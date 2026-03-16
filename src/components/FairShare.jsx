import { useState, useEffect } from 'react';
import PageLoader from './loaders/PageLoader';
import '../styles/home.css';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import FairShareNavbar from "./FairShareNavbar";

const FairShareHome = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Check localStorage on boot
    useEffect(() => {
        const savedUser = localStorage.getItem('fs_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setTimeout(() => setIsLoading(false), 1000); // Small delay for effect
    }, []);

    const handleLogoutFun = () => {
        localStorage.removeItem('fs_user');
        setUser(null);
        navigate('/home'); // Send them to landing
    };

    if (isLoading) return <PageLoader message="Authenticating..." />;

    return (
        <div className="fairshare-app">
            <FairShareNavbar user={user} handleLogout={handleLogoutFun} />

            {user && (<Dashboard user={user} />) }
        </div>
    );
};

export default FairShareHome;