import mysql.connector.pooling
import os
from dotenv import load_dotenv

load_dotenv()
host=os.getenv("dbhost")
user=os.getenv("dbuser")
password=os.getenv("dbpassword")
database=os.getenv("dbname")

dbconfig={
    "host":host,
    "user":user,
    "password":password,
    "database":database
}

connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "taipei_attraction_pool",
    pool_size = 5,
    pool_reset_session = True,
    **dbconfig
)

def dbconnect():
    connection_object = connection_pool.get_connection()
    return connection_object