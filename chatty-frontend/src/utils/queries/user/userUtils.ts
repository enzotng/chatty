export const fetchUser = async () => {
    const storedUser = localStorage.getItem("user");
    console.log(storedUser);
    return storedUser ? JSON.parse(storedUser) : null;
};
