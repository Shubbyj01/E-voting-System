// src/pages/index.tsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "E Voting System";
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#f0f4f8",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem 1rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(1.8rem, 6vw, 3rem)",
          fontWeight: "bold",
          color: "#1a202c",
        }}
      >
        Welcome to E Voting System
      </h1>

      <p
        style={{
          fontSize: "clamp(1rem, 3vw, 1.2rem)",
          marginTop: "1rem",
          maxWidth: "600px",
          color: "black",
        }}
      >
        A secure, fast, and transparent way to cast your vote online. 
        Simply log in, view the candidates, cast your vote, and if you are the admin, you know what to do 🤫.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginTop: "2rem",
          width: "100%",
          maxWidth: "300px",
        }}
      >
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "1rem",
            fontSize: "1rem",
            backgroundColor: "#2b6cb0",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Proceed to Login
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "1rem",
            fontSize: "1rem",
            backgroundColor: "#2b6cb0",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Go To Admin Dashboard
        </button>
      </div>
    </div>
  );
}
