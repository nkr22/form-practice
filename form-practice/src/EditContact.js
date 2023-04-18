import React, { useState, useContext, useRef } from "react";
import { ContactContext } from "./ContactData";
import "./ContactForm.css";
import { useNavigate, useParams } from "react-router-dom";

const EditContact = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const { contactData } = useContext(ContactContext);
    const contact = contactData.filter((contact) => contact.id == id)[0];
    console.log(contact);
    const { updateContact } = useContext(ContactContext);
    const [editedContact, setEditedContact] = useState(contact);

    const handleSubmit = (event) => {
        event.preventDefault();
        updateContact(editedContact);

        navigate("/contactList");
    };

    const formRef = useRef(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedContact({
            ...editedContact,
            [name]: value,
        });
    };

    return (
        <div id="formdiv">
            <form ref={formRef} onSubmit={handleSubmit}>
                <label>
                    Title:
                    <select
                        value={editedContact.title}
                        onChange={handleInputChange}
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
                        value={editedContact.firstName}
                        name="firstName"
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={editedContact.lastName}
                        name="lastName"
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={editedContact.address}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    City:
                    <input
                        type="text"
                        name="city"
                        value={editedContact.city}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    State:
                    <input
                        type="text"
                        name="state"
                        value={editedContact.state}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Zip:
                    <input
                        type="text"
                        name="zip"
                        value={editedContact.zip}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={editedContact.email}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Phone:
                    <input
                        type="tel"
                        name="phone"
                        value={editedContact.phone}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Favorite:
                    <input
                        type="checkbox"
                        name="favorite"
                        checked={editedContact.favorite}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default EditContact;
