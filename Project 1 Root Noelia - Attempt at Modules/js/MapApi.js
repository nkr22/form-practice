//constants
const INDEX_PLACENAME = 2;
const INDEX_LATITUDE = 3;
const INDEX_LONGITUDE = 4;
const INDEX_FLAG = 11;
const INDEX_ZOOM = 9;
const LAT_LONG_PARSER =
    /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\)/;

//variables
let listActualMarkers = [];
let listMarkers = [];

//add a marker to a list
const addMarker = function (matches) {
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

const clearMarkers = function () {
    listActualMarkers.forEach((marker) => {
        marker.setMap(null);
    });
    listActualMarkers = [];
};
// figure out what is the index of the marker that matches another
const indexofMatchingPlace = function (array, geoplace) {
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

//clear the map and center it on Jerusalem
const resetMap = function () {
    map.setCenter({ lat: 31.7683, lng: 35.2137 });
    map.setZoom(8);
    clearMarkers();
};
//see if two locations are the same
const sameLocation = function (place1, place2) {
    return (
        Math.abs(place1.position.lat - place2.position.lat) < 0.0000001 &&
        Math.abs(place1.position.lng - place2.position.lng) < 0.0000001
    );
};
// grap the a tags for locations and put them into their own objects
const setupMarkers = function () {
    if (listMarkers.length > 0) {
        listMarkers = [];
    }

    document
        .querySelectorAll('a[onclick^="showLocation("]')
        .forEach(function (element) {
            let matches = LAT_LONG_PARSER.exec(element.getAttribute("onclick"));

            if (matches) {
                addMarker(matches);
            }
        });

    uniqueGeoPlaces(listMarkers);
};

//create the markers on the map and check to make sure they are unique
const uniqueGeoPlaces = function (geoplaces) {
    const uniquePlaces = [];
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

/*------------------------------------------------------------------------
 *                      EXPORTS
 */
export { setupMarkers, resetMap };
