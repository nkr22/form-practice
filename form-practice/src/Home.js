import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();
    return (
        <div className="Home">
            <h1>Welcome to My Contacts App</h1>
            <p>Use this app to manage your contacts</p>
            <button
                onClick={() => {
                    navigate(`/contactList`);
                }}>
                See Current Contacts
            </button>
        </div>
    );
}

export default Home;
