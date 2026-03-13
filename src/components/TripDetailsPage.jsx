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
    const handleExpenseAdded = (updatedExpense) => {
        setExpenses(prevExpenses => {
            const index = prevExpenses.findIndex(e => e.expenseUID === updatedExpense.expenseUID);

            if (index > -1) {
                // Update: replace the old expense with the new one
                const newExpenses = [...prevExpenses];
                newExpenses[index] = updatedExpense;
                return newExpenses;
            } else {
                // Add: put the new expense at the top
                return [updatedExpense, ...prevExpenses];
            }
        });
    };

    // 1. Initialize state properly to avoid infinite loops
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('fs_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [trip, setTrip] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [editingExpense, setEditingExpense] = useState(null);

    const handleEditClick = (expense) => {
        setEditingExpense(expense); // Set the expense data to be edited
        setShowExpenseModal(true);   // Open the same modal
    };

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
                const tripData = response.data?.data || response.data;

                const expensesResponse = await axios.get(`${API_URL}/expenses/fetch/${tripUID}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const expensesData = expensesResponse.data?.data || expensesResponse.data;

                setTrip(tripData);
                setExpenses(expensesData);

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
                : <Container className="mt-4">
                    <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none mb-3">
                        ← Back to Dashboard
                    </Button>

                    <Card className="shadow-sm border-0 rounded-4 mb-4 p-3">
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
                        <Col lg={8} style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <h5 className="fw-bold mb-3">Expenses</h5>
                            {expenses.length === 0 ? (
                                <div className="p-5 bg-light text-center rounded-3 border">
                                    <p className="text-muted">No expenses recorded yet.</p>
                                </div>
                            ) : (
                                expenses.map((exp) => (
                                    <Card key={exp.expenseUID} className="mb-3 border-0 shadow-sm rounded-3 hover-shadow transition-all">
                                        <Card.Body className="p-4">
                                            <Row className="align-items-center">
                                                <Col xs={7}>
                                                    <h6 className="fw-bold mb-0 text-dark">{exp.description}</h6>
                                                    <small className="text-muted">
                                                        Paid by <span className="text-primary fw-semibold">{exp.paidBy}</span> • {new Date(exp.expenseDate).toLocaleDateString()}
                                                    </small>
                                                </Col>
                                                <Col xs={4} className="text-end">
                                                    <h6 className="text-success fw-bold mb-0">₹{exp.totalAmount.toFixed(2)}</h6>
                                                    <div className="d-flex justify-content-end gap-1 mt-1">
                                                        {/* Visual indicator of people involved */}
                                                        {exp.splits.map((s, i) => (
                                                            <div
                                                                key={i}
                                                                className="bg-light border rounded-circle d-flex align-items-center justify-content-center"
                                                                style={{ width: '20px', height: '20px', fontSize: '10px' }}
                                                                title={s.participantName}
                                                            >
                                                                {s.participantName.charAt(0)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Col>
                                                <Col xs={1} className="text-end p-0">
                                                    {/* The Edit Button */}
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="rounded-pill px-3 py-1 fw-bold edit-btn-hover"
                                                        style={{ fontSize: '0.7rem', borderWidth: '1.5px' }}
                                                        onClick={() => handleEditClick(exp)}
                                                    >
                                                        <i className="bi bi-pencil-fill me-1"></i> EDIT
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                ))
                            )}
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
                        onHide={() => {
                            setShowExpenseModal(false);
                            setEditingExpense(null); // Clear editing state on close
                        }}
                        trip={trip}
                        token={user.token}
                        onExpenseAdded={handleExpenseAdded}
                        editData={editingExpense} // Pass the existing data
                    />
                </Container>
            }
        </>
    );
};

export default TripDetailsPage;