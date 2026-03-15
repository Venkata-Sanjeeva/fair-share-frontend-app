import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FairShareNavbar from "../FairShare";

const API_URL = process.env.REACT_APP_API_URL;

const ResetPasswordPage = () => {

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [alert, setAlert] = useState({ show:false, message:"", variant:"" });
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {

        e.preventDefault();

        if(password !== confirmPassword){
            setAlert({
                show:true,
                variant:"danger",
                message:"Passwords do not match"
            });
            return;
        }

        try{

            setLoading(true);

            await axios.post(`${API_URL}/auth/reset-password`,{
                token,
                newPassword:password
            });

            setAlert({
                show:true,
                variant:"success",
                message:"Password reset successfully"
            });

            setTimeout(()=>{
                navigate("/login");
            },2000)

        }catch(err){

            setAlert({
                show:true,
                variant:"danger",
                message: err.response?.data?.message || "Reset failed"
            });

        }finally{
            setLoading(false);
        }

    }

    return (
        <>
            <FairShareNavbar user={null} onLogout={null}/>

            <Container className="d-flex justify-content-center align-items-center vh-100">

                <Card className="auth-card shadow" style={{maxWidth:'450px',width:'100%'}}>

                    <h2 className="text-center mb-4 fw-bold">
                        Reset Password
                    </h2>

                    {alert.show && (
                        <Alert variant={alert.variant} className="text-center small">
                            {alert.message}
                        </Alert>
                    )}

                    <Form onSubmit={handleResetPassword}>

                        {/* Password */}

                        <Form.Group className="mb-3 position-relative">

                            <Form.Control
                                type={showPassword ? "text":"password"}
                                placeholder="New Password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                required
                                className="pe-5"
                            />

                            <i
                                className={`bi ${showPassword ? "bi-eye-slash":"bi-eye"}`}
                                onClick={()=>setShowPassword(!showPassword)}
                                style={{
                                    position:"absolute",
                                    right:"15px",
                                    top:"50%",
                                    transform:"translateY(-50%)",
                                    cursor:"pointer"
                                }}
                            ></i>

                        </Form.Group>

                        {/* Confirm Password */}

                        <Form.Group className="mb-4 position-relative">

                            <Form.Control
                                type={showConfirmPassword ? "text":"password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                                required
                                className="pe-5"
                            />

                            <i
                                className={`bi ${showConfirmPassword ? "bi-eye-slash":"bi-eye"}`}
                                onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position:"absolute",
                                    right:"15px",
                                    top:"50%",
                                    transform:"translateY(-50%)",
                                    cursor:"pointer"
                                }}
                            ></i>

                        </Form.Group>

                        <Button
                            type="submit"
                            className="w-100 btn-primary-grad"
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>

                    </Form>

                </Card>

            </Container>
        </>
    )
}

export default ResetPasswordPage;