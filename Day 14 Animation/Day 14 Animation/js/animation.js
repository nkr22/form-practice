// Constants
const ANIMATION_TYPE_SLIDE_LEFT = "slideleft";
const ANIMATION_TYPE_SLIDE_RIGHT = "slideright";
const ANIMATION_TYPE_CROSSFADE = "crossfade";
const NEXT_CONTENT_MESSAGE = "The overall count is now";

// Private variables
let clickmeDiv = document.getElementById("clickme");
let onscreenDiv = document.getElementById("chapter1");
let offscreenDiv = document.getElementById("chapter2");
let count = 1;

// Helper methods

const animateToNewContent = function (animationType = ANIMATION_TYPE_CROSSFADE) {
    prepareToAnimate(animationType);
    performAnimation(animationType);
    swapDivs();
};

const performAnimation = function (animationType) {
    onscreenDiv.classList.remove("onscreen");
    onscreenDiv.classList.add(`${animationType}-offscreen`);
    offscreenDiv.className = "chapter onscreen";
};

const prepareToAnimate = function (animationType) {
    offscreenDiv.className = `chapter ${animationType}-prepare-offscreen`;
    updateContentForDiv(offscreenDiv);
    offscreenDiv.scrollTop = 0;
};

const swapDivs = function () {
    [onscreenDiv, offscreenDiv] = [offscreenDiv, onscreenDiv];
};

const updateContentForDiv = function (div) {
    const content = div.innerHTML;
    const indexOfNext = content.indexOf(NEXT_CONTENT_MESSAGE);
    const newContent = `${NEXT_CONTENT_MESSAGE} <b>${count}</b>`;

    count += 1;

    if (indexOfNext >= 0) {
        div.innerHTML = content.slice(0, indexOfNext) + newContent;
    } else {
        div.innerHTML = content + " " + newContent;
    }
};

// Set up click handlers (this assumes the document is ready and the elements exist)
onscreenDiv.addEventListener("click", () => {
    animateToNewContent(ANIMATION_TYPE_SLIDE_LEFT);
});
offscreenDiv.addEventListener("click", () => {
    animateToNewContent(ANIMATION_TYPE_SLIDE_RIGHT);
});
document.getElementsByClassName("map")[0].addEventListener("click", () => {
    animateToNewContent();
});

const quasiRandomLeftTop = function (left, top) {
    let deltaX = Math.floor(Math.random() * 50);
    let deltaY = Math.floor(Math.random() * 50);

    if (deltaX <= 3 || deltaY <= 3) {
        left = 16;
        top = 516;
    } else {
        if (deltaX > 25) {
            left = left + deltaX;
        } else {
            left = left - deltaX;
        }

        if (deltaY > 25) {
            top = top + deltaY;
        } else {
            top = top - deltaY;
        }
    }

    return [left, top];
};

clickmeDiv.addEventListener("click", () => {
    const currentLeft = Number(clickmeDiv.style.left.replace("px", ""));
    const currentTop = Number(clickmeDiv.style.top.replace("px", ""));
    const [left, top] = quasiRandomLeftTop(currentLeft, currentTop);

    clickmeDiv.style.left = `${left}px`;
    clickmeDiv.style.top = `${top}px`;
});

clickmeDiv.style.left = "16px";
clickmeDiv.style.top = "516px";