//constants
const FIRST_BOOKS = [
    "Genesis",
    "The Book of Moses",
    "Title Page",
    "Explanatory Introduction",
];
const ANIMATION_TYPE_SLIDE_LEFT = "slideleft";
const ANIMATION_TYPE_SLIDE_RIGHT = "slideright";
const ANIMATION_TYPE_CROSSFADE = "crossfade";

// Private variables
let onscreenDiv = document.getElementById("chapter1");
let offscreenDiv = document.getElementById("chapter2");

//imports

import { books, text } from "./GetScriptures.js";

//methods

// Helper methods

const animateToNewContent = function (
    animationType = ANIMATION_TYPE_CROSSFADE
) {
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
    updateContentForDiv(offscreenDiv, animationType);
    offscreenDiv.scrollTop = 0;
};

const swapDivs = function () {
    [onscreenDiv, offscreenDiv] = [offscreenDiv, onscreenDiv];
};

const updateContentForDiv = function (div, animationType) {
    // const content = div.innerHTML;
    // const indexOfNext = content.indexOf(NEXT_CONTENT_MESSAGE);
    // const newContent = `${NEXT_CONTENT_MESSAGE} <b>${count}</b>`;

    // count += 1;

    // if (indexOfNext >= 0) {
    //     div.innerHTML = content.slice(0, indexOfNext) + newContent;
    // } else {
    //     div.innerHTML = content + " " + newContent;
    // }
    if (animationType === "slideright" || animationType === "slideleft") {
        div.innerHTML = text;
    }
};

//calculate the next and previous chapter content to change styles

//figure out the name for the next chapter
const nextChapter = function (bookId, chapter) {
    let book = books[bookId];

    if (book !== "undefined") {
        if (chapter < book.numChapters) {
            return [
                bookId,
                chapter + 1,
                titleForBookChapter(book, chapter + 1),
            ];
        } else {
            let nextBook = books[bookId + 1];

            if (nextBook !== "undefined") {
                let nextChapterValue = 0;

                if (nextBook.numChapters > 0) {
                    nextChapterValue = 1;
                }

                return [
                    nextBook.id,
                    nextChapterValue,
                    titleForBookChapter(nextBook, nextChapterValue),
                ];
            }
        }
    }
};

//figure out the name of the previous chapter
const previousChapter = function (bookId, chapter) {
    let book = books[bookId];

    if (book !== "undefined") {
        if (chapter > 1 && chapter <= book.numChapters) {
            return [
                bookId,
                chapter - 1,
                titleForBookChapter(book, chapter - 1),
            ];
        }
        if (
            (chapter === 1 || chapter === "") &&
            chapter <= book.numChapters &&
            FIRST_BOOKS.includes(book.fullName)
        ) {
            return [undefined, undefined, undefined];
        } else {
            let previousBook = books[Number(bookId) - 1];

            if (previousBook !== "undefined") {
                let previousChapterValue = 0;

                if (previousBook.numChapters > 0) {
                    previousChapterValue = previousBook.numChapters;
                }

                return [
                    previousBook.id,
                    previousChapterValue,
                    titleForBookChapter(previousBook, previousChapterValue),
                ];
            }
        }
    }
};

//show the previous and nextbuttons
const showButtons = function (book, chapter) {
    //setting previous and next chapter buttons
    let prevbutton = document.createElement("button");
    let nextbutton = document.createElement("button");

    //setting previous button classes, tooltip, and functions

    let pchaptervalues = previousChapter(book[0].id, chapter);

    if (pchaptervalues[0] !== undefined) {
        prevbutton.innerHTML = `<i class="fa fa-angle-double-left" aria-hidden="true"></i>`;
        prevbutton.className += "col-1 ";
        prevbutton.className += "btn arrow";
        let pvolumetopass = books[pchaptervalues[0]].parentBookId;
        let pbooktopass = pchaptervalues[0];
        let pchaptertopass = pchaptervalues[1];
        prevbutton.title = pchaptervalues[2];
        prevbutton.addEventListener("click", function () {
            window.location.hash = `${pvolumetopass}:${pbooktopass}:${pchaptertopass}`;
            animateToNewContent(ANIMATION_TYPE_SLIDE_LEFT);
        });
        document.getElementById("crumbs").prepend(prevbutton);
    }

    //setting next button classes, tooltip, and functions
    nextbutton.innerHTML = `<i class="fa fa-angle-double-right" aria-hidden="true"></i>`;
    nextbutton.className += "col-1 ";
    nextbutton.className += "btn arrow";
    let nchaptervalues = nextChapter(book[0].id, chapter);
    let nvolumetopass = books[nchaptervalues[0]].parentBookId;
    let nbooktopass = nchaptervalues[0];
    let nchaptertopass = nchaptervalues[1];
    nextbutton.title = nchaptervalues[2];
    nextbutton.addEventListener("click", function () {
        window.location.hash = `${nvolumetopass}:${nbooktopass}:${nchaptertopass}`;
        animateToNewContent(ANIMATION_TYPE_SLIDE_RIGHT);
    });

    document.getElementById("crumbs").append(nextbutton);
};

//figure out the title for a chapter given a book and chapter number
const titleForBookChapter = function (book, chapter) {
    if (book !== "undefined") {
        if (chapter > 0) {
            return `${book.tocName} ${chapter}`;
        }

        return book.tocName;
    }
};

export { showButtons };
