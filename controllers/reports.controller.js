const express = require('express');
const pool = require('../config/db'); // Assuming you are using a PostgreSQL database
const { errorHandler } = require('../helpers/error_handler');

const addNewReport = async (req, res) => {
    try {
        const { user_id, news_id, reason, status, created_at } = req.body;
        const newReport = await pool.query(
            `INSERT INTO reports (user_id, news_id, reason, status, created_at)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user_id, news_id, reason, status, created_at]
        );
        res
            .status(201)
            .send({ message: "Yangi Report qo'shildi", report: newReport.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await pool.query(
            `SELECT * FROM reports WHERE id = $1`,
            [id]
        );
        if (report.rows.length === 0) {
            return res.status(404).send({ message: "Report topilmadi" });
        }
        res.send(report.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const getAllReports = async (req, res) => {
    try {
        const reports = await pool.query(`SELECT * FROM reports`);
        res.send(reports.rows);
    } catch (err) {
        errorHandler(err, res);
    }
}

const updateReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, news_id, reason, status, created_at } = req.body;
        const updatedReport = await pool.query(
            `UPDATE reports SET user_id = $1, news_id = $2, reason = $3, status = $4, created_at = $5
            WHERE id = $6 RETURNING *`,
            [user_id, news_id, reason, status, created_at, id]
        );
        if (updatedReport.rows.length === 0) {
            return res.status(404).send({ message: "Report topilmadi" });
        }
        res.send(updatedReport.rows[0]);
    } catch (err) {
        errorHandler(err, res);
    }
}

const deleteReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReport = await pool.query(
            `DELETE FROM reports WHERE id = $1 RETURNING *`,
            [id]
        );
        if (deletedReport.rows.length === 0) {
            return res.status(404).send({ message: "Report topilmadi" });
        }
        res.send({ message: "Report o'chirildi", report: deletedReport.rows[0] });
    } catch (err) {
        errorHandler(err, res);
    }
}

module.exports = {
    addNewReport,
    getReportById,
    getAllReports,
    updateReportById,
    deleteReportById
}
