import React from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    element: React.ReactElement;
    isAuthenticated: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
    element,
    isAuthenticated,
}) => {
    return isAuthenticated ? <Navigate to="/home" replace /> : element;
};

export default PublicRoute;
