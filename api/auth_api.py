from flask import *
from flask import Blueprint
from flask import make_response
from flask_bcrypt import Bcrypt
from model.auth import auth
from dotenv import load_dotenv
import os
import re
import jwt

load_dotenv()
jwt_secret=os.getenv("jwt_secret")
 
bcrypt = Bcrypt()

auth_api = Blueprint('auth_api',
                   __name__,
                   static_folder='static',
                   template_folder='templates')

@auth_api.route("/api/user",methods=["POST"])
def api_user():
	user_content = request.get_json()
	name = user_content["name"]
	email = user_content["email"]
	password = user_content["password"]
	hash_password = bcrypt.generate_password_hash(password).decode("utf-8")
	try:
		regex = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')
		if re.fullmatch(regex, email):
			result=auth.get_user(email)
			if result != None:
				return make_response(jsonify({"error":True,"message":"此帳號重複註冊"}),400)
			else:
				if auth.insert_user(name,email,hash_password):
					return make_response(jsonify({"ok":True}),200)
		else:
			return make_response(jsonify({"error":True,"message":"請輸入正確的信箱格式"}),400)
	except:
		return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)

@auth_api.route("/api/user/auth",methods=["GET","PUT","DELETE"])
def api_user_auth():
	if request.method=="GET":
		token = request.cookies.get('token')
		if token == None:
			return make_response(jsonify({"data":None}),200)
		else:
			user = jwt.decode(token, jwt_secret, algorithms=["HS256"])
			return make_response(jsonify({"data":user}),200)
            
	if request.method=="PUT":
		try:
			user_content = request.get_json()
			email = user_content["email"]
			put_password = user_content["password"]
			if email=="" or put_password=="":
				return make_response({"error":True,"message":"請輸入帳號密碼"},400)
			user = auth.signin(email)
			if user == None:
				return make_response(jsonify({"error":True,"message":"沒有此帳號，請重新輸入"}),400)
			else:
				password=auth.signin_check(email)
				hash_password = password["password"]
				check_password = bcrypt.check_password_hash(hash_password, put_password)
				if check_password == True:
					token = jwt.encode(user, jwt_secret, algorithm="HS256")
					res = make_response(jsonify({"ok":True}),200)
					res.set_cookie('token',token,max_age=604800)
					return res
				else:
					return make_response(jsonify({"error":True,"message":"密碼輸入錯誤"}),400)
		except:
			return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)

	if request.method=="DELETE":
		res = make_response(jsonify({"ok":True}),200)
		res.delete_cookie('token')
		return res