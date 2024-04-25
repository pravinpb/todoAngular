from flask import Flask
import psycopg2
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

def conn():
    conn = psycopg2.connect(
        host="localhost",
        database="postgres",
        user="postgres",
        password="pravinpb",
        port="5200")
    return conn



from app import views
