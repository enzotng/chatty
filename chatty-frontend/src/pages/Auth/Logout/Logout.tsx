import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }, [navigate]);

    return <div>Déconnexion...</div>;
};

export default Logout;
