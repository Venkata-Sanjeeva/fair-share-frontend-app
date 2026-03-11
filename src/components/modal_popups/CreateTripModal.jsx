import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, Badge, ButtonGroup, ToggleButton } from 'react-bootstrap';
import ButtonLoader from '../loaders/ButtonLoader';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const CreateTripModal = ({ show, onHide, onCreate, token = "" }) => {
    const [tripName, setTripName] = useState('');
    const [tripType, setTripType] = useState('group'); // 'group' or 'solo'
    const [memberName, setMemberName] = useState('');
    const [participants, setParticipants] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);



    const handleAddMember = () => {
        if (memberName.trim() !== "") {
            setParticipants([...participants, memberName.trim()]);
            setMemberName('');
        }
    };

    const removeMember = (index) => {
        setParticipants(participants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (tripType === 'group' && participants.length === 0) {
            alert("Please add at least one friend for a group trip!");
            return;
        }

        setIsSubmitting(true);

        // Get your token safely
        const userData = localStorage.getItem('fs_user');
        const token = userData ? JSON.parse(userData).token : null;

        const tripObj = {
            tripName,
            tripType,
            participants: tripType === 'solo' ? ['Me'] : participants
        };

        try {
            // 1. Send data to Spring Boot
            const response = await axios.post(`${API_URL}/trip/create`, tripObj, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // 2. SUCCESS: Tell Dashboard to add this to the list
            // Assuming your backend returns the saved trip object with its new ID
            onCreate(response.data);

            // 3. Close the modal
            onHide();

        } catch (error) {
            console.error("Error creating trip:", error);
            // Optional: show an alert here using your useAlert hook
        } finally {
            // Reset local form state
            setTripName('');
            setParticipants([]);
            setTripType('group');
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="auth-modal">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">Start Your Journey</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-4">
                <Form onSubmit={handleSubmit}>

                    {/* Trip Type Toggle */}
                    <Form.Group className="mb-4 text-center">
                        <Form.Label className="small fw-bold text-muted text-uppercase d-block mb-3">Trip Type</Form.Label>
                        <ButtonGroup className="w-100">
                            <ToggleButton
                                id="tgl-group"
                                type="radio"
                                variant={tripType === 'group' ? 'primary' : 'outline-primary'}
                                name="radio"
                                value="group"
                                checked={tripType === 'group'}
                                onChange={(e) => setTripType(e.currentTarget.value)}
                            >
                                👥 Group
                            </ToggleButton>
                            <ToggleButton
                                id="tgl-solo"
                                type="radio"
                                variant={tripType === 'solo' ? 'primary' : 'outline-primary'}
                                name="radio"
                                value="solo"
                                checked={tripType === 'solo'}
                                onChange={(e) => setTripType(e.currentTarget.value)}
                            >
                                👤 Solo
                            </ToggleButton>
                        </ButtonGroup>
                    </Form.Group>

                    {/* Trip Name */}
                    <Form.Group className="mb-4">
                        <Form.Label className="small fw-bold text-muted text-uppercase">Trip Name</Form.Label>
                        <Form.Control
                            placeholder={tripType === 'solo' ? "e.g. My Solo Retreat" : "e.g. Puducherry 2026"}
                            value={tripName}
                            onChange={(e) => setTripName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Conditional Rendering: Friends Section */}
                    {tripType === 'group' && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-muted text-uppercase">Add Friends</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        placeholder="Enter friend's name"
                                        value={memberName}
                                        onChange={(e) => setMemberName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
                                    />
                                    <Button variant="outline-primary" onClick={handleAddMember}>Add</Button>
                                </InputGroup>
                            </Form.Group>

                            <div className="mb-4 d-flex flex-wrap gap-2">
                                {participants.map((name, index) => (
                                    <Badge key={index} bg="info" className="p-2 d-flex align-items-center rounded-pill">
                                        {name}
                                        <span className="ms-2" onClick={() => removeMember(index)} style={{ cursor: 'pointer' }}>&times;</span>
                                    </Badge>
                                ))}
                                {participants.length === 0 && <small className="text-muted">No friends added yet.</small>}
                            </div>
                        </>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-100 btn-primary-grad py-3 fw-bold rounded-3 mt-2"
                        disabled={isSubmitting || !tripName}
                    >
                        {isSubmitting ? <ButtonLoader message="Preparing Trip..." /> : "Start Splitting"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateTripModal;