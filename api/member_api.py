from flask import *
from flask import Blueprint
from flask import make_response
from model.member import member
import jwt
import os
import datetime
from dotenv import load_dotenv

member_api = Blueprint('member_api',
                   __name__,
                   static_folder='static',
                   template_folder='templates')

@member_api.route("/member")
def member_page():
    return render_template("member.html")