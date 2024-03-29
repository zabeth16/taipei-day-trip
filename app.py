from flask import (Flask, jsonify, redirect, render_template, request, session,
                   url_for )
import json
import math
import jwt
import re
from pool import pool
import requests , datetime
# 環境變數
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(
    __name__ , 
    static_folder = "static" , # 靜態檔案的資料夾名稱，要改名也可以，不過資料夾名也要記得更動
    static_url_path = "/mysource" 
            ) 

app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

# 加這行讓 API 的json顯示順序變成一樣的喔
app.config["JSON_SORT_KEYS"] = False

# Pages
@app.route("/")
def index():
	return render_template("index.html")

# ====== 註冊會員 api ======
@app.route("/api/user" , methods = ["POST"])
def register():
	try:
		con = pool.get_connection()
		mycursor = con.cursor(dictionary = True)	 
		user = request.get_json()		
		name = user["name"]
		email = user["email"]
		password = user["password"]
	
		# 只有單個參數時，後方逗號是必要的
		mycursor.execute('SELECT email FROM member WHERE email = %s ', (email,))
		check_email = mycursor.fetchall()

		# regex for email
		pattern_email = r"^\S+@\S+$"
		re.match(pattern_email,email)

		# regex for password at least 6 length 
		pattern_password = r"^.{6,}$"
		re.match(pattern_password , password)

		# 還要製作 INSERT table
		if (len(check_email) == 0  and name != "" and email != "" and password != ""  and re.match(pattern_email,email) and re.match(pattern_password , password)):
			mycursor.execute('INSERT INTO member (name, email , password) VALUES (%s,%s,%s)',(name,email,password))
			con.commit()
			print(mycursor.rowcount, "was inserted.")
			return jsonify({ "ok": True	})

		# 檢查客戶端提交的註冊資料
		elif (len(check_email) > 0):	
			return jsonify({"error" : True ,
							"message" : " 有重複的email喔，請換另一個信箱註冊。  "}) , 400
		elif (not re.search(pattern_email, email) or re.search(pattern_email, email)):
			return jsonify({"error" : True ,
							"message" : " email格式錯誤，且密碼長度需6個字。  "}) , 400
		else : 
			return jsonify({"error" : True ,
							"message" : " 註冊欄位不能為空喔 ! "}) , 400

	except:
		
			return jsonify({	"error": True ,
  								"message": "伺服器伍佰老師不想和你跳LAST DANCE"}) , 500	
	finally:
		con.close()
		mycursor.close()


# ====== 【登入、驗證、登出】會員 api ======

@app.route("/api/user/auth" , methods = ["GET" , "PUT" , "DELETE"])
def auth():
	try:	
		con = pool.get_connection()
		mycursor = con.cursor(dictionary = True)
		if  request.method == "GET" :
			# GET 我 cookie 的 token
			cookie_token = request.cookies.get("token")
			if(cookie_token) :
				# 解密驗證JWT
				decoded = jwt.decode(cookie_token, secret_key, algorithms = "HS256" )
				return decoded
			else:
				return jsonify({"data": None})

		elif request.method == "PUT" :
			user = request.get_json()
			email = user["email"]
			password = user["password"]
			mycursor.execute('SELECT * FROM member WHERE email = %s AND password = %s', (email , password))
			check_email = mycursor.fetchall()			
			if ( len(check_email) > 0 and email != "" and password != ""):
				name = check_email[0]["name"]
				id = check_email[0]["id"]
				user_info = {"data" :
								{ "id" : id , "name" : name  , "email" : email }}
				# print(user_info)
				token = jwt.encode(user_info, secret_key , algorithm = "HS256" )
				# print(token)
				response = jsonify({ "ok": True })
				response.set_cookie("token", token , max_age = 7 * 24 * 60 * 60)
				return response

			elif (len(check_email) == 0  and email != "" and password != ""):
				return jsonify({"error" : True ,
								"message" : " 帳號或密碼輸入錯誤 ! "}) , 400

			else:
				return jsonify({"error" : True ,
								"message" : " 登入欄位不能為空喔 ! "}) , 400
		
		else: # request.method == DELETE
			response = jsonify({ "ok": True })
			response.set_cookie("token", "" , max_age = -1 )
			return response
	except:
		return jsonify({	"error": True ,
							"message": "伺服器伍佰老師心理的岩漿快要滿滿滿滿滿了出來"}) , 500
	finally:
		con.close()
		mycursor.close()



