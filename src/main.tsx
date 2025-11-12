import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { VendorsPage } from '@/pages/VendorsPage';
import { VendorDetailPage } from '@/pages/VendorDetailPage';
import { BookingPage } from '@/pages/BookingPage';
import { PaymentPage } from '@/pages/PaymentPage';
import { ConfirmationPage } from '@/pages/ConfirmationPage';
import { TranslatePage } from '@/pages/TranslatePage';
import { GaragePage } from '@/pages/GaragePage';
import { AdminPage } from '@/pages/AdminPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/vendors",
    element: <VendorsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/vendors/:vendorId",
    element: <VendorDetailPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/book",
    element: <BookingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/pay",
    element: <PaymentPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/confirm",
    element: <ConfirmationPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/translate",
    element: <TranslatePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/garage",
    element: <GaragePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)