import model.database

class categories:

    def get():
        try:
            connection_object = model.database.dbconnect().get_connection()
            cursor = connection_object.cursor(dictionary=True)
            data_select = "SELECT category FROM attraction"
            cursor.execute(data_select)
            data_row = cursor.fetchall()
            return data_row
        finally:
            cursor.close()
            connection_object.close()