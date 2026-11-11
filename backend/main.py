import datetime
import json
import uuid
from pathlib import Path
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import auth
import db

ColumnId = Literal["todo", "in-progress", "done"]
Priority = Literal["low", "medium", "high"]
Lang = Literal["en", "sv"]

app = FastAPI(title="Kanban API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(auth.router)


class Card(BaseModel):
    id: str
    title: str
    columnId: ColumnId
    priority: Priority = "medium"
    userId: str


class NewCard(BaseModel):
    title: str
    columnId: ColumnId
    priority: Priority = "medium"


class UpdateCard(BaseModel):
    title: str | None = None
    columnId: ColumnId | None = None
    priority: Priority | None = None


def _card_from_row(row: dict) -> Card:
    return Card(
        id=row["id"],
        title=row["title"],
        columnId=row["column_id"],
        priority=row["priority"],
        userId=row["user_id"] or "",
    )


@app.get("/cards", response_model=list[Card])
def list_cards(user: auth.User = Depends(auth.require_user)) -> list[Card]:
    with db.get_connection() as conn, conn.cursor() as cursor:
        cursor.execute("SELECT * FROM cards WHERE user_id = %s", (user.id,))
        rows = cursor.fetchall()
    return [_card_from_row(row) for row in rows]


@app.post("/cards", response_model=Card)
def add_card(new_card: NewCard, user: auth.User = Depends(auth.require_user)) -> Card:
    card = Card(
        id=uuid.uuid4().hex,
        title=new_card.title,
        columnId=new_card.columnId,
        priority=new_card.priority,
        userId=user.id,
    )
    with db.get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            "INSERT INTO cards (id, title, column_id, priority, user_id) "
            "VALUES (%s, %s, %s, %s, %s)",
            (card.id, card.title, card.columnId, card.priority, card.userId),
        )
    return card


@app.patch("/cards/{card_id}", response_model=Card)
def update_card(
    card_id: str, update: UpdateCard, user: auth.User = Depends(auth.require_user)
) -> Card:
    with db.get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM cards WHERE id = %s AND user_id = %s", (card_id, user.id)
        )
        row = cursor.fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Card not found")

        title = update.title if update.title is not None else row["title"]
        column_id = update.columnId if update.columnId is not None else row["column_id"]
        priority = update.priority if update.priority is not None else row["priority"]

        cursor.execute(
            "UPDATE cards SET title = %s, column_id = %s, priority = %s "
            "WHERE id = %s AND user_id = %s",
            (title, column_id, priority, card_id, user.id),
        )
    return Card(id=card_id, title=title, columnId=column_id, priority=priority, userId=user.id)


@app.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: str, user: auth.User = Depends(auth.require_user)) -> None:
    with db.get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            "DELETE FROM cards WHERE id = %s AND user_id = %s", (card_id, user.id)
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Card not found")


class FoodEntry(BaseModel):
    id: str
    name: str
    calories: float
    protein: float
    carbs: float
    date: str
    userId: str


class NewFoodEntry(BaseModel):
    name: str
    calories: float
    protein: float
    carbs: float


def _food_entry_from_row(row: dict) -> FoodEntry:
    return FoodEntry(
        id=row["id"],
        name=row["name"],
        calories=row["calories"],
        protein=row["protein"],
        carbs=row["carbs"],
        date=row["date"].isoformat(),
        userId=row["user_id"] or "",
    )


@app.get("/food-entries", response_model=list[FoodEntry])
def list_food_entries(user: auth.User = Depends(auth.require_user)) -> list[FoodEntry]:
    with db.get_connection() as conn, conn.cursor() as cursor:
        cursor.execute("SELECT * FROM food_entries WHERE user_id = %s", (user.id,))
        rows = cursor.fetchall()
    return [_food_entry_from_row(row) for row in rows]


@app.post("/food-entries", response_model=FoodEntry)
def add_food_entry(
    new_entry: NewFoodEntry, user: auth.User = Depends(auth.require_user)
) -> FoodEntry:
    entry = FoodEntry(
        id=uuid.uuid4().hex,
        name=new_entry.name,
        calories=new_entry.calories,
        protein=new_entry.protein,
        carbs=new_entry.carbs,
        date=datetime.date.today().isoformat(),
        userId=user.id,
    )
    with db.get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            "INSERT INTO food_entries (id, name, calories, protein, carbs, date, user_id) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (
                entry.id,
                entry.name,
                entry.calories,
                entry.protein,
                entry.carbs,
                entry.date,
                entry.userId,
            ),
        )
    return entry


@app.delete("/food-entries/{entry_id}", status_code=204)
def delete_food_entry(
    entry_id: str, user: auth.User = Depends(auth.require_user)
) -> None:
    with db.get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            "DELETE FROM food_entries WHERE id = %s AND user_id = %s",
            (entry_id, user.id),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Entry not found")


class FoodDatabaseEntry(BaseModel):
    number: int
    name: str
    calories: float
    protein: float
    carbs: float


_NAME_KEY: dict[Lang, str] = {"en": "nameEn", "sv": "nameSv"}
FOOD_DATABASE_FILE = Path(__file__).parent / "data" / "food_database.json"


@app.get("/foods", response_model=list[FoodDatabaseEntry])
def search_foods(
    q: str = "",
    lang: Lang = "en",
    limit: int = 50,
    user: auth.User = Depends(auth.require_user),
) -> list[FoodDatabaseEntry]:
    name_key = _NAME_KEY[lang]
    foods = json.loads(FOOD_DATABASE_FILE.read_text(encoding="utf-8"))
    query = q.strip().lower()
    matches = [food for food in foods if query in food[name_key].lower()]
    matches.sort(key=lambda food: food[name_key])
    return [
        FoodDatabaseEntry(
            number=food["number"],
            name=food[name_key],
            calories=food["calories"],
            protein=food["protein"],
            carbs=food["carbs"],
        )
        for food in matches[:limit]
    ]
