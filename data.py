import ssl
from types import coroutine
from unicodedata import category
ssl._create_default_https_context = ssl._create_unverified_context
import urllib.request as request
import json
import mysql.connector

mydb = mysql.connector.connect(
  host="127.0.0.1",
  user="root",
  password="12131213",
  database="taipeiattraction"
)

with open("/Users/jasminfu/WeHelp/taipei-day-trip/data/taipei-attractions.json") as f:
    data=json.load(f)
list=data["result"]["results"]
for attraction in list:
    name=attraction["name"]
    category=attraction["CAT"]
    description=attraction["description"]
    address=attraction["address"].split()[0]+attraction["address"].split()[1]
    transport=attraction["direction"]
    mrt=attraction["MRT"]
    lat=attraction["latitude"]
    lng=attraction["longitude"]
    images=[]
    for i in range(1,len(attraction["file"].split("https"))):
        img="https"+attraction["file"].split("https")[i]
        l=len(img.split("."))
        img_check=img.split(".")[l-1]
        if img_check=="jpg" or img_check=="JPG":
            images.append("https"+attraction["file"].split("https")[i])
        image=str(images)
    cursor=mydb.cursor(dictionary=True)
    sql="INSERT INTO attraction(name,category,description,address,transport,mrt,lat,lng,images) VALUE (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    val=(name,category,description,address,transport,mrt,lat,lng,image)
    cursor.execute(sql,val)
    mydb.commit()