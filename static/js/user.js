
//============================================================

/*  user login & signup 各種按鈕轉換顯示區 */

const sign_btn = document.querySelector("#login_signup")

sign_btn.addEventListener("click" , () =>{
    document.querySelector(".dialog-background").style.display = "flex";

    if (sign_btn.innerHTML === "登出系統"){
        document.querySelector(".dialog-background").style.display ="none"
        // console.log("點擊登出")
        fetch(`/api/user/auth` , {
            method: "DELETE"
        })
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            // console.log("登出成功" , data)
            location.reload();
            // sign_btn.innerHTML === "登入/註冊"
        })       
    }
} );

const close_btn = document.querySelector(".icon_close")
close_btn.addEventListener("click" , () =>{
    document.querySelector(".dialog-background").style.display = "none";
});

const close_btn_login = document.querySelector(".icon_close_login")
close_btn_login.addEventListener("click" , () => {
    document.querySelector(".dialog-background").style.display = "none";
})

const switch_signup = document.querySelector(".switch-signup")
switch_signup.addEventListener("click" , () =>{
    // 直接顯示切換
    document.querySelector(".dialog-signup").style.display = "flex";
    document.querySelector(".dialog-login").style.display = "none";
})

const switch_login = document.querySelector(".switch-login")
switch_login.addEventListener("click" , () => {
    document.querySelector(".dialog-login").style.display = "flex";
    document.querySelector(".dialog-signup").style.display = "none";
} )


//============================================================
/* 註冊區 */

const signup = document.querySelector(".signup")

signup.addEventListener("click" , (event) =>{
    event.preventDefault(); // 禁止表單預設的提交
    // 使用 serializeArray 方法將表單資料轉換成 JSON 格式 
    const name = document.querySelector("#name").value
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value

    const request_entry = {
        "name": name , 
        "email" : email ,
        "password" : password
    }
    // console.log(request_entry)
    fetch(`/api/user` , {
        method:"POST",
        credentials:"include",
        body:JSON.stringify(request_entry), //// 使用 JSON.stringify 方法將 JSON 格式的資料轉換成字串
        cache:"no-cache",
        headers: new Headers({
            "content-type":"application/json"
        })        
    })
    .then(function (response){ 
        return response.json()                
    })
    .then(function (data){
        if (data.ok === true){
            let notice = document.querySelector(".notice")
            notice.textContent = "註冊成功 ! " 
            const dialog_signup = document.querySelector(".dialog-signup")
            dialog_signup.classList.add("high");
            const dialog_main = document.querySelector(".dialog-main")
            dialog_main.classList.add("high-main")
        }
        else{
            let notice = document.querySelector(".notice")
            notice.textContent = data.message
            const dialog_signup = document.querySelector(".dialog-signup")
            dialog_signup.classList.add("high");
            const dialog_main = document.querySelector(".dialog-main")
            dialog_main.classList.add("high-main")
        }
    }); 
});

//============================================================
/* 登入區 */
const login = document.querySelector(".login")

login.addEventListener( "click" , (event) =>{
    const email = document.querySelector("#email-login").value
    const password = document.querySelector("#password-login").value
    const request_entry = {
        "email" : email ,
        "password" : password
    }
    // console.log(request_entry)
    fetch(`/api/user/auth` , {
        method:"PUT",
        credentials:"include",
        body:JSON.stringify(request_entry), //// 使用 JSON.stringify 方法將 JSON 格式的資料轉換成字串
        cache:"no-cache",
        headers: new Headers({
            "content-type":"application/json"
        })
    })
    .then(function (response){ 
        return response.json()                
    })
    .then(function(data){
        if (data.ok === true){            
            // 登入成功，重新載入頁面
            location.reload();
            // console.log(data)
        }
        else{
            let notice = document.querySelector(".notice-login")
            notice.textContent = data.message
        }
    })
});


window.addEventListener('load', function() {    
    fetch(`/api/user/auth`,{
        method:"GET"        
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if (data.data !== null) {
            // 如果存在 token，我的按鈕要改成登出系統
            // console.log("我的cookie 解密token" , data)
            const button = document.querySelector("#login_signup")
            button.innerHTML = "登出系統"
        }else{
            // Cookie token does not exist
            return
        }
    })    
});