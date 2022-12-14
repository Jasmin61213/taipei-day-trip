import model.database

class booking:

    def user_reserve(user_id):
        try:
            mysql_query = (
                """SELECT attraction_id,date,time,price FROM booking
                WHERE user_id=%s"""
            )
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            value = (user_id,)
            cursor.execute(mysql_query,value)
            result = cursor.fetchone()
            return result
        finally:
            cursor.close()
            connection_object.close()

    def attraction_reserve(attraction_id):
        try:
            mysql_query = (
                """SELECT name,address,images FROM attraction
                WHERE id=%s"""
            )
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            value = (attraction_id,)
            cursor.execute(mysql_query,value)
            result = cursor.fetchone()
            return result
        finally:
            cursor.close()
            connection_object.close()


    def insert_booking(user_id,attractionId,date,time,price):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            booking = "INSERT INTO booking(user_id,attraction_id,date,time,price) VALUES (%s,%s,%s,%s,%s)"
            value = (user_id,attractionId,date,time,price)
            cursor.execute(booking,value)
            connection_object.commit()
            return True
        except:
            return False
        finally:
            cursor.close()
            connection_object.close()

    def check_booking(user_id):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            booking = "SELECT user_id FROM booking WHERE user_id=%s"
            value = (user_id,)
            cursor.execute(booking,value)
            result = cursor.fetchone()
            return result
        finally:
            cursor.close()
            connection_object.close()
    
    def delete_booking(user_id):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            delete = "DELETE FROM booking WHERE user_id=%s"
            value = (user_id,)
            cursor.execute(delete,value)
            connection_object.commit()
            return True
        except:
            return False
        finally:
            cursor.close()
            connection_object.close()