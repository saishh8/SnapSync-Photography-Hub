import {Link,useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

import styles from '../styles/Username.module.css'
import extend from '../styles/Profile.module.css'
export default function RegisterPage() {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [address,setAddress] = useState('');
    const [portfolio,setPortfolio] = useState('')
    const [contact,setContact] =useState('')

    const navigate = useNavigate();
    
    
    async function registerUser(ev) {
        ev.preventDefault();

        if(!name || !email || !password || !address || !address || !portfolio || !contact){
          alert("Please fill all the details before registering.");
          return;
        }
        try {
          await axios.post('/register', {
            name,
            email,
            password,
            address,
            portfolio,
            contact
          });
          alert('Registration successful. Now you can log in');
          navigate('/login')
        } catch (e) {
          alert('Registration failed. Please try again later');
        }
      }

    return (
      <div className='container mx-auto'>

  
      <div className='flex justify-center items-center h-screen'>
  
      <div className={styles.glass} style={{width:'45%',height:'80%'}}>
  
      <div className='title flex flex-col my-5 items-center'><Link className="underline text-black" to={'/'}>HOME</Link></div>
  
      <div className='title flex flex-col items-center'>
  
      <h4 className='text-5xl font-bold'>Photographer Register</h4>
      <span className='py-4 text-xl text-center w-2/3 text-gray-500'>Happy to to join you</span>
  
      
  
      </div>
  
      <form className="py-1" method="POST"  id="login-form" onSubmit={registerUser}>
  
  
  
  <div className="textbox flex flex-col items-center gap-6 ">
  
  <div className="name flex w-3/4 gap-10">
  <input type="text"name="name"id="name"placeholder="Name" className={`${styles.textbox} ${extend.textbox}`} value={name}onChange={ev => setName(ev.target.value)}/>
  <input  type="number" name="contact" id="contact" placeholder="Phone No." className={`${styles.textbox} ${extend.textbox}`} value={contact} onChange={ev => setContact(ev.target.value)}/>
  </div>
  
  <div className="name flex w-3/4 gap-10">
 
  <input  type="email" name="email" id="email" placeholder="Email" className={`${styles.textbox} ${extend.textbox}`} value={email} onChange={ev => setEmail(ev.target.value)}/>
  <input  type="password" name="password" id="password" placeholder="Password*" className={`${styles.textbox} ${extend.textbox}`} value={password} onChange={ev => setPassword(ev.target.value)}/>
   
  </div>
  
  
  <div className="name flex w-3/4 gap-10">
  <input  type="text" name="address" id="address" placeholder="address" className={`${styles.textbox} ${extend.textbox}`} value={address}onChange={ev => setAddress(ev.target.value)}/> 
  <input type="text"name="portfolio"id="portfolio"placeholder="Portfolio Link" className={`${styles.textbox} ${extend.textbox}`} value={portfolio} onChange={ev => setPortfolio(ev.target.value)}/>
  </div>
  <button  className={styles.btn} type='submit'>Register</button>
  
  
  
  
  
  
  
  
   
  
  </div>
  
  <div className='text-center py-2'>
                <span>
                  Already Registered?
                  <Link className='text-red-500' to='/login'>
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