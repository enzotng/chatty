import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

type Inputs = {
    email: string;
    password: string;
};

const Login: React.FC = () => {
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
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                navigate("/home");
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
            <h1>Connexion</h1>
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
            <Link to="/register" className="form-link">
                Don't have an account ?
            </Link>
        </form>
    );
};

export default Login;
