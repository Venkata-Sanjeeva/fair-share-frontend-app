import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TripCard = ({ trip }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        // Navigate to /trip/trip_12345
        navigate(`/trip/${trip.tripUID}`);
    };

    return (
        <Card className="auth-card p-0 overflow-hidden mb-4 border-0 shadow-sm h-100">
            {/* Header with status */}
            <div className="bg-primary p-2 text-white d-flex justify-content-between align-items-center px-3">
                <small className="fw-bold text-uppercase">Trip</small>
                <Badge bg={trip.tripType === 'solo' ? 'secondary' : 'info'} className="rounded-pill">
                    {trip.tripType === 'solo' ? '👤 Solo' : '👥 Group'}
                </Badge>
                <Badge bg="light" text="primary" className="rounded-pill">Active</Badge>
            </div>

            <Card.Body className="p-4">
                <Card.Title className="h4 fw-bold mb-1 text-dark">{trip.tripName}</Card.Title>
                <p className="text-muted small mb-3">Created on: {new Date(trip.createdAt).toLocaleDateString()}</p>

                <div className="d-flex align-items-center mb-4">
                    <div className="avatar-group d-flex">
                        {/* Just a visual representation of members */}
                        <div className="d-flex align-items-center mb-4">
                            <div className="text-muted small">
                                <span className="fw-bold text-primary">Members: </span>
                                {trip.participants && trip.participants.length > 0
                                    ? trip.participants.join(', ')
                                    : 'No members added'}
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    variant="outline-primary"
                    className="w-100 rounded-pill fw-bold py-2"
                    onClick={handleViewDetails}
                >
                    View Details
                </Button>
            </Card.Body>
        </Card>
    );
};

export default TripCard;