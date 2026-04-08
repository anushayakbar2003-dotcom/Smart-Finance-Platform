import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", padding: "60px" }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
}

export default NotFound;