#==============================================

# ====== booking api ======
@app.route("/api/booking" , methods = ["GET" , "POST" , "DELETE"] )
def booking_trip():
	try:
		con = pool.get_connection()
		mycursor = con.cursor(dictionary = True)
		cookie_token = request.cookies.get("token")

		if  request.method == "GET" :
			
			if (cookie_token):
				decoded = jwt.decode(cookie_token, secret_key, algorithms = "HS256" )
				id =  decoded["data"]["id"]
				mycursor.execute('SELECT id FROM member WHERE id = %s' , (id ,))
				member_id = mycursor.fetchone()["id"]		
				mycursor.execute(
								'SELECT attractionId , date , time , price\
								FROM reservation \
								WHERE memberId = %s' , (member_id ,))	
				reservation = mycursor.fetchone()	
				# print(reservation) 
				if reservation != None :			
					id = reservation["attractionId"]
					date = reservation["date"]
					date_str = date.strftime("%Y-%m-%d")
					# 有datetime問題請用date_str = date_obj.strftime("%Y-%m-%d")
					# strftime函數將datetime.date對象轉換為字符串
					time = reservation["time"]
					price = reservation["price"]
					mycursor.execute('SELECT name , address , images FROM travel \
									WHERE id = %s' , ( id ,))
					travel = mycursor.fetchone()
					name = travel["name"]
					address = travel["address"]
					images = travel["images"]
					image = images.split(" ")[0]	

					return ({ "data" : {
							"attraction" :{
								"id":  id,
								"name": name ,
								"address": address,
								"image": image
							} },
								"date": date_str,
								"time": time,
								"price": price		})
				else:
					return ({ "data" : None })		

			else:
				return ({
							"error": True,
							"message": "未登入系統，拒絕存取"
							}) , 403

		elif request.method == "POST" :
			trip_reservation = request.get_json()
			print(trip_reservation)
			attractionId = trip_reservation["attractionId"]
			date = trip_reservation["date"]
			time = trip_reservation["time"]
			price = trip_reservation["price"]
			if (date == ""):
				return ({
							"error": True,
							"message": "日期不可為空"
							}) , 400

			elif (not cookie_token):
				return ({
						"error": True,
						"message": "未登入系統，拒絕存取"
						}) , 403			
			else:
				# 把預定行程放資料庫，且用inner join放進需要的會員資訊		
				# def post_booking():	
				decoded = jwt.decode(cookie_token, secret_key, algorithms = "HS256" )
				id =  decoded["data"]["id"]
				mycursor.execute('SELECT id FROM member WHERE id = %s' , (id ,))
				member_id = mycursor.fetchone()["id"]			
				
				mycursor.execute(
					'UPDATE reservation SET attractionId=%s,date=%s,time=%s,price=%s , memberId=%s  \
					WHERE id = 1 ' \
					, (attractionId , date , time , price , member_id))
				
				con.commit()
				print(mycursor.rowcount, "was updated.")
				return  ({"ok" : True})

		else: # DELETE method
			# comparing user id with tokken id  
			decoded = jwt.decode(cookie_token, secret_key, algorithms = "HS256" )
			id =  decoded["data"]["id"]
			mycursor.execute("SELECT * FROM reservation \
				WHERE memberId = %s" , (id ,))
			mycursor.fetchone()
			find_who =  mycursor.rowcount
			mycursor.close()  # 關閉游標			
			if find_who > 0 :
				mycursor = con.cursor()  # 重新建立游標	
				mycursor.execute("UPDATE reservation SET  \
					attractionId=NULL ,date=NULL ,time=NULL ,price=NULL  , memberId=NULL \
					WHERE id = 1 ")
				con.commit()
				print(mycursor.rowcount , "was delete.")
				return ({"ok" : True })
			else:
				# id was different with token id , someone is BAAAAD.
				return


	except:
		return jsonify({	"error": True ,
							"message": "伺服器伍佰老師表示上帝救救我"}) , 500
	finally:
		con.close()
		mycursor.close()

