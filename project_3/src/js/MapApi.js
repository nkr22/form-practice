import React, { useState, useEffect } from "react";

const INDEX_PLACENAME = 2;
const INDEX_LATITUDE = 3;
const INDEX_LONGITUDE = 4;
const INDEX_FLAG = 11;
const INDEX_ZOOM = 9;
const LAT_LONG_PARSER =
    /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\)/;

const Map = () => {
    const [listActualMarkers, setListActualMarkers] = useState([]);
    const [listMarkers, setListMarkers] = useState([]);

    const addMarker = (matches) => {
        const markerImg = {
            url: "../img/newicon.png",
            size: new window.google.maps.Size(24, 36),
            scaledSize: new window.google.maps.Size(24, 36),
            labelOrigin: new window.google.maps.Point(70, 20),
        };
        let placename = matches[INDEX_PLACENAME];
        const latitude = Number(matches[INDEX_LATITUDE]);
        const longitude = Number(matches[INDEX_LONGITUDE]);
        const zoom = Math.round(Number(matches[INDEX_ZOOM]) / 450);
        const flag = matches[INDEX_FLAG];

        if (flag !== "") {
            placename = `${placename} ${flag}`;
        }

        const marker = {
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

        setListMarkers((prevState) => [...prevState, marker]);
    };

    const clearMarkers = () => {
        listActualMarkers.forEach((marker) => {
            marker.setMap(null);
        });
        setListActualMarkers([]);
    };

    const indexofMatchingPlace = (array, geoplace) => {
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

    const resetMap = () => {
        map.setCenter({ lat: 31.7683, lng: 35.2137 });
        map.setZoom(8);
        clearMarkers();
    };

    const sameLocation = (place1, place2) => {
        return (
            Math.abs(place1.position.lat - place2.position.lat) < 0.0000001 &&
            Math.abs(place1.position.lng - place2.position.lng) < 0.0000001
        );
    };

    const setupMarkers = () => {
        if (listMarkers.length > 0) {
            setListMarkers([]);
        }
        const divtoquery = document.querySelector(".onscreen");
        divtoquery
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

    const uniqueGeoPlaces = (geoplaces) => {
        const uniquePlaces = [];
        if (listActualMarkers.length > 0) {
            clearMarkers();
        }
        let bounds = new window.google.maps.LatLngBounds();

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
};

export default Map;
