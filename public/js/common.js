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

//註冊＆登入
const signInMenu = document.querySelector(".sign-in");
const registerMenu = document.querySelector(".register");
const hideBg=document.querySelector(".hide-bg");
const body = document.querySelector(".body");
const signAlert = document.querySelector(".sign-alert")
const registerAlert = document.querySelector(".register-alert")

//打開登入頁面
function sign(){
    signInMenu.style.display = "block";
    hideBg.style.display="block";
    hideBg.style.height=document.body.clientHeight+"px"; 
    body.style.overflow = "hidden"
};

//關掉視窗
function userClose(){
    signInMenu.style.display = "none";
    registerMenu.style.display = "none";
    signInMenu.style.height = "275px"
    registerMenu.style.height = "340px"
    signAlert.textContent = "";
    registerAlert.textContent = "";    
    hideBg.style.display="none";
    body.style.overflow = "auto";
};

//切換視窗
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
            signInMenu.style.height = "298px"
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
        let registerContent = document.querySelector(".register-content")
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
            window.location.reload();
        };
    });
};