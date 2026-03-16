📦 FairShare | Full-Stack Trip Expense Tracker
FairShare is a robust web application designed to simplify group finances. It allows users to create trips, manage participants, and track shared expenses with real-time split calculations. Built with a focus on high-performance backend logic and a modern, responsive UI.

🚀 Features
Trip Management: Create "Solo" or "Group" trips with dynamic status tracking (Created, Active, Completed).

Smart Ledger: A timeline-based expense history with custom CSS animations.

Automated Splits: Real-time calculation of "Average per person" and total trip spend.

Modern UI/UX: Features a "Status-Bar" style navigation, custom hover effects, and a theme engine that changes colors based on trip status.

Financial Security: Secure JWT-based authentication and transaction deduplication logic.

PDF Reporting: (Optional) Generate billing summaries and expense reports.

🛠️ Tech Stack
Frontend: React.js, React-Bootstrap, Axios, CSS3 (Custom Animations)

Backend: Java Spring Boot, Spring Security (JWT), Hibernate/JPA

Database: MySQL / PostgreSQL

Tools: QR Code API, RESTful API Design

📸 Preview
(Insert your LinkedIn screen recording or a high-res screenshot here)

⚙️ Installation & Setup
Backend (Spring Boot)
Navigate to the /backend directory.

Update application.properties with your database credentials.

Run the application using Maven:

Bash
mvn spring-boot:run
Frontend (React)
Navigate to the /frontend directory.

Install dependencies:

Bash
npm install
Create a .env file and add: REACT_APP_API_URL=http://localhost:8080

Start the development server:

Bash
npm start
🧠 Key Learnings
Implemented Popper.js configurations for smooth, animated dropdown menus.

Managed complex Entity Relationships (One-to-Many) between Trips and Expenses.

Built a Custom Theme Engine in React to provide visual feedback based on application state.
