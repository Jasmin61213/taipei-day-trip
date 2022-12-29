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