from flask import *
from flask import Blueprint
from flask import make_response
from model.booking import booking
import jwt
import os
import datetime
from dotenv import load_dotenv

load_dotenv()
jwt_secret=os.getenv("jwt_secret")

booking_api = Blueprint('booking_api',
                   __name__,
                   static_folder='static',
                   template_folder='templates')

@booking_api.route("/booking")
def bookinghtml():
	return render_template("booking.html")

@booking_api.route("/api/booking",methods=["GET","POST","DELETE"])
def api_booking():
    if request.method=="GET":
        try:
            token = request.cookies.get('token')
            if token == None:
                return make_response({"error":True,"message":"未登入系統，拒絕存取"},403)
            else:
                user = jwt.decode(token, jwt_secret, algorithms=["HS256"])
                user_id = user["id"]
                user_name = user["name"]
                if booking.user_reserve(user_id) == None:
                    return make_response({"data":None,"name":user_name},200)
                else:
                    user_row = booking.user_reserve(user_id)
                    attraction_id = user_row["attraction_id"]
                    attraction_row = booking.attraction_reserve(attraction_id)
                    img = attraction_row["images"].split("['")[1].split("']")[0].split("', '")
                    data={
                        "attraction": {
                        "id": attraction_id,
                        "name": attraction_row["name"],
                        "address": attraction_row["address"],
                        "image": img[0]
                        },
                        "date": user_row["date"],
                        "time": user_row["time"],
                        "price": user_row["price"]
                    }
                    return make_response({"data":data,"name":user_name},200)
        except:
            return make_response({"error":True,"message":"伺服器錯誤"},500)

    if request.method=="POST":
        try:
            token = request.cookies.get('token')
            if token == None:
                return make_response({"error":True,"message":"未登入系統，拒絕存取"},403)
            else:
                user = jwt.decode(token, jwt_secret, algorithms=["HS256"])
                user_id = user["id"]
                attraction = request.get_json()
                attractionId = attraction["attractionId"]
                date = attraction["date"]
                time = attraction["time"]
                price = attraction["price"]
                if date =="":
                    return make_response({"error":True,"message":"請選擇日期"},400)
                today = datetime.date.today()
                tomorrow = today + datetime.timedelta(days=1)
                date_to_date = datetime.datetime.strptime(date,'%Y-%m-%d').date()
                if date_to_date < tomorrow:
                    return make_response({"error":True,"message":"請選擇今天以後的日期"},400)
                try:
                    if booking.check_booking(user_id) == None:
                        booking.insert_booking(user_id,attractionId,date,time,price)
                        return make_response({"ok":True},200)
                    else:
                        booking.delete_booking(user_id)
                        booking.insert_booking(user_id,attractionId,date,time,price)
                        return make_response({"ok":True},200)
                except:
                    return make_response({"error":True,"message":"建立失敗，輸入不正確或其他原因"},400)
        except:
            return make_response({"error":True,"message":"伺服器錯誤"},500)

    if request.method=="DELETE":
        token = request.cookies.get('token')
        if token == None:
            return make_response({"error":True,"message":"未登入系統，拒絕存取"},403)
        else: 
            user = jwt.decode(token, jwt_secret, algorithms=["HS256"])
            user_id = user["id"]
            booking.delete_booking(user_id)
            return make_response({"ok":True},200)

