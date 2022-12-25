import model.database

class order:
    
    def insert_order(order_number,user_id,user_reserve,pay_status,pay_content):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            order = (
                """INSERT INTO orders
                (order_id,attraction_id,date,time,price,user_id,name,email,phone,status)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
                )
            attraction_id = user_reserve["attraction_id"]
            date = user_reserve["date"]
            time = user_reserve["time"]
            price = user_reserve["price"]
            contact_name = pay_content["name"]
            contact_email = pay_content["email"]
            contact_phone = pay_content["phone"]
            value = (order_number,attraction_id,date,time,price,user_id,contact_name,contact_email,contact_phone,pay_status)
            cursor.execute(order,value)
            connection_object.commit()
            return True
        except:
            return False
        finally:
            cursor.close()
            connection_object.close()

    def update_status(order_number):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            update = "UPDATE orders SET status=1 WHERE order_id=%s"
            value = (order_number,)
            cursor.execute(update,value)
            connection_object.commit()
            return True
        except:
            return False
        finally:
            cursor.close()
            connection_object.close()

    def get_order(order_id):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            mysql_query = (
                """SELECT 
                attraction_id,date,time,price,name,email,phone,status
                FROM orders 
                WHERE order_id=%s"""
            )
            value = (order_id,)
            cursor.execute(mysql_query,value)
            result = cursor.fetchone()
            return result
        finally:
            cursor.close()
            connection_object.close()

    def get_orders(user_id):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            mysql_query = (
                """SELECT 
                order_id,date,time,price,status,address,images,attraction.name,attraction_id
                FROM orders 
                INNER JOIN attraction
                ON orders.attraction_id=attraction.id
                WHERE user_id=%s"""
            )
            value = (user_id,)
            cursor.execute(mysql_query,value)
            result = cursor.fetchall()
            return result
        finally:
            cursor.close()
            connection_object.close()