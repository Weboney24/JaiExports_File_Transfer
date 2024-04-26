import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import userStore from "./helper/state/store/user.store.js";
import router from "./router/router.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={userStore}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
