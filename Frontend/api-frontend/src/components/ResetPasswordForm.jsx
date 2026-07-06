import PasswordStrengthMeter from "./PasswordStrengthMeter";

function ResetPasswordForm({
  newPassword,
  setNewPassword,        // ← Changed to setNewPassword
  onSubmit,
  onBackToLogin,
}) {
  return (
    <div className="form-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={onSubmit} className="form-layout">
        <div>
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="input-field"
            minLength={6}
          />
          <PasswordStrengthMeter password={newPassword} />
        </div>

        <button type="submit" className="btn btn-primary">
          Update Password
        </button>

        {onBackToLogin && (
          <button
            type="button"
            onClick={onBackToLogin}
            className="btn btn-muted"
          >
            Back to Login
          </button>
        )}
      </form>
    </div>
  );
}

export default ResetPasswordForm;