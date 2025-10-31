import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const refresh_token = req.cookies?.refresh_token;
    if (!refresh_token) {
      return res.status(401).json({ message: "No hay refresh token" });
    }

    const params = new URLSearchParams();
    params.append("client_id", process.env.KEYCLOAK_CLIENT);
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refresh_token);

    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } } 
    );

    const { access_token, refresh_token: new_refresh_token, expires_in } = response.data;

    res.cookie("refresh_token", new_refresh_token, {
      httpOnly: true,
      secure: false, 
      sameSite: "Strict",
      maxAge: 300 * 1000,
    });

    return res.json({ accessToken: access_token, expiresIn: expires_in });
  } catch (error) {
    console.error("Error al refrescar token:", error.response?.data || error.message);
    res.status(403).json({ message: "No se pudo refrescar el token" });
  }
});

export default router;