#==============================================

@app.route("/booking")
def booking():
	try:
		con = pool.get_connection()
		mycursor = con.cursor(dictionary = True)
		cookie_token = request.cookies.get("token")

		if (cookie_token):	
			decoded = jwt.decode(cookie_token, secret_key, algorithms = "HS256" )	
			id =  decoded["data"]["id"]
			mycursor.execute('SELECT name FROM member WHERE \
							id = %s' , (id ,))
			name = mycursor.fetchone()					
			return render_template("booking.html"  , name = name["name"] , )

		else:
			return redirect("/")

	except:
		return jsonify({	"error": True ,
	 						"message": "伺服器伍佰老師表示上帝救救我"}) , 500
	finally:
		con.close()
		mycursor.close()
#==============================================
@app.route("/api/orders" , methods = ["POST"])
def orders():
	try:
		con = pool.get_connection()
		mycursor = con.cursor(dictionary = True)
		cookie_token = request.cookies.get("token")
	
		order = request.get_json()
		# 聯絡資訊
		name = order["order"]["contact"]["name"]
		email = order["order"]["contact"]["email"]
		phone = order["order"]["contact"]["phone"]
		# 訂購景點資訊
		attractionId = order["order"]["trip"]["attraction"]["id"]
		date = order["order"]["trip"]["date"]
		time = order["order"]["trip"]["time"]
		price = order["order"]["price"]
		# 取得現在的日期和時間
		now = datetime.datetime.now()
		# 建立訂單編號
		order_number = now.strftime("%Y%m%d%H%M%S")
		# print(order_number)  # 輸出結果：20230705150505 一串數字			
		decoded = jwt.decode(cookie_token, secret_key, algorithms = "HS256" )
		id =  decoded["data"]["id"]
		# INSERT 訂單編號、付款狀態、member_id
		mycursor.execute("INSERT INTO orders (order_number,status,member_id ,contact_name,contact_email,contact_phone)  \
			VALUES(%s,%s,%s, %s,%s,%s)" \
			,(order_number , "未付款" , id , name , email , phone))
		con.commit()
		print(mycursor.rowcount, "was inserted.")
		mycursor.execute("INSERT INTO order_trip \
			(order_number, member_id, attractionId, date , time, price)\
			VALUES(%s,%s,%s, %s,%s,%s)"\
			,(order_number, id, attractionId, date, time, price))
		con.commit()
		print(mycursor.rowcount, "order_trip was inserted.")
		# 串接 TapPay後端
		partner_key = os.getenv("partner_key")
		merchant_id = os.getenv("merchant_id")
		x_api_key = os.getenv("x_api_key")
		tap_pay = 	{
			"prime": order["prime"],
			"partner_key": partner_key,
			"merchant_id": merchant_id,
			"details":"TapPay Test",
			"amount": order["order"]["price"],
			"cardholder": {
				"phone_number": order["order"]["contact"]["phone"],
				"name": order["order"]["contact"]["name"],
				"email": order["order"]["contact"]["email"],
			},
			"remember": True
		}
		# print(tap_pay)

		url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
		headers = {
			"Content-Type": "application/json",
			"x-api-key": x_api_key
			}
		response = requests.post(url, json=tap_pay , headers=headers)

		print(response.status_code)
		# print(response.json())
		# return response.json()
								
		if response.status_code == 200:
			# 交易成功
			mycursor.execute("UPDATE orders SET status = '已付款' \
							WHERE member_id = %s" , (id ,))
			con.commit()
			print(mycursor.rowcount, "was updated.")
			return ({
						"data": {
							"number": order_number,
							"payment": {
								"status": 0,
								"message": "付款成功"
								}
						}
					})

		elif response.status_code == 400 :
			# 檢查response.text來查看失敗的原因 ， 訂單建立失敗，輸入不正確或其他原因
			# print(response.text)
			return ({
					"error": True,
					"message": "付款未成功，訂單建立失敗，輸入不正確或其他原因。",
					"number": order_number
					}) , 400

		else:
			# 未登入系統，拒絕存取
			return	({
					"error": True,
					"message": "未登入系統，拒絕存取"
					}) , 403

	except:
		return jsonify({	"error": True ,
	 						"message": "伺服器伍佰老師給你愛情限時批"}) , 500

	finally:
		con.close()
		mycursor.close()

