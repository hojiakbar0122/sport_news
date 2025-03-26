const express = require('express');
const pool = require('../config/db'); // Assuming you are using a PostgreSQL database
const { errorHandler } = require('../helpers/error_handler');

const addNewNotification = async (req, res) => {
    try {
        const { user_id, news_id, msg_type, is_checked, created_at } = req.body;
        const newNotification = await pool.query(
            `INSERT INTO notifications (user_id, news_id, msg_type, is_checked, created_at)
            VALUES ($1, $2, $3, 4$, 5$) RETURNING *`,
            [user_id, news_id, msg_type, is_checked, created_at]
        );
        res
            .status(201)
            .send({ message: "Yangi Notification qo'shildi", notification: newNotification.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

const getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await pool.query(
            `SELECT * FROM notifications WHERE id = $1`,
            [id]
        );
        if (notification.rows.length === 0) {
            return res.status(404).send({ message: "Notification topilmadi" });
        }
        res.send(notification.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const getAllNotifications = async (req, res) => {
    try {
        const notifications = await pool.query(`SELECT * FROM notifications`);
        res.send(notifications.rows);
    } catch (err) {
        errorHandler(err, res);
    }
}

const updateNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, news_id, msg_type, is_checked, created_at } = req.body;
        const updatedNotification = await pool.query(
            `UPDATE notifications SET user_id = $1, news_id = $2, msg_type = 3$, is_checked = 4$, created_at = 5$
            WHERE id = $6 RETURNING *`,
            [user_id, news_id, msg_type, is_checked, created_at, id]
        );
        if (updatedNotification.rows.length === 0) {
            return res.status(404).send({ message: "Notification topilmadi" });
        }
        res.send(updatedNotification.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const deleteNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNotification = await pool.query(
            `DELETE FROM notifications WHERE id = $1 RETURNING *`,
            [id]
        );
        if (deletedNotification.rows.length === 0) {
            return res.status(404).send({ message: "Notification topilmadi" });
        }
        res.send({ message: "Notification o'chirildi", notification: deletedNotification.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

module.exports = {
    addNewNotification,
    getNotificationById,
    getAllNotifications,
    updateNotificationById,
    deleteNotificationById
}
