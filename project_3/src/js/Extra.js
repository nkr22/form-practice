import React, { useEffect } from "react";
import Scriptures from "./js/Scriptures";

const Map = () => {
    let map;

    useEffect(() => {
        const jeru = { lat: 31.7683, lng: 35.2137 };
        map = new window.google.maps.Map(document.getElementById("map"), {
            center: jeru,
            zoom: 8,
        });

        // Initialize Scriptures module
        Scriptures.init(() => {
            Scriptures.onHashChanged();
        });

        // Set showLocation function to window object
        window.showLocation = Scriptures.showLocation;

        // Define showLocation function
        showLocation = (
            geotagId,
            placename,
            latitude,
            longitude,
            viewLatitude,
            viewLongitude,
            viewTilt,
            viewRoll,
            viewAltitude,
            viewHeading
        ) => {
            map.setCenter({ lat: latitude, lng: longitude });
            map.setZoom(Math.round(viewAltitude / 450));
        };

        // Add event listener for hashchange
        window.addEventListener("hashchange", Scriptures.onHashChanged);

        return () => {
            window.removeEventListener("hashchange", Scriptures.onHashChanged);
        };
    }, []);

    return <div id="map"></div>;
};

export default Map;