#==============================================

@app.route("/api/order/<orderNumber>")
def orderNumver(orderNumber):
	try:
		con = pool.get_connection()
		mycursor = con.cursor(dictionary = True)
		cookie_token = request.cookies.get("token")
		if (cookie_token):
			mycursor.execute("SELECT * FROM orders \
							WHERE order_number = %s" , \
							(orderNumber ,))
			orders = mycursor.fetchall()
			
			member_id = orders[0]["member_id"]
			# 這邊改用新的order_trip，下面travel記得也要改
			mycursor.execute("SELECT * FROM order_trip\
							WHERE member_id = %s" , \
								(member_id ,))
			order_trip = mycursor.fetchone()
			attractionId = order_trip["attractionId"]
			mycursor.execute(" SELECT * FROM travel WHERE  id = %s" , (attractionId , ))
			data = mycursor.fetchall()
			data[0]["images"] = data[0]["images"].split(" ")
			
			return jsonify({"data": {
								"number": orderNumber,
								"price": order_trip["price"],
								"trip": {
									"attraction": {
										"id": attractionId,
										"name": data[0]["name"],
										"address": data[0]["address"],
										"image": data[0]["images"][0]
									},
									"date": order_trip["date"],
									"time": order_trip["time"]
								},
								"contact": {
									"name": orders[0]["contact_name"],
									"email": orders[0]["contact_email"],
									"phone": orders[0]["contact_phone"]
								},
								"status": 1
							}
							})
		else:
			return	({
					"error": True,
					"message": "未登入系統，拒絕存取"
					}) , 403

	except:
		# 失敗
		return ({"error" : True ,
					"message": "伺服器伍佰老師覺得很冷。"}), 500
	finally:
		con.close
		# mycursor.close()





@app.route("/thankyou")
def thankyou():
	try:
		con = pool.get_connection()
		mycursor = con.cursor(dictionary = True)
		cookie_token = request.cookies.get("token")
		if (cookie_token):	
			decoded = jwt.decode(cookie_token, secret_key, algorithms = "HS256" )	
			id =  decoded["data"]["id"]
			mycursor.execute('SELECT order_number FROM orders WHERE \
							member_id = %s ORDER BY id DESC' , (id ,))
			orders = mycursor.fetchall()
			# print(orders)
			
			# 訂成功後把reservation的清空
			mycursor.close()  # 關閉游標
			mycursor = con.cursor()  # 重新建立游標
			mycursor.execute("UPDATE reservation SET attractionId=NULL ,date=NULL ,time=NULL ,price=NULL  , memberId=NULL WHERE id = 1")
			con.commit()
			print(mycursor.rowcount , "was delete. After payment finish.")
			
			return render_template("thankyou.html" , order_number = orders[0]["order_number"]) 

		else:
			return redirect("/")

	except:
		return ({"error" : True ,
					"message": "伺服器伍佰老師謝謝大家。"}), 500

	finally:
		# print("感謝")
		con.close
		# mycursor.close
		
#==============================================

