import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux"; // ✅ Import Redux Provider
import store from "./redux/store"; // ✅ Import Redux store
import "./index.css";
import Layout from "./Layout.jsx";
import Home from "./Components/Home/Home";
import Gallery from "./Components/gallery/Gallery";
import About from "./Components/about/About";
import Image from "./Components/Image-to-Text/image";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "gallery",
        element: <Gallery />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "image",
        element: <Image />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
