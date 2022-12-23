import model.database

class attractions:

    def get_attraction_page(page_select):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            data_select = "SELECT * FROM attraction ORDER BY id LIMIT %s,12 "
            page_value = (page_select,)
            cursor.execute(data_select,page_value)
            data = cursor.fetchall()
            return data

        finally:
            cursor.close()
            connection_object.close()
            
    def get_attraction_nextpage(page_select,next_page_select):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            data_select = "SELECT * FROM attraction ORDER BY id LIMIT %s,12 "
            next_page_value = (next_page_select,)
            cursor.execute(data_select,next_page_value)
            next_page_data=cursor.fetchall()
            return next_page_data

        finally:
            cursor.close()
            connection_object.close()
    
    def get_attraction_keyword_page(keyword,page_select):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            keyword_select = (
                """SELECT * FROM attraction 
                WHERE category=%s OR name LIKE %s 
                ORDER BY id LIMIT %s,12"""
            )
            page_value = (keyword,"%"+f"{keyword}"+"%",page_select)
            cursor.execute(keyword_select,page_value)
            data = cursor.fetchall()
            return data

        finally:
            cursor.close()
            connection_object.close()

    def get_attraction_keyword_nextpage(keyword,next_page_select):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            keyword_select = (
                """SELECT * FROM attraction 
                WHERE category=%s OR name LIKE %s 
                ORDER BY id LIMIT %s,12"""
            )
            next_page_value = (keyword,"%"+f"{keyword}"+"%",next_page_select)			
            cursor.execute(keyword_select,next_page_value)
            next_page_data = cursor.fetchall()    
            return next_page_data   

        finally:
            cursor.close()
            connection_object.close()                  

    def get_attraction_id(id):
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            data_select = "SELECT * FROM attraction WHERE id=%s"
            value = (id,)
            cursor.execute(data_select,value)
            data = cursor.fetchone()
            if data != None:
                return data
            else:
                return None

        finally:
            cursor.close()
            connection_object.close()

    def get_categories():
        try:
            connection_object = model.database.dbconnect()
            cursor = connection_object.cursor(dictionary=True)
            data_select = "SELECT category FROM attraction"
            cursor.execute(data_select)
            data_row = cursor.fetchall()
            return data_row
            
        finally:
            cursor.close()
            connection_object.close()