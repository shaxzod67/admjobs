import React, { useState } from "react";
import "./Auth.css";
import {createUserWithEmailAndPassword,getAuth,signInWithEmailAndPassword,} from "firebase/auth";
import { app } from "../../firebase";
import { useNavigate } from "react-router";


const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);

  
  
  // const handleSignUp = async (e) => {
    //   try {
      //     await createUserWithEmailAndPassword(auth, email, password);
      //     console.log("Sign up done: " + email);
      //   } catch (error) {
        //     console.error("Auth error:", error.message);
        //   }
        // };  --------> bu narsa bizga kerak emas chunki kirish faqat HR tomondan beriladi
        
        const HandleLogin = async (e) => {
          e.preventDefault();
          try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged In");
            navigate("/header")
          } catch (error) {
            alert("Tizimga kirishda xato")
            console(error.code);
          }
        };
        const navigate = useNavigate();

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-left">
          <h1>Xodimlarni sinov muddatida baholash tizimi</h1>
        </div>

        <div className="auth-form">
          <h2>Sign Up</h2>

          <div className="form-group">
            <label htmlFor="email">LOGIN</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Login kiriting"
              id="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">PAROL</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parolni kiriting"
              id="password"
            />
          </div>

          <button className="submit-btn" onClick={HandleLogin}>
            KIRISH
          </button>

          <p className="footer-text">
            Login yoki parolni unutgan bo‘lsangiz 1152 ichki raqamga qo‘ng‘iroq
            qiling
          </p>
          {/* <p className="footer-text">
            Ro'yhatdan o'tish
          </p> */}
        </div>
      </div>
    </section>
  );
};

export default Auth;
