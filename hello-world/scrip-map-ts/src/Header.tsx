import React from "react";

function Breadcrumbs() {
    return <div id="crumbs"></div>;
}

function Title() {
    return (
        <div id="centerhead">
            <div className="title">The Scriptures, Mapped</div>
            <div className="subtitle">By Stephen W. Liddle</div>
        </div>
    );
}

function Header() {
    return (
        <header id="header">
            <Breadcrumbs />
            <Title />
        </header>
    );
}

export { Header };
