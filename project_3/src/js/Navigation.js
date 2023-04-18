import { resetMap } from "./MapApi.js";
import { showText } from "./GetScriptures.js";
import { volumes } from "./GetScriptures.js";
import Breadcrumbs from "./Breadcrumbs.js";
import { animateToNewContent } from "./Animations.js";
import { useState, useEffect } from "react";

const App = () => {
    const [hash, setHash] = useState(window.location.hash);

    useEffect(() => {
        window.addEventListener("hashchange", () => {
            setHash(window.location.hash);
        });
    }, []);

    const showVolumes = () => {
        // Show volumes implementation
    };

    const showBooks = (volume) => {
        // Show books implementation
    };

    const showChapters = (volume, book) => {
        // Show chapters implementation
    };

    const onHashChanged = () => {
        let string;
        let splitString;

        if (typeof hash === "string" && hash === "") {
            // Navigate to home
            showVolumes();
            return;
        } else {
            string = hash;
            splitString = string.slice(1).split(":");
        }

        if (splitString.length === 1) {
            if (Number(splitString[0]) < 1 || Number(splitString[0]) > 5) {
                showVolumes();
                return;
            } else {
                showBooks(volumes[splitString[0] - 1]);
                return;
            }
        }

        if (splitString.length === 2) {
            if (
                Number(splitString[1]) <
                    Number(volumes[splitString[0] - 1].minBookId) ||
                Number(splitString[1]) >
                    Number(volumes[splitString[0] - 1].maxBookId)
            ) {
                showVolumes();
                return;
            }
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
};

export { onHashChanged };
