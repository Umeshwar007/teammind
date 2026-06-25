import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { setCredentials } from "../features/auth/authSlice";
import { loginApi } from "../api/auth";

export default function LoginPage(){
    const[email,setEmail]= useState("");
    const[password,setPassword]= useState("");
    const[error,setError]= useState("");
    const[loading,setLoading]= useState(false);

    const dispatch= useAppDispatch();
    const navigate= useNavigate();

    async function handleSubmit(e:React.FormEvent){
        e.preventDefault();
        setError("");
        setLoading(true);
        try{
            const data=await loginApi({email,password});
            dispatch(setCredentials({user:data.user,accessToken:data.accessToken}));
            navigate("/");
        }
        catch(err:any){
            setError(err.response?.data?.message || "LoginFailed");
        }
        finally{
            setLoading(false);
        }
    }
      return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

