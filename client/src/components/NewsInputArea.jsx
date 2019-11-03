import React, { Component } from "react";
import apiCaller from "../utils/apiCaller";

class NewsInputArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      body: "",
      date: this.createLocalDate()
    };
    this.handleTextboxChange = this.handleTextboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  createLocalDate() {
    const date = new Date();
    date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return date;
  }

  handleTextboxChange(event) {
    if (event.target.id === "title") {
      this.setState({
        title: event.target.value
      });
    } else if (event.target.id === "body") {
      this.setState({
        body: event.target.value
      });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const apiEndpoint = "/api/news/";

    const newsItem = {
      title: this.state.title,
      body: this.state.body,
      date: this.state.date
    };

    const token = localStorage.getItem("jwt");
    const config = {
      headers: {
        "x-auth-token": token
      }
    };

    const response = await apiCaller.post(apiEndpoint, newsItem, config);
    if (response) window.location = "/anuncios-del-club";
  }

  render() {
    return (
      <div className="area-container">
        <form onSubmit={this.handleSubmit}>
          <fieldset id="game-input-geninfo-container">
            <div id="game-input-title">Ingresar anuncio</div>

            <div className="label-and-field label-margin">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                name="title"
                value={this.state.title}
                onChange={this.handleTextboxChange}
                id="title"
              />
            </div>

            <div className="label-and-field label-margin">
              <label htmlFor="body">Contenido</label>
              <textarea
                name="body"
                value={this.state.body}
                onChange={this.handleTextboxChange}
                id="body"
              />
            </div>

            <div id="game-input-submit">
              <input type="submit" value="Publicar" method="post" />
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default NewsInputArea;
