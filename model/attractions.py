# import model.database

# class attractions:

#     def id(id):
#         try:
#             connection_object = model.database.dbconnect().get_connection()
#             cursor = connection_object.cursor(dictionary=True)
#             data_select = "SELECT * FROM attraction WHERE id=%s"
#             value = (id,)
#             cursor.execute(data_select,value)
#             data = cursor.fetchone()
#             if data != None:
#                 return data
#         finally:
#             cursor.close()
#             connection_object.close()