import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import UserEditPage from "./pages/UserEditPage";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TestPage from "./pages/TestPage";
import TestCreatePage from "./pages/TestCreatePage";
import TestEditPage from "./pages/TestEditPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <>
            <ScrollToTop />
            <HomePage />
          </>
        ),
      },
      {
        path: "/login",
        element: (
          <>
            <ScrollToTop />
            <LoginPage />
          </>
        ),
      },
      {
        path: "/signup",
        element: (
          <>
            <ScrollToTop />
            <SignupPage />
          </>
        ),
      },
      {
        path: "/create",
        element: (
          <>
            <ScrollToTop />
            <TestCreatePage />
          </>
        ),
      },
      {
        path: "/:userId",
        children: [
          {
            index: true,
            element: (
              <>
                <ScrollToTop />
                <UserPage />
              </>
            ),
          },
          {
            path: "/:userId/edit",
            element: (
              <>
                <ScrollToTop />
                <UserEditPage />
              </>
            ),
          },
        ],
      },
      {
        path: "/test/:testId",
        children: [
          {
            index: true,
            element: (
              <>
                <ScrollToTop />
                <TestPage />
              </>
            ),
          },
          {
            path: "/test/:testId/edit",
            element: (
              <>
                <ScrollToTop />
                <TestEditPage />
              </>
            ),
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
