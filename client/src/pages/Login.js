import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaExclamation, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Switch from '../components/Switch';
import './Login.css'

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showrePassword, setShowrePassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [authType, setAuthtype] = useState("login");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const handleSubmit = async () => {
    if (username==="" && email==="") {
      setEmailError(true);
      setUsernameError(true);
      toast.error("Please enter atleast one.");
      return false;
    }
    if (email !== "" && !emailRegex.test(email)) {
      setEmailError(true);
      toast.error("Invalid email format!");
      return false;
    }
    if (password.length < 6) {
      setPasswordError(true);
      toast.error("Password must be at least 6 characters long!");
      return false;
    }
    if (authType === 'register' && password !== repassword) {
      setPasswordError(true);
      toast.error("Passwords don't match!");
      return false;
    }

    try {
      const endpoint = authType;
      const response = await axios.post(`http://10.125.40.172:5001/${endpoint}`, { username, email, password });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setIsLoggedIn(true);
        toast.success(authType==='register' ? 'Registration successful' : 'Logged in successfully');
        navigate('/');
      } else {
        setEmailError(true);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An error occurred. Please try again later.';
      toast.error(errorMsg);
      if (err.response?.data?.error === 'email/username') setEmailError(true) ; setUsernameError(true);
      if (err.response?.data?.error === 'password') setPasswordError(true)
      if (err.response?.data?.error === 'all') setPasswordError(true); setEmailError(true) ; setUsernameError(true);
    }
  };


  const handleForgotPass = async () => {
    let hasError = false;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      toast.error("Invalid email format!");
      hasError = true;
    }
    if (password.length < 6) {
      setPasswordError(true);
      toast.error("Password must be at least 6 characters long!");
      hasError = true;
    }
    if (password !== repassword) {
      setPasswordError(true);
      toast.error("Passwords don't match!");
      hasError = true;
    } 
    if (hasError) return;
    try {
      const response = await axios.put('http://192.168.1.100:5001/update-password', {email, password});
      toast.success('Password changed succesfully');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message);
      console.log(err.response?.data?.errormsg);
      
      if (err.response?.data?.error === 'email') setEmailError(true)
    }
  }
  const handleToggle = (type) => {
    setRotate(true);
    setTimeout(() => {
      if (type === 'login') setAuthtype('login')
      else if (type === 'forgotpass') setAuthtype('forgotpass')
      else {
        setAuthtype(() => {
          return authType === 'login' ? 'register' : 'login';
        });
      }
      setRotate(false);
    }, 500);
  }
  return (
    <div className='auth-bg'>
      <div className='auth-container'>
        <div className='auth-box'>
          {authType !== 'forgotpass' ? 
          <>
          <h2>WELCOME!!</h2>
          <div onClick={handleToggle}>
              <Switch authType={authType}/>
          </div>
          </>
          : null  
          }
          
          <div className={`form-container ${rotate ? 'rotate': ''}`}>
            <div className='input-exclamation'>
              <input
                type='email'
                onChange={e => { setEmail(e.target.value); setEmailError(false) }}
                placeholder='Enter your email'
                value={email}
                className={emailError ? 'invalid email-input' : 'email-input'}
              />
              {emailError && <FaExclamation className='exclamation show'></FaExclamation>}
            </div>
            {authType === 'login' ? 
            <h2 className='or-h2'>OR</h2>
          : null
          }
            <div className='input-exclamation'>
              <input
                type='text'
                onChange={e => { setUsername(e.target.value); setUsernameError(false) }}
                placeholder='Enter your username'
                value={username}
                className={usernameError ? 'invalid email-input' : 'email-input'}
              />
              {usernameError && <FaExclamation className='exclamation show'></FaExclamation>}
            </div>
            
            <div className='input-exclamation'>
              <div className='password-container'>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  onChange={e => { setPassword(e.target.value); setPasswordError(false) }}
                  placeholder={authType==='forgotpass' ? 'Enter your new password' : 'Enter your password'}
                  value={password}
                  className={passwordError ? 'invalid' : ''}
                />
                <span onClick={() => setShowPassword(!showPassword)} className='eye-icon'>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {passwordError && <FaExclamation className='exclamation show'></FaExclamation>}
            </div>

            {authType !== 'login' && (
              <div className='input-exclamation'>
                <div className='password-container'>
                  <input
                    required
                    type={showrePassword ? 'text' : 'password'}
                    onChange={e => { setrePassword(e.target.value); setPasswordError(false) }}
                    placeholder={authType==='forgotpass' ? 'Confirm your new password' : 'Enter your password again'}
                    value={repassword}
                    className={passwordError ? 'invalid' : ''}
                  />
                  <span onClick={() => setShowrePassword(!showrePassword)} className='eye-icon'>
                    {showrePassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {passwordError && <FaExclamation className='exclamation show'></FaExclamation>}
              </div>
            )}

            <button onClick={authType === 'forgotpass' ? handleForgotPass : handleSubmit} type='submit'>
              {authType === 'forgotpass' ? "Change password" : authType === 'login' ? 'Login' : 'Register'}
            </button>
            {authType !== 'forgotpass' ? 
              authType ==='login' ? 
                <div className='p-tags'>
                  <p onClick={() => handleToggle('x')} className='toggle-auth'>
                    Don't have an account?
                  </p>
                  {authType === 'login' && 
                    <p onClick={() => handleToggle('forgotpass')} className='toggle-auth'>Forgot password?</p>}
                </div>
                :  <p onClick={() => handleToggle('x')} className='toggle-auth'>
                    Already have an account?
                  </p>
            : <p className='toggle-auth' onClick={() => handleToggle('login')}>Click here to go back to login</p>}
            
            
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
