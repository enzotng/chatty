import React, {
    useReducer,
    useRef,
    useEffect,
    useCallback,
    useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

// Syntax Highlighter
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

// CopyToClipboard
import { CopyToClipboard } from "react-copy-to-clipboard";

// Utils
import { fetchUser } from "../../utils/queries/user/userUtils";
import { fetchConversations } from "../../utils/queries/conversation/conversationUtils";
import {
    fetchMessages,
    sendMessage,
} from "../../utils/queries/message/messageUtils";

// Assets
import ChattyTitle from "../../assets/icons/chatty-title.svg";
import NoConversations from "../../assets/images/svg/no-conversations.svg";

// Phosphor Icons
import { Copy, NotePencil, SignOut } from "@phosphor-icons/react";
import { ArrowUp } from "@phosphor-icons/react";

// Styles
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";

type Message = {
    role: "user" | "bot" | "error";
    content: string;
};

type User = {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
};

type Conversation = {
    id: string;
    createdAt: string;
};

type State = {
    messages: Message[];
    userInput: string;
    isLoading: boolean;
    user: User | null;
    conversations: Conversation[];
    currentConversationId: string | null;
    showTitle: boolean;
};

type Action =
    | { type: "SET_USER"; payload: User }
    | { type: "SET_MESSAGES"; payload: Message[] }
    | { type: "ADD_MESSAGE"; payload: Message }
    | { type: "SET_USER_INPUT"; payload: string }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_CONVERSATIONS"; payload: Conversation[] }
    | { type: "SET_CONVERSATION_ID"; payload: string | null }
    | { type: "SET_SHOW_TITLE"; payload: boolean };

const initialState: State = {
    messages: [],
    userInput: "",
    isLoading: false,
    user: null,
    conversations: [],
    currentConversationId: null,
    showTitle: true,
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_USER":
            return { ...state, user: action.payload };
        case "SET_MESSAGES":
            return { ...state, messages: action.payload };
        case "ADD_MESSAGE":
            return { ...state, messages: [...state.messages, action.payload] };
        case "SET_USER_INPUT":
            return { ...state, userInput: action.payload };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "SET_CONVERSATIONS":
            return { ...state, conversations: action.payload };
        case "SET_CONVERSATION_ID":
            return { ...state, currentConversationId: action.payload };
        case "SET_SHOW_TITLE":
            return { ...state, showTitle: action.payload };
        default:
            return state;
    }
};

