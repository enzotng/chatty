import React, { useState } from "react";
import styles from "./Accueil.module.scss";

const Accueil: React.FC = () => {
    const recommandations = ["Generate a website", "Create a responsive CSS layout", "Develop a JavaScript contact form"];
    const [userInput, setUserInput] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleSendClick = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:3001/api/chat", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userInput })
            });
            const data = await res.json();
            setResponse(data.reply);
        } catch (error) {
            console.error("Error fetching response:", error);
            setResponse("Failed to get response.");
        }
        setIsLoading(false);
    };

    return (
        <div className={styles.accueil}>
            <h1>Chatty AI</h1>
            <p>Talk freely and our AI will fit the code for you</p>
            <div className={styles.userInput}>
                <input type="text" placeholder="Type your message..." value={userInput} onChange={handleInputChange} />
                <button onClick={handleSendClick} disabled={isLoading}>{isLoading ? <div className={styles.spinner}></div> : "Send"}</button>
            </div>
            <p>{response}</p>
            <small>Consider verifying important information, as Chatty AI may make errors.</small>
        </div>
    );
};

export default Accueil;