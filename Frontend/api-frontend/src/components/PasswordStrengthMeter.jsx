import { useState, useEffect } from "react";

function PasswordStrengthMeter({ password }) {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setFeedback("");
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    setStrength(score);

    if (score <= 2) setFeedback("Weak");
    else if (score === 3) setFeedback("Medium");
    else if (score === 4) setFeedback("Good");
    else setFeedback("Strong");
  }, [password]);

  const getColor = () => {
    if (strength <= 2) return "#ef4444";
    if (strength === 3) return "#f59e0b";
    if (strength === 4) return "#eab308";
    return "#22c55e";
  };

  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              height: "6px",
              flex: 1,
              backgroundColor: i <= strength ? getColor() : "#e5e7eb",
              borderRadius: "2px",
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: "12px", color: getColor(), margin: 0 }}>
        {feedback}
      </p>
    </div>
  );
}

export default PasswordStrengthMeter;