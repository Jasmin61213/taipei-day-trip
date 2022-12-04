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

//註冊＆登入
let signInContent = document.querySelector(".sign-in");
let registerContent = document.querySelector(".register");
let hideBg=document.querySelector(".hide-bg");
let body = document.querySelector(".body");
//打開登入頁面
function sign(){
    signInContent.style.display = "block";
    hideBg.style.display="block";
    hideBg.style.height=document.body.clientHeight+"px"; 
    body.style.overflow = "hidden"
};

//關掉視窗
function userClose(){
    signInContent.style.display = "none";
    registerContent.style.display = "none";
    hideBg.style.display="none";
    body.style.overflow = "auto"
};

//切換視窗
function toRegister(){
    signInContent.style.display = "none";
    registerContent.style.display = "block";
};
function toSignIn(){
    signInContent.style.display = "block";
    registerContent.style.display = "none";
};

//登入會員
function signIn(){
    email = document.getElementById("signInEmail").value;
    password = document.getElementById("signInPassword").value;
    data = {
        "email":email,
        "password":password
    };
    fetch("/api/user/auth",{
        method: "PUT",
        body: JSON.stringify(data),
        cache: "no-cache",
        headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
        }  
    })
    .then(function(response){
        return response.json();
    })
    .then(function(res){
        if (res.ok == true) {
            alert("登入成功");
            signInContent.style.display = "none";
            hideBg.style.display="none";
            body.style.overflow = "auto"
        };
        if (res.error == true) {
            alert("登入失敗");
        };          
    });
};

//註冊會員
function register(){
    userName= document.getElementById("registerName").value;
    email = document.getElementById("registerEmail").value;
    password = document.getElementById("registerPassword").value;
    data = {
        "name":userName,
        "email":email,
        "password":password
    };
    fetch("/api/user",{
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-cache",
        headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
        }  
    })
    .then(function(response){
        return response.json();
    })
    .then(function(res){
        if (res.ok == true) {
            alert("註冊成功");
            signInContent.style.display = "block";
            registerContent.style.display = "none";
        };
        if (res.error == true) {
            alert("註冊失敗");
        };          
    });
};