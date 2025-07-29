import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Admin from "../pages/admin/Admin";

const darkStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#1a1a1a",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
    padding: "30px", // Зменшений padding
    width: "100%",
    maxWidth: "360px", // Зменшена максимальна ширина
    textAlign: "center",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "26px", // Трохи зменшений розмір заголовка
    fontWeight: "700",
    color: "#e0e0e0",
    marginBottom: "25px", // Зменшений відступ
    letterSpacing: "-0.8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px", // Зменшений відступ між елементами
  },
  input: {
    width: "100%",
    padding: "14px", // Зменшений padding
    borderRadius: "10px",
    border: "1px solid #444",
    backgroundColor: "#3a3a3a",
    color: "#e0e0e0",
    fontSize: "16px", // Зменшений розмір шрифту
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  inputFocus: {
    borderColor: "#8a2be2",
    boxShadow: "0 0 0 3px rgba(138, 43, 226, 0.3)",
  },
  button: {
    padding: "14px 20px", // Зменшений padding
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#8a2be2",
    color: "white",
    fontSize: "17px", // Зменшений розмір шрифту
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s",
    outline: "none",
  },
  buttonHover: {
    backgroundColor: "#6a1ba3",
    transform: "translateY(-2px)",
  },
  buttonDisabled: {
    backgroundColor: "#555555",
    cursor: "not-allowed",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "14px", // Зменшений розмір шрифту
    marginTop: "15px", // Зменшений відступ
    fontWeight: "500",
  },
  loading: {
    fontSize: "18px", // Зменшений розмір шрифту
    color: "#aaaaaa",
  },
};

const AdminPageContent = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      window.location.reload();
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "8px",
        marginTop: "20px",
        backgroundColor: "#2a2a2a",
        maxWidth: "1200px",
        margin: "20px auto",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      <h2
        style={{ textAlign: "center", marginBottom: "30px", color: "#e0e0e0" }}
      >
        Welcome, Admin!
      </h2>
      <p style={{ textAlign: "center", fontSize: "16px", color: "#aaaaaa" }}>
        This is your super secret admin dashboard content.
      </p>
      <button
        onClick={handleLogout}
        style={{
          display: "block",
          margin: "30px auto 0",
          padding: "12px 25px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#dc3545",
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#c82333")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc3545")}
      >
        Logout
      </button>
    </div>
  );
};

const ProtectedAdminPage = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session && session.user.email === ADMIN_EMAIL) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session && session.user.email === ADMIN_EMAIL) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [ADMIN_EMAIL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: ADMIN_EMAIL,
          password: password,
        }
      );

      if (authError) {
        setError(authError.message);
        setIsAuthenticated(false);
      } else if (data.user && data.user.email === ADMIN_EMAIL) {
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setError("Authentication failed. Invalid credentials or not an admin.");
        setIsAuthenticated(false);
        await supabase.auth.signOut();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={darkStyles.container}>
        <div style={darkStyles.card}>
          <p style={darkStyles.loading}>Завантаження...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Admin />;
  }

  return (
    <div style={darkStyles.container}>
      <div style={darkStyles.card}>
        <h3 style={darkStyles.title}>Ліза, привіт!</h3>
        <form onSubmit={handleSubmit} style={darkStyles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            disabled={isLoading}
            style={{
              ...darkStyles.input,
              ...(isInputFocused ? darkStyles.inputFocus : {}),
            }}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...darkStyles.button,
              ...(isLoading ? darkStyles.buttonDisabled : {}),
            }}
            onMouseEnter={(e) =>
              !isLoading &&
              (e.target.style.backgroundColor =
                darkStyles.buttonHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              !isLoading &&
              (e.target.style.backgroundColor =
                darkStyles.button.backgroundColor)
            }
            onMouseDown={(e) =>
              !isLoading &&
              (e.target.style.transform = darkStyles.buttonHover.transform)
            }
            onMouseUp={(e) => !isLoading && (e.target.style.transform = "none")}
          >
            {isLoading ? "Перевірка..." : "Увійти"}
          </button>
        </form>
        {error && <p style={darkStyles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default ProtectedAdminPage;
