// Dependencies
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// Assets
import ChattyTitle from "../../../assets/icons/chatty-title.svg";

type Inputs = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

const Register: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/register`,
                data
            );
            console.log(response.data);
            navigate("/login");
        } catch (error) {
            console.error("Registration error", error);
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
                    <span className="error-message">Email is required</span>
                )}
            </div>
            <div className="form-content">
                <label className="form-label">Password</label>
                <input
                    className="form-input"
                    type="password"
                    {...register("password", { required: true })}
                />
                {errors.password && (
                    <span className="error-message">Password is required</span>
                )}
            </div>
            <div className="form-content-wrapper">
                <div className="form-content">
                    <label className="form-label">First name</label>
                    <input
                        className="form-input"
                        {...register("firstName", { required: true })}
                    />
                    {errors.firstName && (
                        <span className="error-message">
                            First name is required
                        </span>
                    )}
                </div>
                <div className="form-content">
                    <label className="form-label">Last name</label>
                    <input
                        className="form-input"
                        {...register("lastName", { required: true })}
                    />
                    {errors.lastName && (
                        <span className="error-message">
                            Last name is required
                        </span>
                    )}
                </div>
            </div>
            <button className="form-submit" type="submit">
                Register
            </button>
            <Link to="/login" className="form-link">
                Already an account ?
            </Link>
            <span className="version-app">© Chatty AI | b0.0.1</span>
        </form>
    );
};

export default Register;
