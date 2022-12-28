// 老師說要放的觀察全域用 api 是否載入
let isLoading = false;

/*====================*/

let keyword = ""

let nextPage


/*====================*/

async function initialLoad() {
    const response = await fetch("/api/attractions?page=0");
    const parsedData = await response.json();
    nextPage = parsedData.nextPage;
    data = parsedData.data;
    append_view(data);
    
}
  
document.addEventListener("DOMContentLoaded", initialLoad);


/*====================*/

// 點擊input 搜尋欄顯示

input = document.querySelector(".input")

input.addEventListener("click",function (Event)  {
    document.querySelector(".locate_card").style.display = "block";
    // console.log("召喚!!覆蓋的搜尋卡!");    
    Event.stopPropagation(input)      
    },false

);

// 點擊分類景點懶人傳去input欄位
// EventTarget.value 丟到input裡面! select 標籤的textContent

search_card = document.querySelector(".search_card")
search_text = document.querySelector(".search_text")
lo_card = document.querySelector(".locate_card")

lo_card.addEventListener("click",get_btn = (e)=>{ //其實也沒用到什麼get_btn函式
    // 先解決冒泡，不會點了消失
    e.stopPropagation(lo_card)
    
    document.querySelector(".locate_card").style.display = "block"

    // console.log(e.target.textContent) // 可以找到我點誰的文字!!! 

    input = document.querySelector(".input")
    if (e.target.textContent.length > 4){
        input.textContent = ""
    }else{
        input.value = e.target.textContent
        document.querySelector(".locate_card").style.display = "none"
    }
    },false
)



body = document.querySelector(".body")
// 點擊其他區域隱藏
body.addEventListener("click",() =>{
    document.querySelector(".locate_card").style.display = "none";
    // console.log("點擊其他區域隱藏")
    },false
);

/*====================*/
// keyword 搜尋結果專區

content = document.querySelector(".content-1");
button_search = document.querySelector(".button_search")


async function keyword_load(){
    keyword = document.querySelector(".input").value
    // console.log(keyword)
    

    isLoading = true ;
    const response = await fetch(`/api/attractions?page=0&keyword=${keyword}`);
    const data = await response.json();
    // 產生 nextPage 數字
    nextPage = data.nextPage ;
    data_list = data.data;
    append_view(data_list);

    
    if (data_list.length === 0){
        // console.log("沒有這個景點")
        main = document.querySelector(".content-1")
        warn = document.createTextNode("沒有這個景點")
        warn_box = document.createElement("div")
        warn_box.className = "warn_box"
       

        warn_box.appendChild(warn)
        main.appendChild(warn_box)
    }
    

}





// 點擊 serach keyword page
button_search.addEventListener('click',() =>{

    // 搜尋keyword結果的時候要清理原本的
    while (content.hasChildNodes()) {

        content.removeChild(content.firstChild)  
    
    };


    keyword_load();
    // nextPage = 0
    
});

/*====================*/
/*  點擊傳送至attraction頁面  */

let square = document.querySelector(".square")

content.addEventListener("click" , (e) =>{
    
    e.stopPropagation(square)
    // console.log(e.target)
    // 恩......都抓到子元素

    
    },
);




/*====================*/


// 重寫測試全域區


let count = 0
let pageNumber = 1
// 普通 page 頁

let append_view = (data_list) =>{

    // console.log(data_list)
    
    //isLoading = true;
    
    
    

        for (i = 0 ; i < data_list.length  ; i ++ ){
                
            

            // create container square

                let square = document.createElement("div");
                square.className = "square";
                let content = document.querySelector(".content-1");
                content.appendChild(square);


                // attraction images

                first_pic = data_list[i].images[0];              
                let pic_box = document.createElement("img");
                pic_box.id = "img-control";
                pic_box.src = first_pic;
                square.appendChild(pic_box);     

                // attraction name (title)

                let title_text = document.createTextNode(data_list[i].name);
                
                let title = document.createElement("div");
                title.className = "title";
                title.appendChild(title_text);
                square.appendChild(title)

                
                // attraction mrt
                let mrt = document.createTextNode(data_list[i].mrt);
                let mrt_box = document.createElement("div");
                mrt_box.className = "mrt" ;               
                mrt_box.appendChild(mrt);
                

                // attraction category (tag)
                let category = document.createTextNode(data_list[i].category);
                let cat_box = document.createElement("div");
                cat_box.className = "tag";
                cat_box.appendChild(category);

                // container detail
                let detail = document.createElement("div");
                detail.className = "detail";
                detail.appendChild(mrt_box);
                detail.appendChild(cat_box);
                square.appendChild(detail);

                let a = document.createElement("a")
                a.className = "attractionLink"      
                  
                a.href = "/attraction/" + data_list[i].id;    

                content.appendChild(a)
                a.appendChild(square)               

        };  //for end   

        
        
        if (nextPage !== null ){ 
            // console.log("繼續召喚");
            isLoading = false ;
            // console.log(isLoading);
       
        }else{
            isLoading = false ;
            // console.log(isLoading);
            // console.log("取消觀察，以免又觸發下一個 request");
            // 不要做 unobserve或disconnect ，這樣會造成停滯          
        } ;
    

}; // append_view end


