// gsap Lib
import { gsap } from "gsap/index";
import { activeIcon, saveTextInPic } from "./global";
import httpClient from "./helpers/httpClient";

// Home Page functions ------------------------------
export default async function home() {
  activeIcon("home");
  homePageAnimation();
  zikrRecommendtion();
  shortcuts();
  quoteOfDay();
  wheelFunctionalty();
  radio();
  prayerTimes();
}


// Home Page Animation 
const homePageAnimation = () => {
  var mainIndexElements = document.querySelector("#indexMain");
  gsap.from(mainIndexElements.children, {
    duration: 0.5,
    opacity: 0,
    x: () => Math.random() * 500,
    stagger: 0.2,
    ease: "slow(0.7, 0.7, false)",
  });
};


// recommend the right zikr on time
const zikrRecommendtion = () => {
  const zikrRecText = document.querySelector("#zikr-rec-btn");
  const zikrRecImg = document.querySelector("#zikr-rec-img");

  const hourNow = new Date().getHours();

  if (hourNow >= 4 && hourNow <= 16) {
    zikrRecText.textContent = `عطر يومك بأذكار الصباح`;
    zikrRecImg.setAttribute("src", `./images/sun.svg`);
    zikrButnRec("sabah");
  } else {
    zikrRecText.textContent = `عطر يومك بأذكار المساء`;
    zikrRecImg.setAttribute("src", `./images/moon.svg`);
    zikrButnRec("masaa");
  }

  // zikr button recommendtion
  function zikrButnRec(time) {
    let recBtn = document.querySelector("#zikr-rec-btn");
    let recBtnIcon = document.querySelector("#zikr-rec-btn-icon");

    recBtn.addEventListener("click", btnClick);

    function btnClick() {
      if (time === "sabah") {
        localStorage.setItem("zikrShort", "sabah");
      }
      else if (time === "masaa") {
        localStorage.setItem("zikrShort", "masaa");
      }

      recBtnIcon.style.removeProperty("animation");

      let tl = gsap.timeline();
      // --------------
      tl.to(recBtn, {
        duration: 0.3,
        width: "100%",
        backgroundColor: "#EDEDED",
        color: "#222831",
        ease: "power2"
      })
        .to(recBtnIcon, {
          duration: 0.3,
          x: -20,
          ease: "power2"
        }, "-=0.3")
        .to(".icon-fill", {
          duration: 0.2,
          fill: "#222831",
          onComplete: () => {
            window.open("athkarok.html", "_self");
          }
        }, "-=0.2");
    }


  }
};


// Shortcuts animations
const shortcuts = () => {
  const zikrShortCutBtn = document.querySelectorAll(".zikr-shortcut-btn");

  // ----------------
  function shortAnime(btn) {
    gsap.to(btn, {
      duration: 0.5,
      backgroundColor: "#222831",
      color: "#DDDDDD",
      ease: "expo.out",
      onComplete: () => {
        window.open("athkarok.html", "_self");
      },
    });
  }

  zikrShortCutBtn[0].addEventListener("click", () => {
    shortAnime(zikrShortCutBtn[0]);
    localStorage.setItem("zikrShort", "sabah");
  });

  zikrShortCutBtn[1].addEventListener("click", () => {
    shortAnime(zikrShortCutBtn[1]);
    localStorage.setItem("zikrShort", "masaa");
  });

  zikrShortCutBtn[2].addEventListener("click", () => {
    shortAnime(zikrShortCutBtn[2]);
    localStorage.setItem("zikrShort", "massjed");
  });

  zikrShortCutBtn[3].addEventListener("click", () => {
    shortAnime(zikrShortCutBtn[3]);
    localStorage.setItem("zikrShort", "noom");
  });
};


