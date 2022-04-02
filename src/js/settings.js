import { gsap } from "gsap/index";
import {
    activeIcon, addLoader,
    removeLoaders
} from "./global";

import httpClient from "./helpers/httpClient";

export function settings() {
    activeIcon("settings");
    settingsBtns();
    colorOptionBtns();
    fontOptionBtns();
    shareAppBtn();
    sugForm();
}

function settingsBtns() {
    // Main Options Slide
    let mainSlide = document.querySelector(".setting-list");

    // Theem Slide ----------------------
    let theemOptionSlide = document.querySelector(".change-color-theem-op");
    let theemBtn = document.querySelector("#color-theem-btn");
    let theemBackBtn = document.querySelector("#color-theem-back");

    // Animation
    var theemTl = gsap.timeline();
    theemTl.to(mainSlide, {
        duration: 0.5,
        right: "-120%",
        ease: "power3"
    })
        .to(theemOptionSlide, {
            duration: 0.5,
            right: 0,
            ease: "power3"
        }, "-=0.5");
    theemTl.pause();
    // Open
    theemBtn.addEventListener("click", theemBtnClick);
    function theemBtnClick() {
        theemOptionSlide.style.display = "block";
        theemTl.play();
    }
    // Close
    theemBackBtn.addEventListener("click", theemBackBtnClick);
    function theemBackBtnClick() {
        theemTl.reverse().then(() => {
            theemOptionSlide.style.display = "none";
        });
    }
    // End Of Theem Slide ----------------------------

    // Font Slide ------------------------------------
    let fontOptionSlide = document.querySelector(".change-font-size-op");
    let fontBtn = document.querySelector("#font-size-btn");
    let fontBackBtn = document.querySelector("#font-size-back");
    // Animation
    var fontTl = gsap.timeline();
    fontTl.to(mainSlide, {
        duration: 0.5,
        right: "-120%",
        ease: "power3"
    })
        .to(fontOptionSlide, {
            duration: 0.5,
            right: 0,
            ease: "power3"
        }, "-=0.5");
    fontTl.pause();
    // Open
    fontBtn.addEventListener("click", fontBtnClick);
    function fontBtnClick() {
        fontOptionSlide.style.display = "block";
        fontTl.play();
    }
    // Close
    fontBackBtn.addEventListener("click", fontBackBtnClick);
    function fontBackBtnClick() {
        fontTl.reverse().then(() => {
            fontOptionSlide.style.display = "none";
        });
    }
    // End Of Font Slide --------------------------------

    // About Slide -------------------------------------
    let aboutOptionSlide = document.querySelector(".about-app-op");
    let aboutBtn = document.querySelector("#about-app-btn");
    let aboutBackBtn = document.querySelector("#about-app-back");

    let aboutTl = gsap.timeline();
    aboutTl.to(mainSlide, {
        duration: 0.5,
        right: "-120%",
        ease: "power3"
    })
        .to(aboutOptionSlide, {
            duration: 0.5,
            right: 0,
            ease: "power3"
        }, "-=0.5");
    aboutTl.pause();
    // Open
    aboutBtn.addEventListener("click", aboutBtnClick);
    function aboutBtnClick() {
        aboutOptionSlide.style.display = "block";
        aboutTl.play();
    }
    // Close
    aboutBackBtn.addEventListener("click", aboutBackBtnClick);
    function aboutBackBtnClick() {
        aboutTl.reverse().then(() => {
            aboutOptionSlide.style.display = "none";
        });
    }
    // End Of About Slide ----------------

    // Contact Slide ---------------
    let contactOptionSlide = document.querySelector(".contact-op");
    let contactBtn = document.querySelector("#contact-btn");
    let contactBackBtn = document.querySelector("#contact-back");

    let contactTl = gsap.timeline();
    contactTl.to(mainSlide, {
        duration: 0.5,
        right: "-120%",
        ease: "power3"
    })
        .to(contactOptionSlide, {
            duration: 0.5,
            right: 0,
            ease: "power3"
        }, "-=0.5");
    contactTl.pause();
    // Open
    contactBtn.addEventListener("click", contactBtnClick);

    function contactBtnClick() {
        contactOptionSlide.style.display = "block";
        contactTl.play();
    }
    // Close
    contactBackBtn.addEventListener("click", contactBackBtnClick);
    function contactBackBtnClick() {
        contactTl.reverse().then(() => {
            contactOptionSlide.style.display = "none";
        });
    }
    // End Of Contact Slide ---------------
}


function colorOptionBtns() {

    const theems = {
        "auto": 1,
        "light": 2,
        "dark": 3
    };

    const update = async (theem) => {
        localStorage.setItem("theem", theem);
        try {
            addLoader(document.querySelector(".change-color-theem-op"));
            await httpClient.post("/user/settings", {
                disply_theem: theems[theem]
            });
        } catch (e) { }
        colorOption();
        removeLoaders();
    };

    let autoRadio = document.querySelector("#auto");
    let lightRadio = document.querySelector("#light");
    let darkRadio = document.querySelector("#dark");

    // Auto Radio
    autoRadio.addEventListener("click", () => {
        update("auto");
    });

    // Light Radio
    lightRadio.addEventListener("click", () => {
        update("light");
    });

    // Dark Radio
    darkRadio.addEventListener("click", () => {
        update("dark");
    });

}


