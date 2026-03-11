import { Spinner } from "react-bootstrap";

const ComponentLoader = ({ message = "Loading data..." }) => (
  <div className="d-flex flex-column align-items-center my-5 w-100">
    <Spinner animation="grow" variant="primary" role="status" size="md">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    <p className="mt-3 text-muted small fw-medium text-uppercase tracking-wide">
      {message}
    </p>
  </div>
);

export default ComponentLoader;