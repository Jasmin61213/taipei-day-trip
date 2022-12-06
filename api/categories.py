from flask import *
from flask import Blueprint
from flask import make_response
 
categories = Blueprint('categories',
                   __name__,
                   static_folder='static',
                   template_folder='templates')

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

@categories.route("/api/categories")
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