function LoginForm({ onEmailChange, onPasswordChange, onLogin }) {
  return (
    <div className="form-layout">
      <form onSubmit={onLogin} className="form-layout">
        <h3>Account Login</h3>
        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <div className="divider-container">
        <div className="divider-line"></div>
        <span className="divider-text">OR</span>
        <div className="divider-line"></div>
      </div>
      <button
        type="button"
        onClick={() =>
          (window.location.href = "https://secureauth-backend-udsa.onrender.com/api/auth/google")
        }
        className="btn btn-google"
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default LoginForm;
