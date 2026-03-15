import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'; // Import Alert
import { useNavigate } from 'react-router-dom';
import ButtonLoader from '../loaders/ButtonLoader';
import axios from 'axios';
import useAlert from '../utils/ShowAlert';
import { validateEmail } from '../utils/Validations';
import FairShareNavbar from "../FairShareNavbar";

const API_URL = process.env.REACT_APP_API_URL;

const LoginPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { alert, showAlert } = useAlert();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;

        const emailError = validateEmail(email);
        if (emailError) return showAlert(emailError, "warning");
        if (!password) return showAlert("Please enter your password.", "warning");

        setIsSubmitting(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const data = response?.data?.data;

            if (data?.token) {
                localStorage.setItem('fs_user', JSON.stringify({
                    userUID: data.userUID,
                    email: data.email,
                    token: data.token,
                    role: data.role
                }));

                showAlert("Login successful!", 'success');
                // Give the user a moment to see the success alert before navigating
                setTimeout(() => navigate('/dashboard'), 1500);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
            showAlert(errorMessage, "danger");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <FairShareNavbar user={null} onLogout={null} />

            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Card className="auth-card shadow" style={{ maxWidth: '400px', width: '100%' }}>
                    <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>

                    {/* IMPORTANT: Render the alert here */}
                    {alert.show && (
                        <Alert variant={alert.variant} className="text-center py-2 small shadow-sm">
                            {alert.message}
                        </Alert>
                    )}

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Control name="email" type="email" placeholder="Email" required />
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
                        <Button variant="primary" type="submit" className="w-100 btn-primary-grad py-2" disabled={isSubmitting}>
                            {isSubmitting ? <ButtonLoader message="Logging in..." /> : "Login"}
                        </Button>
                    </Form>

                    {/* ... Footer links ... */}
                    <div className="text-center mt-3 small">
                        <p onClick={() => navigate('/forgot-password')} className="text-primary cursor-pointer" style={{ cursor: 'pointer' }}>Forgot Password?</p>
                        <p>New to FairShare? <span onClick={() => navigate('/register')} className="text-primary cursor-pointer" style={{ cursor: 'pointer' }}>Sign Up</span></p>
                    </div>
                </Card>
            </Container>
        </>
    );
};

export default LoginPage;