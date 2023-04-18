import React, { useState } from "react";
import { text } from "./GetScriptures.js";

const ChapterContainer = () => {
    const [onscreenDiv, setOnscreenDiv] = useState(
        document.getElementById("chapter2")
    );
    const [offscreenDiv, setOffscreenDiv] = useState(
        document.getElementById("chapter1")
    );

    const animateToNewContent = function(animationType) {
        prepareToAnimate(animationType);
        performAnimation(animationType);
        swapDivs();
        document.querySelector("#chaptercontainer").scrollTop = 0;
    };

    const performAnimation = function(animationType) {
        onscreenDiv.classList.add(`${animationType}-offscreen`);
        onscreenDiv.classList.remove("onscreen");
        offscreenDiv.className = "chapter onscreen";
    };

    const prepareToAnimate = function(animationType) {
        offscreenDiv.className = `chapter ${animationType}-prepare-offscreen`;
        updateContentForDiv(offscreenDiv, animationType);
        offscreenDiv.scrollTop = 0;
    };

    const swapDivs = function() {
        [onscreenDiv, offscreenDiv] = [offscreenDiv, onscreenDiv];
    };

    const updateContentForDiv = function(offdiv, animationType) {
        if (animationType === "slideright" || animationType === "slideleft") {
            offdiv.innerHTML = text;
            return;
        }
    };

    return (
        <div id="chaptercontainer">
            <div id="chapter1" className="chapter">
                {/* content for offscreenDiv */}
            </div>
            <div id="chapter2" className="chapter onscreen">
                {/* content for onscreenDiv */}
            </div>
        </div>
    );
};

const CrumbContainer = () => {
    const [onScreenBread, setOnScreenBread] = useState(
        document.getElementById("crumbs2")
    );
    const [offScreenBread, setOffScreenBread] = useState(
        document.getElementById("crumbs1")
    );

    const animateBreadcrumbs = function(bread) {
        prepareBread(bread);
        performBread();
        swapBread();
    };

    const performBread = function() {
        onScreenBread.classList.add(`bread-offscreen`);
        onScreenBread.classList.remove("bread-onscreen");
        offScreenBread.className = "crumbs bread-onscreen";
    };

    const prepareBread = function(bread) {
        offScreenBread.className = `crumbs prepare-bread-offscreen`;
        updateContentforBread(offScreenBread, bread);
        offScreenBread.scrollTop = 0;
    };

    const swapBread = function() {
        [onScreenBread, offScreenBread] = [offScreenBread, onScreenBread];
    };

    const updateContentforBread = function(offScreenBread, bread) {
        offScreenBread.innerHTML = bread;
    };

    return (
        <div id="crumbcontainer">
            <div id="crumbs1" className="crumbs">
                {/* content for offScreenBread */}
            </div>
            <div id="crumbs2" className="crumbs bread-onscreen">
                {/* content for onScreenBread */}
            </div>
        </div>
    );
};
export { ChapterContainer, CrumbContainer };
