import { useState } from "react";
import API from "../api";

export function useAdmin(clearMessages, setErrorMsg, setMessage) {
  const [allUsers, setAllUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const fetchAdminData = async () => {
    clearMessages();
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [usersRes, logsRes] = await Promise.all([
        API.get("/users", config),
        API.get("/users/logs", config),
      ]);
      setAllUsers(usersRes.data);
      setActivityLogs(logsRes.data);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load collections.",
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this account?"))
      return;
    clearMessages();
    try {
      const token = localStorage.getItem("accessToken");
      await API.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("User deleted successfully!");
      fetchAdminData();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Failed to delete user account.",
      );
    }
  };

  const handleUnlockUser = async (userId) => {
    if (!window.confirm("Unlock this account?")) return;
    clearMessages();
    try {
      const token = localStorage.getItem("accessToken");
      await API.post(
        `/users/${userId}/unlock`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMessage("Account Unlocked Successfully");
      fetchAdminData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to Unlock Account");
    }
  };

  const handleExportLogsCSV = () => {
    if (activityLogs.length === 0) {
      alert("No logs available to export.");
      return;
    }
    const headers = ["Timestamp", "Action", "User Email", "Details"];
    const rows = activityLogs.map((log) =>
      [
        new Date(log.timestamp).toLocaleString(),
        log.action,
        log.userEmail || "System",

        `"${(log.details || "").replace(/"/g, '""')}"`,
      ].join(","),
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `security_audit_logs_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChangeRole = async (userId, newRole) => {
    if (!["user", "admin"].includes(newRole)) return;

    if (!window.confirm(`Change role to ${newRole}?`)) return;

    clearMessages();

    try {
      const token = localStorage.getItem("accessToken");
      const res = await API.put(
        `/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage(res.data.message || "Role updated successfully");
      fetchAdminData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to change Role");
    }
  };

  return {
    allUsers,
    setAllUsers,
    activityLogs,
    setActivityLogs,
    fetchAdminData,
    handleDeleteUser,
    handleUnlockUser,
    handleExportLogsCSV,
    handleChangeRole
  };
}
