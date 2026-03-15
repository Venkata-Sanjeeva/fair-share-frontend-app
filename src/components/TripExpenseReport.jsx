import React, { useEffect, useState } from "react";
import { Container, Card, Button, Table, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import FairShareNavbar from "./FairShareNavbar";
import ComponentLoader from "./loaders/ComponentLoader";
import "../styles/tripExpenseReport.css";

const API_URL = process.env.REACT_APP_API_URL;

const TripExpenseReport = () => {

    const { tripUID } = useParams();

    const [report, setReport] = useState(null);
    const [notes, setNotes] = useState("");
    const [route, setRoute] = useState("");

    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("fs_user"));

    const fetchReport = async () => {

        try {
            const response = await axios.get(
                `${API_URL}/expenses/calculate/totalShareAmount/${tripUID}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            const data = response.data?.data;
            setReport(data);
        } catch (err) {
            console.error("Error fetching report", err);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const addImage = (e) => {

        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            setImages(prev => [...prev, reader.result]);
        };

        reader.readAsDataURL(file);

        e.target.value = null;
    };

    const exportPDF = () => {

        const element = document.getElementById("tripReport");

        const opt = {
            margin: 10,
            filename: `${report.tripName}_Travel_Report_By_Fair_Share.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 3,
                useCORS: true,
                scrollY: 0
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            }
        };

        html2pdf().set(opt).from(element).save();
    };

    const handleLogout = () => {
        localStorage.removeItem('fs_user');
        navigate('/home');
    };

    return (
        <>
            <FairShareNavbar user={user} handleLogout={handleLogout}/>
            {!report ? <ComponentLoader message="Loading Trip Expense Report..." /> :
                (<Container className="py-4">
                    <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none text-muted mb-3 p-0 small">
                        <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
                    </Button>
                    <div className="d-flex justify-content-between mb-3">

                        <h2>Trip Expense Report</h2>

                        <Button onClick={exportPDF}>
                            Export PDF
                        </Button>

                    </div>

                    <Card className="p-4 shadow-sm">
                        <div id="tripReport">

                            {images.length > 0 && (
                                <img
                                    src={images[0]}
                                    alt="Trip Cover"
                                    className="trip-cover"
                                />
                            )}

                            {/* Trip Title */}
                            <div className="travel-header text-center">

                                <h1 className="travel-title">
                                    {report.tripName.replaceAll("_", " ")}
                                </h1>

                                <p className="travel-subtitle">
                                    Travel Expense Summary
                                </p>
                            </div>

                            {/* Trip Summary */}
                            <div className="trip-summary-grid">

                                <div className="summary-card">
                                    <span className="summary-label">Total Trip Cost</span>
                                    <span className="summary-value">₹{report.totalTripAmount.toFixed(2)}</span>
                                </div>

                                <div className="summary-card">
                                    <span className="summary-label">Participants</span>
                                    <span className="summary-value">{report.tripParticipants.length}</span>
                                </div>

                                <div className="summary-card">
                                    <span className="summary-label">Generated On</span>
                                    <span className="summary-value">{new Date().toLocaleDateString()}</span>
                                </div>

                            </div>

                            <hr />

                            {/* Participant Settlement Summary */}
                            <div className="report-section">

                                <div className="report-section-header">
                                    <h3>Settlement Summary</h3>
                                    <p>Overview of how much each participant paid and owes</p>
                                </div>

                                <div className="participant-grid">
                                    {report.tripParticipants.map((p) => {

                                        const balance = p.amountPaidInTrip - p.shareAmount;

                                        return (
                                            <div className="participant-card" key={p.participant.participantUID}>

                                                <h5>{p.participant.participantName}</h5>

                                                <p>Paid ₹{p.amountPaidInTrip.toFixed(2)}</p>

                                                <p>Share ₹{p.shareAmount.toFixed(2)}</p>

                                                <p className={balance >= 0 ? "balance-positive" : "balance-negative"}>
                                                    {balance >= 0 ? "Gets" : "Owes"} ₹{Math.abs(balance).toFixed(2)}
                                                </p>

                                            </div>
                                        )
                                    })}
                                </div>

                            </div>

                            {/* Expense Split Per Person */}
                            <div className="report-section">

                                <div className="report-section-header">
                                    <h3>Expense Breakdown</h3>
                                    <p>Detailed expense distribution for each participant</p>
                                </div>

                                {report.tripParticipants.map((p) => (
                                    <div className="expense-section" key={p.participant.participantUID}>

                                        <div className="expense-header">
                                            <h4>{p.participant.participantName}</h4>
                                        </div>

                                        <Table bordered size="sm">

                                            <thead>
                                                <tr>
                                                    <th>Expense</th>
                                                    <th>Total Amount</th>
                                                    <th>Share Amount</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {p.listExpensesToBePaid.map((e) => (
                                                    <tr key={e.expenseUID}>
                                                        <td>{e.expenseDesc.replaceAll("_", " ")}</td>
                                                        <td>₹{e.totalExpenseAmount.toFixed(2)}</td>
                                                        <td>₹{e.amountToBePaid.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </Table>

                                    </div>
                                ))}

                            </div>
                            {/* Route Section */}

                            <div className="travel-section">

                                <h3>Route Taken</h3>

                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter route taken during the trip..."
                                    value={route}
                                    onChange={(e) => setRoute(e.target.value)}
                                    className="mb-2"
                                />

                                <div className="travel-box">
                                    {route || "Route preview will appear here"}
                                </div>

                            </div>

                            {/* Notes */}

                            <div className="travel-section">

                                <h3>Trip Notes</h3>

                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Write memories or notes about the trip..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="mb-2"
                                />

                                <div className="travel-box">
                                    {notes || "Notes preview will appear here"}
                                </div>

                            </div>

                            {/* Images */}

                            <div className="travel-section">

                                <h3>Trip Memories</h3>

                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={addImage}
                                    className="mb-3"
                                />

                                <div className="memory-grid">

                                    {images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            className="memory-img"
                                            alt="trip memory"
                                        />
                                    ))}

                                </div>

                            </div>

                        </div>
                    </Card>

                    <div className="report-footer">

                        <hr />

                        <p>
                            This report was automatically generated by FairShare.
                        </p>

                    </div>

                </Container>)
            }
        </>
    );

};

export default TripExpenseReport;