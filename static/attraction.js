/*  全域變數區  */

let number = location.href.split("/")[4]

typeof(number) // string
// console.log(number)




// ===========================================
/*  普通用網址列載入 */

async function web_load() {
    const response = await fetch(`/api/attraction/${number}`);
    const parsedData = await response.json();
    
    data = parsedData.data;
    append_view(data);
    
}


// let addEvent to call this function
window.onload = web_load();
// ============== ATTN ===============





// ===========================================

/*  放入資料  */

function append_view(data){
    // console.log(data[0])

    //  name = data[0].name
    //  tag = data[0].category
    //  mrt = data[0].mrt
    //  imgs = data[0].imgs

    //  description = data[0].description
    //  address = data[0].address
    //  transport = data[0].transport       

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
    let mrt = document.createTextNode(data[0].mrt)
    mrt_div.appendChild(mrt)

    //////////////////////////////

    /*  先弄 mySlides fade 包住我圖片  */

    let slide_container = document.querySelector(".slideshow-container")

    for (i = 0 ; i < data[0].images.length ; i++){
        let mySlides = document.createElement("div")
        mySlides.className = "mySlides" + " fade"
        let imgs = document.createElement("img")
        imgs.className = "img-control"
        // ======ATTN temp for the first one ===========
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





    // let small_black = document.createElement("div")
    // small_black.className = "small-black"
    // let big_white = document.createElement("div")
    // big_white.className = "big-white" 
    // big_white.appendChild(small_black)
    // big_white.setAttribute("onclick" , "current")


    // circle_box.appendChild(big_white)    

    

    // 如果有多的就創造其餘總數的白圓
    // 黑圓也要看他是不是當下的


    // 我每個景點有幾張圖?
    // console.log(data[0].images.length)

    //////////////////////////////
    showSlides(slideIndex);

}; //append_view()  end
    


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