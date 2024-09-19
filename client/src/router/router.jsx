import { createBrowserRouter } from "react-router-dom";
import Signin from "../component/Signin";
import Dashboard from "../pages/admin/Dashboard";
import Sidenav from "../component/Sidenav";
import Users from "../pages/admin/Users";
import Transfer from "../pages/admin/Transfer";
import NotFound from "../pages/NotFound";
import MyTransfer from "../pages/admin/MyTransfer";
import AllTransfers from "../pages/Alltransfers";
import Files from "../pages/Files";
import Home from "../pages/Home";
import Profile from "../pages/admin/Profile";
import NotAccess from "../pages/NotAccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/dashboard",
    element: <Sidenav />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/users",
    element: <Sidenav />,
    children: [
      {
        path: "/users",
        element: <Users />,
      },
    ],
  },
  {
    path: "/make_transfer",
    element: <Sidenav />,
    children: [
      {
        path: "/make_transfer",
        element: <Transfer />,
      },
    ],
  },
  {
    path: "/my_transfer",
    element: <Sidenav />,
    children: [
      {
        path: "/my_transfer",
        element: <MyTransfer />,
      },
    ],
  },
  {
    path: "/all_transfer",
    element: <Sidenav />,
    children: [
      {
        path: "/all_transfer",
        element: <AllTransfers />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/403",
    element: <NotAccess />,
  },
  {
    path: "/files/:filename/:id",
    element: <Files />,
  },
  {
    path: "/files/:id",
    element: <Files />,
  },
  {
    path: "/settings",
    element: <Sidenav />,
    children: [
      {
        path: "/settings",
        element: <Profile />,
      },
    ],
  },
]);

export default router;
