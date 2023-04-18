//import { a } from "react-router-dom";
import "./Header.css";

export default function Header() {
    return (
        <nav id="nav-container">
            <ul id="nav-list">
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="#/about">About</a>
                </li>
                <li>
                    <a href="#/addContact">Add Contact</a>
                </li>
                <li>
                    <a href="#/contactList">Contact List</a>
                </li>
            </ul>
        </nav>
    );
}
