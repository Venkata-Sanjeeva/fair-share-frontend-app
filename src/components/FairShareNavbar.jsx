import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/fairShareNavbar.css';

const FairShareNavbar = ({ user = null, handleLogout = null }) => {
    const navigate = useNavigate();

    return (
        <Navbar 
            variant="dark" 
            expand="lg" 
            className="sticky-top py-2" 
            style={{ 
                background: '#1e272e', // Solid, professional dark deep-space blue
                borderBottom: '2px solid #00d2ff', // Subtle colored accent line
                zIndex: 1050 
            }}
        >
            <Container>
                {/* Brand */}
                <Navbar.Brand 
                    onClick={() => navigate('/home')} 
                    className="fw-bold fs-3"
                    style={{ cursor: 'pointer', letterSpacing: '-0.5px' }}
                >
                    <i className="bi bi-intersect me-2 text-info"></i>FairShare
                </Navbar.Brand>

                <Navbar.Toggle className="border-0 shadow-none" />

                <Navbar.Collapse>
                    <Nav className="ms-auto align-items-center gap-3 mt-3 mt-lg-0">
                        {user ? (
                            <>
                                {/* User Identity Badge */}
                                <div 
                                    className="d-flex align-items-center px-3 py-2 rounded-3 border border-secondary shadow-sm"
                                    style={{ background: 'rgba(255,255,255,0.05)' }}
                                >
                                    <i className="bi bi-person-fill text-info me-2 fs-5"></i>
                                    <div className="d-flex flex-column">
                                        <small className="text-uppercase fw-bold text-warning" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>
                                            Signed In
                                        </small>
                                        <span className="text-white fw-medium" style={{ fontSize: '0.95rem' }}>
                                            {user.email}
                                        </span>
                                    </div>
                                </div>

                                {/* Logout Button - High Visibility */}
                                <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    className="rounded-3 px-3 fw-bold border-2"
                                    onClick={handleLogout}
                                    style={{ fontSize: '0.85rem' }}
                                >
                                    <i className="bi bi-box-arrow-right me-1"></i> LOGOUT
                                </Button>
                            </>
                        ) : (
                            <div className="d-flex align-items-center gap-2">
                                <Nav.Link 
                                    onClick={() => navigate('/login')}
                                    className="text-white-50 fw-bold px-3 transition-all hover-white"
                                >
                                    Login
                                </Nav.Link>
                                <Button 
                                    onClick={() => navigate('/register')}
                                    className="btn-info rounded-3 px-4 fw-bold shadow-sm"
                                    style={{ color: '#1e272e' }}
                                >
                                    Join Free
                                </Button>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default FairShareNavbar;