# AutoNex

A modern, minimalist web application for booking trusted car repair services, featuring AI-powered intake, a vendor rating system, and human-in-the-loop support.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Omi-7z/autonex)

## About The Project

AutoNex is a sophisticated, minimalist web application designed to streamline the process of booking automotive repair services. It offers a modern, intuitive user experience, starting with a seamless onboarding process. The core functionality allows users to find trusted local vendors, book diagnostic appointments with a small 'Trust-Fee', and manage their vehicle service history.

The platform includes a dedicated admin interface for 'AutoNex Coordinators' to provide human-in-the-loop assistance for complex cases, ensuring a high-touch service feel within a scalable digital product.

### Key Features

*   **Seamless Onboarding:** A quick, three-slide introduction for first-time users.
*   **AI-Powered Intake:** An intelligent form to help users describe their vehicle's issues.
*   **Trusted Vendor Network:** Vendor cards highlight key trust signals like SCAD Rate, affiliations, and years in the network.
*   **Diagnostics-First Booking:** A low-commitment model where users pay a small "Trust-Fee" to secure a diagnostic slot.
*   **Human-in-the-Loop Support:** Users can request an "AutoNex Coordinator" to review their booking for a personalized touch.
*   **Quote Translation Utility:** Upload a competitor's quote for a mock analysis.
*   **My Garage:** A personal dashboard to track service history, warranties, and manage disputes.
*   **Admin Queue:** A dedicated interface for coordinators to manage requests needing human review.

## Technology Stack

This project is a full-stack application built with a modern, type-safe technology stack.

*   **Frontend:**
    *   [React](https://react.dev/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Vite](https://vitejs.dev/)
    *   [React Router](https://reactrouter.com/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [shadcn/ui](https://ui.shadcn.com/)
    *   [Zustand](https://zustand-demo.pmnd.rs/) for state management
    *   [Framer Motion](https://www.framer.com/motion/) for animations
    *   [Lucide React](https://lucide.dev/) for icons

*   **Backend:**
    *   [Hono](https://hono.dev/) on [Cloudflare Workers](https://workers.cloudflare.com/)

*   **Storage:**
    *   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)

*   **Tooling:**
    *   [Bun](https://bun.sh/)
    *   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Bun](https://bun.sh/) package manager
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/autonex.git
    cd autonex
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

### Running the Application

To run the application locally, which includes the Vite dev server for the frontend and the Wrangler dev server for the backend functions, use the following command:

```sh
bun run dev
```

This will start the development server, typically on `http://localhost:3000`.

## Development

*   **Frontend Code:** Located in the `src/` directory. Pages are in `src/pages/`, and reusable components are in `src/components/`.
*   **Backend Code:** The Hono API is located in the `worker/` directory. Add new API routes in `worker/user-routes.ts`.
*   **Shared Types:** To ensure type safety between the frontend and backend, shared TypeScript types are located in `shared/types.ts`.

## Deployment

This project is configured for seamless deployment to Cloudflare Pages.

1.  **Build the application:**
    ```sh
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Run the deploy command. This will build and deploy both the static frontend assets to Cloudflare Pages and the serverless functions in the `worker/` directory.

    ```sh
    bun run deploy
    ```

Alternatively, you can connect your GitHub repository to Cloudflare Pages for automatic deployments on every push.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Omi-7z/autonex)

## License

Distributed under the MIT License. See `LICENSE` for more information.