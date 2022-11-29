let url=window.location.pathname

//載入景點頁面
fetch("/api"+url)
.then(function(response){
    return response.json();
})
.then(function(data){
    let dataList = data.data;
    let imgContainer = document.getElementById("img-container");
    let imgContent = document.getElementById("img-content");
    let wrapperContent = document.getElementById("wrapper-content");
    let dotsList = document.getElementById("dot-content");
    //img & dot
    for (let i = 0; i<dataList.images.length; i++){
        let img = document.createElement("img");
        img.className = "img";
        img.src = dataList.images[i];
        imgContainer.appendChild(img)
        let dots = document.createElement("span")
        dots.className = "dot"
        dotsList.appendChild(dots)
        dots.setAttribute("onclick",`slideOnclick(${i})`)
    };
    //name
    let oldName = document.querySelector(".name");
    let name = document.createElement("div");
    name.className = "name";
    name.textContent = dataList.name;
    imgContent.replaceChild(name,oldName);
    //cat-mrt
    let oldCat = document.querySelector(".cat-mrt");
    let cat = document.createElement("div");
    cat.className = "cat-mrt";
    cat.textContent = dataList.category+" at "+dataList.mrt;
    imgContent.replaceChild(cat,oldCat);
    //description
    let oldDescription = document.querySelector(".describe");
    let description = document.createElement("div");
    description.className = "describe";
    description.textContent = dataList.description;
    wrapperContent.replaceChild(description,oldDescription);
    //address
    let oldAddress = document.querySelector(".address");
    let address = document.createElement("div");
    address.className = "address";
    address.textContent = dataList.address;
    wrapperContent.replaceChild(address,oldAddress);
    //transport
    let oldTransport = document.querySelector(".transport");
    let transport = document.createElement("div");
    transport.className = "transport";
    transport.textContent = dataList.transport;
    wrapperContent.replaceChild(transport,oldTransport);
    let items = document.querySelectorAll(".img")
    items[0].style.display = "block"
    let dots = document.querySelectorAll(".dot")
    dots[0].className += " active";
    });

//radio check
function check(){
    let checked = document.querySelector('[name=reserve]:checked').value;
    let reserveFee1 = document.querySelector(".reserve-fee1");
    let reserveFee2 = document.querySelector(".reserve-fee2");
    if (checked == "first-half-day" ){
        reserveFee1.style.display = "block";
        reserveFee2.style.display = "none";  
    }else{
        reserveFee1.style.display = "none";
        reserveFee2.style.display = "block";  
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
    let items = document.querySelectorAll(".img")
    let dots = document.querySelectorAll(".dot")
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