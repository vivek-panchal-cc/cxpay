import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "app/store";
// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
// Import popper css
import "react-popper-tooltip/dist/styles.css";
// Time Picker styles
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
// Custom styles
import "./index.css";
// JAVASCRIPTS
import "bootstrap/dist/js/bootstrap";

import { BrowserRouter } from "react-router-dom";
import LoaderProvider from "context/loaderContext";
import SystemOptionsProvider from "context/systemOptionsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <LoaderProvider>
        <SystemOptionsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SystemOptionsProvider>
      </LoaderProvider>
    </Provider>
  </React.StrictMode>
);
