import React, { useContext } from "react";
import { ContactContext } from "./ContactData";
import "./ContactList.css";
import { useNavigate } from "react-router-dom";

const ContactCard = ({ contact, handleDelete, handleUpdate }) => {
    const navigate = useNavigate();
    return (
        <div key={contact.id} className="contact-card">
            <h3>
                {contact.title} {contact.firstName} {contact.lastName}
            </h3>
            <p>Email: {contact.email}</p>
            <p>Phone: {contact.phone}</p>
            <button
                className="btn-change"
                onClick={() => {
                    navigate(`/editContact/${contact.id}`);
                }}>
                Edit
            </button>
            <button
                className="btn-danger"
                onClick={() => handleDelete(contact.id)}>
                Delete
            </button>
        </div>
    );
};
const ContactList = () => {
    const navigate = useNavigate();
    const { contactData, deleteContact, updateContact } =
        useContext(ContactContext);
    const handleDelete = (id) => {
        deleteContact(id);
    };
    const handleUpdate = (editedContact) => {
        updateContact(editedContact);
    };

    if (contactData.length > 0) {
        return (
            <div>
                <h2>Contacts</h2>
                <div className="contact-list">
                    {contactData.map((contact) => (
                        <>
                            <ContactCard
                                contact={contact}
                                handleDelete={handleDelete}
                                handleUpdate={handleUpdate}
                            />
                        </>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <h2>Contacts</h2>
                <div className="no-contacts">
                    No contacts currently on record
                    <button
                        onClick={() => {
                            navigate(`/addContact`);
                        }}>
                        Add a Contact
                    </button>
                </div>
            </div>
        );
    }
};

export default ContactList;
