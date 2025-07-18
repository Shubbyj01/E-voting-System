import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/results.css";

const Results = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  const ADMIN_EMAIL = "shuaibjafar01@gmail.com"; // ✅ Replace with your admin email

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailInput.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      alert("Access denied: Only admin can view results.");
      navigate("/");
      return;
    }

    setIsAuthorized(true);

    try {
      const querySnapshot = await getDocs(collection(db, "candidates"));
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching results:", error);
      alert("Failed to fetch voting results.");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="results-container">
        <h2>Admin Access Required</h2>
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Enter admin email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />
          <button type="submit">View Results</button>
        </form>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h2>Voting Results</h2>
      {candidates.length === 0 ? (
        <p>No votes yet.</p>
      ) : (
        candidates.map((candidate) => (
          <div key={candidate.id} className="result-card">
            <h3>{candidate.name}</h3>
            <p>Votes: {candidate.votes}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Results;
