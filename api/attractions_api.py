from flask import *
from flask import Blueprint
from flask import make_response
from model.attractions import attractions
 
attractions_api = Blueprint('attractions_api',
                   __name__,
                   static_folder='static',
                   template_folder='templates')

@attractions_api.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
 
@attractions_api.route("/api/attractions")
def api_attractions():
	try:
		page = int(request.args.get("page"))
		keyword = request.args.get("keyword",None)
		page_select = page*12
		next_page_select = (page+1)*12
		if keyword == None:
			data=attractions.get_attraction_page(page_select)
			for i in range(len(data)):
				list=data[i]["images"].split("['")[1].split("']")[0].split("', '")
				data[i]["images"]=list
			next_page_data=attractions.get_attraction_nextpage(page_select,next_page_select)
			if next_page_data == []:
				next_page = None
			else:
				next_page = page+1
		else:
			data=attractions.get_attraction_keyword_page(keyword,page_select)
			for i in range(len(data)):
				list=data[i]["images"].split("['")[1].split("']")[0].split("', '")
				data[i]["images"]=list
			next_page_data=attractions.get_attraction_keyword_nextpage(keyword,next_page_select)
			if next_page_data == []:
				next_page = None
			else:
				next_page = page+1
		return make_response(jsonify({"nextPage":next_page,"data":data}),200)
	except:
		return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)

@attractions_api.route("/api/attraction/<id>")
def api_attraction_id(id):
	try:
		if attractions.get_attraction_id(id) != None:
			data=attractions.get_attraction_id(id)
			list=data["images"].split("['")[1].split("']")[0].split("', '")
			data["images"]=list
			return make_response(jsonify({"data":data}),200)
		else:
			return make_response(jsonify({"error":True,"message":"無此景點"}),400)
	except:
		return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)

@attractions_api.route("/api/categories")
def api_categories():
	data = []
	data_row = attractions.get_categories()
	try:
		for i in range(len(data_row)):
			if data_row[i]["category"] not in data:
				data.append(data_row[i]["category"])
		return make_response(jsonify({"data":data}),200)
	except:
		return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)
