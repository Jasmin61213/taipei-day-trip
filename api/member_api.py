from flask import *
from flask import Blueprint
from flask import make_response
from model.member import member
import jwt
import os
import datetime
from dotenv import load_dotenv

load_dotenv()
jwt_secret=os.getenv("jwt_secret")

member_api = Blueprint('member_api',
                   __name__,
                   static_folder='static',
                   template_folder='templates')

@member_api.route("/member")
def member_page():
    return render_template("member.html")

@member_api.route("api/member",methods=["GET","POST"])
def profile():
    if request.method=="GET":
        try:
            token = request.cookies.get('token')
            if token == None:
                return make_response({"error":True,"message":"未登入系統，拒絕存取"},403)
            else:
                user = jwt.decode(token, jwt_secret, algorithms=["HS256"])
                user_id = user["id"]
                profile = member.get_profile(user_id)
                return make_response({"data":profile},200)
        except:
            return make_response({"error":True,"message":"伺服器錯誤"},500)

    if request.method=="POST":
        try:
            token = request.cookies.get('token')
            user = jwt.decode(token, jwt_secret, algorithms=["HS256"])
            user_id = user["id"]
            new_profile=request.get_json()
            print(new_profile)
            member.insert_profile(new_profile,user_id)
            return make_response(jsonify({"ok":True}),200)
        except:
            return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)