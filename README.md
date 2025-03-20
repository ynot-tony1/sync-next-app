SyncNet Upload

SyncNet Upload is a Next.js application for uploading and processing video files. It features real‑time progress updates through a WebSocket connection and uses NextAuth for authentication. The project leverages React Context to manage shared state across components, including upload file data and WebSocket communication.
Features

    File Upload:
    Users can browse for and upload video files. The upload form sends the file to a backend endpoint, and once processed, a download link is provided.

    Real‑Time Processing Updates:
    A WebSocket connection streams processing updates. The application displays progress milestones using a progress bar and visual indicators (sync icons) for error, success, or syncing states.

    Authentication:
    Uses NextAuth with a credentials provider for user login and registration.

    Context Providers:
    The app uses React Context to manage WebSocket state (via WebSocketProvider) and upload file state (via UploadFileProvider).

Getting Started

This project is bootstrapped with create-next-app.
Prerequisites

Ensure you have Node.js installed. You can use npm, yarn, pnpm, or bun to manage packages.
Local Environment Variables

Create a .env.local file in the root of the project and set the following variables:

NEXT_PUBLIC_BACKEND_URL
NEXT_PUBLIC_AUTH_URL
NEXT_PUBLIC_APP_URL
NEXTAUTH_SECRET
NEXTAUTH_JWT_ENCRYPTION=false
NEXTAUTH_URL

Running the Development Server

Run the development server with one of the following commands:

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

Open http://localhost:3000 in your browser to see the application in action.
Directory Structure

Below is an overview of the project structure (excluding node_modules):

.
├── app
│   ├── api
│   │   └── auth
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── lib
│   │   └── authOptions.ts
│   ├── login
│   │   └── page.tsx
│   ├── page.tsx
│   └── upload
│       └── page.tsx
├── components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── ProcessVideoWebSocket.tsx
│   ├── ProgressBar.tsx
│   ├── SyncIcon.tsx
│   ├── UploadFileContext.tsx
│   ├── UploadForm.tsx
│   └── WebSocketContext.tsx
├── types
│   ├── next-auth.d.ts
│   ├── progress-bar.d.ts
│   ├── sync-icon-props.d.ts
│   ├── upload-file.d.ts
│   └── web-socket-props.d.ts
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── __tests__
│   ├── HomePage.test.tsx
│   ├── LoginPage.test.tsx
│   ├── ProcessVideoWebSocketDownload.test.tsx
│   ├── ProcessVideoWebSocket.test.tsx
│   └── UploadForm.test.tsx
├── package.json
├── tsconfig.json
└── README.md

Technologies Used

    Next.js: Framework for server-rendered React applications.
    React & React Context: For building UI components and managing shared state.
    TypeScript: Provides static type checking.
    NextAuth: Authentication solution for Next.js.
    WebSockets: Real‑time communication for processing updates.
    Tailwind CSS: Utility-first CSS framework for styling.

How It Works

    Upload Flow:
    The UploadForm component lets users select a file and initiate an upload. Once a file is chosen, the component sends a POST request to the backend (using the URL specified in your environment variables). On a successful upload, the backend returns a download URL and filename, which are stored in a context via UploadFileProvider.

    Real-Time Processing:
    The WebSocketProvider establishes a WebSocket connection with the backend. It listens for processing messages and updates state variables such as message, progressSteps, indicatorState, and progressPercent. The ProcessVideoWebSocket component consumes this context to display a progress bar (via the ProgressBar component) and sync indicators (via the SyncIcon component).

    Authentication:
    The authentication flow is managed using NextAuth with a credentials provider defined in app/lib/authOptions.ts. The LoginPage component handles user login and registration, redirecting users upon success.

Deployment

The easiest way to deploy your Next.js app is to use the Vercel Platform. For more detailed instructions, refer to the Next.js deployment documentation.
Learn More

    Next.js Documentation – Learn about Next.js features and API.
    Learn Next.js – An interactive Next.js tutorial.
    Next.js GitHub Repository – Your feedback and contributions are welcome!