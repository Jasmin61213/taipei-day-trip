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
    }
});

const profileName = document.getElementById("name");
const profileEmail = document.getElementById("email");
const profileSex = document.getElementById("sex");
const profileAge = document.getElementById("age");
const profilePhone = document.getElementById("phone");
const profileAddress = document.getElementById("address");

const newName = document.getElementById("nameInput");
const newEmail = document.getElementById("emailInput");
const newAge = document.getElementById("ageInput");
const newPhone = document.getElementById("phoneInput");
const newAddress = document.getElementById("addressInput");

//拿會員資料
fetch("/api/member",{
    method: "GET"
})
.then(function(response){
    return response.json();
})
.then(function(data){
    const profile = data.data;
    profileName.textContent = profile.name;
    profileEmail.textContent = profile.email;
    profileSex.textContent = profile.sex;
    profileAge.textContent = profile.age;
    profilePhone.textContent = profile.phone;
    profileAddress.textContent = profile.address;
    newName.value = profile.name;
    newEmail.value = profile.email;
    // newSex.value = profile.sex;
    newAge.value = profile.age;
    newPhone.value = profile.phone;
    newAddress.value = profile.address;
    
});

//修改會員資料
const buttonEdit = document.querySelector(".button-edit");
const buttonSubmit = document.querySelector(".button-submit");
const radio = document.querySelector(".radio");
const text = document.querySelectorAll(".span");
const input = document.querySelectorAll(".input");

function edit(){
    buttonEdit.style.display = "none";
    buttonSubmit.style.display = "block";
    radio.style.display = "inline";
    for (i=0;i<text.length;i++){
        text[i].style.display = "none";
    }
    for (i=0;i<input.length;i++){
        input[i].style.display = "inline";
    };
};

function submit(){
    const checked = document.querySelector('[name=sex]:checked').value;
    if (newName == "" || newEmail == ""){
        showRemind("姓名，信箱不可為空");
    }else{
        buttonEdit.style.display = "block";
        buttonSubmit.style.display = "none";
        for (i=0;i<text.length;i++){
            text[i].style.display = "inline";
        };
        for (i=0;i<input.length;i++){
            input[i].style.display = "none";
        };
        data = {
            "name" : newName.value,
            "email" : newEmail.value,
            "sex" : checked,
            "age" : newAge.value,
            "phone" : newPhone.value,
            "address" : newAddress.value
        };
        fetch("api/member",{
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
        .then(function(data){
            buttonEdit.style.display = "block";
            buttonSubmit.style.display = "none";
            window.location.reload();
        });
    };
};



