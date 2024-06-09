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
    confirmPassword: string;
    firstName: string;
    lastName: string;
};

const Register: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<Inputs>();
    const navigate = useNavigate();
    const password = watch("password");

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/register`,
                data
            );
            console.log(response.data);
            navigate("/login");
        } catch (error) {
            console.error("Erreur d'inscription", error);
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
                    <span className="error-message">L'email est requis</span>
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
                        Le mot de passe est requis
                    </span>
                )}
            </div>
            <div className="form-content">
                <label className="form-label">Confirmer le mot de passe</label>
                <input
                    className="form-input"
                    type="password"
                    {...register("confirmPassword", {
                        required: "Le mot de passe est requis",
                        validate: (value) =>
                            value === password ||
                            "Les mots de passe ne correspondent pas",
                    })}
                />
                {errors.confirmPassword && (
                    <span className="error-message">
                        {errors.confirmPassword.message}
                    </span>
                )}
            </div>
            <div className="form-content-wrapper">
                <div className="form-content">
                    <label className="form-label">Prénom</label>
                    <input
                        className="form-input"
                        {...register("firstName", { required: true })}
                    />
                    {errors.firstName && (
                        <span className="error-message">
                            Le prénom est requis
                        </span>
                    )}
                </div>
                <div className="form-content">
                    <label className="form-label">Nom</label>
                    <input
                        className="form-input"
                        {...register("lastName", { required: true })}
                    />
                    {errors.lastName && (
                        <span className="error-message">Le nom est requis</span>
                    )}
                </div>
            </div>
            <button className="form-submit" type="submit">
                S'inscrire
            </button>
            <div className="form-link-wrapper">
                <span>Vous avez déjà un compte ?</span>
                <Link to="/login" className="form-link">
                    Connectez-vous
                </Link>
            </div>
            <span className="version-app">© Chatty AI | v1.0.1</span>
        </form>
    );
};

export default Register;
