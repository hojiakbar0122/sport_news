const express = require('express');
const pool = require('../config/db'); // Assuming you are using a PostgreSQL database
const { errorHandler } = require('../helpers/error_handler');

const addNewLike = async (req, res) => {
    try {
        const { user_id, news_id, liked_at } = req.body;
        const newLike = await pool.query(
            `INSERT INTO likes (user_id, news_id, liked_at)
            VALUES ($1, $2, $3) RETURNING *`,
            [user_id, news_id, liked_at]
        );
        res
            .status(201)
            .send({ message: "Yangi Like qo'shildi", like: newLike.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

const getLikeById = async (req, res) => {
    try {
        const { id } = req.params;
        const like = await pool.query(
            `SELECT * FROM likes WHERE id = $1`,
            [id]
        );
        if (like.rows.length === 0) {
            return res.status(404).send({ message: "Like topilmadi" });
        }
        res.send(like.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const getAllLikes = async (req, res) => {
    try {
        const likes = await pool.query(`SELECT * FROM likes`);
        res.send(likes.rows);
    } catch (err) {
        errorHandler(err, res);
    }
}

const updateLikeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, news_id, liked_at } = req.body;
        const updatedLike = await pool.query(
            `UPDATE likes SET user_id = $1, news_id = $2, liked_at = $3
            WHERE id = $4 RETURNING *`,
            [user_id, news_id, liked_at, id]
        );
        if (updatedLike.rows.length === 0) {
            return res.status(404).send({ message: "Like topilmadi" });
        }
        res.send(updatedLike.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const deleteLikeById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLike = await pool.query(
            `DELETE FROM likes WHERE id = $1 RETURNING *`,
            [id]
        );
        if (deletedLike.rows.length === 0) {
            return res.status(404).send({ message: "Like topilmadi" });
        }
        res.send({ message: "Like o'chirildi", like: deletedLike.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

module.exports = {
    addNewLike,
    getLikeById,
    getAllLikes,
    updateLikeById,
    deleteLikeById
}
