import jwt from "jsonwebtoken";
import { findUserbyEmail } from "../pkg/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(400).send({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await findUserbyEmail(decoded.email);
    if (!user) {
      return res.status(401).send({ error: "User not found" });
    }

    req.user = user;
    next(); //call the next function
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};

export const adminRoute = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).send({ error: "Access Denied" });
  }
};
