//imports
import { text } from "./GetScriptures.js";

//variables
let onscreenDiv = document.getElementById("chapter2");
let offscreenDiv = document.getElementById("chapter1");

let onScreenBread = document.getElementById("crumbs2");
let offScreenBread = document.getElementById("crumbs1");

//methods

const animateBreadcrumbs = function (bread) {
    prepareBread(bread);
    performBread();
    swapBread();
};

const animateToNewContent = function (animationType) {
    prepareToAnimate(animationType);
    performAnimation(animationType);
    swapDivs();
    document.querySelector("#chaptercontainer").scrollTop = 0;
};

const performAnimation = function (animationType) {
    onscreenDiv.classList.add(`${animationType}-offscreen`);
    onscreenDiv.classList.remove("onscreen");
    offscreenDiv.className = "chapter onscreen";
};

const performBread = function () {
    onScreenBread.classList.add(`bread-offscreen`);
    onScreenBread.classList.remove("bread-onscreen");
    offScreenBread.className = "crumbs bread-onscreen";
};

const prepareToAnimate = function (animationType) {
    offscreenDiv.className = `chapter ${animationType}-prepare-offscreen`;
    updateContentForDiv(offscreenDiv, onscreenDiv, animationType);
    offscreenDiv.scrollTop = 0;
};

const prepareBread = function (bread) {
    offScreenBread.className = `crumbs prepare-bread-offscreen`;
    updateContentforBread(offScreenBread, onScreenBread, bread);
    offScreenBread.scrollTop = 0;
};

const swapBread = function () {
    [onScreenBread, offScreenBread] = [offScreenBread, onScreenBread];
};

const swapDivs = function () {
    [onscreenDiv, offscreenDiv] = [offscreenDiv, onscreenDiv];
};

const updateContentForDiv = function (offdiv, animationType) {
    if (animationType === "slideright" || animationType === "slideleft") {
        offdiv.innerHTML = text;
        return;
    }
};

const updateContentforBread = function (offScreenBread, onScreenBread, bread) {
    offScreenBread.innerHTML = bread;
};

export { animateToNewContent, animateBreadcrumbs };
