function TwoFactorLoginForm({ twoFactorCode, onCodeChange, onVerify, onBack }) {
  return (
    <div className="form-layout">
      <form onSubmit={onVerify} className="form-layout">
        <h3>Two-Factor Verification Check</h3>
        <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.5" }}>
          Please look at your paired authentication engine tool app code details
          and fill them out into the terminal prompt block below:
        </p>
        <input
          type="text"
          placeholder="Enter 6-Digit Authentication Code"
          maxLength={6}
          value={twoFactorCode}
          onChange={(e) => onCodeChange(e.target.value)}
          required
          className="input-field"
          style={{
            textAlign: "center",
            fontSize: "18px",
            letterSpacing: "4px",
          }}
        />
        <button type="submit" className="btn btn-primary">
          Verify Credentials & Open Dashboard
        </button>
        <button type="button" onClick={onBack} className="btn btn-muted">
          Back to standard Login
        </button>
      </form>
    </div>
  );
}

export default TwoFactorLoginForm;
