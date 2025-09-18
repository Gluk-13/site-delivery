// Проверка доступа по токену
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return <Navigate to="login" replace />;
    }
    
    console.log(token)
    return children;
};

export default ProtectedRoute;