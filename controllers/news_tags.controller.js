const express = require('express');
const pool = require('../config/db'); // Assuming you are using a PostgreSQL database
const { errorHandler } = require('../helpers/error_handler');

const addNewNewsTag = async (req, res) => {
    try {
        const { news_id, tag_id } = req.body;
        const newNewsTag = await pool.query(
            `INSERT INTO news_tags (news_id, tag_id)
            VALUES ($1, $2) RETURNING *`,
            [news_id, tag_id]
        );
        res
            .status(201)
            .send({ message: "Yangi NewsTag qo'shildi", newsTag: newNewsTag.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

const getNewsTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const newsTag = await pool.query(
            `SELECT * FROM news_tags WHERE id = $1`,
            [id]
        );
        if (newsTag.rows.length === 0) {
            return res.status(404).send({ message: "NewsTag topilmadi" });
        }
        res.send(newsTag.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const getAllNewsTags = async (req, res) => {
    try {
        const newsTags = await pool.query(`SELECT * FROM news_tags`);
        res.send(newsTags.rows);
    } catch (err) {
        errorHandler(err, res);
    }
}

const updateNewsTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const { news_id, tag_id } = req.body;
        const updatedNewsTag = await pool.query(
            `UPDATE news_tags SET news_id = $1, tag_id = $2
            WHERE id = $3 RETURNING *`,
            [news_id, tag_id, id]
        );
        if (updatedNewsTag.rows.length === 0) {
            return res.status(404).send({ message: "NewsTag topilmadi" });
        }
        res.send(updatedNewsTag.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const deleteNewsTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNewsTag = await pool.query(
            `DELETE FROM news_tags WHERE id = $1 RETURNING *`,
            [id]
        );
        if (deletedNewsTag.rows.length === 0) {
            return res.status(404).send({ message: "NewsTag topilmadi" });
        }
        res.send({ message: "NewsTag o'chirildi", NewsTag: deletedNewsTag.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

module.exports = {
    addNewNewsTag,
    getNewsTagById,
    getAllNewsTags,
    updateNewsTagById,
    deleteNewsTagById
}
