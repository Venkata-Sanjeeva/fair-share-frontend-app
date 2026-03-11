import { Spinner } from "react-bootstrap";

const PageLoader = ({ message = "Syncing FairShare..." }) => (
  <div 
    className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white" 
    style={{ zIndex: 9999 }}
  >
    <Spinner animation="border" variant="primary" style={{ width: '3.5rem', height: '3.5rem', borderWidth: '0.35rem' }} />
    <h4 className="mt-4 fw-bold text-dark mb-1">FairShare</h4>
    <p className="text-secondary small">{message}</p>
  </div>
);

export default PageLoader;