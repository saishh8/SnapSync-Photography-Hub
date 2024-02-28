import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests
import styles from '../styles/Username.module.css'
import extend from '../styles/Profile.module.css'

function SignIn() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    contact: '',
    email: '',
    password: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send a POST request to your server's registration endpoint
    axios.post('/uregister', formData)
      .then((response) => {
        // Handle successful registration (e.g., redirect to a login page)
        console.log('User registered:', response.data);
      })
      .catch((error) => {
        // Handle registration error (e.g., display an error message)
        console.error('Error during registration:', error);
      });
  };

  return (
    <div className='container mx-auto'>

  
    <div className='flex justify-center items-center h-screen'>

    <div className={styles.glass} style={{width:'45%',height:'80%'}}>

    <div className='title flex flex-col my-5 items-center'><Link className="underline text-black" to={'/'}>HOME</Link></div>

    <div className='title flex flex-col items-center'>

    <h4 className='text-5xl font-bold'>Client Register</h4>
    <span className='py-4 text-xl text-center w-2/3 text-gray-500'>Happy to to join you</span>

    

    </div>

    <form className="py-1" method="POST"  id="login-form" onSubmit={handleSubmit}>



<div className="textbox flex flex-col items-center gap-6 ">

<div className="name flex w-3/4 gap-10">
<input type="text"name="fname"id="fname"placeholder="First Name" className={`${styles.textbox} ${extend.textbox}`} value={formData.fname} onChange={handleChange}/>
<input type="text" name="lname" id="lname" placeholder="Last Name" className={`${styles.textbox} ${extend.textbox}`} value={formData.lname} onChange={handleChange}/>
</div>

<div className="name flex w-3/4 gap-10">
<input  type="number" name="contact" id="contact" placeholder="Phone No." className={`${styles.textbox} ${extend.textbox}`} value={formData.contact} onChange={handleChange}/>
<input  type="email" name="email" id="email" placeholder="Email" className={`${styles.textbox} ${extend.textbox}`} value={formData.email} onChange={handleChange}/>
<input  type="password" name="password" id="password" placeholder="Password*" className={`${styles.textbox} ${extend.textbox}`} value={formData.password} onChange={handleChange}/>
 
</div>


<div className="name flex w-3/4 gap-10">
<input  type="text" name="address" id="address" placeholder="address" className={`${styles.textbox} ${extend.textbox}`} value={formData.address} onChange={handleChange}/> 
</div>
<button  className={styles.btn} type='submit'>Register</button>








 

</div>

<div className='text-center py-2'>
              <span>
                Already Registered?
                <Link className='text-red-500' to='/usign'>
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

export default SignIn;
