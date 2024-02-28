import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';



import styles from '../styles/Username.module.css'

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        try {
          const response = await axios.post('/ulogin', {email,password});
          if (response.status === 200 && response.data && response.data.token) {
            const { token } = response.data;
            localStorage.setItem('token', token);
            
            navigate('/CHome');
          } else {
            
            alert('Login failed. Unexpected response from the server.');
          }
          
        } catch (e) {
          alert('Login failed');
        }
      }


  return (
    
    <div className='container mx-auto'>
      
    

    <div className='flex justify-center items-center h-screen'>

    <div className={styles.glass}>

    <div className='title flex flex-col my-5 items-center'><Link className="underline text-black" to={'/'}>HOME</Link></div>

    <div className='title flex flex-col items-center'>

    <h4 className='text-5xl font-bold'>CLIENT LOGIN</h4>
    <span className='py-4 text-xl text-center w-2/3 text-gray-500'>Explore our Photography Services</span>

    

    </div>

    <form className="py-1" onSubmit={handleLoginSubmit}>

    <div className="textbox flex flex-col items-center gap-6 ">

        <input type="email" placeholder="your@email.com" value={email} onChange={ev => setEmail(ev.target.value)} className={styles.textbox} />

        <input type="password" placeholder="password" value={password} onChange={ev => setPassword(ev.target.value)} className={styles.textbox} />
        <button  className={styles.btn} type='submit'>Let's Go</button>

    </div>

    
      
             
    <div className="text-center py-2 text-gray-500">
      Don't have an account yet? <Link className="underline text-black" to={'/uregister'}>Register now</Link>
    </div>
  </form>

    
    

    </div>



    </div>






    </div>
  );
}

export default SignIn;
