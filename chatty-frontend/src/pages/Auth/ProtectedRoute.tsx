import React from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
    isAuthenticated: boolean;
    element: JSX.Element;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    isAuthenticated,
    element,
}) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
