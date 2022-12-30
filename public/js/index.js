const keyword = ""
const page = 0
const attractionUrl = "/api/attractions";

//首頁載入景點
async function getAttractions(){
    const response = await fetch(attractionUrl+"?page="+page)
    const data = await response.json();
    const dataList = data.data;

    let firstImg = [];
    let name = [];
    let mrtContent = [];
    let categoryContent = [];
    let id = [];

    for (let i = 0; i<dataList.length; i++){
        firstImg.push(dataList[i].images[0]);
        name.push(dataList[i].name);
        mrtContent.push(dataList[i].mrt);
        categoryContent.push(dataList[i].category);
        id.push(dataList[i].id);
    };

    const target = document.querySelectorAll(".attraction_img");
    const transportTarget = document.querySelectorAll(".transport");                
    const oldImg = document.querySelectorAll(".img");
    const attraction_name = document.querySelectorAll(".attraction_name");
    const mrt = document.querySelectorAll(".mrt");
    const category = document.querySelectorAll(".category");

    for (let i = 0; i<12; i++){
        //img
        const newImg = document.createElement("img");
        newImg.className = "img";
        newImg.src = firstImg[i];
        target[i].replaceChild(newImg,oldImg[i]);

        //name
        const newName = document.createElement("div");
        newName.className = "attraction_name";
        const nameTextNode = document.createTextNode(name[i]);
        newName.appendChild(nameTextNode);
        target[i].replaceChild(newName,attraction_name[i]);

        //mrt
        const newMrt = document.createElement("div");
        newMrt.className = "mrt";
        const mrtTextNode = document.createTextNode(mrtContent[i]);
        newMrt.appendChild(mrtTextNode);
        transportTarget[i].replaceChild(newMrt,mrt[i]); 

        //category
        const newCategory = document.createElement("div");
        newCategory.className = "category";
        const categoryTextNode = document.createTextNode(categoryContent[i]);
        newCategory.appendChild(categoryTextNode);
        transportTarget[i].replaceChild(newCategory,category[i]);  

        //跳轉景點頁面
        const link = document.querySelectorAll(".link");
        for(let i = 0; i<link.length; i++){
            link[i].setAttribute("href",`/attraction/${id[i]}`);
        };
    };
};

if (document.readyState === "complete"){
    getAttractions();
}else{
    document.addEventListener("DOMContentLoaded", getAttractions);
};

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
                const content = document.getElementById("content");
                const linkAll = document.createElement("a")
                linkAll.className = "link"
                linkAll.setAttribute("href",`/attraction/${data.data[i].id}`);

                const newAttraction = document.createElement("div");
                newAttraction.className = "attraction";
                const newAttraction_image = document.createElement("div");
                newAttraction_image.className = "attraction_image";

                const newTransport = document.createElement("div");
                newTransport.className = "transport";

                const newImg = document.createElement("img");
                newImg.className = "img";
                newImg.src = data.data[i].images[0];

                const newAttraction_name = document.createElement("div");
                newAttraction_name.className = "attraction_name";
                newAttraction_name.textContent = data.data[i].name;

                const newMrt = document.createElement("div");
                newMrt.className = "mrt";
                newMrt.textContent = data.data[i].mrt;

                const newCategory = document.createElement("div");
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
const target = document.querySelector(".footer");
observer.observe(target);

//關鍵字搜尋
const search = document.querySelector(".input_text");
function searchData(){
    fetch(attractionUrl+"?page=0&keyword="+search.value)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if (data.data[0] == undefined){
            alert("查無此景點");
        }else{
            const main = document.querySelectorAll(".link")
            for (i = 0; i<main.length; i++){
                main[i].remove();
            };
        };
        for (let i = 0; i<data.data.length; i++){
            const content = document.getElementById("content");
            const linkAll = document.createElement("a")
            linkAll.className = "link"
            linkAll.setAttribute("href",`/attraction/${data.data[i].id}`);

            const newAttraction = document.createElement("div");
            newAttraction.className = "attraction";
            const newAttraction_image = document.createElement("div");
            newAttraction_image.className = "attraction_image"

            const newTransport = document.createElement("div");
            newTransport.className = "transport";

            const newImg = document.createElement("img");
            newImg.className = "img";
            newImg.src = data.data[i].images[0];

            const newAttraction_name = document.createElement("div");
            newAttraction_name.className = "attraction_name";
            newAttraction_name.textContent = data.data[i].name;

            const newMrt = document.createElement("div");
            newMrt.className = "mrt";

            newMrt.textContent = data.data[i].mrt;
            const newCategory = document.createElement("div");
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
const categories_menu = document.querySelector(".categories_menu");
fetch("/api/categories")
.then(function(response){
    return response.json();
})
.then(function(data){
    for(let i = 0; i<data.data.length; i++){
        const categories_list = document.getElementById("categories_list");
        const category_list = document.createElement("div");
        category_list.className = "category_list";
        category_list.textContent = data.data[i];
        categories_list.appendChild(category_list);
    };
});
search.addEventListener("click",function(event){
    categories_menu.style.display = "block";
    event.stopPropagation();
    const category_list=document.querySelectorAll(".category_list");
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