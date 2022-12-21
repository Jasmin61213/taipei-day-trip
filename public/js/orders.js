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
        const content = document.querySelector(".content")
        const hello = document.createElement("div")
        hello.textContent = `您好，${data.data.name}，您的預訂行程如下：`;
        content.appendChild(hello)
    }
});

fetch("/api/orders",{
    method: "GET"
})
.then(function(response){
    return response.json();
})
.then(function(data){

});