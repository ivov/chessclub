# chessclub

![](https://img.shields.io/github/last-commit/ivov/chessclub) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Full-stack web app for managing a neighborhood chess club.

Built with React, Node/Express and PostgreSQL.

<p align="center">
    <img src="demo/images/react.png" width="160">
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="demo/images/node.png" width="160">
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="demo/images/pg.png" width="160">
</p>

## Overview

Full-stack web app for helping a chess club manage players, record championship matches and announce club events, with an interactive chess board to view and download matches, user registration/login, and an administrator dashboard.

Demo at: https://ajedrez-torre-blanca.herokuapp.com/

<p align="center">
    <img src="demo/images/overview.gif">
<p>

Features:

- Basic CRUD ops for chess players, matches and event announcements
- Interactive chess board to visualize and step through chess matches
- Registration/login via JSON web tokens, with password encryption
- Admin-only dashboard, logging and event announcement board
- Protected routes, React Router navigation, Jest-based testing

## Installation

1. Install [Node](https://nodejs.org/en/download/) and clone repo
2. Get server dependencies: `npm install`
3. Get client dependencies: `cd client && npm install`
4. Create PostgreSQL db using the `.sql` files provided in `demo/sql`
5. Create an `.env` with `JWT_KEY=whatever` and `DEV_CONNSTRING=...` (\*)
6. Test: `npm run test` (optional)
7. Run server and client: `npm run dev`

(\*) Example connection string:

    "postgresql://john:abc123@localhost:5432/chess_db"

## Operation

The app header offers registration/login buttons and three tabs for access to three main sections:

- `Inicio` (Home), with two subsections:
  - `Acerca del club` (About the club), containing a general description of the neighborhood chess club
  - `Acerca de esta herramienta` (About this tool), containing a general description of the app
- `Partidas` (Matches), with two subsections:
  - `Ver partida` (View match), which lists recorded matches
  - `Ingresar partida` (Enter match), which offers a form for entering a club match
- `Anuncios` (Announcements), with a single subsection:
  - `Anuncios del club` (Club announcements), with announcements by the club's staff

If the user is logged in and is a player, a fourth tab becomes available:

- `Jugador` (Player), with one subsection:
  - `Perfil del jugador` (Player profile), containing a simple profile of the player

If the user is logged in and is an admin, a final fifth tab becomes available:

- `Administrador` (Administrator), with three subsctions:
  - `Ver registros` (View logs), which shows all activity on the app
  - `Ver usuarios` (View users), which lists all users, their contact info and admin status
  - `Publicar anuncio` (Publish announcement), which offers a form for entering an announcement.

<p align="center">
    <img src="demo/images/header.png">
<p>

### Registering, logging in, logging out

To register, press `Registrarse` (Register) on the header and enter a username, e-mail and password. Passwords are encrypted with bcrypt.

To log in, press `Ingresar` (Log in) on the header and enter a valid username and password. A successful login returns a response header with a JWT signed using an environment variable and placed in local storage. The username is displayed on the header, with a circle if a player and a shield if an admin.

To log out, press `Salir` (Log out) on the header. The signed JWT is removed from local storage.

**Note**: This demo has no password recovery mechanism.

<p align="center">
    <img src="demo/images/register.png">
</p>

### Viewing matches

The subsection `Ver partida` shows a list of recorded matches. An `Editar` (Edit) button appears next to a match if the user is logged in and was one of the players in the match. All matches can be edited if the user is an admin.

Selecting a match leads to the interactive chess board, which displays match metadata at the top, each move on the right-hand column, and seven buttons at the bottom:

- `Rotar` (Rotate), to turn the chess board 180 degrees
- `Al inicio` (Start) and `Al final` (End), to jump to the beginning or end
- `Retroceder` (Back) and `Avanzar` (Forward), to move back or forward one move
- `Automático` (Automatic), to start/stop an autoplay of the match
- `Descargar` (Download), to download the match in a PGN-friendly `.txt` file

<p align="center">
    <img src="demo/images/viewing_matches.png">
<p>

### Recording matches

The subsection `Ver partida` offers a form for entering a match between club players as match metadata—date, event, white, black, and result—and up to fifty match moves in algebraic notation.

<p align="center">
    <img src="demo/images/recording_matches.png">
<p>

### Viewing announcements

The subsection `Anuncios del club` lists the most recent announcements by the club's staff.

<p align="center">
    <img src="demo/images/viewing_announcements.png">
<p>

### Viewing a player's profile

A logged-in player can view their own profile.

The subsection `Perfil del jugador` shows a simple player profile with total matches, wins, losses, and draws, including the player's contact info and a listing of their matches.

<p align="center">
    <img src="demo/images/viewing_player_profile.png">
<p>

### Admin dashboard

A logged-in admin can access the admin dashboard.

The subsection `Ver registros` shows logs for all app activity: logins, logouts, entry of match data, announcements sent, etc.

<p align="center">
    <img src="demo/images/admin_dashboard_logs.png">
<p>

The subsection `Ver usuarios` lists all users as well as their contact information and admin status.

<p align="center">
    <img src="demo/images/admin_dashboard_users.jpg">
<p>

The subsection `Publicar anuncio` offers a form for sending out an announcement to all members, to be shown on the `Anuncios` tab.

<p align="center">
    <img src="demo/images/admin_dashboard_announcements.png">
<p>

## Author

© 2019 Iván Ovejero

## License

Distributed under the MIT License. See [LICENSE.md](LICENSE.md)
