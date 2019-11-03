import React, { Component } from "react";
import "../css/chessboard.css";
import "../utils/chessboard";
import apiCaller from "../utils/apiCaller";

class RegisterArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: { username: "", email: "", password: "", isAdmin: false },
      errors: { username: "", email: "", password: "" }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const enteredInfo = event.target.value;
    const relevantField = event.target.name;
    this.setState({
      account: { ...this.state.account, [relevantField]: enteredInfo }
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const errorsFound = this.checkIfEmptyInput();
    this.setState({ errors: errorsFound || {} });
    if (errorsFound !== null) return;

    const apiEndpoint = "/api/users/";
    const newUser = {
      username: this.state.account.username,
      email: this.state.account.email,
      password: this.state.account.password
    };

    try {
      const response = await apiCaller.post(apiEndpoint, newUser);
      localStorage.setItem("jwt", response.headers["x-auth-token"]);
      window.location = "/";
    } catch (error) {
      const errorMessage = error.response.data;
      this.displayExistingInputError(errorMessage);
    }
  }

  checkIfEmptyInput() {
    const errors = {};
    const { account } = this.state;
    if (account.username.trim() === "")
      errors.username = "Nombre sin completar.";
    if (account.email.trim() === "") errors.email = "Correo sin completar.";
    if (account.password.trim() === "")
      errors.password = "Contraseña sin completar.";
    const areThereErrors = Object.keys(errors).length > 0;
    return areThereErrors ? errors : null;
  }

  displayExistingInputError(errorMessage) {
    if (errorMessage.includes("usuario"))
      this.setState({ errors: { username: errorMessage } });
    if (errorMessage.includes("correo"))
      this.setState({ errors: { email: errorMessage } });
  }

  render() {
    const { account, errors } = this.state;

    return (
      <React.Fragment>
        <div className="area-container" id="reglog">
          <form onSubmit={this.handleSubmit}>
            <p>Registrarse</p>
            <input
              type="text"
              name="username"
              value={account.username}
              onChange={this.handleChange}
              placeholder="Nombre de usuario..."
              autoFocus
            />
            {errors.username && (
              <div className="input-error">{errors.username}</div>
            )}
            <input
              type="text"
              name="email"
              value={account.email}
              onChange={this.handleChange}
              placeholder="Correo electrónico..."
            />
            {errors.email && <div className="input-error">{errors.email}</div>}
            <input
              type="password"
              name="password"
              value={account.password}
              onChange={this.handleChange}
              placeholder="Contraseña..."
            />
            {errors.password && (
              <div className="input-error">{errors.password}</div>
            )}
            <input type="submit" value="Confirmar" method="post" />
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default RegisterArea;
