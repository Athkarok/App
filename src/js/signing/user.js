import httpClient from '../helpers/httpClient';
import { colorOption, fontOption } from "../settings";
import { setZikrCounter } from "../global";


const options = {
    "theems": {
        1: "auto",
        2: "light",
        3: "dark"
    },
    "fontSizes": {
        1: "s",
        2: "m",
        3: "l",
        4: "xl",
    },
    "fontTypes": {
        1: "Questv1",
    }
};

const setUserSettings = (settings) => {
    localStorage.setItem("theem", options["theems"][settings.theem]);
    localStorage.setItem("fontSize", options["fontSizes"][settings.font_size]);
    colorOption();
    fontOption();
};

const setWheel = (isDone) => {
    if (isDone) {
        localStorage.setItem("wheelState", "done");
    } else {
        localStorage.removeItem("wheelState");
    }
};

const doneDotUpdate = async (doneGroups) => {
    // Done Dots
    const groups = {
        1: document.querySelector("#sabah span"),
        2: document.querySelector("#masaa span"),
        3: document.querySelector("#noom span"),
        4: document.querySelector("#estekaz span"),
        5: document.querySelector("#massjed span"),
        6: document.querySelector("#slaah span")
    };

    doneGroups.forEach((group) => {
        try {
            groups[group].classList.add("done-dot");
        } catch { }
    });
};

const changeSingBtns = () => {
    try {
        const sign = document.querySelector(".sign-btns");
        sign.innerHTML = '<a href="#">تسجيل الخروج</a>';
        sign.addEventListener("click", async (e) => {
            e.preventDefault();
            await signOut();
            window.location.reload();
        });
    } catch (e) { }
};

const preventSignPages = () => {
    const url = window.location.href;
    if (url.includes("sign_in") || url.includes("sign_up")) {
        window.location.href = "/";
    }
};

const signedState = () => {
    changeSingBtns();
    preventSignPages();
};

export const setUser = async () => {
    try {
        const resp = await httpClient.get("/user/@me");

        const data = resp.data;

        if (data.code == 0) {
            setUserSettings(data.settings);
            setZikrCounter(data.points);
            setWheel(data.progress.wheel);
            doneDotUpdate(data.progress.group_ids);
            signedState();
        }
    }
    catch (err) {
        setZikrCounter(0);
    }
};



const signOut = async () => {
    localStorage.removeItem("token");
};
