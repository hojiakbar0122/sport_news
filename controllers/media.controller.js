const express = require('express');
const pool = require('../config/db'); // Assuming you are using a PostgreSQL database
const { errorHandler } = require('../helpers/error_handler');

const addNewMedia = async (req, res) => {
    try {
        const { news_id, media_type, media_url, media_uploaded } = req.body;
        const newMedia = await pool.query(
            `INSERT INTO media (news_id, media_type, media_url, media_uploaded) VALUES ($1, $2, $3, $4) RETURNING *`,
            [news_id, media_type, media_url, media_uploaded]
        );
        res
            .status(201)
            .send({ message: "Yangi Media qo'shildi", media: newMedia.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

const getMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await pool.query(
            `SELECT * FROM media WHERE id = $1`,
            [id]
        );
        if (media.rows.length === 0) {
            return res.status(404).send({ message: "Media topilmadi" });
        }
        res.send(media.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const getAllMedias = async (req, res) => {
    try {
        const medias = await pool.query(`SELECT * FROM media`);
        res.send(medias.rows);
    } catch (err) {
        errorHandler(err, res);
    }
}

const updateMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        const { news_id, media_type, media_url, media_uploaded } = req.body;
        const updatedMedia = await pool.query(
            `UPDATE media SET news_id = $1, media_type = $2, media_url = $3, media_uploaded = $4 WHERE id = $5 RETURNING *`,
            [news_id, media_type, media_url, media_uploaded, id]
        );
        if (updatedMedia.rows.length === 0) {
            return res.status(404).send({ message: "Media topilmadi" });
        }
        res.send(updatedMedia.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const deleteMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMedia = await pool.query(
            `DELETE FROM media WHERE id = $1 RETURNING *`,
            [id]
        );
        if (deletedMedia.rows.length === 0) {
            return res.status(404).send({ message: "Media topilmadi" });
        }
        res.send({ message: "Media o'chirildi", media: deletedMedia.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

module.exports = {
    addNewMedia,
    getMediaById,
    getAllMedias,
    updateMediaById,
    deleteMediaById
}
