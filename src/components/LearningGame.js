import React from "react";

function LearningGame() {
  return (
    <div className="container">
      <h1>Learning Game</h1>
      <div className="levels">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="level">
            <h3>Level {i + 1}</h3>
            {Array.from({ length: 4 }, (_, j) => (
              <div key={j} className="topic">Topic {j + 1}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LearningGame;
