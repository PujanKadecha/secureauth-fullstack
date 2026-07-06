import { useEffect, useState } from "react";
import API from "../api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/users");
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to Load Admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletUser = async () => {
    try {
      await API.delete(`/user/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading Admin Control Panel...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          <p className="font-bold">Access Denied / Server Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Admin System Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage corporate user records, accounts, and system access status.
            </p>
          </div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm font-medium transition text-sm"
          >
            Refresh Records
          </button>
        </div>

        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-semibold text-xs tracking-wider uppercase">
                  <th className="p-4">User ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Account Role</th>
                  <th className="p-4 text-center">Action Panel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-gray-400 font-medium"
                    >
                      No matching database user accounts discovered.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50/70 transition duration-150"
                    >
                      <td className="p-4 font-mono text-xs text-gray-400">
                        {user._id}
                      </td>
                      <td className="p-4 font-semibold text-gray-900">
                        {user.name || "Anonymous User"}
                      </td>
                      <td className="p-4 text-gray-500">{user.email}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-red-50 text-red-700 ring-1 ring-red-600/10"
                              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-md text-xs font-medium transition"
                        >
                          Terminate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
