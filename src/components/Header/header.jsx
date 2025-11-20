import React from "react";
import "./header.css";
import Dashboard from "../Dashboard/dashboard";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const handleMaster = () => {
    navigate("/master");
  };

  const handleBossPage = () => {
    navigate("/bosspage");
  };

  const handleHRpage = () => {
    navigate("/hrpage");
  };

  return (
    <div>
      <header className="header">
        <div className="header-container">
          <a className="logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="logo-icon"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="logo-text">ADM</span>
          </a>

          <nav className="nav">
            <a onClick={handleMaster} className="nav-link">
              Master Page
            </a>
            <a onClick={handleBossPage} className="nav-link">
              Boss Page
            </a>
            <a onClick={handleHRpage} className="nav-link">
              HR Page
            </a>
          </nav>

          {/* <button className="header-btn">
            Button
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="btn-icon"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button> */}
        </div>
      </header>
      <Dashboard />
    </div>
  );
}

export default Header;
