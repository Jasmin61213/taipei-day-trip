from flask import *
from flask import Blueprint
from flask import make_response
from model.member import member
import jwt
import os
import pathlib
import filetype
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
            member.insert_profile(new_profile,user_id)
            return make_response(jsonify({"ok":True}),200)
        except:
            return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)

# SRC_PATH =  pathlib.Path(__file__).parent.absolute()
SRC_PATH1 =  os.path.dirname(os.getcwd())
# UPLOAD_FOLDER = os.path.join(SRC_PATH,"uploads")
UPLOAD_FOLDER1 = os.path.join(SRC_PATH1,"taipei-day-trip","public","uploads")

@member_api.route("/api/member/img", methods=['POST'])
def upload_file():
    file = request.files.get('file')
    if file.filename == "":
        return {"message": "no file"} 
    token = request.cookies.get('token')
    user = jwt.decode(token, jwt_secret, algorithms=["HS256"])
    user_id = user["id"]
    file_type = filetype.guess_extension(file)
    file.filename = str(user_id)+ "." + file_type
    file_name = file.filename
    # file.save(os.path.join(UPLOAD_FOLDER1, file.filename))
    # print(type(file_name))
    s3.upload_fileobj(
            file,
            os.getenv("AWS_BUCKET_NAME"),
            file_name,
            ExtraArgs={
                "ACL": 'public-read',
                "ContentType": file.content_type
            }
        )
    # s3.upload_file(
    # file, os.getenv('AWS_BUCKET_NAME'), file_name,
    # ExtraArgs={'ACL': 'public-read'}
    # )
    member.insert_profile_img(file_name,user_id)
    return make_response(jsonify({"ok":True,}),200)

# @member_api.route("api/member/img",methods=["POST"])
# def profile_img():
#     try:
#         token = request.cookies.get('token')
#         user = jwt.decode(token, jwt_secret, algorithms=["HS256"])
#         user_id = user["id"]
#         img = request.get_json()
#         member.insert_profile_img(img,user_id)
#         return make_response(jsonify({"ok":True}),200)
#     except:
#         return make_response(jsonify({"error":True,"message":"伺服器錯誤"}),500)
