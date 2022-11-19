
import json

import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="zabeth16",
  database="taipei"
)

mycursor = mydb.cursor() # 我的卡車


# my table travel
mycursor.execute("CREATE TABLE travel (id BIGINT AUTO_INCREMENT PRIMARY KEY, _id BIGINT ,name VARCHAR(255) ,category VARCHAR(255), description TEXT, address VARCHAR(255), transport TEXT, mrt VARCHAR(255), lat DECIMAL(9,6), lng DECIMAL(9,6), images TEXT )")





with open("taipei-attractions.json" , mode = "r" , encoding = "utf-8") as file :
    # 從檔案中讀取 JSON 資料，放入變數 data 中
    data = json.load(file)

data_list = data["result"]["results"]

# print(data_list)


    
for travel in data_list:

    # 處理圖片區
    pic = travel["file"]
    pic_cut = pic.split("https")      
    join = " https".join(pic_cut)
    tide_up_jpg = join.replace(".JPG" , ".jpg")
    
    tide_up_list = tide_up_jpg.split(" ")

    import re
    pickup = re.findall("[\w\.:]+[\w\./]+[\w\.-]+\w+.jpg" , str(tide_up_list) )

    img_pickup = " ".join(pickup)
    # print(img_pickup)

    # 測試圖片是否能insert區
    # print(type(str_pickup))
    # cool_string = "INSERT INTO travel (file) VALUES  (%s) "
    # val = (str(pickup),)

    # mycursor.execute(cool_string , val)
    # mydb.commit()


    # 一次insert
    sql="INSERT INTO travel(_id , name , category ,  description , address , transport , mrt , lat , lng , images ) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    val=(travel["_id"] , travel["name"], travel["CAT"] , travel["description"] , travel["address"] , travel["direction"] , travel["MRT"] , travel["latitude"] , travel["longitude"] , img_pickup )
    mycursor.execute(sql,val)
    mydb.commit()






