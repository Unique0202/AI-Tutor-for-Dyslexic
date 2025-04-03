import React from "react";

function Profile() {
  return (
    <div className="container">
      <h1>Profile</h1>
      <div className="profile-card">
        <div className="avatar">👤</div>
        <button className="info-btn">Info</button>
      </div>
      <div>
        <h2>Recently Played</h2>
        <div className="game-box">Game 1</div>
        <div className="game-box">Game 2</div>
      </div>
      <div>
        <h2>Topics Finished</h2>
        <div className="topic">Topic 1</div>
        <div className="topic">Topic 2</div>
        <div className="topic">Topic 3</div>
      </div>
    </div>
  );
}

export default Profile;
