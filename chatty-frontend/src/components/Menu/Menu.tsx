import React from "react";
import { Link, useNavigate } from "react-router-dom";

// Assets
import ChattyTitle from "../../assets/icons/chatty-title.svg";

// Styles
import styles from "./Menu.module.scss";

interface MenuItem {
    title: string;
    path: string;
}

interface MenuProps {
    items: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ items }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarLogo}>
                <img src={ChattyTitle} alt="Chatty" />
            </div>
            <ul>
                {items.map((item, index) => (
                    <Link key={index} to={item.path}>
                        <li>{item.title}</li>
                    </Link>
                ))}
                <li onClick={handleLogout} className={styles.logout}>
                    Logout
                </li>
            </ul>
        </nav>
    );
};

export default Menu;
