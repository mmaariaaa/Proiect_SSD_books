import React, { useState } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handleEmailLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Logged in successfully!");
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    };


    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            alert("Logged in with Google!");
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #f5e1da, #f0c987)",
                fontFamily: "'Poppins', sans-serif",
            }}
        >
            <div
                style={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    padding: "50px 60px",
                    borderRadius: 20,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    textAlign: "center",
                    width: 350,
                }}
            >
                <h1
                    style={{
                        fontSize: "2.8rem",
                        marginBottom: 30,
                        fontFamily: "'Pacifico', cursive",
                        color: "#34495e",
                    }}
                >
                    LOGIN
                </h1>

                {/* Email & Password */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "15px",
                        marginBottom: 20,
                        borderRadius: 10,
                        border: "1px solid #ccc",
                        fontSize: 16,
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "15px",
                        marginBottom: 30,
                        borderRadius: 10,
                        border: "1px solid #ccc",
                        fontSize: 16,
                    }}
                />
                <button
                    onClick={handleEmailLogin}
                    style={{
                        width: "100%",
                        padding: "15px",
                        borderRadius: 10,
                        border: "none",
                        backgroundColor: "#3498db",
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginBottom: 15,
                    }}
                >
                    Login
                </button>

                <hr style={{ margin: "20px 0" }} />


                <button
                    onClick={handleGoogleLogin}
                    style={{
                        width: "100%",
                        padding: "15px",
                        borderRadius: 10,
                        border: "none",
                        backgroundColor: "#db4437",
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}

export default Login;