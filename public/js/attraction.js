const url=window.location.pathname

//驗證是否登入
fetch("/api/user/auth",{
    method: "GET"
})
.then(function(response){
    return response.json();
})
.then(function(data){
    let signUp = document.getElementById("func");
    if (data.data != null){
        signUp.setAttribute("onclick","signup()")
        signUp.textContent = "登出系統"
    }else{
        signUp.textContent = "登入/註冊"
    };
});

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
const current = 0;

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
const signInContent = document.querySelector(".sign-in");
const registerContent = document.querySelector(".register");
const hideBg=document.querySelector(".hide-bg");
const body = document.querySelector(".body");

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
    let signInEmail = document.getElementById("signInEmail").value;
    let signInPassword = document.getElementById("signInPassword").value;
    data = {
        "email" : signInEmail,
        "password" : signInPassword
    };
    fetch("/api/user/auth",{
        method: "PUT",
        body: JSON.stringify(data),
        cache: "no-cache",
        headers:{
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        }  
    })
    .then(function(response){
        return response.json();
    })
    .then(function(res){
        if (res.ok == true) {
            window.location.reload();
        };
        if (res.error == true) {
            let signAlert = document.querySelector(".sign-alert")
            let sign = document.querySelector(".sign-in")
            sign.style.height = "298px"
            signAlert.textContent = res.message;
        };          
    });
};

//註冊會員
function register(){
    let registerName = document.getElementById("registerName").value;
    let registerEmail = document.getElementById("registerEmail").value;
    let registerPassword = document.getElementById("registerPassword").value;
    data = {
        "name" : registerName,
        "email" : registerEmail,
        "password" : registerPassword
    };
    fetch("/api/user",{
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-cache",
        headers:{
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        }  
    })
    .then(function(response){
        return response.json();
    })
    .then(function(res){
        let registerAlert = document.querySelector(".register-alert")
        let register = document.querySelector(".register")
        register.style.height = "360px"
        if (res.ok == true) {
            registerAlert.textContent = "註冊成功，請登入頁面"
        };
        if (res.error == true) {
            registerAlert.textContent = res.message;
        };          
    });
};

//登出系統
function signup(){
    fetch("/api/user/auth",{
        method: "DELETE"
    })
    .then(function(response){
        return response.json();
    })
    .then(function(res){
        if (res.ok == true) {
            window.location.reload();
        };
    });
};