function getDarkElemnts() {
    let elements = [];
    // Images and Icons to Invert colors

    elements.push(document.querySelector("#signInMain .right a"));

    // Share icon in today's quote
    elements.push(document.querySelector(".share-icon"));

    // Mobile Nav Icons
    elements.push(document.querySelector("#icon-home"));
    elements.push(document.querySelector("#icon-zikr"));
    elements.push(document.querySelector("#icon-settings"));

    elements.push(document.querySelector(".radio-menu img"));
    elements.push(document.querySelector(".sug-menu img"));

    document.querySelectorAll(".info img")
        .forEach((element) => {
            elements.push(element);
        });

    document.querySelectorAll(".option")
        .forEach((element) => {
            elements.push(element);
        });

    document.querySelectorAll(".dalel-card h2")
        .forEach((element) => {
            elements.push(element);
        });
    return elements;
}


function enableDarkMode() {
    document.body.classList.add("dark-mode");

    getDarkElemnts().forEach((elem) => {
        if (!(elem == null)) elem.classList.add("invert");
    });

    // // remove one manualy just fast
    // var finishImg = document.querySelector(".finish-cont img");
    // if (finishImg) finishImg.classList.remove("invert");
}

function disableDarkMode() {
    document.body.classList.remove("dark-mode");

    getDarkElemnts().forEach((elem) => {
        if (!(elem == null)) elem.classList.remove("invert");
    });

    // // add one manualy just fast
    // var finishImg = document.querySelector(".finish-cont img");
    // if (finishImg) finishImg.classList.add("invert");
}

export function colorOption() {
    const theem = localStorage.getItem("theem");
    if (theem == "dark") {
        enableDarkMode();
        // Radio Buttons in Settings
        let darkRadio = document.querySelector("#dark");
        if (darkRadio) darkRadio.checked = true;
    }
    else if (theem == "light") {
        disableDarkMode();
        // Radio Buttons in Settings
        let lightRadio = document.querySelector("#light");
        if (lightRadio) lightRadio.checked = true;
    }
    else if (theem == "auto") {
        let autoRadio = document.querySelector("#auto");
        if (autoRadio) autoRadio.checked = true;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            enableDarkMode();
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            e.matches ? enableDarkMode() : disableDarkMode();
        });
    }
    else {
        localStorage.setItem("theem", "auto");
        colorOption();
    }











}

function fontOptionBtns() {
    const font_sizes = {
        "s": 1,
        "m": 2,
        "l": 3,
        "xl": 4,
    };

    const update = async (size) => {
        localStorage.setItem("fontSize", size);
        try {
            addLoader(document.querySelector(".change-font-size-op"));
            await httpClient.post("/user/settings", {
                font_size: font_sizes[size]
            });
        } catch (e) { }
        fontOption();
        removeLoaders();
    };

    let sRadio = document.querySelector("#s");
    sRadio.addEventListener("click", () => {
        update("s");
    });

    let mRadio = document.querySelector("#m");
    mRadio.addEventListener("click", () => {
        update("m");
    });

    let lRadio = document.querySelector("#l");
    lRadio.addEventListener("click", () => {
        update("l");
    });

    let xlRadio = document.querySelector("#xl");
    xlRadio.addEventListener("click", () => {
        update("xl");
    });

}

export function fontOption() {

    let sRadio = document.querySelector("#s");
    let mRadio = document.querySelector("#m");
    let lRadio = document.querySelector("#l");
    let xlRadio = document.querySelector("#xl");

    const fontSize = localStorage.getItem("fontSize");

    switch (fontSize) {
        case "s":
            if (sRadio) sRadio.checked = true;
            sSize();
            break;
        case "m":
            if (mRadio) mRadio.checked = true;
            mSize();
            break;
        case "l":
            if (lRadio) lRadio.checked = true;
            lSize();
            break;
        case "xl":
            if (xlRadio) xlRadio.checked = true;
            xlSize();
            break;
        default:
            localStorage.setItem("fontSize", "m");
            fontOption();
            break;
    }

    function sSize() {
        document.body.style.fontSize = "0.9rem";
    }
    function mSize() {
        document.body.style.fontSize = "1rem";
    }
    function lSize() {
        document.body.style.fontSize = "1.1rem";
        sharedInBigSize();
    }
    function xlSize() {
        document.body.style.fontSize = "1.2rem";
        sharedInBigSize();
    }

    function sharedInBigSize() {
        let btnRec = document.querySelector("#btn-wraper");
        if (btnRec) btnRec.style.maxWidth = "300px";

        let infoImg = document.querySelectorAll(".info img");
        if (infoImg) {
            infoImg.forEach(img => {
                img.style.width = "1.3rem";
            });
        }
    }
}

function shareAppBtn() {
    var btn = document.querySelector("#share-app");

    btn.addEventListener("click", share);

    function share() {
        navigator.share({
            title: "Athkarok-أذكارك",
            text: "أذكارك هو تطبيق مجاني يمكنك من تصفح الأوراد اليومية للمسلم ويساعدك على المحافظة عليها يوميًا ، يمكنك التطبيق من عرض مواقيت الصلاة ، سماع اذاعة القرآن الكريم والمزيد. \n athkarok.netlify.app",
        });
    }
}

const sugForm = () => {
    const form = document.forms["sugForm"];
    let once = true;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (once){
            once = false;
            const role = form.elements.role.value;
            const name = form.elements.name.value.trim();
            const message = form.elements.message.value.trim();
    
            addLoader(e.target);
            await httpClient.post("/form/contact", {
                role, message, name
            });
            e.target.innerHTML += '<p class="font-s">تم إستلام رسالتك بنجاح، جاري إعادة توجيهك للرئيسية.</p>';
            removeLoaders();
    
            setTimeout(() => {
                window.location = "/";
            }, 5000);
        }
    });
};
