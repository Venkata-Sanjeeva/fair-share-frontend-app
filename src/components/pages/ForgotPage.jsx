import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ButtonLoader from '../loaders/ButtonLoader';
import useAlert from '../utils/ShowAlert'; // Using your hook
import axios from 'axios';
import { validateEmail } from '../utils/Validations';
import FairShareNavbar from "../FairShareNavbar";

const API_URL = process.env.REACT_APP_API_URL;

const ForgotPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const { alert, showAlert } = useAlert(); // Hook initialization

    const handleReset = async (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const emailError = validateEmail(email);
        if (emailError) return showAlert(emailError, "warning");

        setIsSubmitting(true);

        try {
            // Simulate/Call your Spring Boot API
            const response = await axios.post(`${API_URL}/auth/forgot-password?email=${email}`);

            const message = response.data;
            console.log("API Response:", message);

            setSubmitted(true);
            showAlert("Recovery link sent successfully!", "success");
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Something went wrong. Please try again.";
            showAlert(errorMsg, "danger");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <FairShareNavbar user={null} onLogout={null} />

            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Card className="auth-card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                    <h2 className="text-center mb-3 fw-bold">Reset Password</h2>

                    {/* Consistent Alert UI */}
                    {alert.show && (
                        <Alert variant={alert.variant} className="text-center py-2 small mb-3 shadow-sm">
                            {alert.message}
                        </Alert>
                    )}

                    {!submitted ? (
                        <>
                            <p className="text-muted text-center mb-4 small">
                                Enter your email and we'll send you a link to get back into your account.
                            </p>
                            <Form onSubmit={handleReset}>
                                <Form.Group className="mb-4">
                                    <Form.Control
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                        name='email'
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100 btn-primary-grad py-2 mb-3" disabled={isSubmitting}>
                                    {isSubmitting ? <ButtonLoader message="Sending..." /> : "Send Reset Link"}
                                </Button>
                            </Form>
                        </>
                    ) : (
                        <div className="text-center py-3">
                            <p className="small text-muted mb-4">
                                If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
                            </p>
                            <Button variant="outline-primary" className="w-100 rounded-pill" onClick={() => navigate('/login')}>
                                Return to Login
                            </Button>
                        </div>
                    )}

                    {!submitted && (
                        <div className="text-center">
                            <span onClick={() => navigate('/login')} className="text-secondary small cursor-pointer" style={{ cursor: 'pointer' }}>
                                Back to Login
                            </span>
                        </div>
                    )}
                </Card>
            </Container>
        </>
    );
};

export default ForgotPage;