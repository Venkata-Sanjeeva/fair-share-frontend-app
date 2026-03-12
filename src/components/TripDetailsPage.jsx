import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Navbar, Nav } from 'react-bootstrap';
import axios from 'axios';
import PageLoader from './loaders/PageLoader';
import AddExpenseModal from './modal_popups/AddExpenseModal';

const API_URL = process.env.REACT_APP_API_URL;

const TripDetailsPage = () => {
    const { tripUID } = useParams();
    const navigate = useNavigate();

    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [expenses, setExpenses] = useState([]); // Add this state

    // Add a function to handle new expenses
    const handleExpenseAdded = (newExpense) => {
        setExpenses([newExpense, ...expenses]);
    };

    // 1. Initialize state properly to avoid infinite loops
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('fs_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [trip, setTrip] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('fs_user');
        setUser(null);
        navigate('/home');
    };

    useEffect(() => {
        // 2. Redirect if no user found
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchTripDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/trip/${tripUID}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                // Using optional chaining to safely access data
                const data = response.data?.data || response.data;
                setTrip(data);
            } catch (err) {
                console.error("Error fetching trip:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTripDetails();

        // 3. Add dependencies here to satisfy ESLint and ensure data stays fresh
    }, [tripUID, user, navigate]);

    if (isLoading) return <PageLoader message="Loading Trip Details..." />;

    return (
        <>
            <Navbar variant="dark" expand="lg" className="nav-custom sticky-top">
                <Container>
                    <Navbar.Brand href="/home" onClick={() => navigate('/home')} className="fw-bold fs-3">FairShare</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav className="ms-auto align-items-center">
                            <>
                                <span className="text-light me-3">{user.email}</span>
                                <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                            </>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {!trip ?
                <Container className="mt-5 text-center">
                    <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none mb-3">
                        ← Back to Dashboard
                    </Button>
                    <Card className="shadow-sm border-0 rounded-4 p-4 mb-4">
                        <h3>Trip not found.</h3>
                    </Card>
                </Container>
                : <Container className="py-4">
                    <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none mb-3">
                        ← Back to Dashboard
                    </Button>

                    <Card className="shadow-sm border-0 rounded-4 p-4 mb-4">
                        <Row className="align-items-center">
                            <Col>
                                <h1 className="fw-bold">{trip.tripName}</h1>
                                <p className="text-muted">{trip.tripType === 'group' ? '👥 Group Trip' : '👤 Solo Trip'}</p>
                            </Col>
                            <Col className="text-end">
                                <Button
                                    variant="success"
                                    className="rounded-pill px-4"
                                    onClick={() => setShowExpenseModal(true)}
                                >
                                    Add Expense
                                </Button>
                            </Col>
                        </Row>
                    </Card>

                    <Row>
                        <Col lg={8}>
                            <h5 className="fw-bold mb-3">Expenses</h5>
                            {/* Expense list will go here later */}
                            <div className="p-5 bg-light text-center rounded-3">
                                <p className="text-muted">No expenses recorded yet.</p>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <h5 className="fw-bold mb-3">Members</h5>
                            <div className="d-flex flex-wrap gap-2">
                                {trip.participants.map((name, index) => (
                                    <div key={index} className="px-3 py-2 bg-white border rounded-pill shadow-sm small">
                                        {name}
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                    <AddExpenseModal
                        show={showExpenseModal}
                        onHide={() => setShowExpenseModal(false)}
                        trip={trip}
                        token={user.token}
                        onExpenseAdded={handleExpenseAdded}
                    />
                </Container>
            }
        </>
    );
};

export default TripDetailsPage;