from flask import *
from flask import Blueprint
from flask import make_response
import jwt
from flask_bcrypt import Bcrypt
 
bcrypt = Bcrypt()

user = Blueprint('user',
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

@user.route("/api/user",methods=["POST"])
def api_user():
	user_content = request.get_json()
	name = user_content["name"]
	email = user_content["email"]
	password = user_content["password"]
	hash_password = bcrypt.generate_password_hash(password).decode("utf-8")
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor(dictionary=True)
		email_select = "SELECT * FROM user WHERE email=%s"
		value = (email,)
		cursor.execute(email_select,value)
		result = cursor.fetchone()
		if result != None:
			return make_response(jsonify({"error":True,"message":"此帳號重複註冊"}),400)
		else:
			user = "INSERT INTO user(name,email,password) VALUES (%s,%s,%s)"
			value = (name,email,hash_password)
			cursor.execute(user,value)
			connection_object.commit()
			return make_response(jsonify({"ok":True}),200)
	except:
		return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)
	finally:
		cursor.close()
		connection_object.close()

@user.route("/api/user/auth",methods=["GET","PUT","DELETE"])
def api_user_auth():
	if request.method=="GET":
		token = request.cookies.get('token')
		if token == None:
			return make_response(jsonify({"data":None}),200)
		else:
			user = jwt.decode(token, "secret", algorithms=["HS256"])
			return make_response(jsonify({"data":user}),200)
            
	if request.method=="PUT":
		try:
			user_content = request.get_json()
			email = user_content["email"]
			put_password = user_content["password"]
			connection_object = connection_pool.get_connection()
			cursor = connection_object.cursor(dictionary=True)
			user_select = "SELECT id,name,email FROM user WHERE email=%s"
			value = (email,)
			cursor.execute(user_select,value)
			user = cursor.fetchone()
			if user == None:
				return make_response(jsonify({"error":True,"message":"沒有此帳號，請重新輸入"}),400)
			else:
				password_select = "SELECT password FROM user WHERE email=%s"
				value = (email,)
				cursor.execute(password_select,value)
				password = cursor.fetchone()
				hash_password = password["password"]
				check_password = bcrypt.check_password_hash(hash_password, put_password)
				if check_password == True:
					token = jwt.encode(user, "secret", algorithm="HS256")
					res = make_response(jsonify({"ok":True}),200)
					res.set_cookie('token',token,max_age=604800)
					return res
				else:
					return make_response(jsonify({"error":True,"message":"密碼輸入錯誤"}),400)
		except:
			return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)
		finally:
			cursor.close()
			connection_object.close()

	if request.method=="DELETE":
		res = make_response(jsonify({"ok":True}),200)
		res.delete_cookie('token')
		return res