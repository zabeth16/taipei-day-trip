// 老師說要放的觀察全域用 api 是否載入
let isLoading = false;




/*====================*/
// let page_num = 0 

// let key_page_num = 0

let keyword = ""

let nextPage



/*====================*/

async function initialLoad() {
    const response = await fetch("/api/attractions?page=0");
    const parsedData = await response.json();
    nextPage = parsedData.nextPage;
    data = parsedData.data;
    append_view(data);
    // console.log(parsedData.nextPage)
}
  
document.addEventListener("DOMContentLoaded", initialLoad);




/*====================*/

// 點擊input 搜尋欄顯示

input = document.querySelector(".input")




input.addEventListener("click",function (Event)  {
    document.querySelector(".locate_card").style.display = "block";
    console.log("召喚!!覆蓋的搜尋卡!");
    
    Event.stopPropagation(input)  
    
    
    //console.log(document.querySelector(".search_text").textContent)

   
 
  
    },false

);

// 點擊分類景點懶人傳去input欄位
// 還沒查到QQ
// EventTarget.value 丟到input裡面! select 標籤的textContent

// document.getElementsByClassName(".search_text").value = input.innerHTML;
search_text = document.querySelector(".search_text")
search_card = document.querySelector(".search_card")

// ======= add 監聽事件 大失敗=========
// search_card.addEventListener("click" ,function(event){

//     console.log("點擊事件有點到嗎?")
//     event.stopPropagation(search_card)  
//     } , false
// )

// 我上面console的到，但是我點擊各種事件就是拿不到QQ

// ======= onclick 加函式 =========
// document.getElementsByClassName(".locate_card").onclick = function get_btn(){
    
    // let text = document.querySelector(".search_text").textContent
    // console.log("有沒有點到?")
    // let btn_text = document.createTextNode(text)
    

    // input.appendChild(btn_text)
    // text = input.innerHTML

    // document.getElementsByClassName(".input").innerHTML = ""
//     document.getElementsByClassName(".input").innerHTML = document.querySelector(".search_text").textContent

// }



search_card = document.querySelector(".search_card")
search_text = document.querySelector(".search_text")
lo_card = document.querySelector(".locate_card")

lo_card.addEventListener("click",get_btn = (e)=>{
    // 先解決冒泡，不會點了消失
    e.stopPropagation(lo_card)
    
    document.querySelector(".locate_card").style.display = "block"

    console.log(e.target.textContent) // 可以找到我點誰的文字!!!
    // console.log(e.target.textContent.length)
  

    input = document.querySelector(".input")
    if (e.target.textContent.length > 4){
        input.textContent = ""
    }else{
        input.value = e.target.textContent
        document.querySelector(".locate_card").style.display = "none"

    }
    

    
    // 純粹看怎麼抓我的文字
    // text_list = document.querySelectorAll(".search_text")
    
    // // console.log(text_list[8].textContent)
    // for (i = 0 ; i < text_list.length ; i++ ){
    //     text =  text_list[i].textContent
    //     // console.log(text)
        
    // }   



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
    console.log(keyword)
    

    isLoading = true ;
    const response = await fetch(`/api/attractions?page=0&keyword=${keyword}`);
    const data = await response.json();
    // 產生 nextPage 數字
    nextPage = data.nextPage ;
    data_list = data.data;
    append_view(data_list);

    
    if (data_list.length === 0){
        console.log("沒有這個景點")
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


// 重寫測試全域區



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
                detail.appendChild(cat_box)
                square.appendChild(detail)

               

        }; 



        //for end
        console.log("實際nextPage" , nextPage);
        if (nextPage !== null ){ // && isLoading === true
            console.log("繼續召喚");
            isLoading = false ;
            console.log(isLoading);
       
        }else{
            isLoading = false ;
            console.log(isLoading);
            console.log("取消觀察，以免又觸發下一個 request");

            
            // observer.unobserve(listEnd);
            // observer.disconnect(); 
            // nextPage = 0
  

            
        } ;



            

    
    

}; // append_view end




/*====================*/

// 無限卷軸載入、叫產生資料函式
// 配合早上說的async、await


async function load_view(entries){


    entries.forEach((entry) => {
        if(entry.isIntersecting){
            if (nextPage === null || isLoading === true){
                return console.log("不要動!");
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
    


console.log(window.innerHeight)
view_h = window.innerHeight

// the options for observer
let options = {
    root: null,
    rootMargin: `-${view_h - 90}px 0px 0px 0px`  ,
    threshold: 0.5 
};

const observer = new IntersectionObserver(load_view, options);
console.log(new IntersectionObserver(load_view , options ));


const listEnd = document.querySelector(".footer");

observer.observe(listEnd);





// 看我的scroll高度用的，
// window.addEventListener('scroll', () => {
// 	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	
// 	console.log( { scrollTop, scrollHeight, clientHeight });
// });


// 



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
            locate.removeChild(locate.firstChild)    ;                
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


    /*還要做點擊其他區域隱藏、傳送點擊文字至input內，傳送完也要隱藏*/
};

show_tag();

//============================================================
/* 暫時查到的一些資料*/

// $(document).mouseup(function (e) {
//     var container =$(".suggest"); // 這邊放你想要排除的區塊
//     if (!container.is(e.target) && container.has(e.target).length === 0) {
//        container.hide(); 
//     }
// });




// document.getElementsByClassName(".search_card").style.display="none"; //隱藏
// document.getElementsByClassName(".search_card").style.display=""; //顯示

//============================================================