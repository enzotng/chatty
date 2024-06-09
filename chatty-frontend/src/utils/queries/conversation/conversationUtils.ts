export const fetchConversations = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/conversations`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if (res.ok) {
        return res.json();
    } else if (res.status === 401) {
        throw new Error("Unauthorized");
    } else {
        throw new Error("Failed to fetch conversations");
    }
};
