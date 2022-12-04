import email
from http.cookiejar import Cookie
import re
from flask import *
from flask_restful import Api, Resource
from flask import make_response
import jwt

app=Flask(
    __name__,
    static_folder="public",
    static_url_path="/" 
)

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

api=Api(app)

# connection pool
import mysql.connector.pooling
dbconfig={
	"host":"127.0.0.1",
	"user":"root",
	"password":"12131213",
	"database":"taipeiattraction"
}

connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "taipei_attraction_pool",
    pool_size = 5,
    pool_reset_session = True,
    **dbconfig
)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

# api
@app.route("/api/attractions")
def api_attractions():
	try:
		page = int(request.args.get("page"))
		keyword = request.args.get("keyword",None)
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor(dictionary=True)
		page_select = page*12
		next_page_select = (page+1)*12
		if keyword == None:
			data_select = "SELECT * FROM attraction ORDER BY id LIMIT %s,12 "
			page_value = (page_select,)
			next_page_value = (next_page_select,)
			cursor.execute(data_select,page_value)
			data = cursor.fetchall()
			for i in range(len(data)):
				list=data[i]["images"].split("['")[1].split("']")[0].split("', '")
				data[i]["images"]=list
			cursor.execute(data_select,next_page_value)
			next_page_data=cursor.fetchall()
			if next_page_data == []:
				next_page = None
			else:
				next_page = page+1
		else:
			keyword_select = "SELECT * FROM attraction WHERE category=%s OR name LIKE %s ORDER BY id LIMIT %s,12"
			page_value = (keyword,"%"+f"{keyword}"+"%",page_select)
			cursor.execute(keyword_select,page_value)
			data = cursor.fetchall()
			for i in range(len(data)):
				list=data[i]["images"].split("['")[1].split("']")[0].split("', '")
				data[i]["images"]=list
			next_page_value = (keyword,"%"+f"{keyword}"+"%",next_page_select)			
			cursor.execute(keyword_select,next_page_value)
			next_page_data = cursor.fetchall()
			if next_page_data == []:
				next_page = None
			else:
				next_page = page+1
		return make_response(jsonify({"nextPage":next_page,"data":data}),200)
	except:
		return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)
	finally:
		cursor.close()
		connection_object.close()

@app.route("/api/attraction/<id>")
def api_attraction_id(id):
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor(dictionary=True)
		data_select = "SELECT * FROM attraction WHERE id=%s"
		value = (id,)
		cursor.execute(data_select,value)
		data = cursor.fetchone()
		if data != None:
			list=data["images"].split("['")[1].split("']")[0].split("', '")
			data["images"]=list
			return make_response(jsonify({"data":data}),200)
		else:
			return make_response(jsonify({"error":True,"message":"無此景點"}),400)
	except:
		return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)
	finally:
		cursor.close()
		connection_object.close()

@app.route("/api/categories")
def api_categories():
	data = []
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor(dictionary=True)
		data_select = "SELECT category FROM attraction"
		cursor.execute(data_select)
		data_row = cursor.fetchall()
		for i in range(len(data_row)):
			if data_row[i]["category"] not in data:
				data.append(data_row[i]["category"])
		return make_response(jsonify({"data":data}),200)
	except:
		return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)
	finally:
		cursor.close()
		connection_object.close()

@app.route("/api/user",methods=["POST"])
def api_user():
	name=request.form["name"]
	email=request.form["email"]
	password=request.form["password"]
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor(dictionary=True)
		email_select = "SELECT * FROM user WHERE email=%s"
		value = (email,)
		cursor.execute(email_select,value)
		result = cursor.fetchone()
		print(result)
		if result != None:
			return make_response(jsonify({"error":True,"message":"註冊失敗"}),400)
		else:
			user = "INSERT INTO user(name,email,password) VALUES (%s,%s,%s)"
			value = (name,email,password)
			cursor.execute(user,value)
			connection_object.commit()
			return make_response(jsonify({"ok":True}),200)
	except:
		return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)
	finally:
		cursor.close()
		connection_object.close()

@app.route("/api/user/auth",methods=["GET","PUT","DELETE"])
def api_user_auth():
	if request.method=="GET":
		# 從cookie抓jwt
		token = request.cookies.get('token')
		# if 沒有JWT 沒有登入
		if token == None:
			return make_response(jsonify({"data":None}),200)
		# if 有JWT 有登入	
		else:
			user = jwt.decode(token, "secret", algorithms=["HS256"])
			id = user["id"]
			connection_object = connection_pool.get_connection()
			cursor = connection_object.cursor(dictionary=True)
			user_select = "SELECT id,name,email FROM user WHERE id=%s"
			value = (id,)
			cursor.execute(user_select,value)
			data = cursor.fetchone()
			cursor.close()
			connection_object.close()
			return make_response(jsonify({"data":data}),200)
	if request.method=="PUT":
		try:
			# email=request.form["email"]
			# password=request.form["password"]
			email="jasmin@gmail.com"
			password="1213"
			connection_object = connection_pool.get_connection()
			cursor = connection_object.cursor(dictionary=True)
			user_select = "SELECT * FROM user WHERE email=%s AND password=%s"
			value = (email,password)
			cursor.execute(user_select,value)
			user = cursor.fetchone()
			if user != []:
				token = jwt.encode(user, "secret", algorithm="HS256")
				res = make_response(jsonify({"ok":True}),200)
				res.set_cookie('token',token,max_age=604800)
				return res
			else:
				return make_response(jsonify({"error":True,"message":"帳號密碼輸入錯誤"}),400)
		except:
			return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)
		finally:
			cursor.close()
			connection_object.close()
	if request.method=="DELETE":
		res = make_response(jsonify({"ok":True}),200)
		res.delete_cookie('token')
		return res

app.run(host="0.0.0.0",port=3000)