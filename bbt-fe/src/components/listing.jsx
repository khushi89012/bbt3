import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import './Listing.css';

const Listing = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch video data from API using axios
    const fetchVideos = async () => {
      try {
        const response = await axios.get('https://bbt-api.vercel.app/getAll'); // Make GET request using Axios
        setVideos(response.data.data); // Assuming the response contains the list of videos
        setLoading(false);
      } catch (err) {
        setError('Failed to load videos.');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []); // Empty dependency array to run the effect only once

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="listing-container">
      <h2>Video Listings</h2>
      <div className="grid-container">
        {videos.map((video) => (
          <div key={video._id} className="grid-item">
            <div className="video-thumbnail">
              {/* Displaying the video with controls */}
              <video
                className="thumbnail-video"
                controls
                width="100%" // Adjust the width as needed
              >
                <source
                  src={`http://localhost:5000/uploads/${video.video}`} // Path to the video
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <h3>{video.title}</h3>
            <p>
              Uploaded by: {video.uploadedBy?.firstName} {video.uploadedBy?.lastName}
            </p>
            <p>
              Uploaded at: {new Date(video.uploadedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listing;
