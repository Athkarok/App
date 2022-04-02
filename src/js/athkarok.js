import httpClient from "./helpers/httpClient";
import gsap from "gsap/index";

import { colorOption, fontOption } from "./settings";
import {
    activeIcon, getZikrCounter,
    pageLoader, removeLoaders, saveTextInPic
} from "./global";

export default function azkarokPage() {
    activeIcon("zikr");
    azkarokPageAnimation();
    azkarokContent();
}

const azkarokPageAnimation = () => {
    gsap.from(".zikr-theem-box", {
        duration: 1.5,
        y: 200,
        stagger: 0.2,
        ease: "power4",
    });
};


// Get all the data from json file
const zikrGroups = ["أذكار الصباح", "أذكار المساء", "أذكار النوم", "أذكار الإستيقاظ", "أذكار المسجد", "أذكار الصلاة"];

const addZikrs = (zikrArr, groupId) => {
    for (let i = 0; i < zikrArr.length; i++) {
        azkarokMain.innerHTML +=
            `<article href="" class="zikr-card">
            <div class="zikr-card-content">
                <p class="font-s">${zikrArr[i].text}</p>
            </div>
            <footer class="flex flex-ai-c flex-jc-se font-s">
                <div class="info count-btn">
                    <span>مرات التكرار</span>
                    <span class="times-shape">${zikrArr[i].repeat_times}</span>
                </div>
                <div class="barrier"></div>
                <div class="info dalel-btn">
                    <span>الدليل</span>
                    <img src="./images/info.svg" alt="">
                </div>
                <div class="barrier"></div>
                <div class="info share-btn">
                    <span>مشاركة</span>
                    <img src="./images/share-icon.svg" alt="">
                </div>
            </footer>
        </article>`;
    }
    for (let i = 0; i < zikrArr.length; i++) {
        azkarokMain.innerHTML +=
            `<div class="dalel-card-perant">
                <article class="dalel-card">
                    <h2 class="font-m">الــدلـيـل عـلـى الـذكـر</h2>
                    <div class="text-cont">
                        <p class="font-s">${zikrArr[i].dalel}</p>
                    </div>
                    <footer>
                        <button class="dalel-card-btn dalel-close-btn">إغـلاق</button>
                            <a href="${zikrArr[i].dalel_link}" target="_blank" class="dalel-card-btn">المصدر</a>
                    </footer>
                </article>
            </div>`;
    }
    azkarokMain.innerHTML += `
        <div class="done">
            <img src="./images/done.svg" alt="Done Icon">
            <div class="done-text">
                <span id="groupId" data-group-id="${groupId}"></span>
                <h2 class="font-l">تم بحمدالله قراءة <span class="font-s">${zikrGroups[groupId - 1]}</span></h2>
                
                <p class="font-s">تمت اضافة <span id="zikr-added">5</span> ذكر/ أذكار.</p>
                <p class="font-s">إجمالي الأذكار المقروئة <span id="zikr-over-all">999</span> ذكر/ أذكار.</p>
            </div>
            <button>موافق</button>
        </div>`;
};


const getData = async (groupId, callback) => {

    document.querySelector("#azkarokMain").innerHTML = "";
    pageLoader();

    const resp = await httpClient.get(`/zikr/?group_id=${groupId}`);
    removeLoaders();

    const data = resp.data;
    addZikrs(data.zikrs, groupId);
    callback(true);
};

const groupBtns = () => {
    const zikrTheems = document.querySelectorAll(".zikr-theem-box");
    const zikrTheemSabah = zikrTheems[0];
    const zikrTheemMasaa = zikrTheems[1];
    const zikrTheemNoom = zikrTheems[2];
    const zikrTheemEstekaz = zikrTheems[3];
    const zikrTheemMassjed = zikrTheems[4];
    const zikrTheemSlaah = zikrTheems[5];

    zikrTheemSabah.addEventListener("click", () => {
        getData(1, (success) => { if (success) azkarokFuncs(); });
    });

    zikrTheemMasaa.addEventListener("click", () => {
        getData(2, (success) => { if (success) azkarokFuncs(); });
    });

    zikrTheemNoom.addEventListener("click", () => {
        getData(3, (success) => { if (success) azkarokFuncs(); });
    });

    zikrTheemEstekaz.addEventListener("click", () => {
        getData(4, (success) => { if (success) azkarokFuncs(); });
    });

    zikrTheemMassjed.addEventListener("click", () => {
        getData(5, (success) => { if (success) azkarokFuncs(); });
    });

    zikrTheemSlaah.addEventListener("click", () => {
        getData(6, (success) => { if (success) azkarokFuncs(); });
    });
};

const azkarokFuncs = () => {
    let cards = document.querySelectorAll(".zikr-card");
    cards.forEach(card => {
        card.style.display = "block";
    });
    gsap.from(".zikr-card", {
        duration: 0.5,
        opacity: 0,
        y: -100,
        stagger: 0.1
    });
    zikrCardRemove();
    cardBtns();
    colorOption();
    fontOption();
};

