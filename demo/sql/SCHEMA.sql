-- Drop table

-- DROP TABLE public.games;

CREATE TABLE public.games (
	id serial NOT NULL,
	"date" timestamp NOT NULL,
	white serial NOT NULL,
	black serial NOT NULL,
	moves text NOT NULL,
	winner int4 NOT NULL,
	"event" varchar(100) NULL,
	CONSTRAINT games_pkey PRIMARY KEY (id),
	CONSTRAINT games_black_player_fkey FOREIGN KEY (black) REFERENCES users(id),
	CONSTRAINT games_fk FOREIGN KEY (winner) REFERENCES users(id),
	CONSTRAINT games_white_player_fkey FOREIGN KEY (white) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Drop table

-- DROP TABLE public.news;

CREATE TABLE public.news (
	id serial NOT NULL,
	title varchar(50) NOT NULL,
	body text NOT NULL,
	"date" timestamp NULL,
	CONSTRAINT news_pkey PRIMARY KEY (id)
);

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id serial NOT NULL,
	username varchar(30) NOT NULL,
	"password" varchar(100) NOT NULL,
	email varchar(254) NULL,
	is_admin bool NOT NULL DEFAULT false,
	CONSTRAINT users_email_check CHECK (((email)::text <> ''::text)),
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_password_check CHECK (((password)::text <> ''::text)),
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_username_check CHECK (((username)::text <> ''::text)),
	CONSTRAINT users_username_unique_constraint UNIQUE (username)
);