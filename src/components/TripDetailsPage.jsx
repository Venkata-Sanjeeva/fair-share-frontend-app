import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import axios from 'axios';
import PageLoader from './loaders/PageLoader';
import AddExpenseModal from './modal_popups/AddExpenseModal';
import FairShareNavbar from "./FairShareNavbar";
import "../styles/tripDetailsPage.css";
import ComponentLoader from './loaders/ComponentLoader';

const API_URL = process.env.REACT_APP_API_URL;

const TripDetailsPage = () => {
    const { tripUID } = useParams();
    const navigate = useNavigate();

    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [expenses, setExpenses] = useState([]); // Add this state
    const [balances, setBalances] = useState([]);
    const [expandedMember, setExpandedMember] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    // 1. Initialize state properly to avoid infinite loops
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('fs_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [trip, setTrip] = useState(null);
    const [compLoading, setCompLoading] = useState(true);

    const [editingExpense, setEditingExpense] = useState(null);

    const calculateBalance = (member) => {
        return member.amountPaidInTrip - member.shareAmount;
    };

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`${API_URL}/expenses/fetch/${tripUID}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            const data = response?.data?.data;
            setExpenses(data);

        } catch (err) {
            console.error("Error fetching expenses", err);
        } finally {
            setCompLoading(false);
        }
    };

    const fetchTripDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/trip/${tripUID}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            // Using optional chaining to safely access data
            const tripData = response.data?.data || response.data;

            setTrip(tripData);
            fetchExpenses();

        } catch (err) {
            console.error("Error fetching trip:", err);
        } finally {
            setCompLoading(false);
        }
    };

    const fetchBalances = async () => {
        setCompLoading(true);
        try {
            const results = await axios.get(
                `${API_URL}/expenses/${tripUID}/balances`,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            const data = results?.data?.data;
            setBalances(data);

        } catch (err) {
            console.error("Error fetching balances", err);
        } finally {
            setCompLoading(false);
        }
    };

    // Add a function to handle new expenses
    const handleExpenseAdded = (updatedExpense) => {
        setCompLoading(true);

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

        fetchBalances();

        setTimeout(() => {
            setCompLoading(false);
        }, 500);
    };

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
        setPageLoading(true);
        if (!user) {
            navigate('/login');
            return;
        }
        setTimeout(() => {
            setPageLoading(false);
        }, 500);

        fetchTripDetails();
        fetchBalances();

        // 3. Add dependencies here to satisfy ESLint and ensure data stays fresh
    }, [tripUID, user, navigate]);

    // Use the exact same theme mapping as TripCard
    const statusTheme = {
        ACTIVE: { color: '#00d2ff', gradient: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)', icon: 'bi-rocket-takeoff' },
        COMPLETED: { color: '#00b894', gradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', icon: 'bi-patch-check' },
        CREATED: { color: '#6c5ce7', gradient: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)', icon: 'bi-wallet2' }
    };

    const currentStatus = trip?.tripStatus?.toUpperCase() || 'ACTIVE';
    const theme = statusTheme[currentStatus] || statusTheme.ACTIVE;

    if (pageLoading) return <PageLoader message="Loading Trip Details..." />;

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <FairShareNavbar user={user} handleLogout={handleLogout} />

            <Container className="py-4">
                <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none text-muted mb-3 p-0 small">
                    <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
                </Button>

                {!trip ? (
                    <Card className="border-0 shadow-sm rounded-4 p-5 text-center">
                        <h3>Trip not found.</h3>
                    </Card>
                ) : (
                    <>
                        {/* HEADER CARD - Matches TripCard style */}
                        <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden position-relative bg-white">
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '8px', background: theme.gradient }} />
                            <Card.Body className="ps-5 pe-4 py-4">
                                <Row className="align-items-center">
                                    <Col md={8}>
                                        <Badge bg="none" className="text-uppercase mb-2 p-0"
                                            style={{ color: theme.color, fontSize: '0.75rem', letterSpacing: '1.2px' }}>
                                            <i className={`bi ${theme.icon} me-1`}></i> {currentStatus}
                                        </Badge>
                                        <h1 className="fw-bold mb-1" style={{ color: '#2d3436' }}>{trip.tripName}</h1>
                                        <p className="text-muted small mb-0">
                                            {trip.tripType === 'group' ? '👥 Group' : '👤 Solo'} • Created {new Date(trip.createdAt).toLocaleDateString()}
                                        </p>
                                    </Col>
                                    <Col md={4} className="mt-3 mt-md-0">
                                        <div className="d-flex justify-content-md-end gap-2">
                                            {trip.tripStatus === 'ACTIVE' && (
                                                <Button
                                                    style={{ background: theme.gradient, border: 'none' }}
                                                    className="rounded-pill px-4 py-2 fw-bold shadow-sm"
                                                    onClick={() => setShowExpenseModal(true)}
                                                >
                                                    <i className="bi bi-plus-lg me-2"></i>
                                                    Add Expense
                                                </Button>
                                            )}

                                            {trip.tripStatus === 'COMPLETED' && (
                                                <Button
                                                    style={{ background: theme.gradient, border: 'none' }}
                                                    className="rounded-pill px-4 py-2 fw-bold shadow-sm"
                                                    onClick={() => navigate(`/trip/${tripUID}/report`)}
                                                >
                                                    <i className="bi bi-file-earmark-text me-2"></i>
                                                    Generate Report
                                                </Button>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Row>
                            {/* EXPENSE LIST */}
                            <Col lg={7}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <h5 className="fw-bold mb-0" style={{ color: '#2d3436' }}>Trip Ledger</h5>
                                        <small className="text-muted">History of all transactions</small>
                                    </div>
                                </div>

                                {compLoading ? <ComponentLoader message='Expenses are loading...' /> :
                                    <div className="expense-list-container" style={{ maxHeight: '56vh', overflowY: 'auto', paddingRight: '10px' }}>
                                        {expenses.length === 0 ? (
                                            <div className="p-5 bg-white text-center rounded-4 border-0 shadow-sm">
                                                <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                                                    <i className="bi bi-wallet2 text-muted" style={{ fontSize: '2.5rem' }}></i>
                                                </div>
                                                <h6 className="fw-bold text-dark">No expenses yet</h6>
                                                <p className="text-muted small">Tap 'Add Expense' to track your first spend.</p>
                                            </div>
                                        ) : (
                                            expenses.map((exp, index) => (
                                                <div key={exp.expenseUID} className="position-relative mb-3">
                                                    {/* Vertical Timeline Line */}
                                                    {index !== expenses.length - 1 && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            left: '31px',
                                                            top: '50px',
                                                            bottom: '-20px',
                                                            width: '2px',
                                                            background: '#e9ecef',
                                                            zIndex: 0
                                                        }} />
                                                    )}

                                                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white transition-all card-hover-effect"
                                                        style={{ zIndex: 1 }}>
                                                        <Card.Body className="p-3">
                                                            <Row className="align-items-center g-3">
                                                                {/* Date Icon Box */}
                                                                <Col xs="auto">
                                                                    <div className="text-center rounded-3 d-flex flex-column justify-content-center shadow-sm"
                                                                        style={{
                                                                            width: '60px',
                                                                            height: '60px',
                                                                            background: theme.gradient,
                                                                            color: 'white'
                                                                        }}>
                                                                        <div style={{ fontSize: '0.65rem', fontWeight: 'bold', opacity: 0.9 }}>
                                                                            {new Date(exp.expenseDate).toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}
                                                                        </div>
                                                                        <div style={{ fontSize: '1.2rem', fontWeight: '900', lineHeight: 1 }}>
                                                                            {new Date(exp.expenseDate).getDate()}
                                                                        </div>
                                                                    </div>
                                                                </Col>

                                                                {/* Description & Payer */}
                                                                <Col>
                                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                                        <h6 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.2px' }}>
                                                                            {exp.description}
                                                                        </h6>
                                                                        <span className="badge rounded-pill bg-light text-muted fw-normal" style={{ fontSize: '0.65rem' }}>
                                                                            {exp.splits?.length} split
                                                                        </span>
                                                                    </div>
                                                                    <div className="d-flex align-items-center text-muted" style={{ fontSize: '0.75rem' }}>
                                                                        <span>Paid by <span className="fw-bold text-dark">{exp.paidBy?.participantName}</span></span>
                                                                    </div>
                                                                </Col>

                                                                {/* Amount & Actions */}
                                                                <Col xs="auto" className="text-end border-start ps-4">
                                                                    <div className="fw-bold h5 mb-0" style={{ color: '#2d3436' }}>
                                                                        <span style={{ fontSize: '0.9rem', marginRight: '2px' }}>₹</span>
                                                                        {exp.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                                    </div>

                                                                    <div className="mt-2">
                                                                        {trip.tripStatus === 'ACTIVE' && (
                                                                            <button
                                                                                className="btn btn-link p-0 text-decoration-none fw-bold"
                                                                                style={{ fontSize: '0.7rem', color: theme.color }}
                                                                                onClick={() => handleEditClick(exp)}
                                                                            >
                                                                                <i className="bi bi-pencil-square me-1"></i>EDIT
                                                                            </button>

                                                                        )}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                }
                            </Col>

                            {/* SIDEBAR*/}
                            <Col lg={5}>
                                {/* TRIP SETTLEMENT OVERVIEW */}
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <h5 className="fw-bold mb-0" style={{ color: '#2d3436' }}>
                                            Trip Settlement
                                        </h5>
                                        <small className="text-muted">
                                            Overview of member balances
                                        </small>
                                    </div>
                                </div>

                                <Card className="border-0 shadow-sm rounded-4 p-4 bg-white" style={{ maxHeight: '56vh', overflowY: 'auto', paddingRight: '10px' }}>

                                    {compLoading ? <ComponentLoader message='Recalculating balances...'/> : 
                                        balances.map((member, index) => {

                                        const balance = calculateBalance(member);
                                        const isPositive = balance >= 0;

                                        return (
                                            <div key={index} className="mb-3 pb-2 border-bottom">

                                                {/* MEMBER SUMMARY */}
                                                <div className="d-flex justify-content-between align-items-center">

                                                    <div>
                                                        <div className="fw-bold">
                                                            <i className="bi bi-person-circle me-1 text-primary"></i>
                                                            {member.participant.participantName}
                                                        </div>

                                                        <div className="small text-muted">
                                                            Paid ₹{member.amountPaidInTrip.toFixed(2)} • Share ₹{member.shareAmount.toFixed(2)}
                                                        </div>
                                                    </div>

                                                    <div className="text-end">

                                                        <div className={`fw-bold ${isPositive ? "text-success" : "text-danger"}`}>
                                                            {isPositive
                                                                ? `+ ₹${balance.toFixed(2)}`
                                                                : `- ₹${Math.abs(balance).toFixed(2)}`
                                                            }
                                                        </div>

                                                        <button
                                                            className="btn btn-link p-0 small"
                                                            onClick={() =>
                                                                setExpandedMember(
                                                                    expandedMember === member.participant.participantUID
                                                                        ? null
                                                                        : member.participant.participantUID
                                                                )
                                                            }
                                                        >
                                                            {expandedMember === member.participant.participantUID
                                                                ? "Hide Details"
                                                                : "View Details"}
                                                        </button>

                                                    </div>

                                                </div>

                                                {/* EXPENSE BREAKDOWN */}
                                                {expandedMember === member.participant.participantUID && (
                                                    <div className="mt-2 ps-2">

                                                        {member.listExpensesToBePaid.map((exp, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="d-flex justify-content-between small text-muted mb-1"
                                                            >
                                                                <span>{exp.expenseDesc.replaceAll("_", " ").substring(0, 25)}...</span>

                                                                <span className="fw-bold text-dark">
                                                                    ₹{exp.amountToBePaid.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ))}

                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })}
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>

            <AddExpenseModal
                show={showExpenseModal}
                onHide={() => {
                    setShowExpenseModal(false);
                    setEditingExpense(null);
                }}
                trip={trip}
                token={user.token}
                onExpenseAdded={handleExpenseAdded}
                editData={editingExpense}
                theme={theme}
            />
        </div>
    );
};

export default TripDetailsPage;