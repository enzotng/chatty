import React from "react";
import { Navigate } from "react-router-dom";

type PublicRouteProps = {
    isAuthenticated: boolean;
    element: JSX.Element;
};

const PublicRoute: React.FC<PublicRouteProps> = ({
    isAuthenticated,
    element,
}) => {
    return isAuthenticated ? <Navigate to="/chat" replace /> : element;
};

export default PublicRoute;
