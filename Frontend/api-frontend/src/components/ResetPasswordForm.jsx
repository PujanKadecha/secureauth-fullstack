function ResetPasswordForm({ newPassword, onPasswordChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="form-layout">
      <h3>Set a New Password</h3>
      <p style={{ fontSize: "14px", color: "#666" }}>Enter a New Password</p>
      <input
        type="password"
        placeholder="Enter New password"
        value={newPassword}
        onChange={(e) => onPasswordChange(e.target.value)}
        required
        className="input-field"
        minLength={6}
      />
      <button type="submit" className="btn btn-primary">
        Update Password
      </button>
    </form>
  );
}

export default ResetPasswordForm;
