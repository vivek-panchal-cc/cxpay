import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/login/login.jsx";
import Signup from "./pages/signup/singup.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import { Protected } from "components/PrivateRoute";
import { getCookie } from "shared/cookies";
const token = getCookie("auth._token.Bearer");

function App() {
  /* const navigate = useNavigate();
  const [isLoggedIn, setisLoggedIn] = useState(false);

    useEffect(() => {
    // Checking if user is not loggedIn
    if (!isLoggedIn) {
      isLoggedIn = false;
    } else {
       isLoggedIn = true;
    }
  }, [navigate, isLoggedIn]); */

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/dashboard" element={ <Dashboard />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
