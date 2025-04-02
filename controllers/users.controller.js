const express = require("express");
const pool = require("../config/db"); // Assuming you are using a PostgreSQL database
const bcrypt = require("bcrypt");
const { errorHandler } = require("../helpers/error_handler");
const jwtService = require("../services/jwt.service");
const DeviceDetector = require("node-device-detector");
const DeviceHelper = require('node-device-detector/helper');
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
  deviceTrusted: false,
  deviceInfo: false,
  maxUserAgentSize: 500,
});

const addNewUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone_number,
      interests,
      role,
    } = req.body;

    const hashedPassword = bcrypt.hash(password, 7);

    const newUser = await pool.query(
      `INSERT INTO users (first_name,
            last_name,
            email,
            password,
            phone_number,
            interests,
            role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        phone_number,
        interests,
        role,
      ]
    );
    
    res.status(201).send({ message: "New user added", user: newUser.rows[0] });
  } catch (err) {
    errorHandler(err, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Identification
    const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);

    const user = userData.rows[0];

    if (!user) {
      return res
        .status(400)
        .send({ message: "Email yoki password noto'g'ri " });
    }

    //Autentifikatsiya
    const validPassword = bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .send({ message: "Email yoki password noto'g'ri " });
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = jwtService.generateTokens(payload);
    
    await pool.query(`UPDATE users SET refresh_token = $1 WHERE id = $2`, [tokens.refreshToken, user.id]);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.send({
      message: "Tizimga xush kelibsiz",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Cookie da token topilmadi" });
    }

    const updatedUser = await pool.query(
      `UPDATE users SET refresh_token = NULL WHERE refresh_token = $1 RETURNING *`,
      [refreshToken]
    );
    if (!updatedUser.rows[0]) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }

    res.clearCookie("refreshToken");
    res.send({ message: "User succesfully logout" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Cookie da token topilmadi" });
    }

    const userData = await pool.query(
      `SELECT * FROM users WHERE refresh_token = $1`,
      [refreshToken]
    );
    const user = userData.rows[0];

    if (!user) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = jwtService.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });
    res.send({
      message: "Tokenlar yangilandi",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    if (user.rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(`SELECT * FROM users`);
    res.send(users.rows);
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name,
        last_name,
        email,
        password,
        phone_number,
        interests,
        role} = req.body;
    const updatedUser = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, email = $3,
      password = $4, phone_number = $5, interests = $6, role = $7
      WHERE id = $8 RETURNING *`,
      [first_name,
        last_name,
        email,
        password,
        phone_number,
        interests,
        role, id]
    );
    if (updatedUser.rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(updatedUser.rows[0]);
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id]
    );
    if (deletedUser.rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "User deleted", user: deletedUser.rows[0] });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  addNewUser,
  loginUser,
  logoutUser,
  refreshTokenUser,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
};
