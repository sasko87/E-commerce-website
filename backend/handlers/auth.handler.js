import { createNewUser, findUserbyEmail } from "../pkg/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { redis } from "../lib/redis.js";

const generateTokens = async (email) => {
  const user = await findUserbyEmail(email);

  const payload = {
    id: user._id,
    name: user.name,
    type: user.role,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (email, refreshToken) => {
  await redis.set(
    `refresh_token: ${email}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExists = await findUserbyEmail(email);
    if (userExists) {
      return res.status(400).send({ message: "User already exists" });
    }

    req.body.password = bcrypt.hashSync(password);
    await createNewUser(req.body);

    const { accessToken, refreshToken } = await generateTokens(email);

    setCookies(res, accessToken, refreshToken);

    await storeRefreshToken(email, refreshToken);
    return res.status(201).send({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserbyEmail(email);

    if (!user) {
      return res
        .status(400)
        .send({ error: "User with this email does not exists" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({ error: "Wrong password" });
    }

    const { accessToken, refreshToken } = await generateTokens(email);
    setCookies(res, accessToken, refreshToken);
    await storeRefreshToken(email, refreshToken);

    return res.status(200).send({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.email}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).send({ message: "Logout successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