const Home: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const chatMessageRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { conversationId } = useParams<{ conversationId: string }>();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const initializeUser = async () => {
            const user = await fetchUser();
            if (user) {
                dispatch({ type: "SET_USER", payload: user });
            }
        };

        initializeUser();
    }, []);

    useEffect(() => {
        const initializeConversations = async () => {
            try {
                const conversations = await fetchConversations();
                dispatch({ type: "SET_CONVERSATIONS", payload: conversations });
            } catch (error: any) {
                if (error.message === "Unauthorized") {
                    navigate("/login");
                } else {
                    console.error("Failed to fetch conversations:", error);
                }
            }
        };

        if (state.user) {
            initializeConversations();
        }
    }, [state.user, navigate]);

    useEffect(() => {
        const initializeMessages = async () => {
            if (conversationId) {
                dispatch({
                    type: "SET_CONVERSATION_ID",
                    payload: conversationId,
                });
                try {
                    const messages = await fetchMessages(conversationId);
                    dispatch({ type: "SET_MESSAGES", payload: messages });
                } catch (error) {
                    console.error("Failed to fetch messages:", error);
                }
            }
        };

        initializeMessages();
    }, [conversationId]);

    useEffect(() => {
        if (chatMessageRef.current) {
            chatMessageRef.current.scrollTop =
                chatMessageRef.current.scrollHeight;
        }
    }, [state.messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch({ type: "SET_USER_INPUT", payload: e.target.value });
    };

    const handleSendClick = async () => {
        if (state.userInput.trim()) {
            dispatch({ type: "SET_LOADING", payload: true });
            dispatch({
                type: "ADD_MESSAGE",
                payload: { role: "user", content: state.userInput },
            });
            dispatch({ type: "SET_SHOW_TITLE", payload: false });

            try {
                const data = await sendMessage({
                    message: state.userInput,
                    conversationId: state.currentConversationId,
                });
                dispatch({
                    type: "ADD_MESSAGE",
                    payload: { role: "bot", content: data.reply },
                });
                if (!state.currentConversationId) {
                    dispatch({
                        type: "SET_CONVERSATION_ID",
                        payload: data.conversationId,
                    });
                    const conversations = await fetchConversations();
                    dispatch({
                        type: "SET_CONVERSATIONS",
                        payload: conversations,
                    });
                    navigate(`/chat/${data.conversationId}`);
                }
            } catch (error) {
                console.error("Failed to send message:", error);
                dispatch({
                    type: "ADD_MESSAGE",
                    payload: {
                        role: "error",
                        content:
                            "Erreur lors de la récupération de la réponse.",
                    },
                });
            } finally {
                dispatch({ type: "SET_LOADING", payload: false });
                dispatch({ type: "SET_USER_INPUT", payload: "" });
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    };

    const renderMessageContent = (content: string) => {
        if (!content) {
            return null;
        }

        const codeRegex = /```([\s\S]*?)```/g;
        const parts = content.split(codeRegex);

        return parts.map((part, index) => {
            if (index % 2 === 0) {
                const lines = part.split("\n").map((line, i) => {
                    if (
                        line.startsWith("1. ") ||
                        line.startsWith("2. ") ||
                        line.startsWith("3. ") ||
                        line.startsWith("4. ") ||
                        line.startsWith("5. ")
                    ) {
                        return <li key={i}>{line.substring(3)}</li>;
                    } else if (line.startsWith("- ")) {
                        return <li key={i}>{line.substring(2)}</li>;
                    } else {
                        return <p key={i}>{line}</p>;
                    }
                });

                return (
                    <div className={styles.textWrapper} key={index}>
                        {lines}
                    </div>
                );
            } else {
                const lines = part.trim().split("\n");
                const language = lines.shift();
                const code = lines.join("\n");

                return (
                    <div key={index} className={styles.codeWrapper}>
                        <div className={styles.codeHeader}>
                            <span>{language}</span>
                            <CopyToClipboard
                                text={code}
                                onCopy={() => setCopied(true)}
                            >
                                <button className={styles.copyButton}>
                                    <Copy size={20} />
                                </button>
                            </CopyToClipboard>
                        </div>
                        <SyntaxHighlighter
                            style={atomOneDark}
                            showLineNumbers
                            language={language}
                        >
                            {code}
                        </SyntaxHighlighter>
                        {copied && (
                            <div className={styles.copiedMessage}>
                                Copié dans le presse-papiers !
                            </div>
                        )}
                    </div>
                );
            }
        });
    };

    const renderMessage = (msg: Message, index: number) => {
        const messageClass =
            msg.role === "user"
                ? styles.userMessage
                : msg.role === "bot"
                ? styles.botMessage
                : styles.errorMessage;

        return (
            <div key={index} className={messageClass}>
                <p>{renderMessageContent(msg.content)}</p>
            </div>
        );
    };

    const handleConversationClick = useCallback(
        (conversationId: string) => {
            navigate(`/chat/${conversationId}`);
        },
        [navigate]
    );

    return (
        <div className={styles.homeWrapper}>
            <aside className={styles.sidebarContent}>
                <div className={styles.sidebarLogo}>
                    <Link to={"/chat"}>
                        <img src={ChattyTitle} alt="Chatty" />
                    </Link>
                    <Link className={styles.newChat} to={"/chat"}>
                        <NotePencil size={17.5} />
                    </Link>
                </div>
                <div className={styles.conversationWrapper}>
                    <div className={styles.conversationHeader}>
                        <p>Historique des chats</p>
                        <span>{state.conversations.length}</span>
                    </div>
                    {state.conversations.map((conversation) => (
                        <div
                            className={styles.conversationItem}
                            key={conversation.id}
                            onClick={() =>
                                handleConversationClick(conversation.id)
                            }
                        >
                            <span>
                                Conversation du{" "}
                                {new Date(
                                    conversation.createdAt
                                ).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
                <div className={styles.logoutWrapper}>
                    {state.user && (
                        <div className={styles.infosUser}>
                            <span>{state.user.fullName}</span>
                            <span>{state.user.email}</span>
                        </div>
                    )}
                    <Link to="/logout">
                        <SignOut size={20} />
                        Déconnexion
                    </Link>
                </div>
            </aside>
            <main className={styles.mainContent}>
                <div ref={chatMessageRef} className={styles.chatWrapper}>
                    {state.messages.length === 0 ? (
                        <div className={styles.startConversation}>
                            <h1>Débutez une nouvelle conversation !</h1>
                            <img src={NoConversations} alt="No conversations" />
                        </div>
                    ) : (
                        state.messages.map(renderMessage)
                    )}
                </div>
                <div className={styles.userWrapper}>
                    <div className={styles.userInput}>
                        <textarea
                            placeholder="Posez moi une question !"
                            value={state.userInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            style={{ resize: "none" }}
                        />
                        <button
                            onClick={handleSendClick}
                            disabled={state.isLoading}
                        >
                            {state.isLoading ? (
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
            </main>
        </div>
    );
};

export default Home;
