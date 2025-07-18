// src/pages/VotePage.tsx
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const db = getFirestore();

interface Candidate {
  id: string;
  name: string;
  votes: number;
}

export default function VotePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email || "User");
        await checkIfUserVoted(user.uid);

        // Redirect admin to dashboard
        if (user.email === "shuaibjafar01@gmail.com") {
          navigate("/admin-dashboard");
        }
      } else {
        navigate("/register");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const snapshot = await getDocs(collection(db, "candidates"));
        const data: Candidate[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Candidate, "id">),
        }));
        setCandidates(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load candidates");
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const checkIfUserVoted = async (uid: string) => {
    try {
      const voteRef = doc(db, "votes", uid);
      const voteSnap = await getDoc(voteRef);
      if (voteSnap.exists()) {
        setHasVoted(true);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to check vote status");
    }
  };

  const handleVote = async (candidateId: string) => {
    if (!userId) return;

    try {
      const voteRef = doc(db, "votes", userId);
      const voteSnap = await getDoc(voteRef);

      if (voteSnap.exists()) {
        setHasVoted(true);
        alert("You have already voted!");
        return;
      }

      await setDoc(voteRef, {
        userId,
        candidateId,
        timestamp: new Date(),
      });

      const candidateRef = doc(db, "candidates", candidateId);
      await updateDoc(candidateRef, {
        votes: increment(1),
      });

      setHasVoted(true);
      alert("You have voted Successfully✔!");
    } catch (err: any) {
      console.error(err);
      alert("Voting failed: " + err.message);
    }
  };

  if (loading) return <p>Loading candidates...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center" }}>Vote for Your Candidate</h1>
      {userEmail && (
        <p style={{ fontSize: "1rem", marginBottom: "1rem", textAlign: "center" }}>
          Welcome, <strong>{userEmail}</strong> 👋
        </p>
      )}

      {hasVoted ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <h2>You have already voted ✅</h2>
          <button
            onClick={() => {
              signOut(auth);
              navigate("/login");
            }}
            style={{
              padding: "0.6rem 1.5rem",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              marginTop: "1.5rem",
              cursor: "pointer",
            }}
          >
            Back to Login
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem" }}>
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              style={{
                backgroundColor: "#fff",
                padding: "1rem",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                textAlign: "center",
                width: "250px",
              }}
            >
              <h3>{candidate.name}</h3>

              {/* Hide votes from regular users */}
              {userEmail === "shuaibjafar01@gmail.com" && (
                <p>Total Votes: {candidate.votes}</p>
              )}

              <button
                onClick={() => handleVote(candidate.id)}
                disabled={hasVoted}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1.2rem",
                  backgroundColor: hasVoted ? "#6c757d" : "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: hasVoted ? "not-allowed" : "pointer",
                }}
              >
                {hasVoted ? "Already Voted" : "Vote"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
