// sass
import "../scss/style.scss";

// gsap Lib
import { gsap } from "gsap/index";

import * as Global from "./global";
import home from "./home";
import athkarok from "./athkarok";
import { settings, fontOption, colorOption } from "./settings";
import signin from "./signing/signin";
import signup from "./signing/signup";
import * as User from "./signing/user";

// Always Called
async function alwaysCalled() {
  Global.setToLocalFirstTime(); // must saty the first
  Global.updateNewDay(); // must saty the second
  await User.setUser();
  Global.fixShortCutLocal();
  registerSW();
  loader();
  colorOption();
  fontOption();
}

// Things that will run anyway
alwaysCalled();

// Things will run depened on the page
var url = document.URL;

// Loader
const loader = async () => {
  let loader = document.querySelector(".app-loader");
  let progress = document.querySelector(".progress-inner");

  if (url.includes("athkarok.html")) {
    athkarok();
  }
  else if (url.includes("settings.html")) {
    settings();
  }
  else if (url.includes("signin.html")) {
    signin();
  }
  else if (url.includes("signup.html")) {
    signup();
  }
  else {
    home();
  }

  gsap.to(progress, {
    duration: 1,
    width: "100%",
    ease: "power1",
    onComplete: () => {
      gsap.to(loader, {
        duration: 0.2,
        opacity: 0,
        display: "none",
        ease: "power2"
      });
    }
  });
};

const registerSW = () => {
  window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js")
        .then(() => console.log("👍"))
        .catch(() => console.log("🚫"));
    }
  });
};