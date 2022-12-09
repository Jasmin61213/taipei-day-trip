const keyword = ""
const page = 0
const attractionUrl = "/api/attractions";

//首頁載入景點
fetch(attractionUrl+"?page="+page)
.then(function(response){
    return response.json();
})
.then(function(data){
    let dataList = data.data;
    let firstImg = [];
    let name = [];
    let mrtContent = [];
    let categoryContent = [];
    let id = [];
    for (let i = 0; i<data.data.length; i++){
        firstImg.push(dataList[i].images[0]);
        name.push(dataList[i].name);
        mrtContent.push(dataList[i].mrt);
        categoryContent.push(dataList[i].category);
        id.push(dataList[i].id);
    };
    let target = document.querySelectorAll(".attraction_img");
    let transportTarget = document.querySelectorAll(".transport");                
    let oldImg = document.querySelectorAll(".img");
    let attraction_name = document.querySelectorAll(".attraction_name");
    let mrt = document.querySelectorAll(".mrt");
    let category = document.querySelectorAll(".category");
    for (let i = 0; i<12; i++){
        //img
        let newImg = document.createElement("img");
        newImg.className = "img";
        newImg.src = firstImg[i];
        target[i].replaceChild(newImg,oldImg[i]);
        //name
        let newName = document.createElement("div");
        newName.className = "attraction_name";
        let nameTextNode = document.createTextNode(name[i]);
        newName.appendChild(nameTextNode);
        target[i].replaceChild(newName,attraction_name[i]);
        //mrt
        let newMrt = document.createElement("div");
        newMrt.className = "mrt";
        let mrtTextNode = document.createTextNode(mrtContent[i]);
        newMrt.appendChild(mrtTextNode);
        transportTarget[i].replaceChild(newMrt,mrt[i]); 
        //category
        let newCategory = document.createElement("div");
        newCategory.className = "category";
        let categoryTextNode = document.createTextNode(categoryContent[i]);
        newCategory.appendChild(categoryTextNode);
        transportTarget[i].replaceChild(newCategory,category[i]);  
        //跳轉景點頁面
        let link = document.querySelectorAll(".link");
        for(let i = 0; i<link.length; i++){
            link[i].setAttribute("href",`/attraction/${id[i]}`);
        }
    };
});

//無限滾輪
let nextPage = 1
let options = {
    root:null,
    rootMargin:"0px",
    threshold:0.1,
};
let callback = (entries,observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        }
        if (nextPage == null){
            return;
        }
        fetch(attractionUrl+"?page="+nextPage+"&keyword="+search.value)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            for (let i = 0; i<data.data.length; i++){
                let content = document.getElementById("content");
                let linkAll = document.createElement("a")
                linkAll.className = "link"
                linkAll.setAttribute("href",`/attraction/${data.data[i].id}`);
                let newAttraction = document.createElement("div");
                newAttraction.className = "attraction";
                let newAttraction_image = document.createElement("div");
                newAttraction_image.className = "attraction_image";
                let newTransport = document.createElement("div");
                newTransport.className = "transport";
                let newImg = document.createElement("img");
                newImg.className = "img";
                newImg.src = data.data[i].images[0];
                let newAttraction_name = document.createElement("div");
                newAttraction_name.className = "attraction_name";
                newAttraction_name.textContent = data.data[i].name;
                let newMrt = document.createElement("div");
                newMrt.className = "mrt";
                newMrt.textContent = data.data[i].mrt;
                let newCategory = document.createElement("div");
                newCategory.className = "category";
                newCategory.textContent = data.data[i].category;
                newTransport.appendChild(newMrt);
                newTransport.append(newCategory);
                newAttraction_image.appendChild(newImg);
                newAttraction_image.appendChild(newAttraction_name);
                newAttraction.appendChild(newAttraction_image);
                newAttraction.appendChild(newTransport);
                linkAll.append(newAttraction);
                content.appendChild(linkAll);
            };    
            nextPage = data.nextPage;
        });
    });
};
let observer = new IntersectionObserver(callback,options);
let target = document.querySelector(".footer");
observer.observe(target);

//關鍵字搜尋
let search = document.querySelector(".input_text");
function searchData(){
    fetch(attractionUrl+"?page=0&keyword="+search.value)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if (data.data[0] == undefined){
            alert("查無此景點");
        }else{
            main = document.querySelectorAll(".link")
            for (i = 0; i<main.length; i++){
                main[i].remove();
            };
        };
        for (let i = 0; i<data.data.length; i++){
            let content = document.getElementById("content");
            let linkAll = document.createElement("a")
            linkAll.className = "link"
            linkAll.setAttribute("href",`/attraction/${data.data[i].id}`);
            let newAttraction = document.createElement("div");
            newAttraction.className = "attraction";
            let newAttraction_image = document.createElement("div");
            newAttraction_image.className = "attraction_image"
            let newTransport = document.createElement("div");
            newTransport.className = "transport";
            let newImg = document.createElement("img");
            newImg.className = "img";
            newImg.src = data.data[i].images[0];
            let newAttraction_name = document.createElement("div");
            newAttraction_name.className = "attraction_name";
            newAttraction_name.textContent = data.data[i].name;
            let newMrt = document.createElement("div");
            newMrt.className = "mrt";
            newMrt.textContent = data.data[i].mrt;
            let newCategory = document.createElement("div");
            newCategory.className = "category";
            newCategory.textContent = data.data[i].category;
            newTransport.appendChild(newMrt);
            newTransport.append(newCategory);
            newAttraction_image.appendChild(newImg);
            newAttraction_image.appendChild(newAttraction_name);
            newAttraction.appendChild(newAttraction_image);
            newAttraction.appendChild(newTransport);
            linkAll.append(newAttraction);
            content.appendChild(linkAll);
        };
        nextPage = data.nextPage;
    });
};

//關鍵字列表
let categories_menu = document.querySelector(".categories_menu");
fetch("/api/categories")
.then(function(response){
    return response.json();
})
.then(function(data){
    for(let i = 0; i<data.data.length; i++){
        let categories_list = document.getElementById("categories_list");
        let category_list = document.createElement("div");
        category_list.className = "category_list";
        category_list.textContent = data.data[i];
        categories_list.appendChild(category_list);
    };
});
search.addEventListener("click",function(event){
    categories_menu.style.display = "block";
    event.stopPropagation();
    let category_list=document.querySelectorAll(".category_list");
    for(let i = 0; i<category_list.length; i++){
        category_list[i].addEventListener("click",function(){
        search.value = category_list[i].textContent;
        categories_menu.style.display = "none";    
        });
    };       
});
document.addEventListener("click",function(){
    categories_menu.style.display = "none";
});