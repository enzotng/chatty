// Dependencies
import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Pages
import { Home } from "./pages/Home";
import { Register } from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import { Logout } from "./pages/Auth/Logout";

// Components
import { Menu } from "./components/Menu";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import PublicRoute from "./pages/Auth/PublicRoute";

// Styles
import "./assets/styles/Common.scss";

const pageTransition = {
    initial: { opacity: 0, y: -10, transition: { duration: 1 } },
    animate: { opacity: 1, y: 0, transition: { duration: 1 } },
    exit: { opacity: 0, y: 10, transition: { duration: 1 } },
};

const AnimatedRoutes: React.FC<{ isAuthenticated: boolean }> = ({
    isAuthenticated,
}) => {
    const location = useLocation();

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                <Route
                    path="/"
                    element={
                        <motion.div
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={pageTransition}
                        >
                            <PublicRoute
                                isAuthenticated={isAuthenticated}
                                element={<Login />}
                            />
                        </motion.div>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <motion.div
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={pageTransition}
                        >
                            <PublicRoute
                                isAuthenticated={isAuthenticated}
                                element={<Login />}
                            />
                        </motion.div>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <motion.div
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={pageTransition}
                        >
                            <PublicRoute
                                isAuthenticated={isAuthenticated}
                                element={<Register />}
                            />
                        </motion.div>
                    }
                />
                <Route
                    path="/home"
                    element={
                        <motion.div
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={pageTransition}
                        >
                            <ProtectedRoute
                                isAuthenticated={isAuthenticated}
                                element={<Home />}
                            />
                        </motion.div>
                    }
                />
                <Route path="/logout" element={<Logout />} />
                <Route path="*" element={<h1>Erreur 404</h1>} />
            </Routes>
        </AnimatePresence>
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

    const menuItems = [{ title: "Home", path: "/home" }];

    return (
        <Router>
            <div className="pageWrapper">
                {isAuthenticated && <Menu items={menuItems} />}
                <AnimatedRoutes isAuthenticated={isAuthenticated} />
            </div>
        </Router>
    );
};

export default App;
