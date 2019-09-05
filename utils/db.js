var spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/images");

exports.getImages = function getImages() {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 6`);
};

exports.addImage = function addImage(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1,$2,$3,$4) RETURNING *`,
        [url, username, title, description]
    );
};

exports.getDataForModal = function getDataForModal(id) {
    return db.query(`SELECT * FROM images WHERE id =$1`, [id]);
};

exports.addComment = function addComment(users, comment, image_id) {
    return db.query(
        "INSERT INTO comments (users, comment, image_id) VALUES($1, $2, $3) RETURNING *",
        [users, comment, image_id]
    );
};

exports.getComments = function getComments(id) {
    return db.query(
        "SELECT * FROM comments WHERE image_id =$1 ORDER BY id DESC",
        [id]
    );
};
exports.getMoreImages = function getMoreImages(id) {
    return db.query(
        `SELECT *, (SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1) AS "lowestId" FROM images WHERE id < $1 ORDER BY id DESC LIMIT 6`,
        [id]
    );
};
