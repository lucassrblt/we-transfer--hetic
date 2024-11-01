CREATE DATABASE IF NOT EXISTS `we_transfer`;

USE `we_transfer`;

CREATE TABLE users (
    id         VARCHAR(255) PRIMARY KEY,
    email      VARCHAR(255) NOT NULL,
    prenom     VARCHAR(255) NOT NULL,
    nom        VARCHAR(255) NOT NULL,
    stockage   INT       DEFAULT 0,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE files (
    id       VARCHAR(255) PRIMARY KEY,
    user_id  VARCHAR(255) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE files_metadata (
    id         VARCHAR(255) PRIMARY KEY,
    file_id    VARCHAR(255) NOT NULL,
    name       VARCHAR(255) NOT NULL,
    size       INT          NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES files (id)
);

CREATE TABLE mail_history (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    file_id VARCHAR(255) NOT NULL,
    receiver VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (file_id) REFERENCES files (id)
)



