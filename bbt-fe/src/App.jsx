import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login.jsx';
import Dashboard from './components/Dashboard.jsx';
import Signup from './components/signup.jsx';
import './App.css';
import Listing from './components/listing.jsx';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="container">
        <Routes>
          {/* Route for the Signup page */}
          <Route
            path="/"
            element={authenticated ? <Navigate to="/home" /> : <Signup setAuthenticated={setAuthenticated} />}
          />

          {/* Route for the Login page */}
          <Route
            path="/login"
            element={authenticated ? <Navigate to="/home" /> : <Login setAuthenticated={setAuthenticated} />}
          />

          {/* Route for the Protected Dashboard page */}
          <Route
            path="/home"
            element={
              authenticated ? (
                <Dashboard setAuthenticated={setAuthenticated} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* Route for the Protected Dashboard page */}
          <Route
            path="/listAll"
            element={
              authenticated ? (
                <Listing setAuthenticated={setAuthenticated} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Fallback for undefined routes */}
          <Route path="*" element={<Navigate to={authenticated ? "/home" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
