// Author: Noelia Root
// Description Front-end JavaScript code for the Scriptures, Mapped

const Scriptures = (function () {
    "use strict";
    //constants
    const INDEX_PLACENAME = 2;
    const INDEX_LATITUDE = 3;
    const INDEX_LONGITUDE = 4;
    const INDEX_FLAG = 11;
    const LAT_LONG_PARSER =
        /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\)/;

    //private variables
    let books;
    let listMarkers = [];
    let volumes;

    //private method declarations
    let addMarker;
    let ajax;
    let ajaxhtml;
    let cacheBooks;
    let clearMarkers;
    let init;
    let nextChapter;
    let onHashChanged;
    let previousChapter;
    let resetMap;
    let setupMarkers;
    let showBooks;
    let showChapters;
    let showText;
    let showVolumes;
    let titleForBookChapter;

    //private methods

    //method to get the request of the books and volumes
    // addMarker = function (locName, latitude, longitude) {
    //     let marker = new google.maps.Marker({
    //         position: { lat: Number(latitude), lng: Number(longitude) },
    //         map: map,
    //         label: locName,
    //     });

    //     listMarkers.push(marker);
    // };

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

    //get html to display the text for the chapters
    ajaxhtml = function (url, successCallback, failureCallback) {
        let request = new XMLHttpRequest();

        request.open("GET", url, true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                let data = request.responseText;

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

    // create the variables in the cache
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

    clearMarkers = function () {
        listMarkers.forEach(function (marker) {
            marker.setMap(null);
        });

        listMarkers = [];
    };

    //intialize all the variables to be able to access volumes and books later
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

    nextChapter = function (bookId, chapter) {
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

    onHashChanged = function () {
        let string;
        let splitString;

        // Check the hash to see if it’s empty; if so, navigate to the “home” state
        if (
            typeof window.location.hash === "string" &&
            window.location.hash === ""
        ) {
            //hash for home screen
            Scriptures.showVolumes();
            return;
        }
        // Trim the leading “#” and then split the hash based on colons (“:”)
        else {
            string = window.location.hash;
            splitString = string.slice(1).split(":");
        }
        // If we have one ID, it’s a volume, so navigate to that volume
        if (splitString.length === 1) {
            //hash for a volume
            Scriptures.showBooks(volumes[splitString[0] - 1]);
            return;
        }
        // But if the volume ID is < 1 or > 5, it’s invalid, so navigate to “home”
        if (Number(splitString[0]) < 1 || Number(splitString[0]) > 5) {
            //hash for home screen
            Scriptures.showVolumes();
            return;
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
                Scriptures.showVolumes();
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
                    ""
                );
                return;
            } else {
                Scriptures.showChapters(
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
                Scriptures.showVolumes();
                return;
            }
            if (
                Number(splitString[2]) === 0 ||
                Number(splitString[2]) === "undefined"
            ) {
                showText(
                    volumes[splitString[0] - 1],
                    volumes[splitString[0] - 1].books.filter(function (book) {
                        return Number(book.id) === Number(splitString[1]);
                    }),
                    0
                );
                return;
            } else {
                Scriptures.showText(
                    volumes[splitString[0] - 1],
                    passbook,
                    Number(splitString[2])
                );
                return;
            }
        }
        // If invalid, navigate “home”
    };

    previousChapter = function (bookId, chapter) {
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
                (chapter === 1 &&
                    (chapter <= book.numChapters) &
                        (book.fullName === "Genesis")) ||
                book.fullName === "The Book of Moses" ||
                book.fullName === "Title Page" ||
                book.fullName === "Explanatory Introduction"
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

    resetMap = function () {
        map.setCenter({ lat: 31.7683, lng: 35.2137 });
        map.setZoom(8);
        clearMarkers();
    };

    setupMarkers = function () {
        let markerImg = {
            url: "../img/newicon.png",
            size: new google.maps.Size(24, 36),
            scaledSize: new google.maps.Size(24, 36),
            labelOrigin: new google.maps.Point(60, 20),
        };

        let bounds = new google.maps.LatLngBounds();

        if (listMarkers.length > 0) {
            clearMarkers();
        }

        document
            .querySelectorAll('a[onclick^="showLocation("]')
            .forEach(function (element) {
                let matches = LAT_LONG_PARSER.exec(
                    element.getAttribute("onclick")
                );

                if (matches) {
                    let placename = matches[INDEX_PLACENAME];
                    let latitude = Number(matches[INDEX_LATITUDE]);
                    let longitude = Number(matches[INDEX_LONGITUDE]);
                    let flag = matches[INDEX_FLAG];

                    if (flag !== "") {
                        placename = `${placename} ${flag}`;
                    }

                    let marker = new google.maps.Marker({
                        position: {
                            lat: latitude,
                            lng: longitude,
                        },
                        icon: markerImg,
                        map: map,
                        label: {
                            color: "black",
                            fontSize: "1rem",
                            fontWeight: "500",
                            text: placename,
                        },
                        maxZoom: 8,
                        title: placename,
                    });

                    listMarkers.push(marker);

                    bounds.extend(marker.getPosition());
                }
            });

        let duplicateMarkers = [];

        for (let i = 0; i < listMarkers.length; i++) {
            for (let j = i + 1; j < listMarkers.length; j++) {
                if (
                    listMarkers[i].lat === listMarkers[j].lat &&
                    listMarkers[i].lng === listMarkers[j].lng
                ) {
                    duplicateMarkers.push(listMarkers[j]);
                    console.log("this is the list before popping");
                    console.log(listMarkers);
                    listMarkers.splice(j, 1);
                    console.log("this is the list after popping");
                    console.log(listMarkers);
                }
            }
        }
        console.log("this is the duplicate");
        console.log(duplicateMarkers);

        //what to do if only one
        //what to do if there is none
        if (listMarkers.length > 1) {
            map.fitBounds(bounds);
        }

        if (listMarkers.length === 1) {
            map.setCenter(listMarkers[0].getPosition());
            map.setZoom(12);
        }

        if (listMarkers.length === 0) {
            map.setCenter({ lat: 31.7683, lng: 35.2137 });
            map.setZoom(8);
        }
    };

    showBooks = function (volume) {
        const myDiv = document.getElementById("navigator");
        myDiv.innerHTML = "";
        myDiv.style.textAlign = "center";

        //creating crumbs to navigate backwards
        document.getElementById("crumbs").innerHTML = "";
        document.getElementById("crumbs").innerHTML += `<a href='#'">Home</a> `;
        document.getElementById(
            "crumbs"
        ).innerHTML += `| <a href="javascript:void(0);">${volume.fullName} </a>`;

        let vbooks = volume.books;
        vbooks.forEach(function (vbook) {
            // creating button element
            let button = document.createElement("button");

            // appending text to button
            button.innerHTML = vbook.fullName;

            button.className += "col-4 ";
            button.className += "btn btn-primary";
            button.addEventListener("click", function () {
                window.location.hash += ":" + vbook.id;
            });

            // appending button to div
            myDiv.appendChild(button);
        });
        resetMap();
    };

    showChapters = function (volume, book) {
        const myDiv = document.getElementById("navigator");
        myDiv.innerHTML = "";
        myDiv.style.textAlign = "center";

        //creating crumbs to navigate backwards
        document.getElementById("crumbs").innerHTML = "";
        document.getElementById("crumbs").innerHTML += `<a href='#'">Home</a> `;
        document.getElementById(
            "crumbs"
        ).innerHTML += `| <a href="javascript:void(0);" onclick="window.location.hash='${volume.id}'">${volume.fullName} </a>`;
        document.getElementById(
            "crumbs"
        ).innerHTML += `| <a href="javascript:void(0);">${book[0].fullName} </a>`;

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
        resetMap();
    };

    showText = function (volume, book, chapter) {
        const myDiv = document.getElementById("navigator");
        myDiv.style.textAlign = "left";
        let text;
        myDiv.innerHTML = "";

        if (chapter === 0) {
            chapter = "";
        }

        //setting breadcrumbs
        document.getElementById("crumbs").innerHTML = "";
        document.getElementById("crumbs").innerHTML += `<a href='#'">Home</a> `;
        document.getElementById(
            "crumbs"
        ).innerHTML += `| <a href="javascript:void(0);" onclick="window.location.hash='${volume.id}'">${volume.fullName} </a>`;
        document.getElementById(
            "crumbs"
        ).innerHTML += `| <a href="javascript:void(0);" onclick="window.location.hash='${volume.id}:${book[0].id}'">${book[0].fullName} </a>`;
        if (chapter !== "" && chapter !== 0) {
            document.getElementById(
                "crumbs"
            ).innerHTML += `| <a href="javascript:void(0);"> Chapter ${chapter} </a>`;
        }
        ajaxhtml(
            `https://scriptures.byu.edu/mapscrip/mapgetscrip.php?book=${book[0].id}&chap=${chapter}&verses=`,
            (data) => {
                text = data;
                myDiv.innerHTML = text;
                setupMarkers();
            }
        );

        //setting previous and next chapter buttons
        let prevbutton = document.createElement("button");
        let nextbutton = document.createElement("button");

        //setting previous button classes, tooltip, and functions

        let pchaptervalues = previousChapter(book[0].id, chapter);

        if (pchaptervalues[0] !== undefined) {
            prevbutton.innerHTML = `<<`;
            prevbutton.className += "col-1 ";
            prevbutton.className += "btn arrow";
            let pvolumetopass = books[pchaptervalues[0]].parentBookId;
            let pbooktopass = pchaptervalues[0];
            let pchaptertopass = pchaptervalues[1];
            prevbutton.title = pchaptervalues[2];
            prevbutton.addEventListener("click", function () {
                window.location.hash = `${pvolumetopass}:${pbooktopass}:${pchaptertopass}`;
            });
            document.getElementById("crumbs").prepend(prevbutton);
        }

        //setting next button classes, tooltip, and functions
        nextbutton.innerHTML = `>>`;
        nextbutton.className += "col-1 ";
        nextbutton.className += "btn arrow";
        let nchaptervalues = nextChapter(book[0].id, chapter);
        let nvolumetopass = books[nchaptervalues[0]].parentBookId;
        let nbooktopass = nchaptervalues[0];
        let nchaptertopass = nchaptervalues[1];
        nextbutton.title = nchaptervalues[2];
        nextbutton.addEventListener("click", function () {
            window.location.hash = `${nvolumetopass}:${nbooktopass}:${nchaptertopass}`;
        });

        document.getElementById("crumbs").append(nextbutton);
    };

    showVolumes = function () {
        const myDiv = document.getElementById("navigator");

        //resetting the breadcrumbs and the scriptures tag`
        document.getElementById("crumbs").innerHTML = "";
        myDiv.innerHTML = "";
        myDiv.style.textAlign = "center";

        volumes.forEach(function (volume) {
            // creating button element
            let button = document.createElement("button");

            // creating text to be
            //displayed on button
            let text = document.createTextNode(volume.fullName);

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
        resetMap();
    };

    titleForBookChapter = function (book, chapter) {
        if (book !== "undefined") {
            if (chapter > 0) {
                return `${book.tocName} ${chapter}`;
            }

            return book.tocName;
        }
    };

    //for geocoding
    //document.querySelectorAll("a[onclick^=showLocation]")
    //iterate through all the markers to find maximum latitude and longitude
    //make a box
    //dont have any duplicates for location
    //if they are the same location, have it be the same point, but just a ", name" be added to the label

    //public API
    return {
        init: init,
        onHashChanged: onHashChanged,
        showVolumes: showVolumes,
        showBooks: showBooks,
        showChapters: showChapters,
        showText: showText,
        nextChapter: nextChapter,
    };
})();
