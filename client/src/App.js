
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/** import all components */
import Login from './components/Login';
import RegisterPage from './components/RegisterPage';
import PhotoHome from './components/PhotoHome';
import Profile from './components/Profile';
import Card from './components/Card';
import axios from 'axios';
import Desc from './components/Desc';
import Landing from './components/Landing';
import Request from './components/Request.js'

import USignIn from './components/USignIn.js'
import URegister from './components/URegister.js'
import Success from './components/Success';
import Can from './components/Can';

import UserProfile from './components/UserProfile';
import Mybookings from './components/Mybookings';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';

axios.defaults.baseURL='http://localhost:4000';

/** root routes */
const router = createBrowserRouter([
  {
      path:'/',
      element:<Landing/>
  },
  {
    path:'/usign',
    element:<USignIn/>
  },
  {
    path:'/uregister',
    element:<URegister/>
  },
  
  {
      path : '/login',
      element : <Login />
  },
  {
    path: '/register',
    element : <RegisterPage/>
  },
  {
    path: '/PHome',
    element: <PhotoHome/>
  },
  {
    path: '/PHome/profile',
    element: <Profile/>
  },
  {
    path: '/CHome',
    element: <UserProfile/>
  },
  {
    path:'/bookings/:id',
    element:<Mybookings/>
  },
  {
    path:'/Cards',
    element:<Card/>
  },{
    path:'/desc/:id',
    element:<Desc/>
  },{
    path:'/req',
    element:<Request/>
  },{
    path:'/success',
    element:<Success/>
  },
  {
    path:'/cancel',
    element:<Can/>
  },
  {
    path:'/admin',
    element:<AdminLogin/>
  },{
  path:'home_admin',
  element:<Admin/>
}
 
])

export default function App() {
return (
  <main>
     
      <RouterProvider router={router}></RouterProvider>
  </main>
)
}
