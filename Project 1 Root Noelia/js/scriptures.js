// Author: Noelia Root
// Description Front-end JavaScript code for the Scriptures, Mapped

const Scriptures = (function () {
    "use strict";
    //constants
    const FIRST_BOOKS = [
        "Genesis",
        "The Book of Moses",
        "Title Page",
        "Explanatory Introduction",
    ];
    const INDEX_PLACENAME = 2;
    const INDEX_LATITUDE = 3;
    const INDEX_LONGITUDE = 4;
    const INDEX_FLAG = 11;
    const INDEX_ZOOM = 9;
    const LAT_LONG_PARSER =
        /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\)/;
    //private variables
    let books;
    let listActualMarkers = [];
    let listMarkers = [];
    let volumes;

    //private method declarations
    let addMarker;
    let ajax;
    let ajaxhtml;
    let breadcrumbs;
    let cacheBooks;
    let clearMarkers;
    let indexofMatchingPlace;
    let init;
    let nextChapter;
    let onHashChanged;
    let previousChapter;
    let resetMap;
    let sameLocation;
    let setupMarkers;
    let showBooks;
    let showButtons;
    let showChapters;
    let showText;
    let showVolumes;
    let titleForBookChapter;
    let uniqueGeoPlaces;

    //private methods

    //add a marker to a list
    addMarker = function (matches) {
        let markerImg = {
            url: "../img/newicon.png",
            size: new google.maps.Size(24, 36),
            scaledSize: new google.maps.Size(24, 36),
            labelOrigin: new google.maps.Point(60, 20),
        };
        let placename = matches[INDEX_PLACENAME];
        let latitude = Number(matches[INDEX_LATITUDE]);
        let longitude = Number(matches[INDEX_LONGITUDE]);
        let zoom = Math.round(Number(matches[INDEX_ZOOM]) / 450);
        let flag = matches[INDEX_FLAG];

        if (flag !== "") {
            placename = `${placename} ${flag}`;
        }

        let marker = {
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
            maxZoom: zoom,
            title: placename,
        };

        listMarkers.push(marker);
    };

    //method to get the request of the books and volumes
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

    //make breadcrumbs for every page
    breadcrumbs = function (volume, book, chapter) {
        if (chapter === 0 || !chapter) {
            chapter = "";
        }

        //setting breadcrumbs
        document.getElementById("crumbs").innerHTML = "";
        document.getElementById("crumbs").innerHTML += `<a href='#'">Home</a> `;
        if (volume) {
            document.getElementById(
                "crumbs"
            ).innerHTML += `| <a href="javascript:void(0);" onclick="window.location.hash='${volume.id}'">${volume.fullName} </a>`;
        }
        if (book) {
            document.getElementById(
                "crumbs"
            ).innerHTML += `| <a href="javascript:void(0);" onclick="window.location.hash='${volume.id}:${book[0].id}'">${book[0].fullName} </a>`;
        }
        if (chapter !== "" && chapter !== 0) {
            document.getElementById(
                "crumbs"
            ).innerHTML += `| <a href="javascript:void(0);"> Chapter ${chapter} </a>`;
        }
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
    //clear the markers from the map
    clearMarkers = function () {
        listActualMarkers.forEach((marker) => {
            marker.setMap(null);
        });
        listActualMarkers = [];
    };
    // figure out what is the index of the marker that matches another
    indexofMatchingPlace = function (array, geoplace) {
        let index = -1;
        let i = 0;

        while (i < array.length) {
            if (sameLocation(array[i], geoplace)) {
                index = i;
                break;
            }
            i++;
        }

        return index;
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
    //figure out the name for the next chapter
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
    //what happens when the hash changes
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
            // But if the volume ID is < 1 or > 5, it’s invalid, so navigate to “home”
            if (Number(splitString[0]) < 1 || Number(splitString[0]) > 5) {
                //hash for home screen
                window.location.hash = "";
                return;
            }
            //hash for a volume
            else {
                Scriptures.showBooks(volumes[splitString[0] - 1]);
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
                window.location.hash = "";
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
                window.location.hash = "";
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
    //figure out the name of the previous chapter
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
    //clear the map and center it on Jerusalem
    resetMap = function () {
        map.setCenter({ lat: 31.7683, lng: 35.2137 });
        map.setZoom(8);
        clearMarkers();
    };
    //see if two locations are the same
    sameLocation = function (place1, place2) {
        return (
            Math.abs(place1.position.lat - place2.position.lat) < 0.0000001 &&
            Math.abs(place1.position.lng - place2.position.lng) < 0.0000001
        );
    };
    // grap the a tags for locations and put them into their own objects
    setupMarkers = function () {
        if (listMarkers.length > 0) {
            listMarkers = [];
        }

        document
            .querySelectorAll('a[onclick^="showLocation("]')
            .forEach(function (element) {
                let matches = LAT_LONG_PARSER.exec(
                    element.getAttribute("onclick")
                );

                if (matches) {
                    addMarker(matches);
                }
            });

        uniqueGeoPlaces(listMarkers);
    };
    //show the books for a certain volume
    showBooks = function (volume) {
        const myDiv = document.getElementById("navigator");
        myDiv.innerHTML = "";
        myDiv.style.textAlign = "center";

        breadcrumbs(volume);

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

    //show the previous and nextbuttons
    showButtons = function (book, chapter) {
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
    //show all the chapters for a certain book
    showChapters = function (volume, book) {
        const myDiv = document.getElementById("navigator");
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
        resetMap();
    };
    // show the text for a certain chapter
    showText = function (volume, book, chapter) {
        const myDiv = document.getElementById("navigator");
        myDiv.style.textAlign = "left";
        let text;
        myDiv.innerHTML = "";

        if (chapter === 0) {
            chapter = "";
        }

        breadcrumbs(volume, book, chapter);

        ajaxhtml(
            `https://scriptures.byu.edu/mapscrip/mapgetscrip.php?book=${book[0].id}&chap=${chapter}&verses=`,
            (data) => {
                text = data;
                myDiv.innerHTML = text;
                setupMarkers();
            }
        );

        showButtons(book, chapter);
    };
    // show the standard works volumes
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
    //figure out the title for a chapter given a book and chapter number
    titleForBookChapter = function (book, chapter) {
        if (book !== "undefined") {
            if (chapter > 0) {
                return `${book.tocName} ${chapter}`;
            }

            return book.tocName;
        }
    };
    //create the markers on the map and check to make sure they are unique
    uniqueGeoPlaces = function (geoplaces) {
        const uniquePlaces = [];
        console.log(uniquePlaces.length);
        if (listActualMarkers.length > 0) {
            clearMarkers();
        }
        let bounds = new google.maps.LatLngBounds();

        geoplaces.forEach((geoplace) => {
            let i = indexofMatchingPlace(uniquePlaces, geoplace);
            if (i >= 0) {
                // we have this location, test the name
                if (!uniquePlaces[i].label.text.includes(geoplace.label.text)) {
                    uniquePlaces[i].label.text += `, ${geoplace.label.text}`;
                }
            } else {
                //It is not found, add the the array
                uniquePlaces.push(geoplace);
            }
        });

        uniquePlaces.forEach((marker) => {
            let blah = new google.maps.Marker({
                position: {
                    lat: marker.position.lat,
                    lng: marker.position.lng,
                },
                icon: marker.icon,
                map: map,
                label: {
                    color: "black",
                    fontSize: "1rem",
                    fontWeight: "700",
                    align: "left",
                    text: marker.label.text,
                },
                maxZoom: marker.maxZoom,
                title: marker.title,
            });

            bounds.extend({
                lat: marker.position.lat,
                lng: marker.position.lng,
            });

            listActualMarkers.push(blah);
        });

        if (listActualMarkers.length > 1) {
            map.fitBounds(bounds);
        }

        if (listActualMarkers.length === 1) {
            map.setCenter(listActualMarkers[0].position);
            map.setZoom(listActualMarkers[0].maxZoom + 2);
        }

        if (listActualMarkers.length === 0) {
            map.setCenter({ lat: 31.7683, lng: 35.2137 });
            map.setZoom(8);
        }
    };

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
