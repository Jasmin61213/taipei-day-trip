from flask import *
from flask import Blueprint
from flask import make_response
from model.categories import categories
 
categories_api = Blueprint('categories_api',
                   __name__,
                   static_folder='static',
                   template_folder='templates')

@categories_api.route("/api/categories")
def api_categories():
	data = []
	data_row = categories.get()
	try:
		for i in range(len(data_row)):
			if data_row[i]["category"] not in data:
				data.append(data_row[i]["category"])
		return make_response(jsonify({"data":data}),200)
	except:
		return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)