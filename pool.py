from mysql.connector import pooling

# 老師的
import mysql.connector.pooling

mydb ={

    "host" : "localhost",
    "user" : "root",
    "password" : "zabeth16",
    "database" : "taipei"

}



pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool",
                                                  pool_size= 5,
                                                  pool_reset_session= True,
                                                  **mydb
                                                 )