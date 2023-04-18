import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import { ChapterContainer, CrumbContainer } from "./Animations";

function Centerhead() {
    return (
        <div id="centerhead">
            <div className="row" style={{ margin: "auto" }}>
                <div className="title col-12">
                    The Scriptures, Mapped <br />
                    <div className="subtitle">Noelia Root</div>
                </div>
            </div>
        </div>
    );
}

function ScripMapContainer() {
    return (
        <div className="scripmapcontainer">
            {
                <>
                    <NavigatorRouter></NavigatorRouter>
                    <MapContainer></MapContainer>
                </>
            }
        </div>
    );
}

function MapContainer(props) {
    const defaultCenter = {
        lat: 31.7683,
        lng: 35.2137,
    };

    return (
        <div id="map">
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: "AIzaSyBrCGvRQgMpGwg0HFQt5oraRowpPVQAjgQ",
                }}
                defaultCenter={defaultCenter}
                defaultZoom={11}
            ></GoogleMapReact>
        </div>
    );
}

function NavigatorRouter() {
    return (
        <div id="navigatorouter">
            <CrumbContainer></CrumbContainer>
            <ChapterContainer></ChapterContainer>
        </div>
    );
}

// function ChapterContainer() {
//     return <div id="chaptercontainer">chapters</div>;
// }

// function Breadcrumbs({ volume, book, chapter }) {
//     const breadcrumbsRef = useRef(null);

//     useEffect(() => {
//         const myDiv = breadcrumbsRef.current;

//         if (chapter === 0 || !chapter) {
//             chapter = "";
//         }

//         // setting breadcrumbs
//         myDiv.innerHTML = "";
//         myDiv.innerHTML += `<a href='#'>Home</a> `;
//         if (volume) {
//             myDiv.innerHTML += `| <a href="#" onClick={() => window.location.hash='${volume.id}'}>${volume.gridName}</a>`;
//         }
//         if (book) {
//             myDiv.innerHTML += `| <a href="#" onClick={() => window.location.hash='${volume.id}:${book[0].id}'}>${book[0].gridName}</a>`;
//         }
//         if (chapter !== "" && chapter !== 0) {
//             myDiv.innerHTML += `| <a href="#" onClick={() => window.location.hash='${volume.id}:${book[0].id}:${chapter}'}>${book[0].subdiv} ${chapter}</a>`;
//         }

//         const bread = myDiv.innerHTML;
//         console.log(bread);
//         animateBreadcrumbs(bread);
//     }, [volume, book, chapter]);

//     return <div className="crumbs bread-offscreen" ref={breadcrumbsRef}></div>;
// }

// animateBreadcrumbs

export { Centerhead, ScripMapContainer };
