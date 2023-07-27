import React,{useState} from 'react'
import axios from 'axios'
const Register = () => {
    cosnt [DataTransfer,setData] = useState({
        username:'',
        email:'',
        password:'',
        confirmpassword:''
    })
  return (
    <div>Register</div>
  )
}

export default Register