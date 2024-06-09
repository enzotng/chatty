import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

// Pages
import { Home } from "./pages/Home";
import { Register } from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import { Logout } from "./pages/Auth/Logout";

// Components
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import PublicRoute from "./pages/Auth/PublicRoute";

// Styles
import "./assets/styles/Common.scss";

const AnimatedRoutes: React.FC<{
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
}> = ({ isAuthenticated, setIsAuthenticated }) => {
    const location = useLocation();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            setIsAuthenticated(false);
        }
    }, [location.pathname, setIsAuthenticated]);

    return (
        <Routes location={location} key={location.pathname}>
            <Route
                path="/"
                element={
                    <PublicRoute
                        isAuthenticated={isAuthenticated}
                        element={
                            <Login setIsAuthenticated={setIsAuthenticated} />
                        }
                    />
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute
                        isAuthenticated={isAuthenticated}
                        element={
                            <Login setIsAuthenticated={setIsAuthenticated} />
                        }
                    />
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute
                        isAuthenticated={isAuthenticated}
                        element={<Register />}
                    />
                }
            />
            <Route
                path="/chat"
                element={
                    <ProtectedRoute
                        isAuthenticated={isAuthenticated}
                        element={<Home />}
                    />
                }
            />
            <Route
                path="/chat/:conversationId"
                element={
                    <ProtectedRoute
                        isAuthenticated={isAuthenticated}
                        element={<Home />}
                    />
                }
            />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<h1>Erreur 404</h1>} />
        </Routes>
    );
};

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            <div className="pageWrapper">
                <AnimatedRoutes
                    isAuthenticated={isAuthenticated}
                    setIsAuthenticated={setIsAuthenticated}
                />
            </div>
        </Router>
    );
};

export default App;
