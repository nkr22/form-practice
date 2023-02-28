//make breadcrumbs for every page
const breadcrumbs = function (volume, book, chapter) {
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
        ).innerHTML += `| <a href="javascript:void(0);"> ${book[0].subdiv} ${chapter} </a>`;
    }
};

export default breadcrumbs;
