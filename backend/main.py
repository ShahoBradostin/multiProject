import csv
import threading
import uuid
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

ColumnId = Literal["todo", "in-progress", "done"]
COLUMN_ORDER: list[ColumnId] = ["todo", "in-progress", "done"]

DATA_FILE = Path(__file__).parent / "data" / "cards.csv"
FIELDNAMES = ["id", "title", "columnId"]

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


class NewCard(BaseModel):
    title: str
    columnId: ColumnId


class MoveCard(BaseModel):
    columnId: ColumnId


def read_cards() -> list[Card]:
    if not DATA_FILE.exists():
        return []
    with DATA_FILE.open(newline="", encoding="utf-8") as f:
        return [Card(**row) for row in csv.DictReader(f)]


def write_cards(cards: list[Card]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    # Group rows by column (todo, then in-progress, then done) so the file
    # stays readable regardless of the order cards were created or moved in.
    # sorted() is stable, so cards keep their relative order within a column.
    grouped = sorted(cards, key=lambda card: COLUMN_ORDER.index(card.columnId))
    with DATA_FILE.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        for card in grouped:
            writer.writerow(card.model_dump())


@app.get("/cards", response_model=list[Card])
def list_cards() -> list[Card]:
    return read_cards()


@app.post("/cards", response_model=Card)
def add_card(new_card: NewCard) -> Card:
    with _file_lock:
        cards = read_cards()
        card = Card(
            id=uuid.uuid4().hex, title=new_card.title, columnId=new_card.columnId
        )
        cards.append(card)
        write_cards(cards)
        return card


@app.patch("/cards/{card_id}", response_model=Card)
def move_card(card_id: str, move: MoveCard) -> Card:
    with _file_lock:
        cards = read_cards()
        for card in cards:
            if card.id == card_id:
                card.columnId = move.columnId
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
