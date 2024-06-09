// React
import React from "react";

// React Hook Form
import { useForm, SubmitHandler } from "react-hook-form";

// React Router
import { useNavigate, Link } from "react-router-dom";

// Axios
import axios from "axios";

// Assets
import ChattyTitle from "../../../assets/icons/chatty-title.svg";

type Inputs = {
    email: string;
    password: string;
};

const Login: React.FC<{ setIsAuthenticated: (value: boolean) => void }> = ({
    setIsAuthenticated,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/login`,
                data
            );
            console.log(response.data);
            if (response.data.token && response.data.user) {
                console.log("Connexion réussie");
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                setIsAuthenticated(true);
                console.log("Redirection vers /chat");
                navigate("/chat");
            } else {
                console.error(
                    "Échec de la connexion, informations manquantes."
                );
            }
        } catch (error) {
            console.error("Erreur de connexion", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
            <img src={ChattyTitle} alt="Chatty AI Title" />
            <div className="form-content">
                <label className="form-label">Email</label>
                <input
                    className="form-input"
                    {...register("email", { required: true })}
                />
                {errors.email && (
                    <span className="error-message">Email est requis</span>
                )}
            </div>
            <div className="form-content">
                <label className="form-label">Mot de passe</label>
                <input
                    className="form-input"
                    type="password"
                    {...register("password", { required: true })}
                />
                {errors.password && (
                    <span className="error-message">
                        Mot de passe est requis
                    </span>
                )}
            </div>
            <button className="form-submit" type="submit">
                Connexion
            </button>
            <div className="form-link-wrapper">
                <span>Vous n'avez pas de compte ?</span>
                <Link to="/register" className="form-link">
                    Inscrivez-vous
                </Link>
            </div>
            <span className="version-app">© Chatty AI | v1.0.1</span>
        </form>
    );
};

export default Login;