// Quote Of the Day 
const quoteOfDay = async () => {
  var quote = document.querySelector(".quote-box blockquote");
  var author = document.querySelector(".quote-box footer");
  try {
    const data = await (await httpClient.get("/quote/today")).data;

    quote.textContent = data.quote;
    author.textContent = data.author;

  } catch (e) { }


  var shareBtn = document.querySelector(".quote-box #share-quote-btn");
  shareBtn.addEventListener("click", shareQuote);

  function shareQuote() {
    shareBtn.children[0].setAttribute("src", "./images/share-icon-active.svg");
    gsap.to(shareBtn, {
      duration: 0.2,
      scale: 1.1,
      ease: "power2",
      onComplete: () => {
        gsap.to(shareBtn, {
          duration: 0.2,
          scale: 1,
          ease: "power2",
          onComplete: () => {
            shareBtn.children[0].setAttribute("src", "./images/share-icon.svg");
          }
        });
      }
    });
    saveTextInPic(quote.textContent, author.textContent, "مقولة اليوم - " + author.textContent);
  }
};


// wheel work 
const wheelFunctionalty = () => {

  const wheelInnerBox = document.querySelector(".wheel-inner-box");
  const finishCont = document.querySelector(".finish-cont");

  // if user have done the wheel in the same day
  const wheelState = localStorage.getItem("wheelState");

  if (wheelState == "done") boxDone();

  function boxDone() {
    gsap.to(wheelInnerBox, {
      duration: 0.5,
      opacity: 0,
      x: 10,
      onComplete: () => {
        wheelInnerBox.style.display = "none";
        finishCont.style.display = "flex";
        gsap.from(finishCont, {
          duration: 0.5,
          x: -10,
          ease: "power2"
        });
      }
    });
    httpClient.post("/progress/wheel");
  }

  function resetWheel() {
    index = 0;
    wheel.textContent = zikrList[index].textContent;

    finishCont.style.display = "none";
    wheelInnerBox.style.display = "flex";
    gsap.to(wheelInnerBox, {
      duration: 0.5,
      opacity: 1,
      x: 0,
      ease: "power2"
    });
    wheel.removeAttribute("disabled");
    zikrList.forEach(zikr => {
      zikr.removeAttribute("disabled");
    });

  }
  document.querySelector("#reset-wheel-btn").addEventListener("click", resetWheel);



  const wheel = document.querySelector(".wheel");
  const zikrList = document.querySelectorAll(".zikr-on-list");
  const activeStroke = document.querySelector("#cir-active-stroke");

  // set first zikr in wheel
  wheel.textContent = zikrList[0].textContent;


  // which one from the list
  var index = 0;
  // clickCount for the wheel animation only
  var clickCount = 0;
  function wheelClick() {
    // Vibrate the device
    navigator.vibrate(30);
    // animate the wheel 
    gsap.to(wheel, {
      duration: 0.15,
      scale: 1.2,
      ease: "power4",
      onComplete: () => {
        gsap.to(wheel, {
          duration: 0.15,
          scale: 1,
          ease: "power4",
        });
      },
    });

    // chanage the stroke acording to times clicked
    if (clickCount === 0) {
      gsap.to(activeStroke, { duration: 0.4, strokeDashoffset: 332 });
      clickCount++;
    } else if (clickCount === 1) {
      gsap.to(activeStroke, { duration: 0.4, strokeDashoffset: 166 });
      clickCount++;
    } else if (clickCount === 2) {
      resetCount();
      gsap.to(activeStroke, {
        duration: 0.4,
        strokeDashoffset: 0,
        onComplete: () => {
          zikrDone(index);
          index++;
        },
      });
    }
  }

  wheel.addEventListener("click", wheelClick);

  function resetCount() {
    clickCount = 0;
  }

  function zikrDone(index) {
    // reset stroke
    activeStroke.style.strokeDashoffset = 500;

    if (index < zikrList.length - 1) {
      zikrList[index].setAttribute("disabled", "");
      wheel.textContent = zikrList[index + 1].textContent;
    } else {
      wheel.setAttribute("disabled", "");
      zikrList[index].setAttribute("disabled", "");
      boxDone();
    }
  }

};


const radio = () => {

  // Radio Select
  function stopAllAudios() {
    let allAudios = document.getElementsByTagName("audio");
    for (let i = 0; i < allAudios.length; i++) {
      allAudios[i].pause();
    }
  }

  // btns
  let play = document.querySelector("#play-btn");
  let pause = document.querySelector("#pause-btn");

  let radioSelect = document.querySelector("#radio-select");
  play.addEventListener("click", () => {
    stopAllAudios();
    let radioId = radioSelect.value.substring(0, 1);

    const radio = new Audio(`https://api.athkarok.tech/radio?id=${radioId}`);

    document.body.appendChild(radio);

    radio.load();
    radio.play();
  });

  pause.addEventListener("click", () => {
    stopAllAudios();
  });

};


