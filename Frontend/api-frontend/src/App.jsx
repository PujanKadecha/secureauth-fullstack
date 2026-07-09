import { useAuth } from "./hooks/useAuth";
import { useAdmin } from "./hooks/useAdmin";
import "./App.css";

import LoginForm from "./components/LoginForm";
import TwoFactorLoginForm from "./components/TwoFactorLoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import DashboardView from "./components/DashboardView";
import ProfileView from "./components/ProfileView";
import AdminView from "./components/AdminView";

function App() {
  const auth = useAuth();
  const admin = useAdmin(auth.clearMessages, auth.setErrorMsg, auth.setMessage);


  return (
    <div className="app-container">
      <h1 className="app-title">Auth API Dashboard</h1>

      {auth.message && <div className="alert-success">{auth.message}</div>}
      {auth.errorMsg && <div className="alert-error">{auth.errorMsg}</div>}

      {auth.user ? (
        <div className="auth-card">
          <nav className="nav-bar">
            <button
              className={`btn-tab ${auth.view === "dashboard" ? "active-tab" : ""}`}
              onClick={() => auth.setView("dashboard")}
            >
              Dashboard
            </button>
            {auth.user.role === "admin" && (
              <button
                className={`btn-tab ${auth.view === "admin" ? "active-tab" : ""}`}
                onClick={() => {
                  auth.setView("admin");
                  admin.fetchAdminData();
                }}
              >
                Admin Control Panel
              </button>
            )}
            <button
              className={`btn-tab ${auth.view === "profile" ? "active-tab" : ""}`}
              onClick={() => {
                auth.setView("profile");
                auth.setEditName(auth.user.name);
              }}
            >
              My Profile
            </button>
          </nav>

          {auth.view === "profile" && (
            <ProfileView
              user={auth.user}
              editName={auth.editName}
              onEditNameChange={auth.setEditName}
              onUpdateProfile={auth.handleUpdateProfile}
              isSettingUp2FA={auth.isSettingUp2FA}
              qrCodeUrl={auth.qrCodeUrl}
              twoFactorSecret={auth.twoFactorSecret}
              twoFactorSetupCode={auth.twoFactorSetupCode}
              onSetupCodeChange={auth.setTwoFactorSetupCode}
              onSetup2FA={auth.handleSetup2FA}
              onEnable2FA={auth.handleEnable2FA}
              onDisable2FA={auth.handleDisable2FA}
              onCancelSetup={() => auth.setIsSettingUp2FA(false)}
            />
          )}

          {auth.view === "admin" && auth.user.role === "admin" && (
            <AdminView
              user={auth.user}
              allUsers={admin.allUsers}
              activityLogs={admin.activityLogs}
              onRefresh={admin.fetchAdminData}
              onDeleteUser={admin.handleDeleteUser}
              onExportLogs={admin.handleExportLogsCSV}
              onUnlockUser={admin.handleUnlockUser}
              onChangeRole={admin.handleChangeRole}
            />
          )}

          {auth.view !== "profile" && auth.view !== "admin" && (
            <DashboardView user={auth.user} onLogout={auth.handleLogout} />
          )}
        </div>
      ) : (
        <div>
          <div className="nav-toggle-bar">
            <button
              className={`btn-tab ${auth.view === "login" ? "active-tab" : ""}`}
              onClick={() => {
                auth.setView("login");
                auth.clearMessages();
              }}
            >
              Sign In
            </button>
            <button
              className={`btn-tab ${auth.view === "register" ? "active-tab" : ""}`}
              onClick={() => {
                auth.setView("register");
                auth.clearMessages();
              }}
            >
              Sign Up
            </button>
            <button
              className={`btn-tab ${auth.view === "forgot" ? "active-tab" : ""}`}
              onClick={() => {
                auth.setView("forgot");
                auth.clearMessages();
              }}
            >
              Forgot Password
            </button>
          </div>

          {auth.view === "login" && (
            <LoginForm
              onEmailChange={auth.setEmail}
              onPasswordChange={auth.setPassword}
              onLogin={auth.handleLogin}
            />
          )}
          {auth.view === "2fa-login" && (
            <TwoFactorLoginForm
              twoFactorCode={auth.twoFactorCode}
              onCodeChange={auth.setTwoFactorCode}
              onVerify={auth.handle2FALogin}
              onBack={() => {
                auth.setView("login");
                auth.clearMessages();
              }}
            />
          )}
          {auth.view === "register" && (
            <RegisterForm
              name={auth.name}
              email={auth.email}
              password={auth.password}
              confirmPassword={auth.confirmPassword}
              onNameChange={auth.setName}
              onEmailChange={auth.setEmail}
              onPasswordChange={auth.setPassword}
              onConfirmPasswordChange={auth.setConfirmPassword}
              onRegister={auth.handleRegister}
            />
          )}
          {auth.view === "forgot" && (
            <ForgotPasswordForm
              onEmailChange={auth.setEmail}
              onSubmit={auth.handleForgotPassword}
            />
          )}
          {auth.view === "reset-password" && (
            <ResetPasswordForm
              newPassword={auth.newPassword}
              onPasswordChange={auth.setNewPassword}
              newCongirmPassword = {auth.newConfirmPassword}
              onConfirmPasswordChange={auth.setNewConfirmPassword}
              onSubmit={auth.handleResetPassword}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;