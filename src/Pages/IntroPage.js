import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Pages/Css/Intro.css";
import logo from "../Pages/Logo/TNT-logo.png";

function IntroPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 4500);
    const timer2 = setTimeout(() => {
      setShowIntro(false);
      navigate("/dashboard/driver"); 
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <>
      {showIntro ? (
        <div className={`intro-screen ${fadeOut ? "fade-out" : ""}`}>
          <img src={logo} alt="Intro" className="intro-image" />
        </div>
      ) : null}
    </>
  );
}

export default IntroPage;