let stayThere = false;
let zikrSessionCounter = 0;
const zikrCardRemove = () => {
    let zikrCards = document.querySelectorAll(".zikr-card");
    let zikrCardsContent = document.querySelectorAll(".zikr-card-content");
    let zikrCountersText = document.querySelectorAll(".times-shape");
    let countBtn = document.querySelectorAll(".count-btn");
    let dalelBtn = document.querySelectorAll(".dalel-btn");
    let shareBtn = document.querySelectorAll(".share-btn");

    for (let i = 0; i < zikrCards.length; i++) {
        zikrCardsContent[i].addEventListener("click", cardClick);
        countBtn[i].addEventListener("click", cardClick);

        function cardClick() {
            // Increment SessionCounter
            zikrSessionCounter++;
            // vibrate device
            navigator.vibrate(30);

            // Counter Animation
            zikrCountersText[i].classList.toggle("times-shape-anim");
            // TimeOut to Animate
            setTimeout(() => {
                zikrCountersText[i].classList.toggle("times-shape-anim");
            }, 200);

            let count = 0;
            let zikrCountText = zikrCountersText[i];
            let zikrCount = Number(zikrCountText.textContent);

            if (!stayThere)
                if (zikrCount > count) {
                    count++;
                    zikrCount--;
                    zikrCountText.textContent = zikrCount;
                    if (zikrCount === 0) removeCard();
                } else {
                    removeCard();
                }

            function removeCard() {
                // update counter
                zikrCountText.textContent = zikrCount;
                // Prevent accedint touchs
                zikrCardsContent[i].removeEventListener("click", cardClick);
                countBtn[i].removeEventListener("click", cardClick);
                dalelBtn[i].style.pointerEvents = "none";
                shareBtn[i].style.pointerEvents = "none";
                // Animate card disappening
                gsap.to(zikrCards[i], {
                    duration: 0.5,
                    x: 200,
                    opacity: 0,
                    onComplete: () => {
                        // Remove From DOM 
                        zikrCards[i].remove();
                        // Check if last zikr then show finish message
                        zikrFinish();
                    },
                });
            }
        }
    }
};

const zikrFinish = async () => {
    // Check if last zikr show finish message

    // boolean to check if it's there 
    let cardExist = document.body.contains(document.querySelector(".zikr-card"));

    if (!cardExist) {
        pageLoader();
        const group_id = Number(document.querySelector("#groupId").getAttribute("data-group-id"));
        try {
            await httpClient.post("/progress/zikr", { group_id });
        } catch (e) { }

        removeLoaders();


        // Done Element
        let doneMessage = document.querySelector(".done");
        let doneTextAdded = document.querySelector("#zikr-added");
        let doneTextOverAll = document.querySelector("#zikr-over-all");

        doneMessage.style.display = "flex";
        document.body.style.overflow = "hidden";
        doneTextAdded.textContent = zikrSessionCounter;
        doneTextOverAll.textContent = getZikrCounter() + zikrSessionCounter;

        // Animation
        gsap.from(".done button", {
            duration: 0.7,
            width: "30%"
        });


        let doneBtn = document.querySelector(".done button");
        doneBtn.addEventListener("click", () => {
            localStorage.removeItem("zikrShort");
            window.open("athkarok.html", "_self");
        });

    }
};

const azkarokContent = () => {

    const zikrShort = localStorage.getItem("zikrShort");
    if (zikrShort !== null) {
        document.querySelector("#azkarokMain").innerHTML = "";
    }
    // Entry Point
    switch (zikrShort) {
        case "sabah":
            getData(1, (success) => { if (success) azkarokFuncs(); });
            break;
        case "masaa":
            getData(2, (success) => { if (success) azkarokFuncs(); });
            break;
        case "massjed":
            getData(5, (success) => { if (success) azkarokFuncs(); });
            break;
        case "noom":
            getData(3, (success) => { if (success) azkarokFuncs(); });
            break;
        default:
            groupBtns();
            break;
    }
};

const cardBtns = () => {
    // Dalel Btns
    let dalelBtns = document.querySelectorAll(".dalel-btn");
    let dalelCardPerants = document.querySelectorAll(".dalel-card-perant");
    let dalelCards = document.querySelectorAll(".dalel-card");
    let dalelCardBtns = document.querySelectorAll(".dalel-card-btn");
    let dalelCardClose = document.querySelectorAll(".dalel-close-btn");

    for (let i = 0; i < dalelBtns.length; i++) {
        dalelBtns[i].addEventListener("click", dalelBtnClick);
        function dalelBtnClick() {
            dalelBtns[i].removeEventListener("click", dalelBtnClick);
            stayThere = true;
            gsap.from(dalelBtns[i], {
                duration: 0.3,
                scale: 0.8,
                ease: "elastic",
                onComplete: () => {
                    dalelCardPerants[i].style.display = "block";
                    document.body.style.overflow = "hidden";
                    gsap.from(dalelCards[i], {
                        duration: 0.3,
                        opacity: 0,
                        scale: 0.5
                    });
                    gsap.from(dalelCardBtns, {
                        duration: 0.4,
                        scale: 0.5,
                        ease: "power4",
                        delay: 0.1
                    });
                }
            });
            dalelCardClose[i].addEventListener("click", () => {
                dalelBtns[i].addEventListener("click", dalelBtnClick);
                stayThere = false;
                dalelCardPerants[i].style.display = "none";
                document.body.style.overflow = "auto";
            });
        }
    }
    // Share Btns
    let shareBtns = document.querySelectorAll(".share-btn");
    let zikrContent = document.querySelectorAll(".zikr-card-content p");

    for (let i = 0; i < shareBtns.length; i++) {
        shareBtns[i].addEventListener("click", shareBtnClick);
        function shareBtnClick() {
            gsap.from(shareBtns[i], {
                duration: 0.5,
                scale: 0.8,
                ease: "elastic",
                onComplete: () => {
                    let zikrText = zikrContent[i].textContent;
                    saveTextInPic(zikrText, "", `ذكر رقم ${i}`);
                }
            });
        }
    }


};