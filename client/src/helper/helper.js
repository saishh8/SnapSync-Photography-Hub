import axios from 'axios';
import jwt_decode from 'jwt-decode';

export function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token)
    console.log(decode);
    const {id,email} = decode
    
    return {id,email};
}