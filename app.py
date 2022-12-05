from flask import *
from api.attractions import attractions
from api.categories import categories
from api.user import user

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
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

app.register_blueprint(attractions, url_prefix='')
app.register_blueprint(categories, url_prefix='')
app.register_blueprint(user, url_prefix='')

app.run(host="0.0.0.0",port=3000,debug=True)