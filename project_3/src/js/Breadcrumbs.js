import { useEffect, useRef } from "react";
// import { animateBreadcrumbs } from "./Animations.js";

function Breadcrumbs({ volume, book, chapter }) {
    const breadcrumbsRef = useRef(null);

    useEffect(() => {
        const myDiv = breadcrumbsRef.current;

        if (chapter === 0 || !chapter) {
            chapter = "";
        }

        // setting breadcrumbs
        myDiv.innerHTML = "";
        myDiv.innerHTML += `<a href='#'>Home</a> `;
        if (volume) {
            myDiv.innerHTML += `| <a href="#" onClick={() => window.location.hash='${volume.id}'}>${volume.gridName}</a>`;
        }
        if (book) {
            myDiv.innerHTML += `| <a href="#" onClick={() => window.location.hash='${volume.id}:${book[0].id}'}>${book[0].gridName}</a>`;
        }
        if (chapter !== "" && chapter !== 0) {
            myDiv.innerHTML += `| <a href="#" onClick={() => window.location.hash='${volume.id}:${book[0].id}:${chapter}'}>${book[0].subdiv} ${chapter}</a>`;
        }

        const bread = myDiv.innerHTML;
        console.log(bread);
        animateBreadcrumbs(bread);
    }, [volume, book, chapter]);

    return <div className="crumbs bread-offscreen" ref={breadcrumbsRef}></div>;
}

export default Breadcrumbs;
