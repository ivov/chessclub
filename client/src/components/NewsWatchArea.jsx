import React, { Component } from "react";
import apiCaller from "../utils/apiCaller";
import { formatTimestamp } from "../utils/formatTimestamp";

class NewsWatchArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      error: ""
    };
  }

  async componentDidMount() {
    const apiEndpoint = "/api/news/";
    const { data: news } = await apiCaller.get(apiEndpoint);
    this.setState({ news });
  }

  render() {
    const { news } = this.state;

    return (
      <div className="area-container">
        <div className="news-container">
          {news.map((newsItem, index) => {
            return (
              <div key={index} className="news-item">
                <div className="news-item-title">{newsItem.title}</div>
                <div className="news-item-body">{newsItem.body}</div>
                <div className="news-item-date">
                  {formatTimestamp(newsItem.date)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default NewsWatchArea;
