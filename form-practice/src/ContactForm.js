import { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./ContactForm.css";
import { ContactContext } from "./ContactData";
import { useNavigate } from "react-router-dom";

export default function ContactForm() {
    const { addContact } = useContext(ContactContext);
    const navigate = useNavigate();

    const formRef = useRef(null);
    const [title, setTitle] = useState("Mr.");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [favorite, setFavorite] = useState(false);

    //remember EVENT!!!
    const handleSubmit = (event) => {
        event.preventDefault();
        // create new contact object
        const newContact = {
            id: uuidv4(),
            title,
            firstName,
            lastName,
            address,
            city,
            state,
            zip,
            email,
            phone,
            favorite,
        };

        // append new contact to existing contacts
        addContact(newContact);

        // reset the form fields
        formRef.current.reset();
        setTitle("");
        setFirstName("");
        setLastName("");
        setAddress("");
        setCity("");
        setState("");
        setZip("");
        setEmail("");
        setPhone("");
        setFavorite(false);

        navigate("/contactList");
    };

    return (
        <div id="formdiv">
            <form ref={formRef} onSubmit={handleSubmit}>
                <label>
                    Title:
                    <select
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                        name="title">
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                    </select>
                </label>
                <label>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        name="firstName"
                        onChange={(e) => {
                            setFirstName(e.target.value);
                        }}
                    />
                </label>
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        name="lastName"
                        onChange={(e) => {
                            setLastName(e.target.value);
                        }}
                    />
                </label>
                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                        }}
                    />
                </label>
                <label>
                    City:
                    <input
                        type="text"
                        name="city"
                        value={city}
                        onChange={(e) => {
                            setCity(e.target.value);
                        }}
                    />
                </label>
                <label>
                    State:
                    <input
                        type="text"
                        name="state"
                        value={state}
                        onChange={(e) => {
                            setState(e.target.value);
                        }}
                    />
                </label>
                <label>
                    Zip:
                    <input
                        type="text"
                        name="zip"
                        value={zip}
                        onChange={(e) => {
                            setZip(e.target.value);
                        }}
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </label>
                <label>
                    Phone:
                    <input
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                        }}
                    />
                </label>
                <label>
                    Favorite:
                    <input
                        type="checkbox"
                        name="favorite"
                        value={favorite}
                        onChange={(e) => {
                            setFavorite(e.target.checked);
                        }}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
