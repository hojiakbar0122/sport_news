const express = require('express');
const pool = require('../config/db'); // Assuming you are using a PostgreSQL database
const { errorHandler } = require('../helpers/error_handler');

const addNewComment = async (req, res) => {
    try {
        const { user_id, news_id, content, created_at, reply_comment_id, is_approved, is_deleted, views, likes } = req.body;
        const newComment = await pool.query(
            `INSERT INTO comments (user_id, news_id, content, created_at, reply_comment_id, is_approved, is_deleted, views, likes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [user_id, news_id, content, created_at, reply_comment_id, is_approved, is_deleted, views, likes]
        );
        res
            .status(201)
            .send({ message: "Yangi Comment qo'shildi", comment: newComment.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await pool.query(
            `SELECT * FROM comments WHERE id = $1`,
            [id]
        );
        if (comment.rows.length === 0) {
            return res.status(404).send({ message: "Comment topilmadi" });
        }
        res.send(comment.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const getAllComments = async (req, res) => {
    try {
        const comments = await pool.query(`SELECT * FROM comments`);
        res.send(comments.rows);
    } catch (err) {
        errorHandler(err, res);
    }
}

const updateCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, news_id, content, created_at, reply_comment_id, is_approved, is_deleted, views, likes } = req.body;
        const updatedComment = await pool.query(
            `UPDATE comments SET user_id = $1, news_id = $2, content = $3, created_at = $4, reply_comment_id = $5, is_approved = $6, is_deleted = $7, views = $8, likes = $9
            WHERE id = $10 RETURNING *`,
            [user_id, news_id, content, created_at, reply_comment_id, is_approved, is_deleted, views, likes, id]
        );
        if (updatedComment.rows.length === 0) {
            return res.status(404).send({ message: "Comment topilmadi" });
        }
        res.send(updatedComment.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedComment = await pool.query(
            `DELETE FROM comments WHERE id = $1 RETURNING *`,
            [id]
        );
        if (deletedComment.rows.length === 0) {
            return res.status(404).send({ message: "Comment topilmadi" });
        }
        res.send({ message: "Comment o'chirildi", comment: deletedComment.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

module.exports = {
    addNewComment,
    getCommentById,
    getAllComments,
    updateCommentById,
    deleteCommentById
}
