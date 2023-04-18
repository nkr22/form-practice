import React from "react";
import "./App.css";
import { Header } from "./Header";
import { NavigationPanel } from "./NavigationPanel";

// function ListItem({ value }) {
//     return <li>{value}</li>;
// }

// function NumberList(props) {
//     const numbers = props.numbers;
//     const listItems = numbers.map((number) => (
//         <ListItem value={number} key={number.toString()} />
//     ));
//     return <ul>{listItems}</ul>;
// }

// const numbers = [1, 2, 3, 4, 5];

function App() {
    return (
        <div id="app">
            {/* <NumberList numbers={numbers} />
            <NumberList numbers={numbers} /> */}
            <Header />
            <NavigationPanel />
            <div id="map">This is the map</div>
        </div>
    );
}

export default App;
