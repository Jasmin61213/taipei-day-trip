from flask import *
from flask import Blueprint
from flask import make_response

from model.order import order
order_api = Blueprint('order_api',
                   __name__,
                   static_folder='static',
                   template_folder='templates')

@order_api.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

