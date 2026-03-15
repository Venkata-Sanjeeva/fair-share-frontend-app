import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ButtonLoader from '../loaders/ButtonLoader';
import axios from 'axios';
import useAlert from '../utils/ShowAlert';
import { validateEmail, validatePassword, validateFullName } from '../utils/Validations';
import FairShareNavbar from "../FairShareNavbar";

const API_URL = process.env.REACT_APP_API_URL;

const RegisterPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { alert, showAlert } = useAlert();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        const name = e.target.elements.fullName.value;
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        const confirmPassword = e.target.elements.confirmPassword.value;

        // 1. Run Validations
        const nameError = validateFullName(name);
        const emailError = validateEmail(email);
        const passError = validatePassword(password);

        if (nameError) return showAlert(nameError, "warning");
        if (emailError) return showAlert(emailError, "warning");
        if (passError) return showAlert(passError, "warning");
        if (password !== confirmPassword) return showAlert("Passwords do not match!", "danger");

        setIsSubmitting(true);

        try {
            // 2. API Call to Spring Boot
            const response = await axios.post(`${API_URL}/auth/register/user`, {
                name,
                email,
                password
            });

            if (response.status === 201 || response.status === 200) {
                showAlert("Account created! Redirecting to login...", "success");
                // Delay to allow user to read the success message
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Registration failed. Try again.";
            showAlert(errorMsg, "danger");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <FairShareNavbar user={null} handleLogout={null} />

            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Card className="auth-card shadow" style={{ maxWidth: '450px', width: '100%' }}>
                    <h2 className="text-center mb-4 fw-bold">Create Account</h2>

                    {/* Alert Feedback */}
                    {alert.show && (
                        <Alert variant={alert.variant} className="text-center py-2 small shadow-sm">
                            {alert.message}
                        </Alert>
                    )}

                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-3">
                            <Form.Control name="fullName" type="text" placeholder="Full Name" required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control name="email" type="email" placeholder="Email Address" required />
                        </Form.Group>

                        <Form.Group className="mb-3 position-relative">

                            <Form.Control
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                required
                                className="pe-5"
                            />

                            <i
                                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "15px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    color: "#6c757d"
                                }}
                            ></i>

                        </Form.Group>

                        <Form.Group className="mb-4 position-relative">

                            <Form.Control
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                required
                                className="pe-5"
                            />

                            <i
                                className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: "absolute",
                                    right: "15px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    color: "#6c757d"
                                }}
                            ></i>

                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 btn-primary-grad py-2" disabled={isSubmitting}>
                            {isSubmitting ? <ButtonLoader message="Signing up..." /> : "Register"}
                        </Button>
                    </Form>

                    <div className="text-center mt-3 small">
                        <p>Already have an account? <span onClick={() => navigate('/login')} className="text-primary cursor-pointer" style={{ cursor: 'pointer' }}>Login</span></p>
                    </div>
                </Card>
            </Container>
        </>
    );
};

export default RegisterPage;