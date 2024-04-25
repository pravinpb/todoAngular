# from app import conn
from flask import Flask, render_template, url_for, request, jsonify,Response
from flask.views import MethodView
import psycopg2
from psycopg2.extras import DictCursor
import pandas as pd
from app import app
views = Flask(__name__)
import json


class todo(MethodView):
    def __init__(self):
        self.conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="pravinpb",
            port="5200")

    def get(self):
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="pravinpb",
            port="5200")
        
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute("SELECT * FROM todoTable")
            todoList = cur.fetchall()
            conn.commit()

        print(todoList)
        for i in todoList:
            print(i[1::])
        return todoList
    
    def post(self):
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="pravinpb",
            port="5200")
        data = request.get_json()

        task = data['task']
        with conn.cursor() as cur:
            cur.execute("INSERT INTO todoTable (task, status) VALUES (%s,%s);",
                        (task,False))
            conn.commit()
        return jsonify({"message": "Data inserted successfully"})
    
    def put(self):
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="pravinpb",
            port="5200")
        
        data = request.get_json()
        print(data)
        task = data['task']
        status = data['status']

        with conn.cursor() as cur:
            cur.execute("UPDATE todoTable SET status = %s WHERE task = %s;",
                        (status, task))
            conn.commit()
        return jsonify({"message": "Data updated successfully"})
    
    def delete(self,task):
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="pravinpb",
            port="5200")
        print(task)
        with conn.cursor() as cur:
            cur.execute("DELETE FROM todoTable WHERE task = %s;", (task,))
            conn.commit()
        return jsonify({"message": "Data deleted successfully"})

    

        
    
product_view = todo.as_view('product_api')
app.add_url_rule('/', view_func=product_view, methods=['GET', 'POST', 'PUT'])
app.add_url_rule('/<string:task>', view_func=product_view, methods=['DELETE'])

