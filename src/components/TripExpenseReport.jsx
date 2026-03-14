import React, { useEffect, useState } from "react";
import { Container, Card, Button, Table, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import FairShareNavbar from "./FairShareNavbar";
import ComponentLoader from "./loaders/ComponentLoader";

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

        const reader = new FileReader();

        reader.onloadend = () => {

            setImages(prev => [...prev, reader.result]);

        };

        reader.readAsDataURL(file);

    };

    const exportPDF = () => {

        const element = document.getElementById("tripReport");

        html2pdf()
            .set({
                margin: 10,
                filename: `${report.tripName}_Report.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            })
            .from(element)
            .save();

    };

    return (
        <>
            <FairShareNavbar user={user} />
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

                            {/* Trip Title */}

                            <h1>{report.tripName}</h1>

                            <p>
                                Total Trip Amount : ₹{report.totalTripAmount}
                            </p>

                            <hr />

                            {/* Participant Summary */}

                            <h3>Participants Summary</h3>

                            <Table bordered>

                                <thead>

                                    <tr>
                                        <th>Name</th>
                                        <th>Share Amount</th>
                                        <th>Paid</th>
                                        <th>Balance</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {report.tripParticipants.map((p) => (

                                        <tr key={p.participant.participantUID}>

                                            <td>
                                                {p.participant.participantName}
                                            </td>

                                            <td>
                                                ₹{p.shareAmount.toFixed(2)}
                                            </td>

                                            <td>
                                                ₹{p.amountPaidInTrip.toFixed(2)}
                                            </td>

                                            <td>
                                                ₹{p.totalAmountToBePaid.toFixed(2)}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </Table>

                            {/* Expense Split Per Person */}

                            {report.tripParticipants.map((p) => (

                                <div key={p.participant.participantUID} className="mt-4">

                                    <h4>
                                        {p.participant.participantName}'s Expense Breakdown
                                    </h4>

                                    <Table bordered size="sm">

                                        <thead>

                                            <tr>
                                                <th>Expense</th>
                                                <th>Total Expense</th>
                                                <th>Share</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {p.listExpensesToBePaid.map((e) => (

                                                <tr key={e.expenseUID}>

                                                    <td>{e.expenseDesc}</td>

                                                    <td>
                                                        ₹{e.totalExpenseAmount.toFixed(2)}
                                                    </td>

                                                    <td>
                                                        ₹{e.amountToBePaid.toFixed(2)}
                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </Table>

                                </div>

                            ))}

                            {/* Route Section */}

                            <div className="mt-4">

                                <h3>Route Taken</h3>

                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter route details..."
                                    value={route}
                                    onChange={(e) => setRoute(e.target.value)}
                                />

                            </div>

                            {/* Notes */}

                            <div className="mt-4">

                                <h3>Trip Notes</h3>

                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Write notes for the trip..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />

                            </div>

                            {/* Images */}

                            <div className="mt-4">

                                <h3>Trip Images</h3>

                                <input
                                    type="file"
                                    onChange={addImage}
                                />

                                <div className="d-flex flex-wrap mt-3">

                                    {images.map((img, index) => (

                                        <img
                                            key={index}
                                            src={img}
                                            alt="trip"
                                            style={{
                                                width: "200px",
                                                margin: "10px",
                                                borderRadius: "8px"
                                            }}
                                        />

                                    ))}

                                </div>

                            </div>

                        </div>

                    </Card>

                </Container>)
            }
        </>
    );

};

export default TripExpenseReport;