const displayLocation = (latitude, longitude) => {
  // Data Elements to be changed

  // contry and county and city
  let contry = document.querySelector("#contry");
  let county = document.querySelector("#county");
  let city = document.querySelector("#city");

  let request = new XMLHttpRequest();

  let method = 'GET';
  let apiKey = "BP8OL9TYCiZwqz5dZOXH-mfmKa-axiV4HZddHg_MemM";
  let url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&lang=ar-sa&apiKey=${apiKey}`;
  let async = true;

  request.open(method, url, async);
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      var data = JSON.parse(request.responseText);
      contry.textContent = data.items[0].address.countryName;
      county.textContent = data.items[0].address.county;
      city.textContent = data.items[0].address.city;
    }
  };
  request.send();
};


const formatTime = (time) => {
  let hour = Number(time.slice(0, 2));
  let min = time.slice(3, 5);

  if (hour > 12) {
    hour -= 12;

    if (hour <= 9) {
      return String("0" + hour + ":" + min + "م");
    }

    return String(hour + ":" + min + "م");
  }
  else if (hour === 12) {

    if (min === "00") {
      return String(hour + ":" + min + "ص");
    }
    else {
      return String(hour + ":" + min + "م");
    }

  }
  else {
    return String(time + "ص");
  }
};


const getPrayerTimes = async (latitude, longitude) => {

  // Data Elements to be changed
  let day = document.querySelector("#day");
  let dayNum = document.querySelector("#day-num");
  let month = document.querySelector("#month");
  let year = document.querySelector("#year");

  // Prayer Elements to be changed 
  let fajr = document.querySelector("#fajr-time");
  let sunrise = document.querySelector("#sunrise-time");
  let dhuhr = document.querySelector("#dhuhr-time");
  let asr = document.querySelector("#asr-time");
  let maghrib = document.querySelector("#maghrib-time");
  let isha = document.querySelector("#isha-time");
  try {
    const resp = await httpClient.get(
      `/prayers/?latitude=${latitude}&longitude=${longitude}`);

    const data = resp.data;

    // Date 
    day.textContent = data.date.hijri.weekday.ar;
    dayNum.textContent = data.date.hijri.day;
    month.textContent = data.date.hijri.month.ar;
    year.textContent = data.date.hijri.year;

    // Prayer times
    fajr.textContent = formatTime(data.timings.Fajr);
    sunrise.textContent = formatTime(data.timings.Sunrise);
    dhuhr.textContent = formatTime(data.timings.Dhuhr);
    asr.textContent = formatTime(data.timings.Asr);
    maghrib.textContent = formatTime(data.timings.Maghrib);
    isha.textContent = formatTime(data.timings.Isha);

  } catch (e) { console.log(e); }

};


const prayerCard = document.querySelector(".prayer-times");
const locationCard = document.querySelector(".ask-loc");
// Get coords 
const successCallback = async (position) => {
  locationCard.style.display = "none";
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  await displayLocation(latitude, longitude);
  await getPrayerTimes(latitude, longitude);
  // Display Prayer Card 
  prayerCard.style.display = "block";
};

const errorCallback = function (error) {
  if (error.code != 1) {
    locationCard.children[0].textContent = "لايمكن الوصول للموقع الخاص بك حاليا لعرض مواقيت الصلاة اضغط للمحاولة مرة اخرى.";
  }
};


const checkPerm = () => {
  navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
    if (result.state == 'granted') {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback,
        {
          enableHighAccuracy: true,
          timeout: 1000,
          maximumAge: 0
        });
    }
    else if (result.state == 'denied') {
      locationCard.children[0].textContent = "قم بتغيير إعدادات المتصفح والسماح باستخدام خدمة الموقع للوصول إلى مواقيت الصلاة.";
      locationCard.style.cursor = "default";
    }
  });
};

const prayerTimes = () => {
  checkPerm();

  locationCard.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback,
      {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
      });
  });

};