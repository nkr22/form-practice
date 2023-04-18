import React, { createContext, useState } from "react";

const ContactContext = createContext();

const ContactContextProvider = (props) => {
    const [contacts, setContacts] = useState([]);

    const addContact = (newContact) => {
        setContacts([...contacts, newContact]);
    };

    const deleteContact = (id) => {
        const updatedContacts = contacts.filter((contact) => contact.id !== id);
        setContacts(updatedContacts);
    };

    return (
        <ContactContext.Provider
            value={{ contacts, addContact, deleteContact }}>
            {props.children}
        </ContactContext.Provider>
    );
};

export { ContactContextProvider, ContactContext };
