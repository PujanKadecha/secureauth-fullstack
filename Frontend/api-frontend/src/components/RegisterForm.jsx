import PasswordStrengthMeter from "./PasswordStrengthMeter";

function RegisterForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  onRegister,
  onSwitchToLogin,
}) {
  return (
    <div className="form-container">
      <h2>Create New Account</h2>
      <form onSubmit={onRegister} className="form-layout">
        <div>
          <label>Full Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <div>
          <label>Email Address: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
          <PasswordStrengthMeter password={password} />
        </div>
      
        <button type="submit" className="btn btn-primary">
          Create Account
        </button>

        <button
          type="button"
          onClick={onSwitchToLogin}
          className="btn btn-muted"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;