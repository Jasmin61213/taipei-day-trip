from unicodedata import category
from flask import *
from flask_restful import Api, Resource

app=Flask(
    __name__,
    static_folder="public",
    static_url_path="/" 
)

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
api=Api(app)
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

app.run(host="0.0.0.0",port=3000)