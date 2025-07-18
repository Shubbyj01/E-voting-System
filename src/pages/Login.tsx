// src/pages/Login.tsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Check if this is the admin email
      const adminEmail = "admin@example.com"; // 🔁 Replace this with your real admin email

      if (user.email === adminEmail) {
        alert("Welcome Admin!");
        navigate("/admin");
        return;
      }

      // ✅ Check if user is registered
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        alert("Login successful!");
        navigate("/vote");
      } else {
        alert("You're not registered for voting. Please complete registration.");
        navigate("/register");
      }
    } catch (error: any) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <a className="back" href="/register">Click to Register</a>
      </form>
    </div>
  );
};

export default Login;
