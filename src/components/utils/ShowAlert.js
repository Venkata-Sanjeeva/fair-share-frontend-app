import { useState } from "react";

const useAlert = () => {
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

    // Helper function to trigger alerts
    const showAlert = (msg, type) => {
        setAlert({ show: true, message: msg, variant: type });
        // Auto-hide after 3 seconds
        setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
    };

    return { alert, showAlert };
};

export default useAlert;