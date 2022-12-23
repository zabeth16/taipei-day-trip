
/* 載入就 fectch 判斷並渲染頁面 */
window.addEventListener("load" , function(){
    fetch(`/api/booking`,{
        method:"GET"
    })
    .then(function(response){      
        return response.json();
    })
    .then(function(data){      
        // 有資料、沒資料各一版        
        // 有資料
        if (data.data !== null){         
            const title = document.querySelector(".title")
            title.textContent = data.data.attraction.name
            const date = document.querySelector(".date")
            date.textContent = data.date
            const time = document.querySelector(".time")
            if(data.time === "morning"){
                data.time = "早上 9 點到下午 4 點"
            }else{
                data.time = "下午 2 點到晚上 9 點"
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
            // 把資料預定景點id資料打包出去
            let id = data.data.attraction.id
            img.id = id           

        }else{      
            // 沒資料
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
});


/* the card payment: setup */
TPDirect.card.setup({
    
    // Display ccv field
    fields : {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: 'ccv'
        }
    },  
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // style focus state
        ':focus': {
            'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }    
});

/* the card payment: button change */
const  submitButton = document.querySelector(".confirm-button")
submitButton.setAttribute('disabled', true)
submitButton.style.backgroundColor="lightgray";
submitButton.style.cursor = "default";
TPDirect.card.onUpdate(function (update) {   
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime === true ) {
        // Enable submit Button to get prime.
        submitButton.removeAttribute('disabled', true);
        submitButton.style.backgroundColor= "#448899";
        submitButton.style.cursor = "pointer" ;       
    }     
    else {
        // Disable submit Button to get prime.
        submitButton.setAttribute('disabled', true)
        submitButton.style.backgroundColor="lightgray";
        submitButton.style.cursor = "default";
    };
});

/* the card payment: get prime and pay */
const contactNotice = document.querySelector(".contact-notice")
submitButton.addEventListener("click" , onSubmit = (event)  => {
    // console.log("付錢啊!!!")
    event.preventDefault()      
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    const name = document.querySelector(".name").value
    const email = document.querySelector(".email").value
    const phone = document.querySelector(".phone").value
    // 取得 TapPay Fields 的 status
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        console.log('can not get prime')
        return
    }
    if (name === "" || email === "" || phone === ""){        
        contactNotice.textContent = "聯絡資訊不可為空 ! "
        return
    }
    // 記得解放這邊
    else if(! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    .test(email)) {
        contactNotice.textContent = "email 格式輸入錯誤，請符合 XXX@XXX.com"
        return
    }
    else if(! /^[0-9]{4}[0-9]{3}[0-9]{3}$/ .test(phone)){
        contactNotice.textContent = "手機格式錯誤，請檢查是否是4+3+3碼"
        return
        }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            console.log('get prime error ' + result.msg)
            return
        }        
        // console.log('get prime 成功，prime: ' + result.card.prime)        
        // send prime to your server, to pay with Pay by Prime API .
        const prime = result.card.prime      
        // get price
        const priceTxt = document.querySelector(".confirm-fee").textContent;
        const priceTxtTide = priceTxt.match(/\d+/g);
        const price = priceTxtTide[0]
        // get attraction id
        const imgId = document.querySelector(".img").id
        const attractionId = imgId        
        // get attraction name、img、address
        const attractionName = document.querySelector(".title").textContent
        const img = document.querySelector(".img").src
        const address = document.querySelector(".address").textContent
        // get date、time
        const date = document.querySelector(".date").textContent
        let time = document.querySelector(".time").textContent
        if(time.indexOf('早') !== -1 ){
            // 有包含早這個字
            time = "morning"
        }else{
            time = "afternoon"
        };

        let bookingData = {
            "prime": prime,
            "order": {
                "price": price,
                "trip": {
                    "attraction": {
                        "id": attractionId,
                        "name": attractionName,
                        "address": address,
                        "image": img
                    },
                    "date": date,
                    "time": time
                },
                "contact": {
                "name": name,
                "email": email,
                "phone": phone
                }
            }
        };   

        fetch(`/api/orders`,{
            method:"POST",
            credentials:"include",
            body:JSON.stringify(bookingData), //// 使用 JSON.stringify 方法將 JSON 格式的資料轉換成字串
            cache:"no-cache",
            headers: new Headers({
                "content-type":"application/json"
            })
        }).then(function(response){
            return response.json()
        }).then(function(data){
            // console.log(data.data.payment.status)
            if (data.data.payment.status === 0){
                console.log("付款成功 your order number" , data.data.number)
                const orderNumber = data.data.number
                window.location.href = `/thankyou?number=${orderNumber}`
            }else{
                console.log("付款失敗 your order number" , data.data.number)
                // // fail to payment
                const orderNumber = data.data.number
                window.location.href = `/thankyou?number=${orderNumber}`               
            }
        })    
    }); // TPDirect.card.getPrime end  
    
} );
