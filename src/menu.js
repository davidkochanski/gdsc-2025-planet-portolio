const menuButton = document.getElementById("menu-button");
const menuText = document.querySelector("#menu-button i")
const main = document.getElementById("main");

let displaying = false;

menuButton.addEventListener("click", () => {
    displaying = !displaying;

    if(displaying) {
        main.style.display = "flex";
    } else {
        main.style.display = "none";
    }

    menuText.classList.toggle("fa-menu")
    menuText.classList.toggle("fa-x")
})


