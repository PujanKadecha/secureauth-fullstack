function ForgotPasswordForm({ onEmailChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="form-layout">
      <h3>Recover Account Password</h3>
      <p style={{ fontSize: "14px", color: "#666" }}>
        Enter your registered email below to receive an reset link.
      </p>
      <input
        type="email"
        placeholder="Email Address"
        onChange={(e) => onEmailChange(e.target.value)}
        required
        className="input-field"
      />
      <button type="submit" className="btn btn-muted">
        Send Password Reset Email
      </button>
    </form>
  );
}

export default ForgotPasswordForm;
