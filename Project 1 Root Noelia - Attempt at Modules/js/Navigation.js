//imports
import { resetMap } from "./MapApi.js";
import { showText } from "./GetScriptures.js";
import { volumes } from "./GetScriptures.js";
import breadcrumbs from "./Breadcrumbs.js";
import { animateToNewContent } from "./Animations.js";

//what happens when the hash changes
const onHashChanged = function () {
    let string;
    let splitString;

    // Check the hash to see if it’s empty; if so, navigate to the “home” state
    if (
        typeof window.location.hash === "string" &&
        window.location.hash === ""
    ) {
        //hash for home screen
        showVolumes();

        return;
    }
    // Trim the leading “#” and then split the hash based on colons (“:”)
    else {
        string = window.location.hash;
        splitString = string.slice(1).split(":");
    }
    // If we have one ID, it’s a volume, so navigate to that volume
    if (splitString.length === 1) {
        // But if the volume ID is < 1 or > 5, it’s invalid, so navigate to “home”
        if (Number(splitString[0]) < 1 || Number(splitString[0]) > 5) {
            //hash for home screen
            showVolumes();
            return;
        }
        //hash for a volume
        else {
            showBooks(volumes[splitString[0] - 1]);

            return;
        }
    }

    if (splitString.length === 2) {
        //navigate to book

        // But if the volume or book ID is invalid, navigate “home”
        if (
            Number(splitString[1]) <
                Number(volumes[splitString[0] - 1].minBookId) ||
            Number(splitString[1]) >
                Number(volumes[splitString[0] - 1].maxBookId)
        ) {
            // window.location.hash = "";
            showVolumes();
            return;
        }
        // If we have two ID’s, it’s a volume and book, so navigate to that book’s list
        // If the book doesn’t have chapters, navigate to its content directly
        if (
            volumes[splitString[0] - 1].books.filter(function (book) {
                return Number(book.id) === Number(splitString[1]);
            })[0].numChapters === 0
        ) {
            showText(
                volumes[splitString[0] - 1],
                volumes[splitString[0] - 1].books.filter(function (book) {
                    return Number(book.id) === Number(splitString[1]);
                }),
                "",
                "crossfade"
            );

            return;
        } else {
            showChapters(
                volumes[splitString[0] - 1],
                volumes[splitString[0] - 1].books.filter(function (book) {
                    return Number(book.id) === Number(splitString[1]);
                })
            );
        }
        return;
    }

    // If we have three ID’s, its volume, book, chapter, so navigate there if valid
    if (splitString.length === 3) {
        //the value I am passing as the book in showText
        let passbook = volumes[splitString[0] - 1].books.filter(function (
            book
        ) {
            return Number(book.id) === Number(splitString[1]);
        });

        //check to see if chapter number is valid
        if (
            Number(splitString[2]) > Number(passbook[0].numChapters) ||
            Number(splitString[2]) < 0
        ) {
            // window.location.hash = "";
            showVolumes();
            return;
        }
        if (
            Number(splitString[2]) === 0 ||
            Number(splitString[2]) === undefined
        ) {
            showText(
                volumes[splitString[0] - 1],
                volumes[splitString[0] - 1].books.filter(function (book) {
                    return Number(book.id) === Number(splitString[1]);
                }),
                0,
                "crossfade"
            );

            return;
        } else {
            showText(
                volumes[splitString[0] - 1],
                passbook,
                Number(splitString[2]),
                "crossfade"
            );

            return;
        }
    }
    if (splitString.length === 4) {
        let passbook = volumes[splitString[0] - 1].books.filter(function (
            book
        ) {
            return Number(book.id) === Number(splitString[1]);
        });
        if (splitString[3] === "left") {
            showText(
                volumes[splitString[0] - 1],
                passbook,
                Number(splitString[2]),
                "slideleft"
            );

            return;
        }
        if (splitString[3] === "right") {
            showText(
                volumes[splitString[0] - 1],
                passbook,
                Number(splitString[2]),
                "slideright"
            );

            return;
        } else {
            // window.location.hash = "";
            showVolumes();
        }
    }
    // If invalid, navigate “home”
};
//show the books for a certain volume
const showBooks = function (volume) {
    const myDiv =
        document.querySelector(".chapter.crossfade-offscreen") ||
        document.querySelector(".chapter.slideleft-offscreen") ||
        document.querySelector(".chapter.slideright-offscreen") ||
        document.querySelector(".chapter");
    myDiv.innerHTML = "";
    myDiv.style.textAlign = "center";

    breadcrumbs(volume);

    let vbooks = volume.books;
    vbooks.forEach(function (vbook) {
        // creating button element
        let button = document.createElement("button");

        // appending text to button
        button.innerHTML = vbook.gridName;
        button.title = vbook.fullName;
        button.className += "col-4 ";
        button.className += "btn btn-primary";
        button.addEventListener("click", function () {
            window.location.hash += ":" + vbook.id;
        });

        // appending button to div
        myDiv.appendChild(button);
    });
    animateToNewContent("crossfade");
    document.querySelector("#chaptercontainer").scrollTop = 0;
    resetMap();
};

//show all the chapters for a certain book
const showChapters = function (volume, book) {
    const myDiv =
        document.querySelector(".chapter.crossfade-offscreen") ||
        document.querySelector(".chapter.slideleft-offscreen") ||
        document.querySelector(".chapter.slideright-offscreen") ||
        document.querySelector(".chapter");
    myDiv.innerHTML = "";
    myDiv.style.textAlign = "center";

    breadcrumbs(volume, book);

    let bchapters = book[0]["numChapters"];
    for (let i = 1; i <= bchapters; i = i + 1) {
        // creating button element
        let button = document.createElement("button");

        // creating text to be
        //displayed on button
        let text = document.createTextNode(i);

        // appending text to button
        button.appendChild(text);
        button.className += "col-2 ";
        button.className += "btn btn-primary";
        button.addEventListener("click", function () {
            window.location.hash += ":" + i;
        });

        // appending button to div
        myDiv.appendChild(button);
    }
    animateToNewContent("crossfade");
    document.querySelector("#chaptercontainer").scrollTop = 0;
    resetMap();
};

// show the standard works volumes
const showVolumes = function () {
    const myDiv =
        document.querySelector(".chapter.crossfade-offscreen") ||
        document.querySelector(".chapter.slideleft-offscreen") ||
        document.querySelector(".chapter.slideright-offscreen") ||
        document.querySelector(".chapter");

    //resetting the breadcrumbs and the scriptures tag`
    document.querySelector(".crumbs").innerHTML = "";
    myDiv.innerHTML = "";
    myDiv.style.textAlign = "center";

    breadcrumbs();

    volumes.forEach(function (volume) {
        // creating button element
        let button = document.createElement("button");

        // creating text to be
        //displayed on button
        let text = document.createTextNode(volume.gridName);
        button.title = volume.fullName;
        // appending text to button
        button.appendChild(text);
        button.className += "col-5 ";
        button.className += "btn btn-primary";
        button.addEventListener("click", function () {
            window.location.hash = volume.id;
        });

        // appending button to div
        myDiv.appendChild(button);
    });
    animateToNewContent("crossfade");
    document.querySelector("#chaptercontainer").scrollTop = 0;
    resetMap();
};

export { onHashChanged };
