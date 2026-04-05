import Form from "../model/Form.js";

export const saveForm = async (req, res) => {
  const form = await Form.create(req.body);
  res.json(form);
};