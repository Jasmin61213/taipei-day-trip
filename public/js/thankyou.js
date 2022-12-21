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
    };
});