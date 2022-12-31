//驗證是否登入
async function getAuth(){
    const response = await fetch("/api/user/auth",{
        method: "GET"
    })
    const res = await response.json();
    if (res.data == null){
        window.location.href = "/";
    };
};
getAuth();

//載入預定景點頁面
async function getBooking(){
    const response = await fetch("/api/booking",{
        method: "GET"
    })
    const res = await response.json();
    const hello = document.querySelector(".content_title_hello");
    const body = document.querySelector(".change");
    const loading = document.querySelector(".load-wrap");
    hello.textContent = `您好，${res.name}，待預訂的行程如下：`;
    if (res.data == null){
        const remove = document.querySelector(".content");
        remove.remove();
        const content = document.createElement("div");
        content.className = "no-reserve";
        content.style.height="calc(100vh - 257px)"; 
        content.textContent = "目前沒有預定行程";
        body.appendChild(content);
    }else{
        const img = document.getElementById("img");
        img.src = res.data.attraction.image;
        const taipei_title = document.getElementById("taipei_title");
        taipei_title.textContent = res.data.attraction.name;
        const date = document.getElementById("date");
        date.textContent = res.data.date;
        const time = document.getElementById("time");
        if (res.data.time == "morning"){
            timeContent = "早上九點至下午一點";
        }else{
            timeContent = "下午兩點至下午八點";
        }
        time.textContent = timeContent;
        const price = document.getElementById("price");
        price.textContent = res.data.price;
        const address = document.getElementById("address");
        address.textContent = res.data.attraction.address;
        const fee = document.getElementById("fee");
        if (res.data.price == "2000"){
            fee.textContent = "總價：新台幣2000元";
        }else{
            fee.textContent = "總價：新台幣2500元";
        };
    };
    body.style.display = "block";
    loading.style.display = "none";
};
if (document.readyState === "complete"){
    getBooking();
}else{
    document.addEventListener("DOMContentLoaded", getBooking);
};

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