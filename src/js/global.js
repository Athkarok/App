import { gsap } from "gsap/index";

// html2canvas Lib
import html2canvas from 'html2canvas';

// Icons Changing
export function activeIcon(icon) {
    const iconHomeImg = document.querySelector("#icon-home");
    const iconZikrImg = document.querySelector("#icon-zikr");
    const iconSettingsImg = document.querySelector("#icon-settings");

    switch (icon) {
        case "home":
            setHomeActivation(true);
            break;
        case "zikr":
            setZikrActivation(true);
            break;
        case "settings":
            setSettingsActivation(true);
            break;
    }

    // Animeation
    function iconAnimate(icon) {
        gsap.from(icon, {
            duration: 0.7,
            opacity: 0.5,
            ease: "power4",
            scale: 0.7,
        });
    }
    // Home Icon
    function setHomeActivation(activation) {
        if (activation) {
            iconHomeImg.setAttribute("src", "./images/nav-icons/icon-home-active.svg");
            iconAnimate(iconHomeImg);
            setZikrActivation(false);
            setSettingsActivation(false);
            document.querySelector('[active="home"]').className = "font-w-b active";
        } else {
            iconHomeImg.setAttribute("src", "./images/nav-icons/icon-home.svg");
        }
    }
    // Zikr Icon
    function setZikrActivation(activation) {
        if (activation) {
            iconZikrImg.setAttribute("src", "./images/nav-icons/icon-zikr-active.svg");
            iconAnimate(iconZikrImg);
            setHomeActivation(false);
            setSettingsActivation(false);
            document.querySelector('[active="athkarok"]').className = "font-w-b active";
        } else {
            iconZikrImg.setAttribute("src", "./images/nav-icons/icon-zikr.svg");
        }
    }
    // Share Icon
    function setSettingsActivation(activation) {
        if (activation) {
            iconSettingsImg.setAttribute(
                "src",
                "./images/nav-icons/icon-settings-active.svg"
            );
            iconAnimate(iconSettingsImg);
            setHomeActivation(false);
            setZikrActivation(false);
            document.querySelector('[active="settings"]').className = "font-w-b active";
        } else {
            iconSettingsImg.setAttribute("src", "./images/nav-icons/icon-settings.svg");
        }
    }

}

// Update New Day
export function updateNewDay() {
    const currentDay = new Date().getDay();
    const storedDay = Number(localStorage.getItem("day"));

    if (storedDay != currentDay) {
        // Update Everey thing here
        setCurrentDayToLocal(currentDay);

        // remove stuff from local

        // Zikr Finish State
        localStorage.removeItem("sabahS");
        localStorage.removeItem("masaaS");
        localStorage.removeItem("noomS");
        localStorage.removeItem("estekazS");
        localStorage.removeItem("massjedS");
        localStorage.removeItem("slaahS");

        // Wheel State
        localStorage.removeItem("wheelState");


    }
}

// used in update new day
function setCurrentDayToLocal(currentDay) {
    localStorage.setItem("day", String(currentDay));
}


export function setToLocalFirstTime() {
    var day = new Date().getDay();
    if (localStorage.length == 2) {
        localStorage.setItem("day", String(day));
        localStorage.setItem("quoteIndex", "0");
    }
}

export function fixShortCutLocal() {
    try {
        const iconZikr = document.querySelector("#nav-zikr");
        iconZikr.addEventListener("click", () => {
            localStorage.removeItem("zikrShort");
        });

        const azkarokNav = document.querySelector("#azkarok-nav");
        azkarokNav.addEventListener("click", () => {
            localStorage.removeItem("zikrShort");
        });

    }
    catch (err) { };
}


export function setZikrCounter(zikrCounter) {
    window.localStorage.setItem("zikrCounter", String(zikrCounter));
}

export function getZikrCounter() {
    return Number(window.localStorage
        .getItem("zikrCounter"));
}

export const pageLoader = () => {
    const loader = `
        <div class="ui active dimmer">
            <div class="ui big text loader">جاري التحميل ..</div>
        </div>`;
    document.body.innerHTML += loader;
};

export const addLoader = (element) => {
    const loader = '<div class="ui active centered inline loader"></div>';
    element.insertAdjacentHTML("afterend", loader);
};

export const removeLoaders = () => {
    let loaders = [];
    loaders.push(document.querySelectorAll(".loader"));
    loaders.push(document.querySelectorAll(".dimmer"));
    loaders.forEach((i) => { 
        i.forEach((j)=>{ try { j.remove(); } catch (e) { }  })
    });
};


export function saveTextInPic(text, author, fileName) {

    // Pic Container -- 
    var picContainer = document.createElement("div");
    // class with styles required
    picContainer.classList.add("canvas-container");


    // Canvas Text -- 
    var canvasText = document.createElement("p");
    // class with styles required
    canvasText.classList.add("canvas-text");
    // Add text 
    canvasText.textContent = text;
    // Append to canvas container
    picContainer.appendChild(canvasText);


    // Canvas Author -- 
    if (author) {
        var canvasAuthor = document.createElement("span");
        // class with styles required
        canvasAuthor.classList.add("canvas-author");
        // Add author text
        canvasAuthor.textContent = author;
        // Append to canvas container
        picContainer.appendChild(canvasAuthor);
    }

    document.body.appendChild(picContainer);

    html2canvas(picContainer).then(canvas => {
        var canvasImg = canvas.toDataURL("image/jpeg", 1);
        var link = document.createElement("a");
        link.href = canvasImg;
        link.download = "أذكارك - " + fileName + ".jpeg";
        link.click();
        link.delete;
        picContainer.remove();
    });


}