@app.route("/api/attractions")
def attractions():
	try:
		con = pool.get_connection()
		mycursor = con.cursor(dictionary = True)
		keyword = request.args.get("keyword","")
		page = int(request.args.get("page",""))
		# print(type(page))
		# 先判斷沒keyword 的
		if keyword == "":
			find =  "SELECT * FROM travel  LIMIT %s , %s " # LIMIT 12		
			find_value = ( page*12 , 12 ) # 判讀 起始 + 12 頁資料
			mycursor.execute(find , find_value)
			search = mycursor.fetchall()
			# print(len(search))
			for i in  range( len(search) )  :
				search[i]["images"] = search[i]["images"].split(" ")
			# 設置一個變數做數字，要維護修改時改這邊即可
			data_len = 12
			# page 4 , next page = null
			if len(search) < data_len :
				return jsonify( { 
									"nextPage": None ,
									"data":	search					
									
									} )		
			else:
				return jsonify( { 
									"nextPage": page + 1 ,
									"data":	search					
									
									} )
		# keyword exsist
		else  :
			find_key =  "SELECT * FROM travel WHERE name LIKE %s OR category = %s ORDER BY id LIMIT 12 OFFSET %s " # LIMIT 12
			find_key_value = ("%" + keyword + "%" , keyword , page*12)
			mycursor.execute(find_key , find_key_value )
			search_key = mycursor.fetchall()
			# print(search_key)
			# print(len(search_key))
			for i in  range( len(search_key) )  :
				search_key[i]["images"] = search_key[i]["images"].split(" ")
			# 設置一個變數做數字，要維護修改時改這邊即可
			data_len = 12
			# next page = null
			if len(search_key) < data_len :
				return jsonify( { 
					"nextPage": None ,
					"data":	search_key						
					} )
			else:
				return jsonify( { 
						"nextPage": page + 1 ,
						"data":	search_key					
						} )
	except:
		print("夏夜晚風裡的伺服器伍佰老師愛你一萬年")
		return jsonify(	{
							"error": True,
							"message": "夏夜晚風裡的伺服器伍佰老師愛你一萬年"
							}) , 500
	finally:
		con.close()
		mycursor.close()
		

@app.route("/api/categories")
def categories():
	try:
		con = pool.get_connection()
		mycursor = con.cursor(dictionary = True)
		mycursor.execute(" SELECT DISTINCT category FROM travel ")
		CAT = mycursor.fetchall()
		list_CAT = []
		for i in range(len(CAT)):

			all_CAT =  CAT[i]["category"]
			# print(all_CAT)
			list_CAT.append(all_CAT)
			# print(list_CAT)
		return jsonify( { 
			"data" :  list_CAT
			} )
	except:
		print("伺服器伍佰老師迷路到挪威的森林裡")
		return jsonify(	{
							"error": True,
							"message": "伺服器伍佰老師迷路到挪威的森林裡"
							}) , 500
	finally:
		con.close()
		mycursor.close()
		

@app.route("/api/attraction/<attractionId>")
def attractionId(attractionId):
	try:
		con = pool.get_connection()
		mycursor = con.cursor(dictionary = True)
		mycursor.execute(" SELECT * FROM travel WHERE  id = %s" , (attractionId , ))
		data = mycursor.fetchall()
		# print(data[0]["images"])
		data[0]["images"] = data[0]["images"].split(" ")		
		return jsonify({
					"data" : data
				})
	except:
		# 沒找到id 400
		if  attractionId not in data  : 
			return jsonify({
				"error": True,
				"message": "失敗的查詢，沒有此id編號"
				}), 400

		# 伺服器內部錯誤500
		else:
			return jsonify({
				"error": True,
				"message": "伺服器伍佰老師口袋就只有五百，啊~少年啊! 要忍耐，撐過熬過總算苦盡甘來"
				}), 500
	finally:
		con.close()
		mycursor.close()
		


@app.route("/attraction/<id>")
def attraction(id):
	return	render_template("attraction.html")

# ============================================

# 給JWT用的密鑰
jwt_secret_key=os.getenv("jwt_secret_key")
secret_key = jwt_secret_key

# ============================================

app.run(host='0.0.0.0', port=3000, debug=True)