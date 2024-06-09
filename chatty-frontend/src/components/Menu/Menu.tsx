import React from "react";
import { Link } from "react-router-dom";

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
    return (
        <nav className={styles.menu}>
            <ul>
                {items.map((item, index) => (
                    <Link key={index} to={item.path}>
                        <li>{item.title}</li>
                    </Link>
                ))}
                <li>
                    <Link to="/logout">Déconnexion</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;
