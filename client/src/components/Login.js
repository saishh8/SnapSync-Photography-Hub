import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Username.module.css";
import bgm from "../assets/Background.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const response = await axios.post("/login", { email, password });
      if (response.status === 200 && response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        navigate("/PHome");
      } else {
        alert("Login failed. Unexpected response from the server.");
      }
    } catch (e) {
      if (e.response && e.response.status === 403) {
        alert("You are not verified. Please wait till your account is verified to log in.");
      } else if (e.response && e.response.status === 422) {
        alert("Incorrect password. Please try again.");
      } else if (e.response && e.response.status === 404) {
        alert("User not found. Please check your email.");
      } else {
        alert("Login failed. Please try again later.");
      }
    }
  }

  return (
    <div className="container mx-auto min-h-screen flex justify-center items-center p-4">
      <div
        className={styles.glass}
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "2rem",
        }}
      >
        {/* Home Link */}
        <div className="title flex flex-col my-3 items-center">
          <Link className="text-black text-sm underline" to={"/"}>
            HOME
          </Link>
        </div>

        {/* Title */}
        <div className="title flex flex-col items-center text-center">
          <h4 className="text-3xl md:text-5xl font-bold">Photographer</h4>
          <h4 className="text-3xl md:text-5xl font-bold">Login</h4>
          <span className="py-4 text-base md:text-xl text-gray-500">
            Explore more by connecting with us
          </span>
        </div>

        {/* Form */}
        <form className="py-1" onSubmit={handleLoginSubmit}>
          <div className="textbox flex flex-col items-center gap-6 px-2">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className={`${styles.textbox} w-full`}
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className={`${styles.textbox} w-full`}
            />
            <button className={styles.btn} type="submit">
              Let's Go
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center py-4 text-gray-500 text-sm">
            Don&apos;t have an account yet?{" "}
            <Link className="underline text-black" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

