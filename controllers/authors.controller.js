const express = require('express');
const pool = require('../config/db'); // Assuming you are using a PostgreSQL database
const { errorHandler } = require('../helpers/error_handler');

const addNewAuthor = async (req, res) => {
    try {
        const { user_id, is_approved, is_editor } = req.body;
        const newAuthor = await pool.query(
            `INSERT INTO authors (user_id, is_approved, is_editor)
            VALUES ($1, $2, $3) RETURNING *`,
            [user_id, is_approved, is_editor]
        );
        res
            .status(201)
            .send({ message: "Yangi Author qo'shildi", author: newAuthor.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

const getAuthorById = async (req, res) => {
    try {
        const { id } = req.params;
        const author = await pool.query(
            `SELECT * FROM authors WHERE id = $1`,
            [id]
        );
        if (author.rows.length === 0) {
            return res.status(404).send({ message: "Author topilmadi" });
        }
        res.send(author.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const getAllAuthors = async (req, res) => {
    try {
        const authors = await pool.query(`SELECT * FROM authors`);
        res.send(authors.rows);
    } catch (err) {
        errorHandler(err, res);
    }
}

const updateAuthorById = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, is_approved, is_editor } = req.body;
        const updatedAuthor = await pool.query(
            `UPDATE authors SET user_id = $1, is_approved = $2, is_editor = $3
            WHERE id = $4 RETURNING *`,
            [user_id, is_approved, is_editor, id]
        );
        if (updatedAuthor.rows.length === 0) {
            return res.status(404).send({ message: "Author topilmadi" });
        }
        res.send(updatedAuthor.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const deleteAuthorById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAuthor = await pool.query(
            `DELETE FROM authors WHERE id = $1 RETURNING *`,
            [id]
        );
        if (deletedAuthor.rows.length === 0) {
            return res.status(404).send({ message: "Author topilmadi" });
        }
        res.send({ message: "Author o'chirildi", author: deletedAuthor.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

module.exports = {
    addNewAuthor,
    getAuthorById,
    getAllAuthors,
    updateAuthorById,
    deleteAuthorById
}
