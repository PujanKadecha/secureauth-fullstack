import { useState, useEffect } from "react";
import API from "../api";

export function useAuth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editName, setEditName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [view, setView] = useState("login");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeResetToken, setActiveResetToken] = useState("");

  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [tempUserId, setTempUserId] = useState("");
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [qrCodeUrl, setQqCodeUrl] = useState("");
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [twoFactorSetupCode, setTwoFactorSetupCode] = useState("");

  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView("dashboard");
    }
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const refresh = queryParams.get("refresh");
    const userDataStr = queryParams.get("user");
    const oauthError = queryParams.get("error");
    const verifyToken = queryParams.get("verifyToken");
    const resetToken = queryParams.get("resetToken");

    if (token && refresh && userDataStr) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refresh);
      const parsedUser = JSON.parse(decodeURIComponent(userDataStr));
      localStorage.setItem("user", JSON.stringify(parsedUser));
      setUser(parsedUser);
      setMessage(
        `Successfully authenticated via Google! Welcome, ${parsedUser.name}.`,
      );
      setView("dashboard");
      window.history.replaceState({}, document.title, "/");
    } else if (oauthError) {
      setErrorMsg(
        `Google authentication failed: ${decodeURIComponent(oauthError)}`,
      );
      window.history.replaceState({}, document.title, "/");
    } else if (verifyToken) {
      window.history.replaceState({}, document.title, "/");
      const triggerEmailVerification = async () => {
        setMessage("Verifying Your Email");
        try {
          const res = await API.get(`/auth/verify-email?token=${verifyToken}`);
          setMessage(res.data.message || "Email Verified Successfully");
          setErrorMsg("");
          setView("login");
        } catch (err) {
          setErrorMsg(
            err.response?.data?.message ||
              "Email verification link is Unavailable",
          );
          setMessage("");
        }
      };
      triggerEmailVerification();
    } else if (resetToken) {
      setActiveResetToken(resetToken);
      setView("reset-password");
    }
  }, []);

  useEffect(() => {
    if (view === "profile") {
      fetchLoginHistory();
    }
  }, [view]);

  const fetchLoginHistory = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await API.get("/users/login-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoginHistory(res.data.loginHistory || []);
    } catch (err) {
      console.log("Failed to load login history", err);
      setLoginHistory([]);
    }
  };

  const clearMessages = () => {
    setMessage("");
    setErrorMsg("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const res = await API.post("/auth/login", { email, password });
      if (res.data.isTwoFactorRequired) {
        setTempUserId(res.data.userId);
        setView("2fa-login");
        setMessage("Two-Factor Authentication is enabled on this account.");
        return;
      }
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setMessage(`Successfully logged in! Welcome, ${res.data.user.name}.`);
      setView("dashboard");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    }
  };

  const handle2FALogin = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const res = await API.post("/auth/2fa/verify-login", {
        userId: tempUserId,
        token: twoFactorCode,
      });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setMessage(
        `Successfully verified 2FA! Welcome back, ${res.data.user.name}.`,
      );
      setTwoFactorCode("");
      setTempUserId("");
      setView("dashboard");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Invalid Authentication Code");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });
      setMessage(
        res.data.message || "Registration done! Please check your email.",
      );

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data?.error;
      if (backendMessage) {
        setMessage(backendMessage);
      } else {
        setErrorMsg("Registration failed. Please try again.");
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const res = await API.post("/users/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Error sending link");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const res = await API.post(`/users/reset-password/${activeResetToken}`, {
        password: newPassword,
      });
      setMessage(res.data.message || "Password updated");
      setNewPassword("");
      setView("login");
      window.history.replaceState({}, document.title, "/");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Server error.",
      );
    }
  };

  const handleLogout = async () => {
    clearMessages();
    try {
      const token = localStorage.getItem("refreshToken");
      if (token) {
        await API.post("/auth/logout", { token });
      }
    } catch (err) {
      console.log("Server side logout failed", err);
    } finally {
      localStorage.clear();
      setUser(null);
      setView("login");
      setMessage("Logged out successfully.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const response = await API.put(
        "/users/profile",
        { name: editName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setMessage(response.data.message);
      setErrorMsg("");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to Update user");
      setMessage("");
    }
  };

  const handleSetup2FA = async () => {
    clearMessages();
    try {
      const token = localStorage.getItem("accessToken");
      const res = await API.post(
        "/auth/2fa/setup",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setQqCodeUrl(res.data.qrCodeUrl);
      setTwoFactorSecret(res.data.secret);
      setIsSettingUp2FA(true);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to initialize 2FA initialization",
      );
    }
  };

  const handleEnable2FA = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const token = localStorage.getItem("accessToken");
      const res = await API.post(
        "/auth/2fa/enable",
        { token: twoFactorSetupCode },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage(
        res.data.message ||
          "Two Factor Authentication successfully verified and locked.",
      );

      const updatedUser = { ...user, isTwoFactorEnabled: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsSettingUp2FA(false);
      setTwoFactorSetupCode("");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          "Invalid authentication code verification sequence.",
      );
    }
  };

  const handleDisable2FA = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await API.post(
        "/auth/2fa/disable",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage(res.data.message || "2FA status disabled.");

      const updatedUser = { ...user, isTwoFactorEnabled: false };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          "Could not complete configuration adjustment update requests.",
      );
    }
  };


  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    editName,
    setEditName,
    newPassword,
    setNewPassword,
    view,
    setView,
    user,
    setUser,
    message,
    setMessage,
    errorMsg,
    setErrorMsg,
    twoFactorCode,
    setTwoFactorCode,
    isSettingUp2FA,
    setIsSettingUp2FA,
    qrCodeUrl,
    twoFactorSecret,
    twoFactorSetupCode,
    setTwoFactorSetupCode,
    loginHistory,
    clearMessages,
    handleLogin,
    handle2FALogin,
    handleRegister,
    handleForgotPassword,
    handleResetPassword,
    handleLogout,
    handleUpdateProfile,
    handleSetup2FA,
    handleEnable2FA,
    handleDisable2FA,
  };
}
