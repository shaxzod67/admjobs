import { BrowserRouter, Route, Routes } from "react-router-dom"; // ✅ react-router-dom
import "./App.css";
import Auth from "./components/Auth/auth";
import Header from "./components/Header/header";
import Master from "./components/Master/master";
import BossPage from "./components/BossPage/bosspage";
import HRPage from "./components/HR/hr";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />

        <Route
          path="/header"
          element={
            <ProtectedRoute>
              <Header />
            </ProtectedRoute>
          }
        />

        <Route
          path="/master"
          element={
            <ProtectedRoute>
              <Master />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bosspage"
          element={
            <ProtectedRoute>
              <BossPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hrpage"
          element={
            <ProtectedRoute>
              <HRPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
