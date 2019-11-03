import React from "react";

const ToolArea = () => {
  return (
    <div className="area-container">
      <div className="infocard-container">
        <div className="infocard-text">
          <h1>Acerca de esta herramienta</h1>
          <p>Proyecto de desarrollo para administrar un club de ajedrez.</p>
          <div className="tool-subtitle">Características:</div>
          <ul>
            <li>Registro y acceso de jugadores del club.</li>
            <li>Carga de datos de partidas entre jugadores del club.</li>
            <li>Análisis, edición y descarga de partidas ingresadas.</li>
            <li>Resumen e historial del jugador y sus partidas.</li>
            <li>Publicación y vista de anuncios del club.</li>
            <li>Usuarios administradores con más funciones.</li>
            <li>Vista de registros de uso de la herramienta.</li>
            <li>Vista de listado de usuarios.</li>
          </ul>
          <div className="tool-subtitle">Tecnologías:</div>
          <div className="technologies">
            <div>
              <div>Cliente</div>
              <div className="technology">
                <img
                  src={process.env.PUBLIC_URL + "/img/react.png"}
                  className="tool-logo"
                  alt="Logo de React"
                />
                React.js
              </div>
            </div>
            <div>
              <div>Servidor</div>
              <div className="technology">
                <img
                  src={process.env.PUBLIC_URL + "/img/node.png"}
                  className="tool-logo"
                  alt="Logo de Node"
                />
                Node.js
              </div>
            </div>
            <div>
              <div>Base de datos</div>
              <div className="technology">
                <img
                  src={process.env.PUBLIC_URL + "/img/pg.png"}
                  className="tool-logo"
                  alt="Logo de Postgres"
                />
                PostgreSQL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolArea;
