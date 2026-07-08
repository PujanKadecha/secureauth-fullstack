function AdminView({
  user,
  allUsers,
  activityLogs,
  onRefresh,
  onDeleteUser,
  onUnlockUser,
  onChangeRole, 
  onExportLogs,
}) {
  return (
    <div className="admin-view-container">
      <h2>System Users Management</h2>
      <button
        onClick={onRefresh}
        className="btn btn-success"
        style={{ marginBottom: "15px" }}
      >
        Refresh
      </button>

      <div className="user-directory-box" style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f4f4f5",
                borderBottom: "2px solid #e4e4e7",
              }}
            >
              <th style={{ padding: "10px" }}>Name</th>
              <th style={{ padding: "10px" }}>Email</th>
              <th style={{ padding: "10px" }}>Role</th>
              <th style={{ padding: "10px" }}>Status</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((u) => {
              const currentUserId = user?.id || user?._id;
              const isLocked = Boolean(
                u.lockUntil && new Date(u.lockUntil).getTime() > Date.now(),
              );
              return (
                <tr key={u._id} style={{ borderBottom: "1px solid #e4e4e7" }}>
                  <td style={{ padding: "10px", fontWeight: "bold" }}>
                    {u.name || "Anonymous"}
                  </td>
                  <td style={{ padding: "10px" }}>{u.email}</td>
                  <td style={{ padding: "10px" }}>{u.role || "user"}</td>
                  <td style={{ padding: "10px" }}>
                    {isLocked ? (
                      <span style={{ color: "#ef4444", fontWeight: "bold" }}>
                        Locked
                      </span>
                    ) : (
                      <span style={{ color: "#22c55e" }}>Active</span>
                    )}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {u._id !== currentUserId && (
                      <>
                        <select
                          onChange={(e) => onChangeRole(u._id, e.target.value)}
                          defaultValue={u.role}
                          style={{
                            marginRight: "8px",
                            padding: "5px 8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                          }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>

                        {isLocked && (
                          <button
                            onClick={() => onUnlockUser(u._id)}
                            className="btn btn-warning"
                            style={{
                              marginRight: "8px",
                              padding: "5px 10px",
                              fontSize: "12px",
                            }}
                          >
                            Unlock
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteUser(u._id)}
                          className="btn btn-danger"
                          style={{ padding: "5px 10px", fontSize: "12px" }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        className="audit-trail-section"
        style={{ marginTop: "40px", textAlign: "left" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #e4e4e7",
            paddingBottom: "8px",
            marginBottom: "10px",
          }}
        >
          <h3 style={{ margin: 0 }}>Security Audit Feed</h3>
          <button
            onClick={onExportLogs}
            className="btn btn-primary"
            style={{ padding: "5px 12px", fontSize: "13px" }}
          >
            Export to CSV
          </button>
        </div>

        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #e4e4e7",
            borderRadius: "6px",
            backgroundColor: "#fafafa",
            padding: "10px",
          }}
        >
          {activityLogs.length === 0 ? (
            <p style={{ color: "#71717a", fontSize: "14px" }}>
              No system logs recorded yet.
            </p>
          ) : (
            activityLogs.map((log) => (
              <div
                key={log._id}
                style={{
                  padding: "8px 5px",
                  borderBottom: "1px dashed #e4e4e7",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: "#71717a", marginRight: "10px" }}>
                  [{new Date(log.timestamp).toLocaleString()}]
                </span>
                <strong
                  style={{
                    color: log.action.includes("DELETE")
                      ? "#ef4444"
                      : log.action.includes("SUCCESS") ||
                          log.action.includes("UPDATE")
                        ? "#22c55e"
                        : "#3b82f6",
                    marginRight: "10px",
                  }}
                >
                  {log.action}
                </strong>
                <span style={{ color: "#18181b" }}>
                  ({log.userEmail || "System"}) — {log.details}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminView;