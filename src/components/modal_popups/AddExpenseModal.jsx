import { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const AddExpenseModal = ({ show, onHide, trip, token, onExpenseAdded, editData, theme }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [amount, setAmount] = useState(editData?.totalAmount || 0);
    const [involvedMembers, setInvolvedMembers] = useState([]);

    // Sync state when modal opens or editData changes
    useEffect(() => {
        if (show) {
            setAmount(editData?.totalAmount || 0);
            setInvolvedMembers(editData ? editData.splits.map(s => s.participantName) : trip.participants);
        }
    }, [show, editData, trip.participants]);

    const handleCheckboxChange = (member) => {
        setInvolvedMembers(prev =>
            prev.includes(member) ? prev.filter(m => m !== member) : [...prev, member]
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
                response = await axios.put(`${API_URL}/expenses/update/${trip.tripUID}/${editData.expenseUID}`, expenseData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                response = await axios.post(`${API_URL}/expenses/create`, expenseData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            onExpenseAdded(response.data?.data);
            onHide();
        } catch (err) {
            console.error("Failed to save expense", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered contentClassName="border-0 shadow-lg rounded-4">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold ps-2" style={{ color: '#2d3436' }}>
                    {editData ? "📝 Edit Expense" : "💸 New Expense"}
                </Modal.Title>
            </Modal.Header>
            
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="px-4 pt-3">
                    {/* Amount Hero Input */}
                    <div className="text-center mb-4 p-3 rounded-4" style={{ background: '#f8f9fa' }}>
                        <label className="text-muted small fw-bold text-uppercase mb-1 d-block">Total Amount</label>
                        <InputGroup className="justify-content-center border-0">
                            <InputGroup.Text className="bg-transparent border-0 fs-3 fw-bold text-dark pe-1">₹</InputGroup.Text>
                            <Form.Control
                                name="amount"
                                type="number"
                                step="0.01"
                                className="bg-transparent border-0 fs-1 fw-black p-0 text-dark"
                                style={{ width: '150px', fontWeight: '800', outline: 'none', boxShadow: 'none' }}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </InputGroup>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-muted text-uppercase">Description</Form.Label>
                        <Form.Control
                            name="description"
                            className="rounded-3 border-light-subtle p-2"
                            defaultValue={editData?.description || ''}
                            placeholder="Lunch, Fuel, Tickets..."
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="small fw-bold text-muted text-uppercase">Who Paid?</Form.Label>
                        <div className="position-relative">
                            <Form.Select name="paidBy" className="rounded-3 border-light-subtle p-2 appearance-none" defaultValue={editData?.paidBy}>
                                {trip.participants.map((person, idx) => (
                                    <option key={idx} value={person}>{person}</option>
                                ))}
                            </Form.Select>
                            <i className="bi bi-person-circle position-absolute" style={{ right: '35px', top: '10px', color: theme.color }}></i>
                        </div>
                    </Form.Group>

                    {/* Split Selector Section */}
                    <div className="rounded-4 p-3 border border-light shadow-sm" style={{ background: '#fff' }}>
                        <Form.Label className="fw-bold small text-dark d-block mb-3">
                            <i className="bi bi-people-fill me-2"></i>Split between:
                        </Form.Label>

                        <div className="d-flex flex-wrap gap-2 mb-3">
                            {trip.participants.map((member, idx) => {
                                const isSelected = involvedMembers.includes(member);
                                return (
                                    <div key={idx}>
                                        <input
                                            type="checkbox"
                                            className="btn-check"
                                            id={`member-${idx}`}
                                            checked={isSelected}
                                            onChange={() => handleCheckboxChange(member)}
                                        />
                                        <label
                                            className={`btn rounded-pill px-3 py-1 small fw-bold transition-all ${
                                                isSelected ? 'shadow-sm' : 'opacity-50'
                                            }`}
                                            style={{
                                                backgroundColor: isSelected ? theme.color : '#eee',
                                                color: isSelected ? '#fff' : '#666',
                                                border: 'none',
                                                fontSize: '0.8rem'
                                            }}
                                            htmlFor={`member-${idx}`}
                                        >
                                            {member}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Live Calculation Footer */}
                        <div className="pt-2 border-top d-flex justify-content-between align-items-center">
                            <span className="text-muted small">Equal Split</span>
                            <div className="text-end">
                                <div className="fw-bold" style={{ color: theme.color }}>
                                    ₹{(amount / (involvedMembers.length || 1)).toFixed(2)} <small className="text-muted">/ person</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className="border-0 px-4 pb-4 pt-0">
                    <Button variant="light" className="rounded-pill px-4 fw-bold text-muted" onClick={onHide}>
                        Discard
                    </Button>
                    <Button 
                        type="submit" 
                        className="rounded-pill px-4 fw-bold shadow-sm" 
                        style={{ backgroundColor: theme.color, border: 'none' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Processing..." : (editData ? "Update Expense" : "Save Expense")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddExpenseModal;