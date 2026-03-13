import React from 'react';
import { Card, Button, Badge, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TripCard = ({ trip, onStatusUpdate }) => {
    const navigate = useNavigate();

    // Configuration for colors based on status
    const statusTheme = {
        ACTIVE: { color: '#00d2ff', gradient: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)', icon: 'bi-rocket-takeoff' },
        COMPLETED: { color: '#00b894', gradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', icon: 'bi-patch-check' },
        CREATED: { color: '#6c5ce7', gradient: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)', icon: 'bi-wallet2' }
    };

    const currentStatus = trip.tripStatus?.toUpperCase() || 'ACTIVE';
    const theme = statusTheme[currentStatus] || statusTheme.ACTIVE;

    return (
        <Card className="h-100 border-0 shadow-sm position-relative overflow-hidden"
            style={{ borderRadius: '15px', background: '#fff' }}>

            {/* Left Status Accent Strip */}
            <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '6px',
                background: theme.gradient
            }} />

            <Card.Body className="ps-4 pe-3 py-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <Badge bg="none" className="text-uppercase mb-2 p-0"
                            style={{ color: theme.color, fontSize: '0.7rem', letterSpacing: '1px' }}>
                            <i className={`bi ${theme.icon} me-1`}></i> {currentStatus}
                        </Badge>
                        <Card.Title className="fw-bold h5 mb-1" style={{ color: '#2d3436' }}>
                            {trip.tripName}
                        </Card.Title>
                    </div>

                    <Dropdown align="end">
                        <Dropdown.Toggle
                            variant="link"
                            className="text-muted p-0 border-0 no-caret d-flex align-items-center justify-content-center"
                            id={`dropdown-${trip.tripUID}`}
                            style={{ boxShadow: 'none' }} // Removes the focus ring
                        >
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '32px', height: '32px', transition: 'background 0.2s' }}>
                                <i className="bi bi-three-dots-vertical fs-5"></i>
                            </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow border-0 rounded-3 mt-2">
                            <Dropdown.Header className="small text-uppercase fw-bold">Trip Status</Dropdown.Header>
                            <Dropdown.Item className="small py-2" onClick={() => onStatusUpdate(trip.tripUID, 'ACTIVE')}>
                                <i className="bi bi-circle-fill me-2 text-info" style={{ fontSize: '8px' }}></i> Mark as Active
                            </Dropdown.Item>
                            <Dropdown.Item className="small py-2" onClick={() => onStatusUpdate(trip.tripUID, 'COMPLETED')}>
                                <i className="bi bi-circle-fill me-2 text-success" style={{ fontSize: '8px' }}></i> Mark as Completed
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <p className="text-muted small mb-4">
                    Created: {new Date(trip.createdAt).toLocaleDateString()}
                </p>

                {/* Stats Row */}
                <div className="d-flex gap-4 mb-4">
                    <div className="text-start">
                        <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: '600' }}>MEMBERS</div>
                        <div className="fw-bold" style={{ color: '#636e72' }}>
                            {trip.participants?.length || 0} <span className="small fw-normal">People</span>
                        </div>
                    </div>
                    <div className="text-start border-start ps-4">
                        <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: '600' }}>TYPE</div>
                        <div className="fw-bold" style={{ color: '#636e72' }}>
                            {trip.tripType === 'solo' ? '👤 Solo' : '👥 Group'}
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-auto">
                    {/* Group Avatars and "More" text together so they stay on the left */}
                    <div className="d-flex align-items-center">
                        <div className="avatar-stack d-flex">
                            {trip.participants?.slice(0, 3).map((p, i) => (
                                <div key={i} className="rounded-circle border border-2 border-white bg-light d-flex align-items-center justify-content-center shadow-sm"
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        marginLeft: i > 0 ? '-10px' : '0',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        zIndex: 3 - i // Ensures first avatar is on top
                                    }}>
                                    {p.substring(0, 1).toUpperCase()}
                                </div>
                            ))}
                        </div>

                        {/* This text is now part of the left-side group */}
                        {trip.participants?.length > 3 && (
                            <div className="text-muted small ms-2" style={{ fontSize: '0.75rem' }}>
                                + {trip.participants?.length - 3} more
                            </div>
                        )}
                    </div>

                    {/* This button will now correctly push to the far right */}
                    <Button
                        variant="link"
                        className="p-0 text-decoration-none fw-bold small d-flex align-items-center"
                        style={{ color: theme.color, fontSize: '0.75rem' }}
                        onClick={() => navigate(`/trip/${trip.tripUID}`)}
                    >
                        VIEW TRIP <i className="bi bi-chevron-right ms-1"></i>
                    </Button>
                </div>
            </Card.Body>

            {/* Subtle Watermark Icon in background */}
            <i className={`bi ${theme.icon}`} style={{
                position: 'absolute',
                right: '-10px',
                bottom: '-10px',
                fontSize: '5rem',
                opacity: '0.03',
                pointerEvents: 'none'
            }} />
        </Card>
    );
};

export default TripCard;