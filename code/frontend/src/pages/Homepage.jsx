import "./styles/authstyles.css";
import { useNavigate} from "react-router-dom";
import Footer from "../components/Layout/Footer.jsx";
import { useAuth } from "../context/auth.jsx";  

function App() {
  const navigate = useNavigate();
  // const location = useLocation();
  const { auth, setAuth } = useAuth(); 

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <div className="auth-container">
        <h1>BuySell@IIITH</h1>
        {/* <pre>{auth ? JSON.stringify(auth, null, 4) : 'Loading...'}</pre> */}
        <div className="form-group">
          <button 
            onClick={handleRegister} 
            className="register-button"
          >
            Register
          </button>
        </div>
        <div className="form-group">
          <button 
            onClick={handleLogin} 
            className="register-button"
          >
            Login
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;