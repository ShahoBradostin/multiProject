import datetime
import json
import threading
import uuid
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

ColumnId = Literal["todo", "in-progress", "done"]
COLUMN_ORDER: list[ColumnId] = ["todo", "in-progress", "done"]

Priority = Literal["low", "medium", "high"]

DATA_FILE = Path(__file__).parent / "data" / "cards.json"
FOOD_DATA_FILE = Path(__file__).parent / "data" / "food_entries.json"

# FastAPI runs sync route handlers in a thread pool, so two requests (e.g. two
# quick clicks) can otherwise interleave their read-modify-write on the CSV
# and clobber each other. This makes each mutation atomic within this process.
_file_lock = threading.Lock()

app = FastAPI(title="Kanban API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Card(BaseModel):
    id: str
    title: str
    columnId: ColumnId
    priority: Priority = "medium"


class NewCard(BaseModel):
    title: str
    columnId: ColumnId
    priority: Priority = "medium"


class UpdateCard(BaseModel):
    title: str | None = None
    columnId: ColumnId | None = None
    priority: Priority | None = None


def read_cards() -> list[Card]:
    if not DATA_FILE.exists():
        return []
    with DATA_FILE.open(encoding="utf-8") as f:
        data = json.load(f)
    return [
        Card(
            id=item["id"],
            title=item["title"],
            columnId=column_id,
            priority=item.get("priority", "medium"),
        )
        for column_id in COLUMN_ORDER
        for item in data.get(column_id, [])
    ]


def write_cards(cards: list[Card]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    # Grouping by column is the file's actual structure (not just a sort),
    # so a card's column never needs repeating inside each entry.
    grouped: dict[str, list[dict[str, str]]] = {
        column_id: [] for column_id in COLUMN_ORDER
    }
    for card in cards:
        grouped[card.columnId].append(
            {"id": card.id, "title": card.title, "priority": card.priority}
        )
    with DATA_FILE.open("w", encoding="utf-8") as f:
        json.dump(grouped, f, indent=2)
        f.write("\n")


@app.get("/cards", response_model=list[Card])
def list_cards() -> list[Card]:
    return read_cards()


@app.post("/cards", response_model=Card)
def add_card(new_card: NewCard) -> Card:
    with _file_lock:
        cards = read_cards()
        card = Card(
            id=uuid.uuid4().hex,
            title=new_card.title,
            columnId=new_card.columnId,
            priority=new_card.priority,
        )
        cards.append(card)
        write_cards(cards)
        return card


@app.patch("/cards/{card_id}", response_model=Card)
def update_card(card_id: str, update: UpdateCard) -> Card:
    with _file_lock:
        cards = read_cards()
        for card in cards:
            if card.id == card_id:
                if update.title is not None:
                    card.title = update.title
                if update.columnId is not None:
                    card.columnId = update.columnId
                if update.priority is not None:
                    card.priority = update.priority
                write_cards(cards)
                return card
        raise HTTPException(status_code=404, detail="Card not found")


@app.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: str) -> None:
    with _file_lock:
        cards = read_cards()
        remaining = [card for card in cards if card.id != card_id]
        if len(remaining) == len(cards):
            raise HTTPException(status_code=404, detail="Card not found")
        write_cards(remaining)


class FoodEntry(BaseModel):
    id: str
    name: str
    calories: float
    protein: float
    carbs: float
    date: str


class NewFoodEntry(BaseModel):
    name: str
    calories: float
    protein: float
    carbs: float


def read_food_entries() -> list[FoodEntry]:
    if not FOOD_DATA_FILE.exists():
        return []
    with FOOD_DATA_FILE.open(encoding="utf-8") as f:
        data = json.load(f)
    return [FoodEntry(**item) for item in data]


def write_food_entries(entries: list[FoodEntry]) -> None:
    FOOD_DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with FOOD_DATA_FILE.open("w", encoding="utf-8") as f:
        json.dump([entry.model_dump() for entry in entries], f, indent=2)
        f.write("\n")


@app.get("/food-entries", response_model=list[FoodEntry])
def list_food_entries() -> list[FoodEntry]:
    return read_food_entries()


@app.post("/food-entries", response_model=FoodEntry)
def add_food_entry(new_entry: NewFoodEntry) -> FoodEntry:
    with _file_lock:
        entries = read_food_entries()
        entry = FoodEntry(
            id=uuid.uuid4().hex,
            name=new_entry.name,
            calories=new_entry.calories,
            protein=new_entry.protein,
            carbs=new_entry.carbs,
            date=datetime.date.today().isoformat(),
        )
        entries.append(entry)
        write_food_entries(entries)
        return entry


@app.delete("/food-entries/{entry_id}", status_code=204)
def delete_food_entry(entry_id: str) -> None:
    with _file_lock:
        entries = read_food_entries()
        remaining = [entry for entry in entries if entry.id != entry_id]
        if len(remaining) == len(entries):
            raise HTTPException(status_code=404, detail="Entry not found")
        write_food_entries(remaining)
