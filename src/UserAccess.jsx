import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserAccess.css';

function UserAccess({
  credential,
  setCredential,
  loginShow,
  setLoginShow,
  roleInput,
  setRoleInput,
  setAgree,
  setIsUserLogin,
  setScrapeTypeBtn,
  setShowSearch,
  setMainScrape,
  setIsScrapeData,
  setIsSearchFilter,
  setIsScraped,
  setDashboard,
  setIsDashboard,

                         
}) 
{
  const [roleBase, setRoleBase] = useState(false);
  const [userNameAccess, setUserNameAccess] = useState('');
  const [roleAccess, setRoleAccess] = useState('');
  const [accessResult,setAccessResult] = useState(false)
  const [submitBtn , setSubmitBtn] =useState(false)
  const [password,setPassword]= useState(null)
  const [email,setEmail]= useState(null)
  const [otp,setotp] = useState('')
  const [step,setStep]=useState(1)
  const [emailOtp,setEmailOtp]=useState('')

const maxScrapes = 3; 
const coolTime = 60000; 
let scrapeCount = 0;

  setInterval(() => {
  scrapeCount = 0; 
  console.log("Scrape limit reset. You can scrape again.");
}, coolTime);




  const verifyCaptcha1 = async () => {


  try {
    
    const rand = Math.floor(Math.random() * 9 + 1);
    const rand2 = Math.floor(Math.random() * 9 + 1);
    const add = rand + rand2;

    const captchaResponse = prompt(`Please solve the captcha: ${rand} + ${rand2}`);

    if (parseInt(captchaResponse) !== add) {
      alert("Captcha verification failed. Please try again.");
      return false;
    }

    console.log("Captcha verified successfully.");

   
    return true;
  } catch (error) {
    console.error("Error verifying captcha:", error);
    alert("Captcha verification failed due to an error.");
    return false;
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

 if (!credential.username || credential.username.length < 6) {
  alert("Enter a username with at least 6 characters!");
  return;
}


  if (!credential.password || credential.password.length < 6) {
    alert("Enter a password with more than 6 characters!");
    return;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!credential.email) {
    alert("Enter your email!");
    return;
  }

  if (!emailPattern.test(credential.email)) {
    alert("Enter a valid email address!");
    return;
  }

 
  if (scrapeCount >= maxScrapes) {
    alert("Rate limit reached! Please wait for a minute before scraping again.");
    return;
  }

  const isCaptchaVerified = await verifyCaptcha1();

  if (!isCaptchaVerified) return;

  scrapeCount++;

  console.log(`Scraping attempt ${scrapeCount} in this minute.`);

  const delay = Math.floor(Math.random() * (3000 - 1000 + 1) + 1000);
  console.log(`Delay time before login request: ${delay}ms`);

  await new Promise((resolve) => setTimeout(resolve, delay));

  try {
    const response = await axios.post("http://127.0.0.1:5000/api/register", {
      username: credential.username,
      password: credential.password,
      email: credential.email,
    });

    if (response.status === 200) {
      alert("SignUp successful!");
      setStep(2); 
       setCredential({ username: "", password: "", email: ""});
      
    } else {
      alert("Error during SignUp! Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Enter valid data. Error: " + error);
  }
};









const handleLogin = async (e) => {
e.preventDefault()
  if (!email) {
    alert("Enter your email!");
    return;
  }


  if (!password) {
    alert("Enter your password!");
    return;
  }

  try {
    const response = await axios.post("http://127.0.0.1:5000/api/login", {
      email,
      password
    });

    if (response.status === 200) {
      console.log("Login successful");
      alert("Login successful");
      setStep(3);
    } else {
      alert("Login rejected,Please check the email and password!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Invalid login: " + error.message);
    setStep(2);
  }
};


const handleOTP = async (e)=>{
 e.preventDefault()

 try {
    const response = await axios.post("http://127.0.0.1:5000/api/verify-otp", {
        email: emailOtp,
        otp: otp
    });

    if (response.status === 200) {
        const token = response.data.token;

        if (token) {
            localStorage.setItem("authToken", token);  
        }

        console.log("OTP verified!");
        alert("OTP verified! Login successfully!");

        setCredential({ username: "", password: "", email: "" }); 
        setLoginShow(false);
        setAgree(true);
    } else {
        alert("Invalid OTP");
        setOtp(''); 
    }
} catch (error) {
    console.error("Error:", error.message);
    alert("Invalid: " + error.message);
}

}


  
return (
<div className="user-access-container">
  {loginShow ? (
    <>
      <p className="access-welcome-text">Welcome to One Point Research.</p>

      {step === 1 && (
        <>
          <h3 className="access-login-heading">Sign Up</h3>

          <label htmlFor="username">Username</label>
          <input
            type="text"
            value={credential.username}
            onChange={(e) => setCredential({ ...credential, username: e.target.value })}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={credential.password}
            onChange={(e) => setCredential({ ...credential, password: e.target.value })}
            placeholder="Enter the password"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            className="access-input-field email-input"
            type="email"
            value={credential.email}
            onChange={(e) => setCredential({ ...credential, email: e.target.value })}
            required
          />

          <button className="access-btn login-btn" onClick={handleSubmit}>
            Sign Up
          </button>

          <button onClick={() => setStep(2)} className="signUp-button">
            Already Signed Up? Click here
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <label htmlFor="email">Email</label>
          <input
            className="access-input-field email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <button onClick={handleLogin} className="signUp-button">
            Login
          </button>

          <button
            onClick={() => {
              setStep(1);
              setEmail('');
              setPassword('');
            }}
            className="signUp-button"
          >
            Back to Sign Up
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h3 className="access-otp-heading">OTP</h3>
          <input
            className="access-input-field email-input"
            type="email"
            value={emailOtp}
            onChange={(e)=> setEmailOtp(e.target.value)}
            required
          />

          <input
            type="text"
            value={otp}
            onChange={(e) => setotp(e.target.value)}
            placeholder="Enter the OTP"
            required
          />

          <button className="access-btn-submit-btn" onClick={handleOTP}>
            Submit
          </button>
        </>
      )}
    </>
  ) : null}
</div>

);

}

export default UserAccess;







