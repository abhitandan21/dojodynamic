import Certificate from "../models/Certificate.js";

export const getAllCertificates = async (req, res) => {
  const data = await Certificate.find().populate("userId");
  res.json(data);
};

export const approveCertificate = async (req, res) => {
  await Certificate.findByIdAndUpdate(req.params.id, {
    status: "approved"
  });
  res.json({ message: "Approved" });
};