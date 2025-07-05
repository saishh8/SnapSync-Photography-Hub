import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import styles from "../styles/Username.module.css";
import extend from "../styles/Profile.module.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [contact, setContact] = useState("");

  const navigate = useNavigate();

  async function registerUser(ev) {
    ev.preventDefault();

    if (!name || !email || !password || !address || !portfolio || !contact) {
      alert("Please fill all the details before registering.");
      return;
    }

    try {
      const response = await axios.post("/register", {
        name,
        email,
        password,
        address,
        portfolio,
        contact,
      });
    
      if (response.status === 201) {
        alert("Registration successful. Now you can log in");
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code out of 2xx
        alert(error.response.data.message || "Registration failed.");
      } else if (error.request) {
        // No response received
        alert("No response from server. Please try again.");
      } else {
        // Something else went wrong
        alert("An unexpected error occurred.");
      }
    }
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center min-h-screen p-4">
        <div
          className={styles.glass}
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "2rem",
            height: "auto",
          }}
        >
          <div className="title flex flex-col my-3 items-center">
            <Link className="text-black" to={"/"}>
              HOME
            </Link>
          </div>

          <div className="title flex flex-col items-center">
            <h4 className="text-3xl md:text-5xl font-bold text-center">
              Photographer Register
            </h4>
            <span className="py-4 text-base md:text-xl text-center text-gray-500">
              Happy to join you
            </span>
          </div>

          <form className="py-1" method="POST" id="login-form" onSubmit={registerUser}>
            <div className="textbox flex flex-col items-center gap-6 px-4">
              {/* Name & Contact */}
              <div className="flex flex-col md:flex-row w-full md:w-3/4 gap-4">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  className={`${styles.textbox} ${extend.textbox} w-full`}
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                />
                <input
                  type="number"
                  name="contact"
                  id="contact"
                  placeholder="Phone No."
                  className={`${styles.textbox} ${extend.textbox} w-full`}
                  value={contact}
                  onChange={(ev) => setContact(ev.target.value)}
                />
              </div>

              {/* Email & Password */}
              <div className="flex flex-col md:flex-row w-full md:w-3/4 gap-4">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className={`${styles.textbox} ${extend.textbox} w-full`}
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                />
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password*"
                  className={`${styles.textbox} ${extend.textbox} w-full`}
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                />
              </div>

              {/* Address & Portfolio */}
              <div className="flex flex-col md:flex-row w-full md:w-3/4 gap-4">
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Address"
                  className={`${styles.textbox} ${extend.textbox} w-full`}
                  value={address}
                  onChange={(ev) => setAddress(ev.target.value)}
                />
                <input
                  type="text"
                  name="portfolio"
                  id="portfolio"
                  placeholder="Portfolio Link"
                  className={`${styles.textbox} ${extend.textbox} w-full`}
                  value={portfolio}
                  onChange={(ev) => setPortfolio(ev.target.value)}
                />
              </div>

              <button className={styles.btn} type="submit">
                Register
              </button>
            </div>

            <div className="text-center py-2">
              <span>
                Already Registered?{" "}
                <Link className="text-red-500" to="/login">
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
