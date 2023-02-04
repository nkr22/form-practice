// Author: Noelia Root
// Description Front-end JavaScript code for the Scriptures, Mapped

const Scriptures = (function () {
    "use strict";
    //constants

    //private variables
    let books;
    let volumes;

    //private method declarations
    let ajax;
    let init;
    let cacheBooks;

    //private methods
    ajax = function (url, successCallback, failureCallback) {
        let request = new XMLHttpRequest();

        request.open("GET", url, true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                let data = JSON.parse(request.responseText);

                if (typeof successCallback === "function") {
                    successCallback(data);
                }
            } else {
                if (typeof failureCallback === "function") {
                    failureCallback(request);
                }
            }
        };
        request.onerror = failureCallback;
        request.send();
    };

    cacheBooks = function (callback) {
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

    init = function (callback) {
        let booksLoaded = false;
        let volumesLoaded = false;

        ajax("https://scriptures.byu.edu/mapscrip/model/books.php", (data) => {
            books = data;
            console.log(books);
            booksLoaded = true;

            if (volumesLoaded) {
                cacheBooks(callback);
            }
        });
        ajax(
            "https://scriptures.byu.edu/mapscrip/model/volumes.php",
            (data) => {
                volumes = data;
                volumesLoaded = true;
                console.log(volumes);

                if (booksLoaded) {
                    cacheBooks(callback);
                }
            }
        );
    };

    //public API
    return {
        init: init,
    };
})();

//console test
//Scriptures.init(() => { console.log("initilized"); });
