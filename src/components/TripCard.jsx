import React from 'react';
import { Card, Button, Badge, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TripCard = ({ trip, onStatusUpdate }) => {
    const navigate = useNavigate();
    // Helper to define badge color based on status

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'completed': return 'secondary';
            default: return 'primary';
        }
    };

    const handleViewDetails = () => {
        // Navigate to /trip/trip_12345
        navigate(`/trip/${trip.tripUID}`);
    };

    return (
        <Card className="auth-card p-0 overflow-hidden mb-4 border-0 shadow-sm h-100">
            <div className="bg-primary p-2 text-white d-flex justify-content-between align-items-center px-3">
                <small className="fw-bold text-uppercase">{trip.tripType}</small>
                <div className="d-flex gap-2">
                    <Badge bg="light" text={getStatusColor(trip.tripStatus)} className="rounded-pill shadow-sm">
                        {trip.tripStatus || 'Active'}
                    </Badge>
                </div>
            </div>

            <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <Card.Title className="h4 fw-bold mb-1 text-dark">{trip.tripName}</Card.Title>
                        <p className="text-muted small mb-3">Created: {new Date(trip.createdAt).toLocaleDateString()}</p>
                    </div>
                    {/* Status Update Dropdown */}
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="link" className="text-muted p-0 border-0">
                            <i className="bi bi-three-dots-vertical"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="shadow-sm border-0">
                            <Dropdown.Header>Change Status</Dropdown.Header>
                            <Dropdown.Item onClick={() => onStatusUpdate(trip.tripUID, 'ACTIVE')}>Mark Active</Dropdown.Item>
                            <Dropdown.Item onClick={() => onStatusUpdate(trip.tripUID, 'COMPLETED')}>Mark Completed</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

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