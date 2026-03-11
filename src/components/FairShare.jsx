import React, { useState, useEffect } from 'react';
import { Container, Button, Navbar, Nav } from 'react-bootstrap';
import PageLoader from './loaders/PageLoader';
import '../styles/home.css';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

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

    const handleLogout = () => {
        localStorage.removeItem('fs_user');
        setUser(null);
        navigate('/home'); // Send them to landing
    };

    if (isLoading) return <PageLoader message="Authenticating..." />;

    return (
        <div className="fairshare-app">
            <Navbar variant="dark" expand="lg" className="nav-custom sticky-top">
                <Container>
                    <Navbar.Brand href="/home" onClick={() => navigate('/home')} className="fw-bold fs-3">FairShare</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav className="ms-auto align-items-center">
                            {user ? (
                                <>
                                    <span className="text-light me-3">{user.email}</span>
                                    <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>
                                    <Button onClick={() => navigate('/register')}>Join Free</Button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {user ? (<Dashboard user={user} />) : (
                <HeroView onGetStarted={() => navigate('/register')} />
            )}
        </div>
    );
};

const HeroView = ({ onGetStarted }) => (
    <div className="hero-gradient text-center">
        <Container>
            <h1 className="display-3 fw-bold mb-3">Split Bills, Keep Friends.</h1>
            <p className="lead mb-5 opacity-75">The ultimate expense tracker for your Puducherry trips and beyond.</p>
            <Button variant="light" size="lg" className="px-5 py-3 fw-bold" onClick={onGetStarted}>Start Your First Trip</Button>
        </Container>
    </div>
);

export default FairShareHome;