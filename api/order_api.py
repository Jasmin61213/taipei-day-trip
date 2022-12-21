from flask import *
from flask import Blueprint
from flask import make_response
from model.booking import booking
from model.order import order
import requests
import re
import jwt
import time
import os
from dotenv import load_dotenv

load_dotenv()
jwt_secret=os.getenv("jwt_secret")
PartnerKey=os.getenv("PartnerKey")
merchant_id=os.getenv("merchant_id")

order_api = Blueprint('order_api',
                   __name__,
                   static_folder='static',
                   template_folder='templates')

@order_api.route("/thankyou")
def thankyou():
    number=request.args.get("number",None) 
    return render_template("thankyou.html",number=number)

@order_api.route("/api/orders", methods=["POST"])
def api_orders():
        try:
            token = request.cookies.get('token')
            if token == None:
                return make_response({"error":True,"message":"未登入系統，拒絕存取"},403)
            else:
                order_number = time.strftime("%Y%m%d%H%M%S", time.localtime())
                user = jwt.decode(token, jwt_secret, algorithms=["HS256"])
                user_id = user["id"]
                pay_content = request.get_json()
                contact_name = pay_content["name"]
                contact_email = pay_content["email"]
                contact_phone = pay_content["phone"]
                prime = pay_content["prime"]
                user_reserve = booking.user_reserve(user_id)
                # pay_status 未付款=0 已付款=1
                pay_status = 0 
                order.insert_order(order_number,user_id,user_reserve,pay_status,pay_content)
                # 呼叫 TapPay 的付款 API
                url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
                headers = {
                    "Content-Type": "application/json",
                    "x-api-key": PartnerKey
                }
                pay_data = {
                        "prime": prime,
                        "partner_key": PartnerKey,
                        "merchant_id": merchant_id,
                        "details":"預定行程",
                        "amount": user_reserve["price"],
                        "cardholder": {
                            "phone_number": contact_phone,
                            "name": contact_name,
                            "email": contact_email
                        }
                    }
                res = requests.post(url, headers=headers, json=pay_data).json()
                status = res["status"]
                if status == 0:
                    order.update_status(order_number)
                    data = {
                        "data":
                        {
                            "number": order_number ,
                            "payment": {
                                "status": 0,
                                "message": "付款成功"
                            }
                        }
                    }
                    return make_response({"data":data},200)
                else:
                    return make_response({"error":True,"message":"付款失敗","order_id":order_number},400)
        except:
            return make_response({"error":True,"message":"伺服器錯誤"},500)

@order_api.route("/api/order/<order_id>", methods=["GET"])
def api_order_id(order_id):
    try:
        token = request.cookies.get('token')
        if token == None:
            return make_response({"error":True,"message":"未登入系統，拒絕存取"},403)
        else:
            user_order = order.get_order(order_id)
            attraction_id = user_order["attraction_id"]
            attraction_reserve = booking.attraction_reserve(attraction_id)
            img = attraction_reserve["images"].split("['")[1].split("']")[0].split("', '")
            data = {
                "number": order_id,
                "price": user_order["price"],
                "trip": {
                    "attraction": {
                        "id": attraction_id,
                        "name": attraction_reserve["name"],
                        "address": attraction_reserve["address"],
                        "image": img[0]
                    },
                    "date": user_order["date"],
                    "time": user_order["time"]
                },
                "contact": {
                    "name": user_order["name"],
                    "email": user_order["email"],
                    "phone": user_order["phone"]
                },
                "status": user_order["status"]
            }
            return make_response({"data":data},200)
    except:
        return make_response({"error":True,"message":"伺服器錯誤"},500)