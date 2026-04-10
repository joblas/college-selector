#!/usr/bin/env python3
"""
College Selector Database API - Flask version
"""

from flask import Flask, jsonify, request
import psycopg2
from psycopg2.extras import RealDictCursor
import json

app = Flask(__name__)

DB_CONFIG = {
    "host": "127.0.0.1",
    "port": 5432,
    "database": "college_selector",
    "user": "sellerdoor",
    "password": "sellerdoor",
}


def get_db():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)


@app.route("/health")
def health():
    return jsonify({"status": "healthy", "service": "college-db-api"})


@app.route("/users", methods=["GET"])
def get_users():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, name, created_at FROM users ORDER BY created_at DESC")
    users = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify({"users": [dict(u) for u in users]})


@app.route("/users/create", methods=["POST"])
def create_user():
    data = request.json
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO users (name, pin) VALUES (%s, %s) RETURNING id, name, created_at",
        (data.get("name"), data.get("pin")),
    )
    user = cur.fetchone()
    conn.commit()

    cur.execute(
        "INSERT INTO profile (user_id, name) VALUES (%s, %s)",
        (user["id"], data.get("name")),
    )
    cur.execute("INSERT INTO weights (user_id) VALUES (%s)", (user["id"],))
    conn.commit()

    cur.close()
    conn.close()
    return jsonify({"user": dict(user)})


@app.route("/users/login", methods=["POST"])
def login():
    data = request.json
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, name, pin FROM users WHERE id = %s", (data.get("userId"),))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user and user["pin"] == data.get("pin"):
        return jsonify({"success": True, "user": dict(user)})
    return jsonify({"success": False, "error": "Invalid credentials"}), 401


@app.route("/schools", methods=["POST"])
def add_school():
    data = request.json
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO schools (user_id, name, status, color) 
           VALUES (%s, %s, %s, %s) RETURNING *""",
        (
            data.get("userId"),
            data.get("name"),
            data.get("status", "Consider"),
            data.get("color", "#863bff"),
        ),
    )
    school = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"school": dict(school)})


@app.route("/sync/<int:user_id>", methods=["GET"])
def sync(user_id):
    conn = get_db()
    cur = conn.cursor()

    result = {}

    cur.execute("SELECT * FROM schools WHERE user_id = %s", (user_id,))
    result["schools"] = [dict(s) for s in cur.fetchall()]

    cur.execute("SELECT * FROM scholarships WHERE user_id = %s", (user_id,))
    result["scholarships"] = [dict(s) for s in cur.fetchall()]

    cur.execute("SELECT * FROM profile WHERE user_id = %s", (user_id,))
    profile = cur.fetchone()
    result["profile"] = dict(profile) if profile else {}

    cur.execute("SELECT * FROM weights WHERE user_id = %s", (user_id,))
    weights = cur.fetchone()
    result["weights"] = dict(weights)["data"] if weights else {}

    cur.close()
    conn.close()
    return jsonify(result)


if __name__ == "__main__":
    print(f"🎓 College DB API running on http://localhost:8766")
    app.run(host="0.0.0.0", port=8766, debug=False)
