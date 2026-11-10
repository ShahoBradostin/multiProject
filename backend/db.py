import os
from pathlib import Path

import pymysql
import pymysql.cursors
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")


def get_connection() -> pymysql.connections.Connection:
    return pymysql.connect(
        host=os.environ["DB_HOST"],
        port=int(os.environ.get("DB_PORT", 3306)),
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"],
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True,
    )
