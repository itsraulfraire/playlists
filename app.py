# python.exe -m venv .venv
# cd .venv/Scripts
# activate.bat
# py -m ensurepip --upgrade
# pip install -r requirements.txt

from functools import wraps
from flask import Flask, render_template, request, jsonify, make_response, session
import mysql.connector.pooling
import pytz, datetime

app = Flask(__name__)
app.secret_key = "Test12345"

# --- Patrón Singleton ---
class DatabaseConnection:
    _instance = None

    def __init__(self):
        if DatabaseConnection._instance is not None:
            raise Exception("Esta clase es un Singleton.")
        else:
            DatabaseConnection._instance = self
            self.pool = mysql.connector.pooling.MySQLConnectionPool(
                pool_name="playlist_pool",
                pool_size=5,
                host="185.232.14.52",
                database="u760464709_16005339_bd",
                user="u760464709_16005339_usr",
                password="/iJRzrJBz+P1"
            )

    @staticmethod
    def get_instance():
        if DatabaseConnection._instance is None:
            DatabaseConnection()
        return DatabaseConnection._instance

def requiere_login(fun):
    @wraps(fun)
    def decorador(*args, **kwargs):
        if not session.get("login"):
            return jsonify({"error": "No has iniciado sesión"}), 401
        return fun(*args, **kwargs)
    return decorador

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/iniciarSesion", methods=["POST"])
def iniciarSesion():
    usuario = request.form["usuario"]
    contrasena = request.form["contrasena"]

    db = DatabaseConnection.get_instance()
    con = db.pool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("""
        SELECT id_usuarios, nombre_usuario, tipo_usuario
        FROM usuarios
        WHERE nombre_usuario = %s AND contrasena = %s
    """, (usuario, contrasena))
    registros = cursor.fetchall()
    cursor.close()
    con.close()

    if registros:
        session["login"] = True
        session["usr"] = registros[0]["nombre_usuario"]
    else:
        session["login"] = False

    return jsonify(registros)


@app.route("/playlists")
@requiere_login
def playlists():
    return render_template("playlists.html")

@app.route("/preferencias")
@requiere_login
def preferencias():
    return make_response(jsonify({
        "usr": session.get("login-usr"),
        "tipo": session.get("login-tipo", 2)
    }))

@app.route("/playlists/buscar")
@requiere_login
def buscarPlaylists():
    db = DatabaseConnection.get_instance()
    con = db.pool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("""
        SELECT idPlaylist, nombre, descripcion, url
        FROM playlists
        ORDER BY idPlaylist DESC
        LIMIT 10
    """)
    data = cursor.fetchall()
    cursor.close()
    con.close()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)

