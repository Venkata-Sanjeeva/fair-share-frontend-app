import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import TripCard from './TripCard';
import CreateTripModal from './modal_popups/CreateTripModal';
import axios from 'axios';
import ComponentLoader from './loaders/ComponentLoader';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
    const [showModal, setShowModal] = useState(false);
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Move the data retrieval up, but don't return early here
    const userData = localStorage.getItem('fs_user');
    const token = userData ? JSON.parse(userData).token : null;

    useEffect(() => {
        // 2. Handle the "No User" logic inside the effect
        if (!userData) {
            navigate('/login');
            return;
        }

        const fetchTrips = async () => {
            try {
                const response = await axios.get(`${API_URL}/trip/my-trips`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrips(response.data?.data);
            } catch (err) {
                console.error("Failed to load trips", err);
            } finally {
                setTimeout(() => setIsLoading(false), 1000); // Small delay for better UX
            }
        };

        fetchTrips();
    }, [token, navigate, userData]); // Added dependencies for safety

    // 3. Optional: Add a safety check in the render if token is missing
    if (!token) return null;

    const handleCreateTrip = (newTrip) => {
        setTrips([newTrip, ...trips]);
        window.location.reload(); // Refresh to show the new trip in the list
    };

    const handleStatusUpdate = async (tripUID, newStatus) => {
        setIsLoading(true);
        try {
            // url is 1st arg, body is 2nd arg, config (headers) is 3rd arg
            const response = await axios.put(
                `${API_URL}/trip/${tripUID}/update/status?newStatus=${newStatus}`,
                {}, // Empty body
                {
                    headers: { Authorization: `Bearer ${token}` } // Correct config location
                }
            );

            console.log("Status update response:", response.data?.data);

            // Update local state instead of reloading
            setTrips(prev => prev.map(t =>
                t.tripUID === tripUID ? { ...t, tripStatus: newStatus } : t
            ));
        } catch (err) {
            console.error("Failed to update status", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-end mb-5">
                <div>
                    <h1 className="fw-bold mb-0">My Trips</h1>
                    <p className="text-muted mb-0">Manage your group expenses easily.</p>
                </div>
                <Button
                    variant="success"
                    className="rounded-pill shadow-sm px-4 py-2 fw-bold d-flex align-items-center"
                    onClick={() => setShowModal(true)}
                >
                    <span className="fs-4 me-2">+</span> New Trip
                </Button>
            </div>

            <Row className="mt-4" style={{ overflowY: 'auto', maxHeight: '56vh' }}>
                {isLoading ? (
                    <Col className="text-center py-5">
                        {/* Using your custom loader component here */}
                        <div className="d-flex flex-column align-items-center justify-content-center">
                            <ComponentLoader message="Loading your trips..." />
                        </div>
                    </Col>
                ) : !trips || trips.length === 0 ? (
                    <Col className="text-center">
                        <div className="p-5 bg-white rounded-4 shadow-sm border">
                            <h3 className="text-muted fw-light">No trips found</h3>
                            <p className="small text-muted mb-4">You haven't added any trips yet. Ready for a new adventure?</p>
                            <Button variant="primary" className="rounded-pill px-4" onClick={() => setShowModal(true)}>
                                Create Your First Trip
                            </Button>
                        </div>
                    </Col>
                ) : (
                    trips.map((trip) => (
                        <Col lg={4} md={6} key={trip.tripUID} className="mb-4">
                            <TripCard trip={trip} onStatusUpdate={handleStatusUpdate} />
                        </Col>
                    ))
                )}
            </Row>
            <CreateTripModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onCreate={handleCreateTrip}
                token={token}
            />
        </Container>
    );
};

export default Dashboard;