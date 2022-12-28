from mysql.connector import pooling
import mysql.connector.pooling
# 環境變數
import os
from dotenv import load_dotenv
load_dotenv()
mydb_password = os.getenv("mydb_password")

mydb ={
    "host" : "localhost",
    "user" : "root",
    "password" : mydb_password,
    "database" : "taipei"
}
# mydb.getconnection
pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool",
                                                  pool_size= 5,
                                                  pool_reset_session= True,
                                                  **mydb
                                                 )