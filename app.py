from flask import (Flask, jsonify, redirect, render_template, request, session,
                   url_for)


import json



from pool import pool

app = Flask(
    __name__ , 
    static_folder = "static" , # 靜態檔案的資料夾名稱，要改名也可以，不過資料夾名也要記得更動
    static_url_path = "/mysource" 
            ) 


app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

# 加這行讓 API 的順序變成一樣的喔
app.config["JSON_SORT_KEYS"] = False



# Pages
@app.route("/")
def index():
	return render_template("index.html")




@app.route("/api/attractions")
def attractions():
	try:
		con = pool.get_connection()
		mycursor = con.cursor(dictionary = True)

		
		mycursor.execute(" SELECT * FROM travel ")
		data = mycursor.fetchall()
	

		keyword = request.args.get("keyword","")
		
		# find =  "SELECT * FROM travel WHERE name LIKE %s OR category = %s ORDER BY id  " # LIMIT 12
	
		# find_value = ("%" + keyword + "%" , keyword)
		# mycursor.execute(find , find_value )
		# search = mycursor.fetchall()
		# print(search)
		# print(len(search))





		# # 圖片轉陣列區，記得放進去

		data_list = []
		data_list.append(data)

		for i in range(len(data)):

			data[i]["images"] = data[i]["images"].split(" ")
			

			
		

		page = int(request.args.get("page",""))

		# print(type(page))
		
		if  page < (len(data)/12 -1) and keyword != "":

			
			find =  "SELECT * FROM travel WHERE name LIKE %s OR category = %s ORDER BY id LIMIT 12 OFFSET %s " # LIMIT 12
		
			find_value = ("%" + keyword + "%" , keyword , page*12)
			mycursor.execute(find , find_value )
			search = mycursor.fetchall()
			print(search)
			print(len(search))

			for s in range(len(search)):
				search[s]["images"] = search[s]["images"].split(" ")


	
		
			start_num = (12*page)
			# print(start_num)

			# 藝文館所 page 0
			if len(search) == (page + 12) :


				return   jsonify( { 
								"nextPage": page + 1 ,
								"data":	search					
								
								} )

			# 普通page 0~3



			else: 
				return   jsonify( { 
								"nextPage": None ,
								"data":	search					
								
								} )



		# "data":	data[start_num : start_num + 12 ]
		
		elif   page < (len(data)/12 -1) and keyword == ""	:
			return   jsonify( { 
				"nextPage": page +1  ,
				"data":	data[ page * 12 : page * 12 + 12 ]					
				
				} )

								


		elif   page  > (len(data)/12) :
			print("頁數超過了啊!")
			return jsonify(	{
							"error": True,
							"message": "頁數超過了啊 !"
							})			
		

		else : 
			return   jsonify( { 
						"nextPage": None ,
						"data":	data[-10:]					
						
						} )






	# except:

	# 	print("夏夜晚風裡的伺服器伍佰老師愛你一萬年")
	# 	return jsonify(	{
	# 						"error": True,
	# 						"message": "夏夜晚風裡的伺服器伍佰老師愛你一萬年"
	# 						}) , 500

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


		



@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")



# ============================================


# 建立一個密鑰，內容可以隨便打，session 用
app.secret_key = "anyway, that is a secrect"


# ============================================

app.run(host='0.0.0.0', port=3000, debug=True)