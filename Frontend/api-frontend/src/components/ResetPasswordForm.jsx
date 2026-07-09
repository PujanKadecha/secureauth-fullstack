function ResetPasswordForm({ newPassword, onPasswordChange,newCongirmPassword,onNewConfirmPasswordChange, onSubmit }) {
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
      <input
        type="password"
        placeholder="Confirm New Password"
        value={newCongirmPassword}
        onChange={(e) => onNewConfirmPasswordChange(e.target.value)}
        required
        className="input-field"
      />
      <button type="submit" className="btn btn-primary">
        Update Password
      </button>
    </form>
  );
}

export default ResetPasswordForm;
