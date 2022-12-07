import mysql.connector.pooling

def dbconnect():

    dbconfig={
        "host":"127.0.0.1",
        "user":"root",
        "password":"12131213",
        "database":"taipeiattraction"
    }

    connection_pool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name = "taipei_attraction_pool",
        pool_size = 5,
        pool_reset_session = True,
        **dbconfig
    )

    return connection_pool
