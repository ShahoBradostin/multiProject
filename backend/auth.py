import datetime
import json
import threading
import uuid
from pathlib import Path

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, field_validator

USERS_FILE = Path(__file__).parent / "data" / "users.json"
SESSIONS_FILE = Path(__file__).parent / "data" / "sessions.json"

SESSION_COOKIE = "session_token"
SESSION_TTL = datetime.timedelta(days=7)

# Guards read-modify-write on the JSON files below, same reasoning as
# main.py's _file_lock: FastAPI's sync routes run in a thread pool.
_lock = threading.Lock()


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


def read_users() -> list[User]:
    if not USERS_FILE.exists():
        return []
    with USERS_FILE.open(encoding="utf-8") as f:
        return [User(**item) for item in json.load(f)]


def write_users(users: list[User]) -> None:
    USERS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with USERS_FILE.open("w", encoding="utf-8") as f:
        json.dump([user.model_dump() for user in users], f, indent=2)
        f.write("\n")


def read_sessions() -> dict[str, dict]:
    if not SESSIONS_FILE.exists():
        return {}
    with SESSIONS_FILE.open(encoding="utf-8") as f:
        return json.load(f)


def write_sessions(sessions: dict[str, dict]) -> None:
    SESSIONS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with SESSIONS_FILE.open("w", encoding="utf-8") as f:
        json.dump(sessions, f, indent=2)
        f.write("\n")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def create_session(user_id: str) -> tuple[str, datetime.datetime]:
    token = uuid.uuid4().hex
    expires_at = datetime.datetime.now(datetime.timezone.utc) + SESSION_TTL
    with _lock:
        sessions = read_sessions()
        sessions[token] = {
            "userId": user_id,
            "expiresAt": expires_at.isoformat(),
        }
        write_sessions(sessions)
    return token, expires_at


def get_user_for_token(token: str) -> User | None:
    with _lock:
        sessions = read_sessions()
        session = sessions.get(token)
        if session is None:
            return None
        expires_at = datetime.datetime.fromisoformat(session["expiresAt"])
        if expires_at < datetime.datetime.now(datetime.timezone.utc):
            del sessions[token]
            write_sessions(sessions)
            return None
        user_id = session["userId"]
    for user in read_users():
        if user.id == user_id:
            return user
    return None


def delete_session(token: str) -> None:
    with _lock:
        sessions = read_sessions()
        if token in sessions:
            del sessions[token]
            write_sessions(sessions)


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
    with _lock:
        users = read_users()
        if any(u.username == payload.username for u in users):
            raise HTTPException(status_code=400, detail="Username already taken")
        user = User(
            id=uuid.uuid4().hex,
            username=payload.username,
            passwordHash=hash_password(payload.password),
            createdAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        )
        users.append(user)
        write_users(users)

    token, expires_at = create_session(user.id)
    _set_session_cookie(response, token, expires_at)
    return UserPublic(id=user.id, username=user.username)


@router.post("/login", response_model=UserPublic)
def login(payload: LoginRequest, response: Response) -> UserPublic:
    users = read_users()
    user = next((u for u in users if u.username == payload.username), None)
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
