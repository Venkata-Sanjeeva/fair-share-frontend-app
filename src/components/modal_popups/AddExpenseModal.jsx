import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const AddExpenseModal = ({ show, onHide, trip, token, onExpenseAdded, editData }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [amount, setAmount] = useState(editData?.totalAmount || 0);
    const [involvedMembers, setInvolvedMembers] = useState(
        editData ? editData.splits.map(s => s.participantName) : trip.participants
    );

    const handleCheckboxChange = (member) => {
        setInvolvedMembers(prev =>
            prev.includes(member)
                ? prev.filter(m => m !== member)
                : [...prev, member]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = e.target.elements;

        const involvedParticipants = involvedMembers.length > 0 ? involvedMembers : trip.participants;

        const expenseData = {
            tripUID: trip.tripUID,
            description: formData.description.value,
            totalAmount: parseFloat(formData.amount.value),
            paidByParticipantName: formData.paidBy.value,
            involvedParticipantNames: involvedParticipants
        };

        setIsSubmitting(true);
        try {
            let response;
            if (editData) {
                // Update existing expense
                response = await axios.put(`${API_URL}/expenses/update/${trip.tripUID}/${editData.expenseUID}`, expenseData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Create new expense
                response = await axios.post(`${API_URL}/expenses/create`, expenseData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            onExpenseAdded(response.data?.data); // This updates the list in parent
            onHide();
        } catch (err) {
            console.error("Failed to add expense", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">
                    {editData ? "Edit Expense" : "Add New Expense"}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            name="description"
                            defaultValue={editData?.description || ''}
                            placeholder="e.g. Dinner at Promenade"
                            required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            name="amount"
                            type="number"
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Who Paid?</Form.Label>
                        <Form.Select name="paidBy" required>
                            {trip.participants.map((person, idx) => (
                                <option key={idx} value={person}>{person}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3 border rounded p-3 bg-light">
                        <Form.Label className="fw-bold mb-3 d-block text-center">
                            Who is involved in this expense?
                        </Form.Label>

                        <div className="d-flex flex-wrap gap-2 justify-content-center">
                            {trip.participants.map((member, idx) => {
                                const isSelected = involvedMembers.includes(member);
                                return (
                                    <div key={idx}>
                                        <input
                                            type="checkbox"
                                            className="btn-check"
                                            id={`btn-check-${idx}`}
                                            checked={isSelected}
                                            onChange={() => handleCheckboxChange(member)}
                                            autoComplete="off"
                                        />
                                        <label
                                            className={`btn rounded-pill px-3 shadow-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary bg-white'
                                                }`}
                                            htmlFor={`btn-check-${idx}`}
                                            style={{ transition: 'all 0.2s ease' }}
                                        >
                                            {isSelected ? '✓ ' : ''}{member}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="text-center mt-3">
                            <small className="text-primary fw-bold">
                                Splitting ₹{amount || 0} among {involvedMembers.length} people
                            </small>
                            <br />
                            <small className="text-muted">
                                (₹{(amount / (involvedMembers.length || 1)).toFixed(2)} each)
                            </small>
                        </div>
                    </Form.Group>
                    <p className="text-muted small">This expense will be split equally among all members.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancel</Button>
                    <Button variant="success" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Add Expense"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddExpenseModal;