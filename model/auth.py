import model.database

class auth:

    def get_user(email):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            email_select = "SELECT * FROM user WHERE email=%s"
            value = (email,)
            cursor.execute(email_select,value)
            result = cursor.fetchone()
            return result
        finally:
            cursor.close()
            connection_object.close()
    
    def insert_user(name,email,hash_password):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            user = "INSERT INTO user(name,email,password) VALUES (%s,%s,%s)"
            value = (name,email,hash_password)
            cursor.execute(user,value)
            connection_object.commit()
            return True
        finally:
            cursor.close()
            connection_object.close()
    
    def signin(email):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            user_select = "SELECT id,name,email FROM user WHERE email=%s"
            value = (email,)
            cursor.execute(user_select,value)
            user = cursor.fetchone()
            return user
        finally:
            cursor.close()
            connection_object.close()

    def signin_check(email):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            password_select = "SELECT password FROM user WHERE email=%s"
            value = (email,)
            cursor.execute(password_select,value)
            password = cursor.fetchone()
            return password
        finally:
            cursor.close()
            connection_object.close()    