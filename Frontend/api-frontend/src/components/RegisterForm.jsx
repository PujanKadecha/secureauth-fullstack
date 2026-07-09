function RegisterForm({
  name,
  email,
  password,
  confirmPassword,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onRegister,
  onConfirmPasswordChange,
}) {
  return (
    <form onSubmit={onRegister} className="form-layout">
      <h3>Create an Account</h3>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        required
        className="input-field"
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        required
        className="input-field"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        required
        className="input-field"
      />
      <button type="submit" className="btn btn-success">
        Register
      </button>
    </form>
  );
}

export default RegisterForm;
