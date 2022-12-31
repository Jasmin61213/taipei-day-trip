from flask import *
from flask import Blueprint
from flask import make_response
from model.member import member
import jwt
import os
import filetype
import re
from dotenv import load_dotenv
import boto3, botocore

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

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
            new_profile = request.get_json()
            email = new_profile["email"]
            regex = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')
            if re.fullmatch(regex, email):
                member.insert_profile(new_profile,user_id)
                return make_response({"ok":True},200)
            else:
                return make_response(jsonify({"error":True,"message":"請輸入正確的信箱格式"}),400)
        except:
            return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)
                


@member_api.route("/api/member/img", methods=['POST'])
def upload_file():
    file = request.files.get('picture')
    if file == None:
        return make_response(jsonify({"error":True,"message":"請上傳檔案"}),400)
    token = request.cookies.get('token')
    user = jwt.decode(token, jwt_secret, algorithms=["HS256"])
    user_id = user["id"]
    file.filename = "picture"+str(user_id)
    file_name = file.filename
    s3.upload_fileobj(
        file,
        os.getenv("AWS_BUCKET_NAME"),
        file_name,
        ExtraArgs={
            "ACL": 'public-read',
            "ContentType": file.content_type
        }
    )
    member.insert_profile_img(file_name,user_id)
    return make_response(jsonify({"ok":True,}),200)
