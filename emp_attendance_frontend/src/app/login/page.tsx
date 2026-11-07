"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
function LoginPage() {      
  const router = useRouter();
  async function handleLogin(){
    try{
      const response= await fetch("http://127.0.0.1:8000/users/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        email:email,
        password:password
      }),
    });
    
      const data = await response.json();
      if (response.ok){
        localStorage.setItem("access_token", data.access_token);
        setMessage("Login Successful");
        if (data.role === "employee") {
          router.push("/employee/dashboard");
        }else if (data.role === "admin") {
          router.push("/admin/dashboard");
        }
        
      }else{
        setMessage("Login Failed")
    }
    console.log(data);
   }catch(error){
    setMessage("Something went wrong");
    }
  }
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[message, setMessage] =useState("")
  return (
    <div>
      <h1>Employee Login</h1>
      <input type="email" placeholder="Email" 
      value={email}
      onChange={(e) => setEmail(e.target.value)}/>
      
      <input type="password" placeholder="Password"
      value={password}
      onChange={(e)=>setPassword(e.target.value) } />
       <button onClick={handleLogin}>Login</button>
       <p>{message}</p>
    </div>
  );
}
export default LoginPage;