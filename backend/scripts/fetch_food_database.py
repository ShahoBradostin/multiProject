"""Fetch food name + core nutrient data from Livsmedelsverket's open API
(dataportal.livsmedelsverket.se) and write it to backend/data/food_database.json.

Only pulls what the calorie tracker needs: name (Swedish + English), calories,
protein and carbs per 100g. Everything else the API offers (classifications,
raw materials, ingredients, ...) is skipped.

Data is licensed CC BY 4.0 by Livsmedelsverket - keep attribution if you
surface this in the app.
"""

import concurrent.futures
import json
import sys
import time
from pathlib import Path

import requests

BASE_URL = "https://dataportal.livsmedelsverket.se/livsmedel/api/v1"
PAGE_SIZE = 100
MAX_WORKERS = 6
MAX_RETRIES = 3
OUTPUT_FILE = Path(__file__).parent.parent / "data" / "food_database.json"

NUTRIENT_CODES = {"ENERC": "calories", "PROT": "protein", "CHO": "carbs"}


def request_with_retry(url: str, params: dict) -> dict:
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.get(url, params=params, timeout=15)
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException:
            if attempt == MAX_RETRIES:
                raise
            time.sleep(0.5 * attempt)
    raise RuntimeError("unreachable")


def fetch_names(sprak: int) -> dict[int, str]:
    names: dict[int, str] = {}
    offset = 0
    while True:
        data = request_with_retry(
            f"{BASE_URL}/livsmedel",
            {"offset": offset, "limit": PAGE_SIZE, "sprak": sprak},
        )
        items = data.get("livsmedel", [])
        for item in items:
            names[item["nummer"]] = item["namn"].strip()
        total = data.get("_meta", {}).get("totalRecords", len(names))
        offset += PAGE_SIZE
        print(f"  sprak={sprak}: {min(offset, total)}/{total}", end="\r")
        if offset >= total or not items:
            break
    print()
    return names


def fetch_nutrients(nummer: int) -> dict:
    data = request_with_retry(f"{BASE_URL}/livsmedel/{nummer}/naringsvarden", {})
    result: dict[str, float] = {}
    for entry in data:
        code = entry.get("euroFIRkod")
        field = NUTRIENT_CODES.get(code)
        if field and entry.get("viktGram") == 100:
            result[field] = entry.get("varde")
    return result


def main() -> None:
    print("Fetching Swedish names...")
    names_sv = fetch_names(1)
    print("Fetching English names...")
    names_en = fetch_names(2)

    numbers = sorted(set(names_sv) | set(names_en))
    total = len(numbers)
    print(f"Fetching nutrients for {total} items...")

    results: dict[int, dict] = {}
    done = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        future_to_number = {
            pool.submit(fetch_nutrients, n): n for n in numbers
        }
        for future in concurrent.futures.as_completed(future_to_number):
            nummer = future_to_number[future]
            done += 1
            try:
                results[nummer] = future.result()
            except requests.RequestException as exc:
                print(f"\n  warning: {nummer} failed ({exc}), skipping", file=sys.stderr)
            if done % 25 == 0 or done == total:
                print(f"  {done}/{total}", end="\r")
    print()

    foods = []
    for nummer in numbers:
        nutrients = results.get(nummer, {})
        if not {"calories", "protein", "carbs"} <= nutrients.keys():
            continue
        foods.append(
            {
                "number": nummer,
                "nameEn": names_en.get(nummer, names_sv.get(nummer)),
                "nameSv": names_sv.get(nummer, names_en.get(nummer)),
                "calories": nutrients["calories"],
                "protein": nutrients["protein"],
                "carbs": nutrients["carbs"],
            }
        )

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_FILE.open("w", encoding="utf-8") as f:
        json.dump(foods, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Wrote {len(foods)}/{total} items to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
