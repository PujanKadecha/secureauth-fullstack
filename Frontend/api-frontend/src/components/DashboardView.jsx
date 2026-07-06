function DashboardView({ user, onLogout }) {
  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>User ID:</strong> {user.id}
      </p>
      <p>
        <strong>Role:</strong> {user.role || "user"}
      </p>
      <hr />
      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <button onClick={onLogout} className="btn btn-danger">
          Log Out
        </button>
      </div>
    </div>
  );
}

export default DashboardView;
