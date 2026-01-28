import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/dashboard";
import Experiments from "./pages/experiments";
import Login from "./pages/login";
import ExperimentDetail from "./pages/ExperimentDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "experiments", element: <Experiments /> },
      { path: "experimentDetail", element: <ExperimentDetail /> },
    ],
  },
  { path: "/login", element: <Login /> },
]);
