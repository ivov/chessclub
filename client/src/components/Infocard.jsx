import React from "react";

const Infocard = props => {
  const { title, text } = props;
  return (
    <div className="area-container">
      <div className="infocard-container">
        <div className="infocard-text">
          <h1>{title}</h1>
          {text.map((paragraph, index) => {
            return <p key={index}>{paragraph}</p>;
          })}
        </div>
        {/* <div className="infocard-picture">
          <img src={picture} />
        </div> */}
      </div>
    </div>
  );
};

export default Infocard;
