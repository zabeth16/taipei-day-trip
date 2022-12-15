
/* 每次載入都檢查是否有登入，沒有就導回首頁 */
window.addEventListener("load" , ()=>{
    fetch(`/api/user/auth` , {
        method:"GET"
    }).then(function(response){
        return response.josn()
    })
    .then(function(data){
        console.log(data)
    })
})



/* 載入就 fectch 判斷並渲染頁面 */
window.addEventListener("load" , function(){
    fetch(`/api/booking`,{
        method:"GET"
    })
    .then(function(response){      
        return response.json();
    })
    .then(function(data){
        console.log(data)
        // 有資料、沒資料各一版
        
        // 有資料
        if (data.data !== null){
            // console.log(data.data.attraction.name)

            const title = document.querySelector(".title")
            title.textContent = data.data.attraction.name

            const date = document.querySelector(".date")
            date.textContent = data.date

            const time = document.querySelector(".time")
            if(data.time === "morning"){
                data.time = "早上 9 點到下午 4 點"
            }else{
                data.time = "下午2點到晚上9點"
            }
            time.textContent = data.time

            const fee = document.querySelector(".fee")
            fee.textContent = data.price
            const confirmFee = document.querySelector(".confirm-fee")
            confirmFee.textContent = "總價 : 新台幣 " + data.price + " 元"

            const address = document.querySelector(".address")
            address.textContent = data.data.attraction.address

            const img = document.querySelector(".img")
            img.src = data.data.attraction.image


        }else{      

            document.querySelector(".section").style.display = "none";
            document.querySelector(".contact").style.display = "none";
            document.querySelector(".payment").style.display = "none";
            let hrs = document.querySelectorAll("hr");

            for (let i = 0; i < hrs.length; i++) {
                hrs[i].style.display = "none";
            }
            document.querySelector(".confirm").style.display = "none";
            const content = document.querySelector(".content")
            let emptyTxt = document.createTextNode("目前沒有任何待預訂的行程")
            content.appendChild(emptyTxt)
            const headline = document.querySelector(".headline")
            headline.classList.add("empty-buttom")

            const footer = document.querySelector(".footer")
            footer.style.height = "500px"
            footer.style.backgroundImage = "none";
            const footerTxt = document.createElement("txt")
            footerTxt.textContent = "COPYRIGHT © 2021 台北一日遊"
            footerTxt.className = "footerTxt"
            footer.appendChild(footerTxt)
            
            

        

        }// else end

    })
});


/* 刪除行程 */
const deleteIcon = document.querySelector(".icon_delete")

deleteIcon.addEventListener("click" , async() =>{
    const response =  await fetch(`/api/booking` ,{
                        method : "DELETE"
                    })
    const data =  await response.json();
    
    location.reload(); 

})




