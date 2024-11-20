import {Link, useNavigate} from "react-router-dom";
import React from "react";
import {useContext, useState} from "react";
import axios from "axios";
import styles from '../styles/Username.module.css'
import bgm from "../assets/Background.png"


export default function Login(){
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        try {
          const response = await axios.post('/login', {email,password});
          if (response.status === 200 && response.data && response.data.token) {
            const { token } = response.data;
            localStorage.setItem('token', token);
            
            navigate('/PHome');
          } else {
            
            alert('Login failed. Unexpected response from the server.');
          }
          
        } catch (e) {
          if (e.response && e.response.status === 403) {
            // Handle unverified user case
            alert('You are not verified. Please wait till your account is verified to log in.');
          } else if (e.response && e.response.status === 422) {
            // Handle incorrect password case
            alert('Incorrect password. Please try again.');
          } else if (e.response && e.response.status === 404) {
            // Handle user not found case
            alert('User not found. Please check your email.');
          } else {
            // Handle other errors
            alert('Login failed. Please try again later.');
          }
        }
      }

      

    return (
      // <div className='container mx-auto' style={{backgroundImage:`url(${bgm})`}}>
      <div className='container mx-auto'>

      

    <div className='flex justify-center items-center h-screen'>

    <div className={styles.glass}>

      <div className='title flex flex-col my-5 items-center'><Link className="underline text-black" to={'/'}>HOME</Link></div>

    <div className='title flex flex-col items-center'>

    <h4 className='text-5xl py-2 font-bold'>Photographer</h4>
    <h4 className='text-5xl font-bold'>Login</h4>
    <span className='py-4 text-xl text-center w-2/3 text-gray-500'>Explore more by connecting with us</span>

    

    </div>

    <form className="py-1" onSubmit={handleLoginSubmit}>

    <div className="textbox flex flex-col items-center gap-6 ">

        <input type="email" placeholder="your@email.com" value={email} onChange={ev => setEmail(ev.target.value)} className={styles.textbox} />

        <input type="password" placeholder="password" value={password} onChange={ev => setPassword(ev.target.value)} className={styles.textbox} />
        <button  className={styles.btn} type='submit'>Let's Go</button>

    </div>

    
      
             
    <div className="text-center py-2 text-gray-500">
      Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
    </div>
  </form>

    
    

    </div>



    </div>

    </div>


      




      );
}