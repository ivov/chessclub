import React from "react";
import Infocard from "./Infocard";

const ClubArea = () => {
  return <Infocard title="Acerca del club" text={text} />;
};

export const text = [
  "El círculo de ajedrez Torre Blanca es una prestigiosa institución deportiva y educativa que, como servicio a su comunidad, practica, promociona y difunde el ajedrez.",
  "Es una asociación civil que fue fundada por un grupo de jóvenes entusiastas el 31 de marzo de 1972. Desde sus orígenes estuvo radicada en el populoso barrio de Abasto-Almagro, en la ciudad de Buenos Aires, República Argentina, donde realiza, junto con otras entidades vecinales, una gran actividad deportiva y comunitaria.",
  "El ajedrez es su actividad exclusiva. Vive del aporte regular de sus socios, gran parte niños, a través de una accesible cuota social y de moderadas inscripciones a torneos y actividades sociales. Con la suma de estos individualmente pequeños aportes mantiene su infraestructura deportiva y administrativa. En 1993, tras pasar 21 años en una vieja casa alquilada de la Avenida Díaz Vélez, logró adquirir su actual sede social en la calle Sánchez de Bustamante 587, desde donde centraliza sus actividades."
];

export default ClubArea;
