import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        const token = localStorage.getItem("accessToken"); // Changed to localStorage and correct key

        if (token) {
          const response = await fetch("http://localhost:5555/api/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.warn("Backend logout failed:", await response.json());
          }
        }

        // Clear ALL localStorage items related to authentication
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        
        // Optional: Clear all localStorage (if you want to be thorough)
        // localStorage.clear();
        
        navigate("/signin");
      } catch (error) {
        console.error("Logout request error:", error);
        // Ensure cleanup even if request fails
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        navigate("/signin");
      }
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-xl font-semibold hover:bg-orange-200 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
};

export default LogoutButton;