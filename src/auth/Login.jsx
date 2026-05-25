import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/authApi";
import { useAuth } from "./AuthContext";
import "./Login.css";

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const userData = await loginApi(username, password);

      login(userData);

      navigate(
        userData.firstLogin
          ? "/reset-password"
          : "/"
      );

    } catch {

      setError("Invalid username or password");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="login-page">

      <div className="login-container">

        {/* LEFT PANEL */}

        <div className="login-left">

          <h2>Welcome Back!</h2>

          <p>
            Manage your clients, products, invoices and billing payments securely and efficiently.
          </p>

        </div>


        {/* RIGHT PANEL */}

        <div className="login-right">

          <h2 className="login-title">Login</h2>

          <p className="login-subtitle">
            Sign in to your account
          </p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          <form onSubmit={handleLogin}>


            {/* USERNAME (FIXED WITH WRAPPER) */}

            <div className="input-group">

              <div className="password-wrapper">

                <input
                  className="input-field"
                  type="text"
                  placeholder="Username or Email"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  required
                />

              </div>

            </div>



            {/* PASSWORD */}

            <div className="input-group">

              <div className="password-wrapper">

                <input
                  className="input-field"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <span
                  className="eye-icon"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </span>

              </div>

            </div>



            {/* BUTTON */}

            <button
              className="login-button"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Login"}

            </button>


          </form>

        </div>

      </div>

    </div>

  );

};

export default Login;
