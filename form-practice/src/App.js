import { useEffect, useMemo, useState } from "react";
import AboutPage from "./AboutPage";
import "./App.css";
import ContactForm from "./ContactForm.js";
import Home from "./Home";
import { RouterProvider, createHashRouter } from "react-router-dom";
import Header from "./Header";
import ContactList from "./ContactList";
import { ContactContext } from "./ContactData";
import EditContact from "./EditContact";

function App() {
    const [contactData, setContactData] = useState(() => {
        const storedContacts = localStorage.getItem("contacts");
        return storedContacts ? JSON.parse(storedContacts) : [];
    });

    useEffect(() => {
        localStorage.setItem("contacts", JSON.stringify(contactData));
    }, [contactData]);

    const addContact = (newContact) => {
        setContactData([...contactData, newContact]);
    };
    const deleteContact = (id) => {
        const updatedContacts = contactData.filter(
            (contact) => contact.id !== id
        );
        setContactData(updatedContacts);
    };
    const updateContact = (updatedContact) => {
        setContactData((prevContactData) => {
            // Find the index of the contact to be updated
            const index = prevContactData.findIndex(
                (c) => c.id === updatedContact.id
            );

            // If the contact doesn't exist, return the previous state
            if (index === -1) {
                return prevContactData;
            }

            // Create a copy of the previous contact data array
            const updatedContacts = [...prevContactData];

            // Update the contact at the given index with the new contact data
            updatedContacts[index] = updatedContact;

            // Return the updated contact data array
            return updatedContacts;
        });
    };

    const router = useMemo(
        () =>
            createHashRouter([
                { path: "/", element: <Home /> },
                { path: "/about", element: <AboutPage /> },
                {
                    path: "/addContact",
                    element: <ContactForm />,
                },
                {
                    path: "/contactList",
                    element: <ContactList contactData={contactData} />,
                },
                {
                    path: "/editContact/:id",
                    element: <EditContact />,
                },
            ]),
        []
    );
    return (
        <ContactContext.Provider
            value={{ contactData, addContact, deleteContact, updateContact }}>
            <div className="App">
                <Header />
                <div id="content">
                    <RouterProvider router={router}></RouterProvider>
                </div>
            </div>
        </ContactContext.Provider>
    );
}

export default App;
