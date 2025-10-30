import jwtmod from "jsonwebtoken";

export default async (req, res, next) => {
  try {
    const bearerHeader = req.headers["Authorization"];
    if (!bearerHeader) return res.sendStatus(401);

    const token = bearerHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const public_key = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLICKEY}\n-----END PUBLIC KEY-----`;

    const decodedToken = jwtmod.verify(token, public_key, {
      algorithms: ["RS256"],
    });

    const { preferred_username } = decodedToken;
    req.user = preferred_username;

    next();
  } catch (err) {
    console.error("Error verificando token:", err.message);
    return res.sendStatus(403);
  }
};
