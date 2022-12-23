const url = location.href.split("=")   //.split("/")[4]
// console.log(url[1])
const orderNumber = url[1]


/* 載入就 fectch 判斷並渲染頁面 */
window.addEventListener("load" , function(){
    fetch(`/api/order/${orderNumber}`)
    .then(function(response) {
        if(response.status === 500) {
            const result = document.querySelector(".result")
            result.textContent = "這是您上一筆歷史訂單"
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

            const name = document.querySelector(".name")
            name.textContent = data.data.contact.name
            const email = document.querySelector(".email")
            email.textContent = data.data.contact.email
            const phone = document.querySelector(".phone")
            phone.textContent = data.data.contact.phone

        }
    })
});

