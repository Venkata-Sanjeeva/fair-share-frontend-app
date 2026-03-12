// src/utils/Validations.js

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required.";
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    return null;
};

export const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters long.";
    // Optional: Add regex for a capital letter or number here
    return null;
};

export const validateFullName = (name) => {
    if (!name || name.trim().length < 2) return "Please enter your full name.";
    return null;
};