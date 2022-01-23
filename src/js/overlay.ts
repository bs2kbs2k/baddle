document.querySelectorAll(".close").forEach((e)=>{
    e.addEventListener("click", (ev) => {
        if (ev.target !== ev.currentTarget && (ev.currentTarget as HTMLElement).id === "overlay") {
            return;
        }
        const overlay = document.querySelector("#overlay");
        overlay.children[0].classList.remove("slide-in");
        overlay.children[0].classList.add("slide-out");
        setTimeout(() => {
            overlay.children[0].classList.remove("slide-out");
            overlay.children[0].children[1].innerHTML = "";
            overlay.classList.add("hidden");
        }, 150);
    });
});