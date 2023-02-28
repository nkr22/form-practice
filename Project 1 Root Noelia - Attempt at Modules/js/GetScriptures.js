//imports
import { setupMarkers } from "./MapApi.js";
import breadcrumbs from "./Breadcrumbs.js";
import { showButtons } from "./DisplayChapter.js";

//variables
let books;
let volumes;
let text;

//method to get the request of the books and volumes
const ajax = function (url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    reject(
                        new Error(
                            "Request failed with status code: " +
                                response.status
                        )
                    );
                }
            })
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

//get html to display the text for the chapters
const ajaxhtml = function (url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    reject(
                        new Error(
                            "Request failed with status code: " +
                                response.status
                        )
                    );
                }
            })
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
// create the variables in the cache
const cacheBooks = function (callback) {
    volumes.forEach((volume) => {
        let volumeBooks = [];
        let bookId = volume.minBookId;

        while (bookId <= volume.maxBookId) {
            volumeBooks.push(books[bookId]);
            bookId += 1;
        }
        volume.books = volumeBooks;
    });

    if (typeof callback === "function") {
        callback();
    }
};
//clear the markers from the map

//intialize all the variables to be able to access volumes and books later
const init = function (callback) {
    const promise1 = ajax(
        "https://scriptures.byu.edu/mapscrip/model/volumes.php"
    ).then(function (result) {
        volumes = result;
    });
    const promise2 = ajax(
        "https://scriptures.byu.edu/mapscrip/model/books.php"
    ).then(function (result) {
        books = result;
    });
    Promise.all([promise1, promise2]).then(function () {
        cacheBooks(callback);
    });
};
// show the text for a certain chapter
const showText = function (volume, book, chapter) {
    const myDiv = document.querySelector(".chapter.onscreen");
    myDiv.style.textAlign = "left";
    myDiv.innerHTML = "";

    if (chapter === 0) {
        chapter = "";
    }

    breadcrumbs(volume, book, chapter);

    ajaxhtml(
        `https://scriptures.byu.edu/mapscrip/mapgetscrip.php?book=${book[0].id}&chap=${chapter}&verses=`
    ).then(function (response) {
        text = response;
        myDiv.innerHTML = text;

        setupMarkers();
    });

    showButtons(book, chapter);
};

export { init, books, volumes, showText, text };