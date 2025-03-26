const express = require('express');
const pool = require('../config/db'); // Assuming you are using a PostgreSQL database
const { errorHandler } = require('../helpers/error_handler');

const addNewTag = async (req, res) => {
    try {
        const { tag_name, description } = req.body;
        const newTag = await pool.query(
            `INSERT INTO tags (tag_name, description)
            VALUES ($1, $2) RETURNING *`,
            [tag_name, description]
        );
        res
            .status(201)
            .send({ message: "Yangi Tag qo'shildi", tag: newTag.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

const getTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await pool.query(
            `SELECT * FROM tags WHERE id = $1`,
            [id]
        );
        if (tag.rows.length === 0) {
            return res.status(404).send({ message: "Tag topilmadi" });
        }
        res.send(tag.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const getAllTags = async (req, res) => {
    try {
        const tags = await pool.query(`SELECT * FROM tags`);
        res.send(tags.rows);
    } catch (err) {
        errorHandler(err, res);
    }
}

const updateTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const { tag_name, description } = req.body;
        const updatedTag = await pool.query(
            `UPDATE tags SET tag_name = $1, description = $2
            WHERE id = $3 RETURNING *`,
            [tag_name, description, id]
        );
        if (updatedTag.rows.length === 0) {
            return res.status(404).send({ message: "Tag topilmadi" });
        }
        res.send(updatedTag.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const deleteTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTag = await pool.query(
            `DELETE FROM tags WHERE id = $1 RETURNING *`,
            [id]
        );
        if (deletedTag.rows.length === 0) {
            return res.status(404).send({ message: "Tag topilmadi" });
        }
        res.send({ message: "Tag o'chirildi", tag: deletedTag.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

module.exports = {
    addNewTag,
    getTagById,
    getAllTags,
    updateTagById,
    deleteTagById
}
