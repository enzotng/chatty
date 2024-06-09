import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await fetch(
                        `${
                            import.meta.env.VITE_APP_BACKEND_URL
                        }/api/auth/logout`,
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    if (response.ok) {
                        console.log("Déconnexion réussie");
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/login");
                    } else {
                        console.error("Erreur lors de la déconnexion");
                    }
                } catch (error) {
                    console.error("Erreur lors de la déconnexion", error);
                }
            } else {
                console.log("Token non trouvé, redirection vers login");
                navigate("/login");
            }
        };

        logout();
    }, [navigate]);

    return (
        <div>
            <p>Déconnexion en cours...</p>
        </div>
    );
};

export default Logout;
