import model.database

class member:

    def get_profile(user_id):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            mysql_query = (
                """SELECT 
                name,email,sex,age,phone,address
                FROM user
                WHERE id=%s"""
            )
            value = (user_id,)
            cursor.execute(mysql_query,value)
            result = cursor.fetchone()
            return result
        finally:
            cursor.close()
            connection_object.close()

    def insert_profile(new_profile,user_id):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            mysql_query = (
                """UPDATE user
                 SET name=%s,email=%s,sex=%s,age=%s,phone=%s,address=%s
                 WHERE id=%s"""
                )
            name = new_profile["name"]
            email = new_profile["email"]
            sex = new_profile["sex"]
            age = new_profile["age"]
            phone = new_profile["phone"]
            address = new_profile["address"]
            value = (name,email,sex,age,phone,address,user_id)
            cursor.execute(mysql_query,value)
            connection_object.commit()
            return True
        except:
            return False
        finally:
            cursor.close()
            connection_object.close()

    
