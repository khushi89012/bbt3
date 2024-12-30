import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [bio, setBio] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || ''); // Retrieve profile picture from local storage
  const [showBioModal, setShowBioModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')) || {});

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('profilePic');
    localStorage.removeItem('userBio');
  
    // Reset local state
    setUser({});
    setBio('');
    setProfilePic('');
    
    // Navigate to login page
    navigate('/login');
    
    // Optionally, refresh the page to ensure everything is reset
    window.location.reload();
  };

  // Save bio to local storage
  const handleBioSave = () => {
    localStorage.setItem('userBio', bio);
    alert('Bio saved successfully!');
    setShowBioModal(false);
  };

  // Handle video upload
  const handleVideoUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', videoTitle);
    formData.append('video', videoFile);
    formData.append('uploadedBy', user);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Video uploaded successfully!');
      setShowVideoModal(false);
    } catch (error) {
      console.error('Error uploading video:', error.response?.data || error.message);
      alert('Failed to upload video.');
    }
  };

  // Handle profile picture upload
  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        localStorage.setItem('profilePic', reader.result); // Save to local storage
      };
      reader.readAsDataURL(file);
    }
  };

  // Navigate to the "All Listings" page
  const handleViewListings = () => {
    navigate('/listAll'); // Assuming '/listings' is the path for the listings page
  };

  return (
    <div className="dashboard-container">
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <h2>Welcome, {user.firstName}</h2>
      {/* Profile Picture Section */}
      <div className="profile-pic-section">
        <img
          src={profilePic || 'https://via.placeholder.com/150'} // Fallback to placeholder if no profile pic
          alt="Profile"
          className="profile-pic"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicUpload}
          style={{ display: 'none' }}
          id="profilePicInput"
        />
        <button onClick={() => document.getElementById('profilePicInput').click()}>
          Upload Profile Picture
        </button>
      </div>

      {/* User Information */}
      <p>Email: {user.email}</p>
      <p>Phone: {user.number}</p>
      <p>Bio: {bio || localStorage.getItem('userBio') || 'No bio added yet.'}</p>
      <button onClick={() => setShowBioModal(true)}>Add Bio</button>
      <button onClick={() => setShowVideoModal(true)}>Upload Video</button>
      <button onClick={handleViewListings} style={{margin:"10px"}}>View All Listings</button>

      {/* Bio Modal */}
      {showBioModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Bio</h3>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write your bio here..."
              rows="4"
            />
            <button onClick={handleBioSave}>Save Bio</button>
            <button onClick={() => setShowBioModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Video Upload Modal */}
      {showVideoModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Upload Video</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!videoTitle || !videoFile) {
                  alert('Please provide both a video title and file before uploading.');
                  return;
                }
                handleVideoUpload();
              }}
            >
              <div className="form-group">
                <label htmlFor="videoTitle">Video Title:</label>
                <input
                  id="videoTitle"
                  type="text"
                  placeholder="Enter Video Title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="videoFile">Upload Video (+)</label>
                <input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  style={{border:"1px solid red"}}
                  required
                />
              </div>

              <div className="button-group">
                <button type="submit">Upload</button>
                <button type="button" onClick={() => setShowVideoModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
