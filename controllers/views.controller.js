const express = require('express');
const pool = require('../config/db'); // Assuming you are using a PostgreSQL database
const { errorHandler } = require('../helpers/error_handler');

const addNewView = async (req, res) => {
    try {
        const { user_id, news_id, viewed_at } = req.body;
        const newView = await pool.query(
            `INSERT INTO views (user_id, news_id, viewed_at)
            VALUES ($1, $2, $3) RETURNING *`,
            [user_id, news_id, viewed_at]
        );
        res
            .status(201)
            .send({ message: "Yangi View qo'shildi", view: newView.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

const getViewById = async (req, res) => {
    try {
        const { id } = req.params;
        const view = await pool.query(
            `SELECT * FROM views WHERE id = $1`,
            [id]
        );
        if (view.rows.length === 0) {
            return res.status(404).send({ message: "View topilmadi" });
        }
        res.send(view.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const getAllViews = async (req, res) => {
    try {
        const views = await pool.query(`SELECT * FROM views`);
        res.send(views.rows);
    } catch (err) {
        errorHandler(err, res);
    }
}

const updateViewById = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, news_id, viewed_at } = req.body;
        const updatedView = await pool.query(
            `UPDATE views SET user_id = $1, news_id = $2, view_at = $3
            WHERE id = $4 RETURNING *`,
            [user_id, news_id, viewed_at, id]
        );
        if (updatedView.rows.length === 0) {
            return res.status(404).send({ message: "View topilmadi" });
        }
        res.send(updatedView.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const deleteViewById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedView = await pool.query(
            `DELETE FROM views WHERE id = $1 RETURNING *`,
            [id]
        );
        if (deletedView.rows.length === 0) {
            return res.status(404).send({ message: "View topilmadi" });
        }
        res.send({ message: "View o'chirildi", like: deletedView.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

module.exports = {
    addNewView,
    getViewById,
    getAllViews,
    updateViewById,
    deleteViewById
}
