//驗證是否登入
fetch("/api/user/auth",{
    method: "GET"
})
.then(function(response){
    return response.json();
})
.then(function(data){
    const signUp = document.getElementById("func");
    if (data.data != null){
        signUp.setAttribute("onclick","signup()")
        signUp.textContent = "登出系統"
    }else{
        signUp.textContent = "登入/註冊"
    };
});

//註冊＆登入
const signInMenu = document.querySelector(".sign-in");
const registerMenu = document.querySelector(".register");
const hideBg=document.querySelector(".hide-bg");
const body = document.querySelector(".body");
const signAlert = document.querySelector(".sign-alert")
const registerAlert = document.querySelector(".register-alert")
const remind = document.querySelector(".remind")
const textRemind = document.querySelector(".text-remind")

//重整頁面
function reload(){
    window.location.reload();
}

//打開登入頁面
function sign(){
    signInMenu.style.display = "block";
    hideBg.style.display="block";
    hideBg.style.height=document.body.clientHeight+"px"; 
    body.style.overflow = "hidden"
};

//打開提醒框
function showRemind(message){
    remind.style.display = "block"
    textRemind.textContent = message
    hideBg.style.display="block";
    hideBg.style.height=document.body.clientHeight+"px"; 
    body.style.overflow = "hidden"
}

//關掉會員視窗
function userClose(){
    signInMenu.style.display = "none";
    registerMenu.style.display = "none";
    remind.style.display = "none"
    signInMenu.style.height = "275px"
    registerMenu.style.height = "340px"
    signAlert.textContent = "";
    registerAlert.textContent = "";    
    hideBg.style.display="none";
    body.style.overflow = "auto";
};

//切換會員視窗
function toRegister(){
    signInMenu.style.display = "none";
    registerMenu.style.display = "block";
};
function toSignIn(){
    signInMenu.style.display = "block";
    registerMenu.style.display = "none";
};

//登入會員
function signIn(){
    const signInEmail = document.getElementById("signInEmail").value;
    const signInPassword = document.getElementById("signInPassword").value;
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
            signInMenu.style.display = "none";
            let message = "登入成功"
            showRemind(message)
            setTimeout(reload, 1000);
        };
        if (res.error == true) {
            signInMenu.style.height = "298px"
            signAlert.textContent = res.message;
        };          
    });
};

//註冊會員
function register(){
    const registerName = document.getElementById("registerName").value;
    const registerEmail = document.getElementById("registerEmail").value;
    const registerPassword = document.getElementById("registerPassword").value;
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
        const registerContent = document.querySelector(".register-content")
        registerMenu.style.height = "355px"
        if (res.ok == true) {
            registerAlert.textContent = "註冊成功，請登入頁面"
            registerContent.textContent = "點此登入"
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
            let message = "登出成功"
            showRemind(message)
            setTimeout(reload, 1000);
        };
    });
};

function booking(){
    fetch("/api/user/auth",{
        method: "GET"
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if (data.data != null){
            window.location.href = "/booking"
        }else{
            sign()
        };
    });
}