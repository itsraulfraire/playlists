# python.exe -m venv .venv
# cd .venv/Scripts
# activate.bat
# py -m ensurepip --upgrade
# pip install -r requirements.txt

from functools import wraps
from flask import Flask, render_template, request, jsonify, make_response, session
import mysql.connector.pooling
import pytz, datetime, uuid, traceback

app = Flask(__name__)
app.secret_key = "Test12345"

class DatabaseConnection:
    _instance = None

    def __init__(self):
        if DatabaseConnection._instance is not None:
            raise Exception("Esta clase es un Singleton.")
        else:
            DatabaseConnection._instance = self
            pool_name = f"playlist_pool_{uuid.uuid4().hex[:8]}"

            try:
                self.pool = mysql.connector.pooling.MySQLConnectionPool(
                    pool_name=pool_name,
                    pool_size=5,
                    host="185.232.14.52",
                    database="u760464709_23005270_bd",
                    user="u760464709_23005270_usr",
                    password="$x[QjFu>Lt9H"
                )
                print(f"✅ Pool de conexiones '{pool_name}' creado correctamente.")
            except Exception as e:
                print("❌ Error al crear el pool de conexiones MySQL:", e)
                raise e

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

    try:
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
            session["tipo"] = registros[0]["tipo_usuario"]
        else:
            session["login"] = False

        return jsonify(registros)

    except Exception as e:
        print("❌ ERROR en /iniciarSesion:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/playlists")
@requiere_login
def playlists():
    return render_template("playlists.html")


@app.route("/preferencias")
@requiere_login
def preferencias():
    return make_response(jsonify({
        "usr": session.get("usr"),
        "tipo": session.get("tipo", 2)
    }))

@app.route("/playlists/buscar")
@requiere_login
def buscarPlaylists():
    try:
        db = DatabaseConnection.get_instance()
        print("✅ Pool obtenido correctamente:", db.pool)

        con = db.pool.get_connection()
        print("✅ Conexión obtenida del pool:", con)

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

        print(f"✅ {len(data)} playlists obtenidas correctamente.")
        return jsonify(data)

    except Exception as e:
        print("❌ ERROR en /playlists/buscar:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/estadoAnimo")
@requiere_login
def estadoAnimo():
    return render_template("estadoAnimo.html")

@app.route("/estadoAnimo/recomendar", methods=["GET"])
@requiere_login
def recomendarPlaylist():
    estado = request.args.get("estado")

    if not estado:
        return jsonify({"error": "No se especificó el estado de ánimo"}), 400

    try:
        db = DatabaseConnection.get_instance()
        con = db.pool.get_connection()
        cursor = con.cursor(dictionary=True)

        # Ejemplo: Buscar playlists según estado de ánimo (campo 'descripcion')
        cursor.execute("""
            SELECT idPlaylist, nombre, descripcion, url
            FROM playlists
            WHERE descripcion LIKE %s
            ORDER BY RAND()
            LIMIT 1
        """, (f"%{estado}%",))

        resultado = cursor.fetchone()
        cursor.close()
        con.close()

        if not resultado:
            return jsonify({
                "mensaje": f"No hay playlists asociadas al estado de ánimo '{estado}'"
            })

        return jsonify(resultado)

    except Exception as e:
        print("❌ ERROR en /estadoAnimo/recomendar:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/cerrarSesion", methods=["POST"])
def cerrarSesion():
    session.clear()
    return jsonify({"mensaje": "Sesión cerrada"})

@app.route("/fechaHora")
def fechaHora():
    zona = pytz.timezone("America/Mexico_City")
    ahora = datetime.datetime.now(zona)
    return ahora.strftime("%Y-%m-%d %H:%M:%S")
if __name__ == "__main__":
    app.run(debug=True)


