# 📄 SignBuddy - Secure Digital PDF Signing Platform

---

## 📌 Overview

SignBuddy is a full-stack digital document signing platform inspired by services such as DocuSign and Adobe Sign.

The application allows users to securely upload PDF documents, create reusable signature templates, place signatures using a drag-and-drop interface, generate digitally signed PDF files, and share documents with other users through email-based signing requests.

The entire application has been containerized using Docker, making deployment simple and platform independent.

---

# ✨ Features

## 👤 User Management

- User Registration
- User Login
- JWT Authentication
- Secure Password Encryption (BCrypt)
- Protected APIs using Spring Security

---

## 📄 Document Management

- Upload PDF documents
- View uploaded documents
- Download original PDF
- Delete uploaded documents
- Document status tracking

---

## ✍ Signature Management

Users can create reusable signatures by:

- Drawing using mouse/trackpad
- Typing their name with multiple fonts

Each signature is stored securely and can be reused across documents.

---

## 📍 Signature Placement

- View uploaded PDF
- Drag & Drop signatures anywhere
- Resize placement
- Position signatures page-wise
- Save placement coordinates

---

## 📝 PDF Signing

Generate a new signed PDF by embedding all placed signatures into the original document.

Supports:

- Multiple signatures
- Multiple pages
- Multiple placements

Original document always remains unchanged.

---

## 📧 Email Signing Requests

Users can send documents for signing through email.

Features include:

- Secure signing link
- Token-based verification
- Expiration support
- Email notifications

---

## 🔐 Security

- Spring Security
- JWT Authentication
- BCrypt Password Hashing
- Protected REST APIs
- Token Validation
- Request Authorization

---

## 📋 Audit Logging

The application records important actions such as:

- Login
- Document Upload
- PDF Signing
- Signature Creation
- Email Requests

including timestamp and client IP.

---

# 🛠 Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Maven
- PDFBox
- Java Mail

### Frontend

- React
- Axios
- React Router
- Tailwind CSS

### Database

- MySQL

### DevOps

- Docker
- Docker Compose
- Git
- GitHub

---

# 📂 Project Structure

```
SignBuddy
│
├── signpdf/              # Spring Boot Backend
│
├── signpdf-frontend/     # React Frontend
│
├── docker-compose.yml
│
└── README.md
```

---

# ⚙ Installation

## Prerequisites

Install:

- Docker Desktop
- Git

Clone the repository

```bash
git clone https://github.com/yourusername/SignBuddy.git

cd SignBuddy
```

---

# 🔧 Environment Variables

Create a `.env` file in the root directory.

```env
DB_URL=jdbc:mysql://...

DB_USERNAME=your_username

DB_PASSWORD=your_password

JWT_SECRET=your_secret_key

JWT_EXPIRATION=86400000

MAIL_USERNAME=your_email@gmail.com

MAIL_PASSWORD=your_google_app_password

FRONTEND_URL=http://localhost:3000
```

> **Important:** If using Gmail SMTP, use a Google **App Password**, not your normal Gmail password.

---

# 🐳 Running the Application

Build all containers

```bash
docker compose build
```

Start the application

```bash
docker compose up
```

Run in detached mode

```bash
docker compose up -d
```

Stop all services

```bash
docker compose down
```

---

# 🚀 Application URLs

Frontend

```
http://localhost:3000
```

Backend

```
http://localhost:8080
```

---

# 📖 User Guide

## 1. Register

Create a new account.

Fields:

- Full Name
- Email
- Password

---

## 2. Login

Login using registered credentials.

A JWT token is generated automatically.

---

## 3. Create Signature

Navigate to:

```
Signatures
```

Choose one:

- Draw Signature
- Type Signature

Save the signature.

---

## 4. Upload PDF

Navigate to:

```
Documents
```

Upload any PDF.

---

## 5. Place Signature

Open the uploaded PDF.

Select an existing signature.

Drag and drop it anywhere on the document.

Save the placement.

---

## 6. Generate Signed PDF

Click

```
Generate Signed PDF
```

The system creates a new signed document.

---

## 7. Download Signed PDF

Click

```
Download Signed PDF
```

The signed document is downloaded.

---

## 8. Send for Signing

Open the document.

Click

```
Send for Signing
```

Enter recipient email.

The recipient receives a secure signing link.

---

# 🔒 Security Features

✔ JWT Authentication

✔ Password Encryption

✔ Protected Endpoints

✔ Email Verification

✔ Token Expiration

✔ Audit Logging

---

# 📷 Screenshots

Add screenshots here.

```
/screenshots

login.png

dashboard.png

upload.png

placement.png

signedpdf.png
```

---

# 📈 Future Improvements

- Digital Certificate Support
- Cloud Storage Integration
- Multi-user Collaboration
- Electronic Signature Verification
- OTP Verification
- Signature Expiry
- Notification Center
- OCR Support
- Version History
- Organization Workspaces

---

# 👨‍💻 Author

**Swastik Basu**

Computer Science Undergraduate

Java Full Stack Developer

GitHub:
https://github.com/swastik-basu

LinkedIn:
https://www.linkedin.com/in/swastik-basu-561a092ab/

Portfolio:
https://swastik-basu.github.io/Portfolio-SwastikBasu/

---

# ⭐ If you found this project useful

Please consider giving it a ⭐ on GitHub.