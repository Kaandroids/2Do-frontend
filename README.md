# 2Do - Enterprise Task Management UI 🎨

![Angular](https://img.shields.io/badge/Angular-17%2B-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)
![Azure](https://img.shields.io/badge/Azure-SWA-0089D6?logo=microsoftazure&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?logo=bootstrap&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-Reactive-B7178C)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white)

## 🚀 Live Demo
Access the latest version of the application here:
👉 **[2Do Web Application](https://gentle-cliff-06c31ee03.6.azurestaticapps.net/)**
> ⏱️ **Note:** Please allow **15-20 seconds** for the initial request. The backend Docker container may take a moment to wake up if it has been idle.

## 📖 About The Project

**2Do UI** is the modern, responsive Single Page Application (SPA) frontend for the 2Do Task Management system.

It is built with **Angular 17+** using the latest **Standalone Components** architecture (no NgModules). The project adheres to strict **Enterprise Design Patterns**, enforcing a clear separation of concerns between Logic (Services), State, and Presentation (Components).

## 🔗 Backend Repository

This Frontend application consumes the **2Do REST API**.
You can find the backend source code, Docker configuration, and API documentation here:

👉 **[2Do Backend Repository (Java Spring Boot)](https://github.com/kaandroids/2Do-backend)**

## 🛠 Tech Stack

* **Framework:** Angular 17+ (Standalone APIs)
* **Infrastructure:** Azure Static Web Apps (Frontend Host)
* **Backend Hosting:** Azure Container Apps
* **CI/CD:** GitHub Actions (Automated Deployment)
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
## 🔌 API & Production Configuration

The application dynamically connects to the relevant API endpoint based on the environment:

| Environment | Base URL |
| :--- | :--- |
| **Production** | `https://todo-backend.icyfield-790fdb3.germanywestcentral.azurecontainerapps.io/api/v1` |
| **Local** | `http://localhost:8080/api/v1` |

> **CORS Configuration:** Production security protocols (CORS) are optimized via both Azure Container Apps Ingress settings and Spring Security configuration to allow requests only from this verified frontend domain.

---

## 🚀 Deployment (CI/CD)

This project features a fully automated **DevOps** cycle to ensure high availability and seamless updates:

* **Automated Workflow**: Every push to the `main` branch triggers a **GitHub Actions** CI/CD pipeline.
* **Build Environment**: The project is built using **Node.js 20** to ensure compatibility with modern Angular 17+ features.
* **Cloud Hosting**: Successful build artifacts are automatically deployed to **Azure Static Web Apps**.


## 🚀 Key Features

* **Secure Authentication:** JWT-based authentication flow with automatic token injection via functional `HttpInterceptorFn`.
* **Reactive Forms:** Robust form handling with strict TypeScript typing, run-time validation, and immediate user feedback.
* **Modular Architecture:** A clean separation of concerns using `Core`, `Features`, and `Shared` modules to ensure scalability.
* **Automated CI/CD Pipeline**: A seamless DevOps workflow using **GitHub Actions** that automatically builds and deploys the application to **Azure Static Web Apps** on every push.
* **Responsive Design:** Mobile-first user interface built with **Bootstrap 5** Grid System and SCSS.
* * **Secure Cross-Origin Communication**: Fully configured CORS protocols to allow secure data exchange between the Azure-hosted frontend and backend.
* **Production-Ready Docker:** Containerized application using multi-stage builds. Served via Nginx for high performance and low footprint.
* **Standalone Components:** Utilizes modern Angular 17+ architecture, eliminating the need for complex `NgModules`.
* **Responsive Design:** Mobile-first user interface built with Bootstrap 5 Grid System and SCSS.

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
Ensure you have the following installed:
* **Node.js** (v18 or higher recommended)
* **NPM** (Node Package Manager)
* **Angular CLI** (Install globally via `npm install -g @angular/cli`)

## 🏁 Getting Started

You can run this project in two ways: using **Docker** (Recommended for consistency) or standard **Local Development**.

### Prerequisites
* **Git**
* **Docker & Docker Compose** (For Option A)
* **Node.js v18+ & Angular CLI** (For Option B)

---

### Option A: Docker (Recommended) 🐳

This method builds a production-ready image served by Nginx. It is the closest simulation to a real production environment.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/kaandroids/2Do-frontend.git
    cd 2Do-frontend
    ```

2.  **Run with Docker Compose**
    ```bash
    docker-compose up -d --build
    ```

3.  **Access the App**
    Open your browser and navigate to: `http://localhost:4200`

> **⚠️ Note on Hot Reload:** Running via Docker serves a static production build. **Hot Reload (Live Refresh) does NOT work** in this mode. You must rebuild the container to see code changes. Use Option B for active development.

---

### Option B: Local Development (Hot Reload) 🔥

Use this method if you are actively writing code and need instant feedback.

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run the Development Server**
    ```bash
    ng serve
    ```
    Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.
## 🔌 API Configuration

This frontend application is configured to consume the **2Do Backend API**.

* **Default Base URL:** `http://localhost:8080/api/v1`
* **Configuration File:** Currently, the API endpoint is defined in `src/app/core/services/auth.service.ts`.

> **Note:** Ensure your Backend Docker container or local server is running on port `8080` before logging in.

## 🗺️ Roadmap & Future Enhancements

The project is continuously evolving. Below are the planned features and technical improvements:

### 🛠️ Technical Improvements
* **Global Error Handling**: Implement a centralized `GlobalErrorHandler` and HTTP Interceptors to provide user-friendly toast notifications for API errors (400, 401, 403, 500).
* **State Management Upgrade**: Transition from basic RxJS subjects to **Angular Signals** or **NgRx** for more robust and predictable state handling.
* **Unit & E2E Testing**: Achieve high code coverage by implementing unit tests with **Jasmine/Karma** and end-to-end testing with **Cypress**.
* **PWA Support**: Add Service Workers to enable offline access and "Install to Desktop/Mobile" capabilities.

### ✨ New Features
* **Real-time Updates**: Integrate **WebSockets** or **SignalR** to allow multiple users to see task updates in real-time without refreshing.
* **Dark Mode**: Implementation of a native theme switcher using Bootstrap 5's color modes.
* **Advanced Filtering**: Add complex search, tag-based filtering, and multi-sort options for the dashboard.
* **User Profile & Settings**: Allow users to upload avatars, change passwords, and customize their dashboard preferences.
* **i18n (Internationalization)**: Add multi-language support (English, Turkish, etc.) using `@ngx-translate`.
* **Task Attachments**: Enable users to upload files and documents directly to their tasks.


## 🤝 Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kaan-kara-0a720439b/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kaan403@icloud.com)
