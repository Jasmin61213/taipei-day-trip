//驗證是否登入
fetch("/api/user/auth",{
    method: "GET"
})
.then(function(response){
    return response.json();
})
.then(function(data){
    if (data.data == null){
        window.location.href = "/";
    };
});

//載入預定景點頁面
fetch("/api/booking",{
    method: "GET"
})
.then(function(response){
    return response.json();
})
.then(function(data){
    const hello = document.querySelector(".content_title_hello");
    hello.textContent = `您好，${data.name}，待預訂的行程如下：`;
    if (data.data == null){
        const remove = document.querySelector(".content");
        remove.remove();
        const content = document.createElement("div");
        content.className = "no-reserve";
        content.style.height="calc(100vh - 257px)"; 
        content.textContent = "目前沒有預定行程";
        const body = document.querySelector(".change");
        body.appendChild(content);
    }else{
        const img = document.getElementById("img");
        img.src = data.data.attraction.image;
        const taipei_title = document.getElementById("taipei_title");
        taipei_title.textContent = data.data.attraction.name;
        const date = document.getElementById("date");
        date.textContent = data.data.date;
        const time = document.getElementById("time");
        if (data.data.time == "morning"){
            timeContent = "早上九點至下午一點";
        }else{
            timeContent = "下午兩點至下午八點";
        }
        time.textContent = timeContent;
        const price = document.getElementById("price");
        price.textContent = data.data.price;
        const address = document.getElementById("address");
        address.textContent = data.data.attraction.address;
        const fee = document.getElementById("fee");
        if (data.data.price == "2000"){
            fee.textContent = "總價：新台幣2000元";
        }else{
            fee.textContent = "總價：新台幣2500元";
        };
    };
});


//刪除行程
function deleteReserve(){
    fetch("/api/booking",{
        method: "DELETE"
    })
    .then(function(response){
        return response.json();
    })
    .then(function(res){
        if (res.ok == true){
            window.location.reload();
        };
    });
};

