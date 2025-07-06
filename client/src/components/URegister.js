import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css';

function SignIn() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    contact: '',
    email: '',
    password: '',
    address: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fname, lname, contact, email, password, address } = formData;

    if (!fname || !lname || !contact || !email || !password || !address) {
      alert("Please fill in all fields before registering.");
      return;
    }

    axios.post('/uregister', formData)
      .then((response) => {
        console.log('User registered:', response.data);
        alert('Registration successful. Now you can log in');
        navigate('/usign');
      })
      .catch((error) => {
        console.error('Error during registration:', error);
        if (error.response?.data?.message) {
          alert(error.response.data.message); // Shows 'Email already exists' if sent by server
        } else {
          alert('Registration failed. Please try again later.');
        }
      });
  };

  return (
    <div className="container mx-auto min-h-screen flex justify-center items-center p-4">
      <div
        className={styles.glass}
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "2rem",
          height: "auto",
        }}
      >
        {/* Home Link */}
        <div className="title flex flex-col my-3 items-center">
          <Link className="text-black text-sm underline" to="/">HOME</Link>
        </div>

        {/* Title */}
        <div className="title flex flex-col items-center text-center">
          <h4 className="text-3xl md:text-5xl font-bold">Client Register</h4>
          <span className="py-4 text-base md:text-xl text-gray-500">
            Happy to join you
          </span>
        </div>

        {/* Form */}
        <form className="py-1" method="POST" id="login-form" onSubmit={handleSubmit}>
          <div className="textbox flex flex-col items-center gap-6 px-2">
            {/* First & Last Name */}
            <div className="flex flex-col md:flex-row w-full md:w-3/4 gap-4">
              <input
                type="text"
                name="fname"
                id="fname"
                placeholder="First Name"
                className={`${styles.textbox} ${extend.textbox} w-full`}
                value={formData.fname}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lname"
                id="lname"
                placeholder="Last Name"
                className={`${styles.textbox} ${extend.textbox} w-full`}
                value={formData.lname}
                onChange={handleChange}
              />
            </div>

            {/* Contact, Email, Password */}
            <div className="flex flex-col md:flex-row w-full md:w-3/4 gap-4">
              <input
                type="number"
                name="contact"
                id="contact"
                placeholder="Phone No."
                className={`${styles.textbox} ${extend.textbox} w-full`}
                value={formData.contact}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className={`${styles.textbox} ${extend.textbox} w-full`}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex w-full md:w-3/4">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password*"
                className={`${styles.textbox} ${extend.textbox} w-full`}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="flex w-full md:w-3/4">
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Address"
                className={`${styles.textbox} ${extend.textbox} w-full`}
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button className={styles.btn} type="submit">
              Register
            </button>
          </div>

          {/* Already Registered */}
          <div className="text-center py-4 text-gray-500 text-sm">
            Already Registered?{" "}
            <Link className="text-red-500 underline" to="/usign">
              Login Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
