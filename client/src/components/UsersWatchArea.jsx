import React, { Component } from "react";
import apiCaller from "../utils/apiCaller";

class UsersWatchArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: []
    };
  }

  async componentDidMount() {
    const apiEndpoint = "/api/users/";

    const token = localStorage.getItem("jwt");
    const config = {
      headers: {
        "x-auth-token": token
      }
    };

    const response = await apiCaller.get(apiEndpoint + "allForAdmin", config);
    const allUsers = response.data;
    this.setState({ allUsers });
  }

  render() {
    const { allUsers } = this.state;
    return (
      <div className="area-container">
        <div className="user-list-container">
          <div className="user-line user-line-header">
            <div>Usuario</div>
            <div>Correo</div>
            <div>Administrador</div>
          </div>
          {allUsers &&
            allUsers.map((item, index) => {
              const isAdmin = item.is_admin.toString() === "true";
              return (
                <div className="user-line" key={index}>
                  <div>{item.username}</div>
                  <div>{item.email}</div>
                  <div
                    className={isAdmin ? "bold-for-admin" : "grey-for-nonadmin"}
                  >
                    {isAdmin ? "Sí" : "No"}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default UsersWatchArea;
