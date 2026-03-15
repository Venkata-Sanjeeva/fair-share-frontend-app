import { useNavigate } from "react-router-dom";
import FairShareNavbar from "../FairShareNavbar";
import { Button, Container } from "react-bootstrap";

const LandingPage = () => {
    const navigate = useNavigate();
    const user = localStorage.getItem("fs_user");

    if (user) {
        navigate("/dashboard");
    }

    return (
        <div className="fairshare-app">
            <FairShareNavbar user={user} handleLogout={null} />

            <div className="hero-gradient text-center">
                <Container>
                    <h1 className="display-3 fw-bold mb-3">
                        Split Bills, Keep Friends.
                    </h1>

                    <p className="lead mb-5 opacity-75">
                        The ultimate expense tracker for your trips.
                    </p>

                    <Button
                        variant="light"
                        size="lg"
                        className="px-5 py-3 fw-bold"
                        onClick={() => navigate('/register')}
                    >
                        Start Your First Trip
                    </Button>
                </Container>
            </div>
        </div>
    );
};

export default LandingPage;