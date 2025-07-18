import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "../styles/admin.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const adminEmail = "shuaibjafar01@gmail.com";
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user || user.email !== adminEmail) {
        alert("Access Denied. Admins only.");
        navigate("/login");
        return;
      }
    });

    const fetchData = async () => {
      const userDocs = await getDocs(collection(db, "users"));
      const voteDocs = await getDocs(collection(db, "votes"));
      const candidateDocs = await getDocs(collection(db, "candidates"));

      setUsers(userDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setVotes(voteDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setCandidates(candidateDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
    return () => unsubscribe();
  }, [navigate]);

  const getCandidateName = (id: string) => {
    return candidates.find((c) => c.id === id)?.name || "Unknown";
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("E-Voting Results", 10, 10);

    candidates.forEach((c, i) => {
      doc.text(`${c.name}: ${c.voteCount} votes`, 10, 20 + i * 10);
    });

    doc.save("voting-results.pdf");
  };

  const exportToExcel = () => {
    const data = candidates.map((c) => ({
      Candidate: c.name,
      Votes: c.voteCount,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, "voting-results.xlsx");
  };

  return (
    <div className="admin-container">
      <header>
        <h1>E-Voting Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section className="results">
        <h2>Vote Results</h2>
        <ul>
          {candidates.map((c) => (
            <li key={c.id}>
              {c.name}: {c.voteCount} votes
            </li>
          ))}
        </ul>
        <div className="export-buttons">
          <button onClick={exportToPDF}>Export PDF</button>
          <button onClick={exportToExcel}>Export Excel</button>
        </div>
      </section>

      <section className="votes">
        <h2>Who Voted for Whom</h2>
        <ul>
          {votes.map((vote) => {
            const user = users.find((u) => u.id === vote.id);
            return (
              <li key={vote.id}>
                {user?.name || "Unknown user"} voted for {getCandidateName(vote.candidateId)}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
