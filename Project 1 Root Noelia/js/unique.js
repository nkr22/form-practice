function sameLocation(place1, place2) {
    return (
        Math.abs(place1.latitude - place2.latitude) < 0.0000001 &&
        Math.abs(place1.longitude - place2.longitude) < 0.0000001
    );
}

function indexofMatchingPlace(array, geoplace) {
    let index = -1;
    let i = 0;

    while (i < array.length) {
        if (sameLocation(array[i], geoplace)) {
            index = 1;
            break;
        }
        i++;
    }

    return index;
}

function uniqueGeoPlaces(geoplaces) {
    const uniquePlaces = [];

    geoplaces.forEach((geoplace) => {
        let i = indexofMatchingPlace(uniquePlaces, geoplace);
        if (i >= 0) {
            // we have this location, test the name
            if (!uniquePlaces[i].name.includes(geoplace.name)) {
                uniquePlaces[i].name += `, ${geoplace.name}`;
            }
        } else {
            //It is not found, add the the array
            uniquePlaces.push(geoplace);
        }
    });
}
