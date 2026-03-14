# 2Do - Task Management UI

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)
![Azure](https://img.shields.io/badge/Azure-SWA-0089D6?logo=microsoftazure&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?logo=bootstrap&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white)

## Live Demo
**[2Do Web Application](https://gentle-cliff-06c31ee03.6.azurestaticapps.net/)**
> **Note:** Please allow **15-20 seconds** for the initial request. The backend Docker container may take a moment to wake up if it has been idle.

## About The Project

**2Do UI** is the modern, responsive Single Page Application frontend for the 2Do Task Management system. It is built with **Angular 21** using the latest **Standalone Components** architecture (no NgModules).

## Backend Repository

**[2Do Backend Repository (Java Spring Boot)](https://github.com/kaandroids/2Do-backend)**

## Tech Stack

* **Framework:** Angular 21 (Standalone APIs, Signals)
* **Language:** TypeScript 5.x
* **Styling:** SCSS + Bootstrap 5 + Bootstrap Icons
* **Forms:** Reactive Forms
* **HTTP:** Angular `HttpClient` with functional interceptors
* **Hosting:** Azure Static Web Apps
* **CI/CD:** GitHub Actions
* **Container:** Docker + Nginx (multi-stage build)

## Key Features

### Personal Tasks
* Create, edit, complete, and delete tasks
* Priority levels (HIGH, MEDIUM, LOW) with colour-coded badges
* Due dates and completion tracking
* **AI Voice Task creation** — speak your task, Gemini AI fills in every field

### Groups & Collaboration
* Create group workspaces and invite members by email
* Accept or decline invitations from the dashboard
* Per-member permission management (Create / Edit / Delete / Invite / Master)
* **Master permission** automatically grants all other permissions
* View group tasks in a dedicated group view — separate from personal tasks
* Assign multiple members to a task
* **Private tasks** — only visible to the creator and assigned members
* Task cards show creator name and assigned members

### UI & UX
* Dashboard overview with pending task summary
* Sidebar navigation (Dashboard / Tasks / Groups)
* Mobile-responsive with a slide-in hamburger drawer
* Toast notifications for API errors and actions
* Shared `<app-navbar>` and `<app-footer>` components across public pages
* Landing page, About Us page with shared navigation

## Project Structure

```text
src/app/
├── core/
│   ├── guards/          # Auth route guards
│   ├── interceptors/    # JWT token injection
│   ├── models/          # TypeScript interfaces (task, group, auth)
│   └── services/        # AuthService, TaskService, GroupService, InvitationService
│
├── features/
│   ├── auth/            # Login & Register
│   ├── dashboard/       # Main task board + group views
│   ├── groups/          # Groups page, settings modal, create modal
│   ├── landing/         # Public landing page
│   └── about/           # About Us page
│
└── shared/
    └── components/
        ├── navbar/      # Shared navigation bar (used on all public pages)
        └── footer/      # Shared footer (used on all public pages)
```

## Getting Started

### Prerequisites
* **Node.js** v18+
* **Angular CLI** (`npm install -g @angular/cli`)

### Option A: Docker (Recommended)

```bash
git clone https://github.com/kaandroids/2Do-frontend.git
cd 2Do-frontend
docker-compose up -d --build
```

Open `http://localhost:4200`.

### Option B: Local Development

```bash
npm install
npm start
```

Open `http://localhost:4200`. Hot reload is enabled.

## API Configuration

| Environment | Base URL |
|---|---|
| **Production** | Azure Container Apps URL |
| **Local** | `http://localhost:8080/api/v1` |

Configured in `src/environments/environment.ts`.

## Roadmap

- [x] JWT authentication with auto token injection
- [x] Reactive forms with validation and error feedback
- [x] CI/CD pipeline (GitHub Actions → Azure Static Web Apps)
- [x] AI voice task generation (Gemini API)
- [x] Groups, invitations, and per-member permissions
- [x] Task privacy and assignees
- [x] Mobile hamburger drawer navigation
- [x] Toast notification system
- [x] Shared navbar and footer components
- [ ] Dark mode
- [ ] Real-time updates via WebSockets
- [ ] User profile & avatar settings
- [ ] Advanced task filtering and search
- [ ] PWA support (offline access)

## Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kaan-kara-0a720439b/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kaan403@icloud.com)
