import './App.css';
import React, { useState } from "react";
import Axios from 'axios';


function App() {

  const [usernameReg, setUsernameReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const[loginStatus, setLoginStatus] = useState("");

  const register = () => {
    Axios.post('http://localhost3001/register', {
      
    username: usernameReg, 
    email: emailReg,
    password: passwordReg,
  }).then((response)=>{
    console.log(response);

  });
};

  const login = () => {
    Axios.post('http://localhost3001/login', {   
    username: username, 
    password: password,
  }).then((response) => {
    if (response.data.message) {
      setLoginStatus(response.data.message);
  } else {
      setLoginStatus(response.data[0].username);
    }
  });
  };

  return (
    <div className="App">
      <div className="registration">
        <h1> registration</h1>
        <label> Username </label>
        <input
         type="text"
         onChange= {(e) => {
          setUsernameReg(e.target.value);
        }}
        />
        <label> Email </label>
        <input
         type="text"
         onChange= {(e) => {
          setEmailReg(e.target.value);
        }}
        />
        <label> password </label>
        <input 
        type="password"
        onChange= {(e) => {
          setPasswordReg(e.target.value);
        }}/>
        <button onClick={register}> Register </button>
    </div> 
    <div className="login">
    <h1> Login</h1>
    <input type="text" placeholder="username" 
      onChange={(e)=>{
      setUsername(e.target.value);
    }}
    />
    <input type="password" placeholder="password" 
      onChange={(e)=>{
      setPassword(e.target.value);
      }}
      />
    <button onClick={login}>login</button>
    </div>  
    <h1>{loginStatus}</h1> 
    </div>
  );
}

export default App;
