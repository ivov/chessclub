import React from "react";
import { Link } from "react-router-dom";

const Tabpane = props => {
  const { tabpaneLinks } = props; // array of objects

  return (
    <nav>
      <div id="nav-contents">
        {tabpaneLinks.map(obj => {
          return (
            <Link to={"/" + obj.url} key={obj.title}>
              {obj.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Tabpane;
