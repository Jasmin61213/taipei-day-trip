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
# print(list)
for attraction in list:
    name=attraction["name"]
    # print(name)
    category=attraction["CAT"]
    # print(category)
    description=attraction["description"]
    #print(description)
    address=attraction["address"].split()[0]+attraction["address"].split()[1]
    # print(address)
    transport=attraction["direction"]
    # print(transport)
    mrt=attraction["MRT"]
    # print(mrt)
    lat=attraction["latitude"]
    # print(lat)
    lng=attraction["longitude"]
    # print(lng)
    images=[]
    for i in range(1,len(attraction["file"].split("https"))):
        img="https"+attraction["file"].split("https")[i]
        # print(img)
        l=len(img.split("."))
        img_check=img.split(".")[l-1]
        # print(img_check)
        if img_check=="jpg" or "JPG":
            images.append("https"+attraction["file"].split("https")[i])
    images=str(images)
    # print(images)
    cursor=mydb.cursor(dictionary=True)
    sql="INSERT INTO attraction(name,category,description,address,transport,mrt,lat,lng,images) VALUE (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    val=(name,category,description,address,transport,mrt,lat,lng,images)
    cursor.execute(sql,val)
    mydb.commit()