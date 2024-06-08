// Dependencies
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Assets
import IconChatbot from "../../assets/icons/icon-star.svg";
import { ArrowUp } from "@phosphor-icons/react";

// Styles
import styles from "./Home.module.scss";

type Message = {
    role: "user" | "bot" | "error";
    content: string;
};

type User = {
    firstName: string;
    lastName: string;
    fullName: string;
};

type Conversation = {
    id: string;
    createdAt: string;
};

const Home: React.FC = () => {
    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<
        string | null
    >(null);
    const [showTitle, setShowTitle] = useState(true);
    const chatMessageRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            console.log("Utilisateur stocké :", storedUser);
            setUser(JSON.parse(storedUser));
            fetchConversations();
        } else {
            console.log("Aucun utilisateur trouvé dans le localStorage");
        }
    }, []);

    const fetchConversations = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${import.meta.env.VITE_APP_BACKEND_URL}/api/conversations`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res.status === 401) {
                navigate("/login");
            } else if (res.ok) {
                const data = await res.json();
                setConversations(data);
            } else {
                throw new Error("Échec de la récupération des conversations");
            }
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des conversations :",
                error
            );
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(e.target.value);
    };

    const handleSendClick = async () => {
        if (userInput.trim()) {
            setIsLoading(true);
            setMessages((prev) => [
                ...prev,
                { role: "user", content: userInput },
            ]);
            setShowTitle(false);

            const token = localStorage.getItem("token");

            try {
                const res = await fetch(
                    `${import.meta.env.VITE_APP_BACKEND_URL}/api/chat`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            message: userInput,
                            conversationId: currentConversationId,
                        }),
                    }
                );
                if (res.status === 401) {
                    navigate("/login");
                } else if (res.ok) {
                    const data = await res.json();
                    if (data && data.reply) {
                        setMessages((prev) => [
                            ...prev,
                            { role: "bot", content: data.reply },
                        ]);
                        if (!currentConversationId) {
                            setCurrentConversationId(data.conversationId);
                            fetchConversations(); // Refresh conversations
                        }
                    } else {
                        throw new Error("Réponse invalide du serveur");
                    }
                } else {
                    throw new Error(
                        "Échec de la récupération des données du serveur"
                    );
                }
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération de la réponse :",
                    error
                );
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "error",
                        content:
                            "Erreur lors de la récupération de la réponse.",
                    },
                ]);
            }
            setIsLoading(false);
            setUserInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    };

    const renderMessage = (msg: Message, index: number) => {
        if (msg.role === "user") {
            return (
                <div key={index} className={styles.userMessage}>
                    <p>{msg.content}</p>
                </div>
            );
        } else if (msg.role === "bot") {
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

    const handleConversationClick = async (conversationId: string) => {
        setCurrentConversationId(conversationId);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${
                    import.meta.env.VITE_APP_BACKEND_URL
                }/api/conversations/${conversationId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res.status === 401) {
                navigate("/login");
            } else if (res.ok) {
                const data = await res.json();
                const messages = data.map((msg: any) => ({
                    role: msg.role,
                    content: msg.content,
                }));
                setMessages(messages);
            } else {
                throw new Error(
                    "Échec de la récupération des messages de la conversation"
                );
            }
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des messages de la conversation :",
                error
            );
        }
    };

    const titleVariants = {
        visible: { opacity: 1, display: "block" },
        hidden: { opacity: 0, transitionEnd: { display: "none" } },
    };

    return (
        <div className={styles.home}>
            {user && (
                <motion.div
                    variants={titleVariants}
                    initial="visible"
                    animate={showTitle ? "visible" : "hidden"}
                    transition={{ duration: 0.5 }}
                >
                    <div>Bienvenue, {user.fullName}</div>
                </motion.div>
            )}
            <div className={styles.homeContent}>
                <div className={styles.sidebarContent}>
                    <h2>Conversations</h2>
                    <div className={styles.conversationWrapper}>
                        {conversations.map((conversation) => (
                            <div
                                className={styles.conversationItem}
                                key={conversation.id}
                                onClick={() =>
                                    handleConversationClick(conversation.id)
                                }
                            >
                                {conversation.id}
                                {new Date(
                                    conversation.createdAt
                                ).toLocaleString()}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.mainContent}>
                    <div ref={chatMessageRef} className={styles.chatWrapper}>
                        {messages.map(renderMessage)}
                    </div>
                    <div className={styles.userWrapper}>
                        <div className={styles.userInput}>
                            <textarea
                                placeholder="Tapez votre message..."
                                value={userInput}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                style={{ resize: "none" }}
                            />
                            <button
                                onClick={handleSendClick}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className={styles.spinner}></div>
                                ) : (
                                    <ArrowUp size={20} />
                                )}
                            </button>
                        </div>
                        <small>
                            Veuillez vérifier les informations importantes, car
                            Chatty AI peut faire des erreurs.
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
