from flask import *
from api.attractions_api import attractions_api
from api.auth_api import auth_api
from api.booking_api import booking_api
from api.order_api import order_api

app=Flask(
    __name__,
    static_folder="public",
    static_url_path="/" 
)

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# Pages
@app.route("/")
def index():
	return render_template("index.html")

app.register_blueprint(attractions_api, url_prefix='')
app.register_blueprint(auth_api, url_prefix='')
app.register_blueprint(booking_api, url_prefix='')
app.register_blueprint(order_api, url_prefix='')

app.run(host="0.0.0.0",port=3000,debug=True)