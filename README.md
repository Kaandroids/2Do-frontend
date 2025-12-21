# 2Do - Enterprise Task Management UI 🎨

![Angular](https://img.shields.io/badge/Angular-17%2B-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?logo=bootstrap&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-Reactive-B7178C)

## 📖 About The Project

**2Do UI** is the modern, responsive Single Page Application (SPA) frontend for the 2Do Task Management system.

It is built with **Angular 17+** using the latest **Standalone Components** architecture (no NgModules). The project adheres to strict **Enterprise Design Patterns**, enforcing a clear separation of concerns between Logic (Services), State, and Presentation (Components).

## 🔗 Backend Repository

This Frontend application consumes the **2Do REST API**.
You can find the backend source code, Docker configuration, and API documentation here:

👉 **[2Do Backend Repository (Java Spring Boot)](https://github.com/kaandroids/2Do-backend)**

## 🛠 Tech Stack

* **Framework:** Angular 17+ (Standalone APIs)
* **Language:** TypeScript 5.x
* **Styling:** SCSS (Sass) & Bootstrap 5
* **State Management:** RxJS (Reactive Extensions)
* **HTTP Client:** Angular `HttpClient` with Functional Interceptors
* **Forms:** Reactive Forms (Strict Typed)
* **Design System:** Bootstrap 5 & Bootstrap Icons

## 🏗 Modular Architecture

The project follows a scalable folder structure designed for growth:

```text
src/app/
├── core/                # Singleton services and business logic
│   ├── constants/       # Global constants (API endpoints, regex)
│   ├── guards/          # Route protection guards
│   ├── interceptors/    # HTTP Interceptors (Token Injection)
│   ├── models/          # TypeScript Interfaces (DTOs)
│   └── services/        # AuthService, TaskService
│
├── features/            # Business Logic Modules (Lazy Loadable)
│   ├── auth/            # Login & Register pages
│   ├── dashboard/       # Main Task Board
│   └── tasks/           # Task Management operations
│
├── layout/              # App Shell Components
│   ├── footer/          # Application Footer
│   ├── main-layout/     # Wrapper for authenticated pages
│   └── navbar/          # Top Navigation Bar
│
└── shared/              # Reusable UI Components (Stateless)
    ├── components/      # Generic Buttons, Loaders, Cards
    └── pipes/           # Data formatters
```
## 🚀 Key Features

* **Secure Authentication:** JWT-based authentication flow with automatic token injection via functional `HttpInterceptorFn`.
* **Reactive Forms:** Robust form handling with strict TypeScript typing, run-time validation, and immediate user feedback.
* **Modular Architecture:** A clean separation of concerns using `Core`, `Features`, and `Shared` modules to ensure scalability.
* **Responsive Design:** Mobile-first user interface built with **Bootstrap 5** Grid System and SCSS.
* **Standalone Components:** Utilizes modern Angular 17+ architecture, eliminating the need for complex `NgModules`.

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
Ensure you have the following installed:
* **Node.js** (v18 or higher recommended)
* **NPM** (Node Package Manager)
* **Angular CLI** (Install globally via `npm install -g @angular/cli`)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/kaandroids/2Do-frontend.git
    cd 2Do-frontend
    ```

2.  **Install Dependencies**
    This will install all required packages listed in `package.json`.
    ```bash
    npm install
    ```

3.  **Run the Development Server**
    Start the application in development mode.
    ```bash
    ng serve
    ```
    Once started, navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any source files.

## 🔌 API Configuration

This frontend application is configured to consume the **2Do Backend API**.

* **Default Base URL:** `http://localhost:8080/api/v1`
* **Configuration File:** Currently, the API endpoint is defined in `src/app/core/services/auth.service.ts`.

> **Note:** Ensure your Backend Docker container or local server is running on port `8080` before logging in.


## 🤝 Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kaan-kara-0a720439b/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kaan403@icloud.com)
