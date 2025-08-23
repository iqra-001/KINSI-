import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleLoginButton() {
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "401749867078-60if3o8ukhh0tqmihu4sj2qfvpsp2t7n.apps.googleusercontent.com",  // replace with your real client ID
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large" }
    );
  }, []);
  const navigate = useNavigate()
  const handleCallbackResponse = (response) => {
    console.log("JWT Token: ", response.credential);
    // backend for verification

     // ✅ Store token in localStorage/sessionStorage
    localStorage.setItem("google_token", response.credential);

    // ✅ Redirect to dashboard
    navigate("/userdashboard");
  };

  return <div id="googleBtn"></div>;
}

export default GoogleLoginButton;
