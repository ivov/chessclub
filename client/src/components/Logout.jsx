// eslint-disable-next-line
import React, { Component } from "react";
import apiCaller from "../utils/apiCaller";

class Logout extends Component {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    const apiEndpoint = `/api/logout/?username=${this.props.username}`;
    apiCaller.get(apiEndpoint);
    localStorage.removeItem("jwt");
    window.location = "/";
  }

  render() {
    return null;
  }
}

export default Logout;
