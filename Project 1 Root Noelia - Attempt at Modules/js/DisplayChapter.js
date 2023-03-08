//constants

// Private variables

//imports

import { books } from "./GetScriptures.js";

// Helper methods

//calculate the next and previous chapter content to change styles

//figure out the name for the next chapter
const nextChapter = function (bookId, chapter) {
    let book = books[bookId];
    console.log(book);
    if (book !== undefined) {
        if (chapter < book.numChapters) {
            return [
                bookId,
                chapter + 1,
                titleForBookChapter(book, chapter + 1),
            ];
        } else {
            let nextBook = books[bookId + 1];
            console.log(nextBook);
            if (nextBook !== undefined) {
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

    if (book !== undefined) {
        if (chapter > 1 && chapter <= book.numChapters) {
            return [
                bookId,
                chapter - 1,
                titleForBookChapter(book, chapter - 1),
            ];
        } else {
            let previousBook = books[Number(bookId) - 1];

            if (previousBook !== undefined) {
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
    const divtoadd =
        document.querySelector(".crumbs.bread-onscreen") ||
        document.querySelector("#crumbs1");
    //setting previous and next chapter buttons
    let prevbutton = document.createElement("button");
    let nextbutton = document.createElement("button");

    //setting previous button classes, tooltip, and functions

    let pchaptervalues = previousChapter(book[0].id, chapter);

    if (pchaptervalues !== undefined) {
        prevbutton.innerHTML = `<i class="fa fa-angle-double-left" aria-hidden="true"></i>`;
        prevbutton.className += "btn arrow";
        let pvolumetopass = books[pchaptervalues[0]].parentBookId;
        let pbooktopass = pchaptervalues[0];
        let pchaptertopass = pchaptervalues[1];
        prevbutton.title = pchaptervalues[2];
        prevbutton.addEventListener("click", function () {
            window.location.hash = `${pvolumetopass}:${pbooktopass}:${pchaptertopass}:left`;
        });
        divtoadd.prepend(prevbutton);
    }

    //setting next button classes, tooltip, and functions
    let nchaptervalues = nextChapter(book[0].id, chapter);

    if (nchaptervalues !== undefined) {
        nextbutton.innerHTML = `<i class="fa fa-angle-double-right" aria-hidden="true"></i>`;
        nextbutton.className += "btn arrow";

        let nvolumetopass = books[nchaptervalues[0]].parentBookId;
        let nbooktopass = nchaptervalues[0];
        let nchaptertopass = nchaptervalues[1];
        nextbutton.title = nchaptervalues[2];
        nextbutton.addEventListener("click", function () {
            window.location.hash = `${nvolumetopass}:${nbooktopass}:${nchaptertopass}:right`;
        });

        divtoadd.append(nextbutton);
    }
};

//figure out the title for a chapter given a book and chapter number
const titleForBookChapter = function (book, chapter) {
    if (book !== undefined) {
        if (chapter > 0) {
            return `${book.tocName} ${chapter}`;
        }

        return book.tocName;
    }
};

export { showButtons };
