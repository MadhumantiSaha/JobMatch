# 💼 JobMatch - Online Job Portal

JobMatch is a premium, full-stack web application designed to seamlessly connect Job Seekers with Job Providers. It provides a robust, secure, and modern platform for recruiters to post jobs, manage applicants, track applicant metrics through an analytics pipeline, and chat directly in real time, while enabling candidates to build profiles, upload resumes, search for opportunities, upgrade to premium features, and track their application progress.

---

## 🚀 Key Features

### 🔐 Authentication & Security
*   **JWT Token-Based Authentication:** Secure endpoints and state management using JSON Web Tokens (JWT).
*   **OTP Email Verification:** Secure registration and authentication verification using SMTP-enabled OTP codes with validation time-limits (expiry).
*   **Role-Based Access Control:** Separate layouts, routing, and access permissions for `job_seeker` and `job_provider`.

### 💬 Real-Time Messaging & Conversations
*   **Recruiter-Candidate Chat:** Direct real-time messaging system allowing job providers and job seekers to communicate seamlessly.
*   **Unread Badges:** Unread message tracking with instant notification counters.
*   **Conversation History:** Threaded conversations displaying status and timestamps.

### 🌟 Premium Membership (Razorpay Integration)
*   **Monetization Engine:** Job seekers can upgrade to a premium subscription plan (₹499/30 Days) via a simulated Razorpay payment gateway checkout flow.
*   **Premium Perks:** Unlocks AI-powered resume parsing, email job matches every 4 days, early access to new postings, and featured candidate status.

### 📊 Recruiter Analytics Dashboard
*   **Application Timelines:** Custom SVG-based line charts visualizing daily application flow over the last 14 days.
*   **Hiring Funnel:** High-fidelity tracking of applicant distribution (Pending, Shortlisted, Interview, Hired, Rejected) with real-time conversion rates.
*   **Category Analysis:** Dynamic breakdown of posted jobs vs. applicant count grouped by job type.

### 👥 For Job Seekers
*   **Profile Management:** Update personal details, contact information, and profile picture.
*   **Resume Upload:** Upload and persist resumes (PDF format) to showcase qualifications.
*   **Browse & Search Jobs:** Browse jobs by keyword, skills, job type, or salary.
*   **Apply Instantly:** Seamlessly apply for jobs with personal details and target resumes.

### 🏢 For Job Providers (Recruiters)
*   **Job Management:** Create, update, view, and delete job postings.
*   **Applicant Dashboard:** View all applicants who applied for jobs, download/view their resumes directly, review contact details, and progress their hiring status.

---

## 🛠️ Technology Stack

### Backend
*   **Language:** Java 25
*   **Framework:** Spring Boot 4.0.6 (Spring Web, Spring Security)
*   **ORM / JPA:** Spring Data JPA, Hibernate
*   **Database:** MySQL (relational database storage)
*   **Security & Auth:** io.jsonwebtoken (JWT), Spring Security
*   **Notification:** Spring Boot Starter Mail (JavaMailSender with SMTP authentication & STARTTLS)
*   **Payment Gateway:** Razorpay SDK integration (Order creation & Signature verification APIs)
*   **Build Tool:** Maven

### Frontend
*   **Language:** JavaScript (ES6+)
*   **Framework:** React 19 (Vite)
*   **Routing:** React Router v7
*   **API Client:** Axios
*   **Payment:** Razorpay Web Checkout Integration
*   **Styling:** Highly modular CSS System (`frontend/src/styles/` containing global design tokens, base layouts, and component-specific stylesheets)

---

## 📂 Project Structure

```
JobMatch/
├── backend/                  # Spring Boot REST API
│   ├── src/main/java/        # Java Source Files
│   │   └── com/example/OnlineJob/System/
│   │       ├── controller/   # REST Controllers (Endpoints for Auth, Jobs, Messaging, Premium)
│   │       ├── model/        # JPA Entities (User, Job, Application, Conversation, Message)
│   │       ├── repository/   # JPA Repositories
│   │       ├── service/      # Business Logic Services
│   │       └── util/         # Utility Classes (JWT, Email OTP helpers)
│   ├── src/main/resources/   # Application properties & config
│   ├── uploads/              # Dynamic uploads (resumes/PDFs)
│   └── pom.xml               # Maven Dependency Configuration
└── frontend/                 # React Single Page Application (SPA)
    ├── public/               # Static assets
    ├── src/
    │   ├── assets/           # CSS & design assets
    │   ├── components/       # Reusable React components (Navbar, Layouts, Sidebars)
    │   ├── hooks/            # Custom React hooks (e.g., useProviderData)
    │   ├── pages/            # View Pages (Home, Login, Register, Job details)
    │   │   ├── auth/         # Authentication flows (Login, Register, OTP Verification)
    │   │   ├── job_provider/ # Recruiter dashboard, My Jobs, View Applicants, Analytics
    │   │   └── job_seeker/   # Candidate application/profile management, Premium upgrade
    │   ├── routes/           # Routing configuration (AppRoutes.jsx)
    │   ├── styles/           # Modular CSS stylesheets (design tokens, layout, forms, etc.)
    │   ├── App.jsx           # Main App component
    │   └── main.jsx          # Vite main entrypoint
    ├── package.json          # Frontend packages & scripts
    └── vite.config.js        # Vite build properties
```

---

## ⚙️ Setup & Installation

### Prerequisites
*   **Java Development Kit (JDK):** Version 25
*   **Node.js:** Version 18+ (with npm)
*   **MySQL Server** running locally or in the cloud.

---

### Step 1: Database Setup
1. Open your MySQL client and create a database named `onlinejobdb`:
   ```sql
   CREATE DATABASE onlinejobdb;
   ```
2. Modify the database configurations in `backend/src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/onlinejobdb
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
3. Set up SMTP Gmail properties in `backend/src/main/resources/application.properties` to enable email verification (OTP):
   ```properties
   spring.mail.username=YOUR_GMAIL_ADDRESS
   spring.mail.password=YOUR_GMAIL_APP_PASSWORD
   ```

---

### Step 2: Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and run the project using Maven:
   ```bash
   # On Windows (cmd/PowerShell)
   mvnw.cmd spring-boot:run

   # On Linux/macOS
   ./mvnw spring-boot:run
   ```
The backend server runs on `http://localhost:8080` by default.

---

### Step 3: Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
The application will be accessible at `http://localhost:5173`.

---

## 🤝 Contribution Guidelines
1. Perform changes in a new feature branch.
2. Ensure the code builds on both frontend and backend before committing.
3. Test your changes locally to verify role-based security configurations.

