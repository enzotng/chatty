import React, { useRef, useState } from "react";
import gsap from "gsap";

// Assets
import IconChatbot from "../../assets/icons/icon-star.svg";

// Styles
import styles from "./Accueil.module.scss";

const Accueil: React.FC = () => {
    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatMessageRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleSendClick = async () => {
        setIsLoading(true);
        setMessages(prev => [...prev, { role: 'user', content: userInput }]);
        try {
            const res = await fetch("http://localhost:3001/api/chat", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userInput })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages(prev => [...prev, { role: 'error', content: "Erreur lors de la récupération de la réponse." }]);
        }
        setIsLoading(false);
        setUserInput("");
    };

    const renderMessage = (msg, index) => {
        if (msg.role === 'user') {
            return (
                <div key={index} className={styles.userMessage}>
                    <p>{msg.content}</p>
                </div>
            );
        } else if (msg.role === 'bot') {
            return (
                <div key={index} className={styles.botMessage}>
                    <div className={styles.chatbotInput}>
                        <div className={styles.chatbotImage}>
                            <img src={IconChatbot} alt="Chatbot" />
                        </div>
                        <p>{msg.content}</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div key={index} className={styles.errorMessage}>
                    <p>{msg.content}</p>
                </div>
            );
        }
    };

    return (
        <div className={styles.accueil}>
            <div ref={chatMessageRef} className={styles.chatWrapper}>
                {messages.map(renderMessage)}
            </div>
            <div className={styles.userWrapper}>
                <div className={styles.userInput}>
                    <input type="text" placeholder="Type your message..." value={userInput} onChange={handleInputChange} />
                    <button onClick={handleSendClick} disabled={isLoading}>
                        {isLoading ? <div className={styles.spinner}></div> : "Send"}
                    </button>
                </div>
                <small>Consider verifying important information, as Chatty AI may make errors.</small>
            </div>
        </div>
    );
};

export default Accueil;
