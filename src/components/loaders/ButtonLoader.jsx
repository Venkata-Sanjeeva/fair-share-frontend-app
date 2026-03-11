const ButtonLoader = ({ message = "Processing..." }) => (
  <div className="d-flex align-items-center justify-content-center gap-2">
    <div className="dot-loader">
      <span></span><span></span><span></span>
    </div>
    <span className="small fw-medium">{message}</span>
  </div>
);

export default ButtonLoader;