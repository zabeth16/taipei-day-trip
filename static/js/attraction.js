/*  全域變數區  */
let number = location.href.split("/")[4]
typeof(number) // string
// ===========================================
/*  普通用網址列載入 */

async function web_load() {
    const response = await fetch(`/api/attraction/${number}`);
    const parsedData = await response.json();
    
    data = parsedData.data;
    append_view(data);
    
}

// let addEvent to call this function
window.onload = web_load() ;

// ===========================================

/*  放入資料  */

function append_view(data){
    let info = document.querySelector(".info")    
    let description = document.createTextNode(data[0].description)
    info.appendChild(description)

    let address_div = document.querySelector(".address")
    let address = document.createTextNode(data[0].address)
    address_div.appendChild(address)

    let traffic = document.querySelector(".traffic")
    let transport = document.createTextNode(data[0].transport)
    traffic.appendChild(transport)

    let name_div = document.querySelector(".name")
    let name = document.createTextNode(data[0].name)
    name_div.appendChild(name)

    let tag_div = document.querySelector("#tag")
    let tag = document.createTextNode(data[0].category)
    tag_div.appendChild(tag)

    let mrt_div = document.querySelector("#mrt")
    if (data[0].mrt === null){
        data[0].mrt = "無捷運站"
    }
    let mrt = document.createTextNode(data[0].mrt)    
    mrt_div.appendChild(mrt)
    /* 換網頁頂端title! */    
    document.title = "景點: " + (data[0].name);
    //////////////////////////////

    /*  先弄 mySlides fade 包住我圖片  */

    let slide_container = document.querySelector(".slideshow-container")
    for (i = 0 ; i < data[0].images.length ; i++){
        let mySlides = document.createElement("div")
        mySlides.className = "mySlides" + " fade"
        let imgs = document.createElement("img")
        imgs.className = "img-control"        
        imgs.src = data[0].images[i]  
        // all imgs will not show well
        mySlides.appendChild(imgs)
        slide_container.appendChild(mySlides)
    }
    // the circle and its' box 
    let circle_box = document.querySelector(".circle-box")
    
    for (i = 1 ; i < data[0].images.length  + 1; i ++){
        let dot = document.createElement("div")
        dot.className = "dot"
        let current_len = data[0].images.length    
        dot.setAttribute("onclick" , "currentSlide(" + i + ")")
        circle_box.appendChild(dot)
    
    }    
    showSlides(slideIndex);

}; //append_view()  end

/* 手機平板的左右滑動顯示圖片 */
// 取得圖片元素
const imageElement = document.querySelector(".slideshow-container");
// 定義目前顯示的圖片索引
let currentIndex = 0;
imageElement.addEventListener("touchmove", function(event) {
    // 取得觸摸的水平位移量
    let x = event.touches[0].clientX;
    // 如果觸摸的水平位移量大於 50，則觸發 plusSlides(1) 函式
    if (x > 360) {
        plusSlides(1);
    }
    // 如果觸摸的水平位移量小於 -50，則觸發 plusSlides(-1) 函式
    if (x < -360) {
        plusSlides(-1);
    }
})

let right_A = document.querySelector(".right-A")
let left_A = document.querySelector(".left-A")
right_A.setAttribute("onclick" , "plusSlides(1)")
left_A.setAttribute("onclick" , "plusSlides(-1)")



i = 0
let slideIndex = 1 

// ===========================================
/* the function for slides changing */

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    for (i = 0; i < slides.length ; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active";
}


// ===========================================

// ===========================================

/*  switch day and night fee*/
let fee = document.querySelector(".fee")

let big_night = document.querySelector("#big-night")

let day = document.querySelector("#day")
let night = document.querySelector("#night")

big_night.addEventListener("click" , (event) =>{
    day.style.display = "none";
    night.style.display = "block";
    fee.textContent = "新台幣2500元"
    }
);

let big_day = document.querySelector("#big-day")
big_day.addEventListener("click" , (event) =>{
    day.style.display = "block";
    night.style.display = "none"
    fee.textContent = "新台幣2000元"
    }
);

// ===========================================

const bookingBtn = document.querySelector(".booking-btn")

// 設定 input 元素的 value 為當前日期


bookingBtn.addEventListener("click" , () =>{
    let id = number
    let date = document.querySelector(".calender").value
    //設定今天的日期
    var today = new Date();
    document.querySelector(".calender").min = today.toISOString().split("T")[0];
    let selectedDate = new Date(date);
    if (selectedDate.getTime() < today.getTime()) {
        const dateNotice = document.querySelector(".date-notice")
        dateNotice.style.display = "block"
        dateNotice.textContent = "請選擇今天或之後的日期！"
        const bookingArea = document.querySelector(".booking_area")
        bookingArea.classList.add("high-date-notice")
        const hr = document.querySelector("hr")
        hr.classList.add("hr-date-notice")
        return
    }     
    // time 用錢弄出來
    let fee = document.querySelector(".fee").textContent
    let feeWord = fee.split("新台幣")   
    let money = feeWord[1].replace('元', '')
    let time = "morning"
    if (money === "2000"){
        time = "morning"
        
    }else{
        time = "afternoon"        
    }

    let request_entry = {
        "attractionId": id,
        "date": date,
        "time": time,
        "price": money
    }

    fetch(`/api/booking` ,{
        method:"POST",
        credentials:"include",
        body:JSON.stringify(request_entry), //// 使用 JSON.stringify 方法將 JSON 格式的資料轉換成字串
        cache:"no-cache",
        headers: new Headers({
            "content-type":"application/json"
        })
    })
    .then(function(response){
        return response.json()
    })
    .then(function(data){

        console.log(Object.keys(data)[0])
        if (Object.keys(data)[0] === "ok"){
            // 有驗證成功才去booking頁面
            window.location.href = "/booking";
        }
        else if (data.message === "日期不可為空" ){
            // console.log(data.message);
            const dateNotice = document.querySelector(".date-notice")
            dateNotice.style.display = "block"
            dateNotice.textContent = data.message
            const bookingArea = document.querySelector(".booking_area")
            bookingArea.classList.add("high-date-notice")
        }else{
            // 未登入要彈給他登入
            document.querySelector(".dialog-background").style.display = "flex";

        }        
    });
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