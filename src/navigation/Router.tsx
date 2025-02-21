import * as React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
  Navigate,
} from "react-router-dom";
import GuestBook from "../guests/GuestBook";
import Home from "../home/Home";
import UnderConstruction from "../common/UnderConstruction";
import Contact from "../contact/Contact";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <UnderConstruction />,
  },
  {
    path: "/projects",
    element: <UnderConstruction />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/guestbook",
    element: <GuestBook />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export const router = createBrowserRouter(routes);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
