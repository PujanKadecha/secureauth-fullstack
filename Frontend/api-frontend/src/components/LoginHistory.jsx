function LoginHistory({ loginHistory }) {
  return (
    <div className="login-history">
      <h3>Recent Login Activity</h3>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {loginHistory.length === 0 ? (
          <p>No login history yet.</p>
        ) : (
          loginHistory.map((entry, index) => (
            <div key={index} style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              <strong>{new Date(entry.timestamp).toLocaleString()}</strong>
              <p style={{ margin: "4px 0", fontSize: "14px" }}>
                IP: {entry.ip} | {entry.userAgent?.substring(0, 50)}...
              </p>
              <span style={{ color: entry.success ? "green" : "red" }}>
                {entry.success ? "Success" : "Failed"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LoginHistory;