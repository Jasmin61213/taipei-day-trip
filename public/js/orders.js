const content = document.querySelector(".content");
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
    }else{
        // const content = document.querySelector(".content");
        const hello = document.createElement("div");
        hello.textContent = `您好，${data.data.name}，您的預訂行程如下：`;
        hello.className = "content-title";
        content.appendChild(hello);
    };
});

fetch("/api/orders",{
    method: "GET"
})
.then(function(response){
    return response.json();
})
.then(function(data){
    const orders = data.data;
    if (orders.length == 0){
        content.style.height="calc(100vh - 188.5px)"; 
        const noOrder = document.createElement("div");
        noOrder.className = "content-title"
        noOrder.textContent = "目前沒有預定訂單"
        content.appendChild(noOrder)
    }
    if (orders.length == 1){
        content.style.height="calc(100vh - 188.5px)"; 
        const wrapContent = document.createElement("div");
            wrapContent.className = "wrap-content";
            const wrap = document.createElement("div");
            wrap.className = "wrap";
            const contentLeft = document.createElement("div");
            contentLeft.className = "content-left";
            const contentRight = document.createElement("div");
            contentRight.className = "content-right";
            const userTitle = document.createElement("div");
            userTitle.className = "text-content--title";
            userTitle.textContent = "訂單編號："+orders[i].order_id;
            wrapContent.append(userTitle);
            const img = document.createElement("img");
            img.src = orders[i].images[0];
            img.className = "img";
            contentLeft.appendChild(img);
            const name = document.createElement("div");
            name.textContent = orders[i].name;
            name.className = "text-content-top";
            contentRight.appendChild(name);
            const date = document.createElement("div");
            date.textContent = "日期："+orders[i].date;
            date.className = "text-content";
            contentRight.appendChild(date);
            const time = document.createElement("div");
            if (orders[i].time == "morning"){
                timeContent = "早上九點至下午一點";
            }else{
                timeContent = "下午兩點至下午八點";
            };
            time.textContent = "時間："+timeContent;
            time.className = "text-content";
            contentRight.appendChild(time);
            const address = document.createElement("div");
            address.textContent = "地點："+orders[i].address;
            address.className = "text-content";
            contentRight.appendChild(address);
            const price = document.createElement("div");
            price.textContent = "金額："+orders[i].price;
            price.className = "text-content";
            contentRight.appendChild(price);
            const button = document.createElement("button");
            button.textContent = "查看景點介紹";
            button.className = "button";
            button.href = "/";
            const a = document.createElement("a");
            a.href = "/attraction/"+orders[i].attraction_id;
            a.appendChild(button);
            contentRight.appendChild(a);
            wrap.appendChild(contentLeft);
            wrap.appendChild(contentRight);
            wrapContent.appendChild(wrap);
            content.appendChild(wrapContent);
    }
    if (orders.length > 1){
        for (let i = 0; i<orders.length; i++){
            const wrapContent = document.createElement("div");
            wrapContent.className = "wrap-content";
            const wrap = document.createElement("div");
            wrap.className = "wrap";
            const contentLeft = document.createElement("div");
            contentLeft.className = "content-left";
            const contentRight = document.createElement("div");
            contentRight.className = "content-right";
            const userTitle = document.createElement("div");
            userTitle.className = "text-content--title";
            userTitle.textContent = "訂單編號："+orders[i].order_id;
            wrapContent.append(userTitle);
            const img = document.createElement("img");
            img.src = orders[i].images[0];
            img.className = "img";
            contentLeft.appendChild(img);
            const name = document.createElement("div");
            name.textContent = orders[i].name;
            name.className = "text-content-top";
            contentRight.appendChild(name);
            const date = document.createElement("div");
            date.textContent = "日期："+orders[i].date;
            date.className = "text-content";
            contentRight.appendChild(date);
            const time = document.createElement("div");
            if (orders[i].time == "morning"){
                timeContent = "早上九點至下午一點";
            }else{
                timeContent = "下午兩點至下午八點";
            };
            time.textContent = "時間："+timeContent;
            time.className = "text-content";
            contentRight.appendChild(time);
            const address = document.createElement("div");
            address.textContent = "地點："+orders[i].address;
            address.className = "text-content";
            contentRight.appendChild(address);
            const price = document.createElement("div");
            price.textContent = "金額："+orders[i].price;
            price.className = "text-content";
            contentRight.appendChild(price);
            const status = document.createElement("div");
            if (orders[i].status == "0"){
                statusContent = "未付款";
            }else{
                statusContent = "已付款";
            };
            status.textContent = "狀態："+statusContent;
            status.className = "text-content-bottom";
            contentRight.appendChild(status);
            const button = document.createElement("button");
            button.textContent = "查看景點介紹";
            button.className = "button";
            button.href = "/";
            const a = document.createElement("a");
            a.href = "/attraction/"+orders[i].attraction_id;
            a.appendChild(button);
            contentRight.appendChild(a);
            wrap.appendChild(contentLeft);
            wrap.appendChild(contentRight);
            wrapContent.appendChild(wrap);
            content.appendChild(wrapContent);
        };
    } 
});