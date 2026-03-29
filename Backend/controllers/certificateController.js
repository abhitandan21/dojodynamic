import Certificate from "../models/Certificate.js";

export const addCertificate = async (req, res) => {
  const cert = await Certificate.create(req.body);
  res.json(cert);
};

export const getMyCertificates = async (req, res) => {
  const data = await Certificate.find({ userId: req.params.id });
  res.json(data);
};