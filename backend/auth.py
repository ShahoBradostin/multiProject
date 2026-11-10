import datetime
import uuid

import bcrypt
import pymysql
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, field_validator

import db

SESSION_COOKIE = "session_token"
SESSION_TTL = datetime.timedelta(days=7)


class User(BaseModel):
    id: str
    username: str
    passwordHash: str
    createdAt: str


class UserPublic(BaseModel):
    id: str
    username: str


class RegisterRequest(BaseModel):
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def username_not_blank(cls, v: str) -> str:
        if len(v.strip()) < 3:
            raise ValueError("Username must be at least 3 characters")
        return v.strip()

    @field_validator("password")
    @classmethod
    def password_long_enough(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginRequest(BaseModel):
    username: str
    password: str


def _user_from_row(row: dict) -> User:
    return User(
        id=row["id"],
        username=row["username"],
        passwordHash=row["password_hash"],
        createdAt=row["created_at"].isoformat(),
    )


def get_user_by_username(username: str) -> User | None:
    with db.get_connection() as conn, conn.cursor() as cursor:
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        row = cursor.fetchone()
    return _user_from_row(row) if row else None


def insert_user(user: User) -> None:
    with db.get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            "INSERT INTO users (id, username, password_hash, created_at) "
            "VALUES (%s, %s, %s, %s)",
            (
                user.id,
                user.username,
                user.passwordHash,
                datetime.datetime.fromisoformat(user.createdAt),
            ),
        )


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def create_session(user_id: str) -> tuple[str, datetime.datetime]:
    token = uuid.uuid4().hex
    expires_at = datetime.datetime.now(datetime.timezone.utc) + SESSION_TTL
    with db.get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            "INSERT INTO sessions (token, user_id, expires_at) VALUES (%s, %s, %s)",
            (token, user_id, expires_at),
        )
    return token, expires_at


def get_user_for_token(token: str) -> User | None:
    with db.get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            "SELECT sessions.expires_at, users.* FROM sessions "
            "JOIN users ON users.id = sessions.user_id "
            "WHERE sessions.token = %s",
            (token,),
        )
        row = cursor.fetchone()
        if row is None:
            return None
        expires_at = row["expires_at"].replace(tzinfo=datetime.timezone.utc)
        if expires_at < datetime.datetime.now(datetime.timezone.utc):
            cursor.execute("DELETE FROM sessions WHERE token = %s", (token,))
            return None
    return _user_from_row(row)


def delete_session(token: str) -> None:
    with db.get_connection() as conn, conn.cursor() as cursor:
        cursor.execute("DELETE FROM sessions WHERE token = %s", (token,))


def require_user(request: Request) -> User:
    token = request.cookies.get(SESSION_COOKIE)
    user = get_user_for_token(token) if token else None
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


def _set_session_cookie(response: Response, token: str, expires_at: datetime.datetime) -> None:
    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        httponly=True,
        samesite="lax",
        expires=expires_at,
        path="/",
    )


router = APIRouter(prefix="/auth")


@router.post("/register", response_model=UserPublic)
def register(payload: RegisterRequest, response: Response) -> UserPublic:
    user = User(
        id=uuid.uuid4().hex,
        username=payload.username,
        passwordHash=hash_password(payload.password),
        createdAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),
    )
    try:
        insert_user(user)
    except pymysql.err.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already taken")

    token, expires_at = create_session(user.id)
    _set_session_cookie(response, token, expires_at)
    return UserPublic(id=user.id, username=user.username)


@router.post("/login", response_model=UserPublic)
def login(payload: LoginRequest, response: Response) -> UserPublic:
    user = get_user_by_username(payload.username)
    if user is None or not verify_password(payload.password, user.passwordHash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token, expires_at = create_session(user.id)
    _set_session_cookie(response, token, expires_at)
    return UserPublic(id=user.id, username=user.username)


@router.post("/logout", status_code=204)
def logout(request: Request, response: Response) -> None:
    token = request.cookies.get(SESSION_COOKIE)
    if token:
        delete_session(token)
    response.delete_cookie(SESSION_COOKIE, path="/")


@router.get("/me", response_model=UserPublic)
def me(user: User = Depends(require_user)) -> UserPublic:
    return UserPublic(id=user.id, username=user.username)
