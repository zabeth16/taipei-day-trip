const url = location.href.split("=")   //.split("/")[4]
// console.log(url[1])
const orderNumber = url[1]


/* 載入就 fectch 判斷並渲染頁面 */
window.addEventListener("load" , function(){
    fetch(`/api/order/${orderNumber}`)
    .then(function(response) {
        if(response.status === 500) {
            const result = document.querySelector(".result")
            result.textContent = "失敗，請保存此訂單號做詢問"
            const detail = document.querySelectorAll(".detail")
            for (let item of detail) {
                item.textContent = '';
            }
        }
        return response.json()
    })
    .then(function(data){
        // console.log(data)
        if(data.data !== null){
            const result = document.querySelector(".result")
            result.textContent = "成功 !"
            const name = document.querySelector(".name")
            name.textContent = data.data.contact.name
            const email = document.querySelector(".email")
            email.textContent = data.data.contact.email
            const phone = document.querySelector(".phone")
            phone.textContent = data.data.contact.phone
        }else{
            const result = document.querySelector(".result")
            result.textContent = "失敗 ~"
            const resultNotice = document.querySelector(".result-notice")
            resultNotice.textContent = data.message
            const name = document.querySelector(".name")
            name.textContent = data.data.contact.name
            const email = document.querySelector(".email")
            email.textContent = data.data.contact.email
            const phone = document.querySelector(".phone")
            phone.textContent = data.data.contact.phone

        }
    })
});

//============================================================
/* 預定行程區 */

const booking = document.querySelector("#booking")


booking.addEventListener("click" , () =>{

    fetch(`/api/user/auth`,{
        method : "GET"
    })
    .then(function(response){
        return response.json();        
    })
    .then(function(data){
        console.log(data)
        
        
        if (data.data === null){
            document.querySelector(".dialog-background").style.display = "flex"; 
        }else{
            window.location.href = "/booking"
        }

    })
    .catch(function(error){
        console.error(error);
    });

  
});

