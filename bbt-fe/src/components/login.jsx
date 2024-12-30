import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file for styling

// eslint-disable-next-line react/prop-types
const Login = ({ setAuthenticated }) => {
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        firstName,
        password,
      });

      // Handle successful login
      const user = response.data.name; // Assuming response contains user data
      localStorage.setItem('user', JSON.stringify(user)); // Save user info in localStorage
      setSuccessMessage('Login successful!');
      setAuthenticated(true); // Update the authenticated state
      navigate('/home'); // Redirect to dashboard or home
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error during login');
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  // Clear messages when user updates input fields
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={handleInputChange(setFirstName)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleInputChange(setPassword)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <p>
        Don't have an account? <Link to="/">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
