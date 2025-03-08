import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import styles from "../styles/Username.module.css";


export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Check if the email and password match your criteria
    if (email === "admin@gmail.com" && password === "admin") {
      // Navigate to the "/Admin" page if the credentials are correct
      navigate("/home_admin");
    } else {
      // Handle incorrect login here (show an error message, etc.)
      console.log("Invalid credentials");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col my-5 items-center">
            <Link className="underline text-black" to={"/"}>
              HOME
            </Link>
          </div>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl py-2 font-bold">Admin</h4>
            <h4 className="text-5xl font-bold">Login</h4>
            <span className="py-4 text-xl text-center w-2/3 text-gray-500">
              Explore more by connecting with us
            </span>
          </div>
          <form className="py-1" onSubmit={handleLoginSubmit}>
            <div className="textbox flex flex-col items-center gap-6 ">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                className={styles.textbox}
              />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className={styles.textbox}
              />
              <button className={styles.btn} type="submit">
                Let's Go
              </button>
            </div>
           
          </form>
        </div>
      </div>
      
    </div>
  );
}
