const url=window.location.pathname

//載入景點頁面
fetch("/api"+url)
.then(function(response){
    return response.json();
})
.then(function(data){
    const dataList = data.data;
    const imgContainer = document.getElementById("img-container");
    const imgContent = document.getElementById("img-content");
    const wrapperContent = document.getElementById("wrapper-content");
    const dotsList = document.getElementById("dot-content");
    //img & dot
    for (let i = 0; i<dataList.images.length; i++){
        const img = document.createElement("img");
        img.className = "img fade";
        img.src = dataList.images[i];
        imgContainer.appendChild(img)
        const dots = document.createElement("span")
        dots.className = "dot"
        dotsList.appendChild(dots)
        dots.setAttribute("onclick",`slideOnclick(${i})`)
    };
    //name
    const oldName = document.querySelector(".name");
    const name = document.createElement("div");
    name.className = "name";
    name.textContent = dataList.name;
    imgContent.replaceChild(name,oldName);
    //cat-mrt
    const oldCat = document.querySelector(".cat-mrt");
    const cat = document.createElement("div");
    cat.className = "cat-mrt";
    cat.textContent = dataList.category+" at "+dataList.mrt;
    imgContent.replaceChild(cat,oldCat);
    //description
    const oldDescription = document.querySelector(".describe");
    const description = document.createElement("div");
    description.className = "describe";
    description.textContent = dataList.description;
    wrapperContent.replaceChild(description,oldDescription);
    //address
    const oldAddress = document.querySelector(".address");
    const address = document.createElement("div");
    address.className = "address";
    address.textContent = dataList.address;
    wrapperContent.replaceChild(address,oldAddress);
    //transport
    const oldTransport = document.querySelector(".transport");
    const transport = document.createElement("div");
    transport.className = "transport";
    transport.textContent = dataList.transport;
    wrapperContent.replaceChild(transport,oldTransport);
    const items = document.querySelectorAll(".img")
    items[0].style.display = "block"
    const dots = document.querySelectorAll(".dot")
    dots[0].className += " active";
    document.title = dataList.name;

    });

//radio check

function check(){
    let checked = document.querySelector('[name=reserve]:checked').value;
    let reserveFee2000 = document.querySelector(".reserve-fee2000");
    let reserveFee2500 = document.querySelector(".reserve-fee2500");
    if (checked == "morning" ){
        reserveFee2000.style.display = "block";
        reserveFee2500.style.display = "none";  
    }else{
        reserveFee2000.style.display = "none";
        reserveFee2500.style.display = "block";  
    };
};

//img輪播
let current = 0;

//左右鍵輪播
function slide(n){
    current += n;
    showImg(current);
};

//下方dot選取
function slideOnclick(n){
    showImg(current=n);
};

function showImg(n){
    const items = document.querySelectorAll(".img")
    const dots = document.querySelectorAll(".dot")
    if (n > items.length-1) { current = 0 }
    if (n < 0) { current = items.length-1 }
    for (let i = 0; i < items.length; i++){
        items[i].style.display = "none"
    };
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }   
    items[current].style.display = "block"  
    dots[current].className += " active";
};

function reserve(){
    const id = url.split("/")[2]
    const date = document.querySelector(".date").value
    const checked = document.querySelector('[name=reserve]:checked').value;
    if (checked == "morning" ){
        price = "2000"
    }else{
        price = "2500"
    };
    const time = document.querySelector('[name=reserve]:checked').value;
    data = {
        "attractionId": id,
        "date": date,
        "time": time,
        "price": price
    };
    fetch("/api/booking",{
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-cache",
        headers:{
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        }
    })
    .then(function(response){
        res = response
        return response.json();
    })
    .then(function(data){
        if (res.status == 403){
            sign()
        }
        if (res.status == 200){
            window.location.href = "/booking"
        }
        if (res.status == 400){
            const message = data.message
            showRemind(message)
        }
    });
};