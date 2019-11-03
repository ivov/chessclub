import React from "react";
import { Link } from "react-router-dom";

const Header = props => {
  const userLoggedIn = props.username !== "";
  const userIsAdmin = props.isAdmin;

  return (
    <header>
      <div id="header-contents">
        <a href="/">
          <div id="header-logo-container">
            <div id="header-logo-image">
              <img
                src={process.env.PUBLIC_URL + "/img/tower.png"}
                alt="Logo de Torre Blanca"
              />
            </div>
            <div id="header-logo-title">
              <b>Torre Blanca</b>
            </div>
          </div>
        </a>
        {!userLoggedIn && (
          <div id="header-reglog-container">
            <Link to="/registrarse">
              <div id="reglog-icon">
                <span className="mdi mdi-plus-box-outline" />
              </div>
              <div>Registrarse</div>
            </Link>
            <Link to="/ingresar">
              <div id="reglog-icon">
                <span className="mdi mdi-login-variant" />
              </div>
              <div>Ingresar</div>
            </Link>
          </div>
        )}
        {userLoggedIn && (
          <div id="header-reglog-container">
            <div id="reglog-icon">
              <span
                className={
                  userIsAdmin
                    ? "mdi mdi-shield-account"
                    : "mdi mdi-account-circle"
                }
              />
            </div>
            <div id="username">{props.username}</div>
            <Link to="/salir">
              <div id="reglog-icon">
                <span className="mdi mdi-logout-variant" />
              </div>
              <div>Salir</div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
