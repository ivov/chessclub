import React, { Component } from "react";
import Tab from "./Tab";
import Tabpane from "./Tabpane";
import {
  inicioLinks,
  partidaLinks,
  jugadorLinks,
  anunciosLinks,
  administradorLinks
} from "../utils/linkList";

class Subheader extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: null, tabpaneLinks: null };
    this.onTabClick = this.onTabClick.bind(this);
  }

  onTabClick(event) {
    const clickedTab = event.currentTarget.id;
    const newTabpaneLinks = this.getTabpaneLinks(clickedTab);
    this.setState({
      activeTab: clickedTab,
      tabpaneLinks: newTabpaneLinks
    });
  }

  getActiveTab() {
    const path = window.location.pathname;
    if (/herramienta/.test(path)) return "Inicio";
    if (/partida/.test(path)) return "Partidas";
    if (/jugador/.test(path)) return "Jugador";
    if (/anuncios-del-club/.test(path)) return "Anuncios";
    if (/ver-registros/.test(path)) return "Administrador";
    if (/publicar-anuncio/.test(path)) return "Administrador";
    if (/ver-usuarios/.test(path)) return "Administrador";
    else return "Inicio";
  }

  getTabpaneLinks(clickedTab) {
    switch (clickedTab) {
      case "Partidas":
        return partidaLinks;
      case "Jugador":
        return jugadorLinks;
      case "Anuncios":
        return anunciosLinks;
      case "Administrador":
        return administradorLinks;
      default:
        return inicioLinks;
    }
  }

  setActiveTabAndTabpaneLinks() {
    const activeTab = this.getActiveTab();
    const tabpaneLinks = this.getTabpaneLinks(activeTab);
    this.setState({ activeTab, tabpaneLinks });
  }

  componentDidMount() {
    this.setActiveTabAndTabpaneLinks(Tab);
  }

  componentDidUpdate(prevProps) {
    // if url in props changes, set activeTab and tabpaneLinks
    const newUrl = this.props.location.pathname;
    const oldUrl = prevProps.location.pathname;
    if (newUrl !== oldUrl) {
      this.setActiveTabAndTabpaneLinks();
    }
  }

  render() {
    const { activeTab, tabpaneLinks } = this.state;
    const tabpaneLinksLoaded = tabpaneLinks !== null;
    const { isAdmin, isLoggedIn } = this.props;

    return (
      <React.Fragment>
        <div id="subheader">
          <Tab
            tabName="Inicio"
            tabIcon="mdi-home"
            onTabClick={this.onTabClick}
            activeTab={activeTab}
          />
          <Tab
            tabName="Partidas"
            tabIcon="mdi-checkerboard"
            onTabClick={this.onTabClick}
            activeTab={activeTab}
          />
          {isLoggedIn && (
            <Tab
              tabName="Jugador"
              tabIcon="mdi-account"
              onTabClick={this.onTabClick}
              activeTab={activeTab}
            />
          )}
          <Tab
            tabName="Anuncios"
            tabIcon="mdi-message-alert-outline"
            onTabClick={this.onTabClick}
            activeTab={activeTab}
          />
          {isAdmin && (
            <Tab
              tabName="Administrador"
              tabIcon="mdi-chess-king"
              onTabClick={this.onTabClick}
              activeTab={activeTab}
            />
          )}
        </div>
        {tabpaneLinksLoaded && <Tabpane tabpaneLinks={tabpaneLinks} />}
      </React.Fragment>
    );
  }
}

export default Subheader;
