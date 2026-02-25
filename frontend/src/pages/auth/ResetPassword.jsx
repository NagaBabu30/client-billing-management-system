import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const submit = async () => {
    if (!username || !oldPassword || !newPassword) {
      alert("All fields required");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        username,
        oldPassword,
        newPassword,
      });

      alert("Password reset successful. Login again.");
      localStorage.clear();
      navigate("/login");
    } catch {
      alert("Reset failed");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "400px" }}>
      <h2>Reset Password</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Temporary Password"
        value={oldPassword}
        onChange={e => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />

      <button onClick={submit}>Reset Password</button>
    </div>
  );
}

