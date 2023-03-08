//import breadcrumbs

import { animateBreadcrumbs } from "./Animations.js";

let bread;

//make breadcrumbs for every page
const breadcrumbs = function (volume, book, chapter) {
    const myDiv =
        document.querySelector(".crumbs.bread-offscreen") ||
        document.querySelector("#crumbs1");

    if (chapter === 0 || !chapter) {
        chapter = "";
    }

    //setting breadcrumbs
    myDiv.innerHTML = "";
    myDiv.innerHTML += `<a href='#'">Home</a> `;
    if (volume) {
        myDiv.innerHTML += `| <a href="javascript:void(0);" onclick="window.location.hash='${volume.id}'">${volume.gridName} </a>`;
    }
    if (book) {
        myDiv.innerHTML += `| <a href="javascript:void(0);" onclick="window.location.hash='${volume.id}:${book[0].id}'">${book[0].gridName} </a>`;
    }
    if (chapter !== "" && chapter !== 0) {
        myDiv.innerHTML += `| <a href="javascript:void(0);"> ${book[0].subdiv} ${chapter}</a>`;
    }

    bread = myDiv.innerHTML;
    console.log(bread);
    animateBreadcrumbs(bread);
};

export default breadcrumbs;
