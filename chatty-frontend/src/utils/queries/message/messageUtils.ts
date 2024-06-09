export const fetchMessages = async (conversationId: string) => {
    const token = localStorage.getItem("token");
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
    if (res.ok) {
        const data = await res.json();
        console.log("Raw data from API:", data);
        const messages = data.flatMap((msg: any) => [
            { role: "user", content: msg.message },
            { role: "bot", content: msg.reply },
        ]);
        return messages;
    } else {
        throw new Error("Failed to fetch messages");
    }
};

export const sendMessage = async ({
    message,
    conversationId,
}: {
    message: string;
    conversationId: string | null;
}) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/chat`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message, conversationId }),
        }
    );
    if (res.ok) {
        return res.json();
    } else {
        throw new Error("Failed to send message");
    }
};
