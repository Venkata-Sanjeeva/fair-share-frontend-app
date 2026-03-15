import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FairShareNavbar from "../FairShareNavbar";

const PageNotFound = () => {

    const navigate = useNavigate();

    return (
        <>
            <FairShareNavbar user={null} onLogout={null} />

            <Container
                className="d-flex flex-column justify-content-center align-items-center text-center"
                style={{ height: "80vh" }}
            >

                <h1 style={{ fontSize: "80px", fontWeight: "700" }}>
                    404
                </h1>

                <h3 className="mb-3">
                    Page Not Found
                </h3>

                <p className="text-muted mb-4">
                    The page you are looking for doesn't exist or may have been moved.
                </p>

                <Button
                    variant="primary"
                    className="btn-primary-grad px-4"
                    onClick={() => navigate("/")}
                >
                    Go to Home
                </Button>

            </Container>
        </>
    );
};

export default PageNotFound;