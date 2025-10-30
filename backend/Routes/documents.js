import express from "express";
const router = express.Router();

let data = {
  "emma@com": [
    "Barranquilla",
    "Playa",
    "Sol",
    "Paisaje",
  ],
  "esfajardo": [
    "Flores",
    "Cartajena",
    "Viajes",
    "Viajes",
  ],
};

const getDocuments = async (req, res) => {
  try {
    const  preferred_username = req.user;

    res.status(200).send(data[ preferred_username]);
  } catch (err) {
    res.status(500).send(err);
  }
};

router.get("/", getDocuments);
export default router;  