/*====================*/

// 無限卷軸載入、叫產生資料函式
// 配合早上說的async、await


async function load_view(entries){


    entries.forEach((entry) => {
        if(entry.isIntersecting){
            if (nextPage === null || isLoading === true){
                return 
                // console.log("不要動!");
            }
        
            if (keyword !== ""){ 
                
                url = `/api/attractions?page=${nextPage}&keyword=${keyword}`
            }
            else{
                
                url = `/api/attractions?page=${nextPage}`
            }
            isLoading = true ;
            fetch(url).then(function (response){
                return response.json();
                }).then(res = (data)  => {
                    // 產生 nextPage 數字
                    nextPage = data.nextPage;
                    
                    append_view(data.data);
                })     
      
        };
    });
    
};
    
// console.log(window.innerHeight)
view_h = window.innerHeight

// the options for observer
let options = {
    root: null,
    rootMargin: `-${view_h - 90}px 0px 0px 0px`  ,
    threshold: 0.5 
};

const observer = new IntersectionObserver(load_view, options);
// console.log(new IntersectionObserver(load_view , options ));
const listEnd = document.querySelector(".footer");
observer.observe(listEnd);


/* search card 區 */

function show_tag(){
    fetch("/api/categories")
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        // console.log(data.data);

        let search_card = document.createElement("div");
        search_card.className = "search_card";
        let locate = document.querySelector(".locate_card");

        while (locate.hasChildNodes()) {
            locate.removeChild(locate.firstChild);                
        };

        locate.appendChild(search_card)
        for (s = 0 ; s <data.data.length ; s++ ){
            let search_text = document.createElement("div");
            search_text.className = "search_text";
            let text = document.createTextNode(data.data[s]);
            search_text.appendChild(text);
            search_card.appendChild(search_text);            
            
        };
           
    });
    
};

show_tag();

//============================================================

/*  user login & signup 各種按鈕轉換顯示區 */

let sign_btn = document.querySelector("#login_signup")

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
        })

    }
} );

let close_btn = document.querySelector(".icon_close")

close_btn.addEventListener("click" , () =>{
    document.querySelector(".dialog-background").style.display = "none";
});


let close_btn_login = document.querySelector(".icon_close_login")
close_btn_login.addEventListener("click" , () => {
    document.querySelector(".dialog-background").style.display = "none";
})


let switch_signup = document.querySelector(".switch-signup")

switch_signup.addEventListener("click" , () =>{

    // 直接顯示切換比較快吧
    document.querySelector(".dialog-signup").style.display = "flex";
    document.querySelector(".dialog-login").style.display = "none";
})

let switch_login = document.querySelector(".switch-login")

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

    let name = document.querySelector("#name").value
    let email = document.querySelector("#email").value
    let password = document.querySelector("#password").value

    let request_entry = {
        "name": name , 
        "email" : email ,
        "password" : password
    }

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
        // console.log(data)

        if (data.ok === true){
            let notice = document.querySelector(".notice")
            notice.textContent = "註冊成功 ! " 
            let dialog_signup = document.querySelector(".dialog-signup")
            dialog_signup.classList.add("high");
            let dialog_main = document.querySelector(".dialog-main")
            dialog_main.classList.add("high-main")
        }
        else{
            let notice = document.querySelector(".notice")
            notice.textContent = data.message
            let dialog_signup = document.querySelector(".dialog-signup")
            dialog_signup.classList.add("high");
            let dialog_main = document.querySelector(".dialog-main")
            dialog_main.classList.add("high-main")
        }

    });  

});

//============================================================
/* 登入區 */
const login = document.querySelector(".login")

login.addEventListener( "click" , (event) =>{
    let email = document.querySelector("#email-login").value
    let password = document.querySelector("#password-login").value

    let request_entry = {
        "email" : email ,
        "password" : password
    }

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
            
        }else{
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
            let button = document.querySelector("#login_signup")
            button.innerHTML = "登出系統"

        }else{
            // 如果不存在 token，就沒幹嘛
            // console.log("Cookie token does not exist")
            return
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
        // console.log(data)
        
        
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