import User from "../model/User.js";

export const register = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

export const login = async (req, res) => {
  const { mobile, password } = req.body;

  const user = await User.findOne({ mobile });

  if (!user) return res.status(404).json({ msg: "User not found" });

  if (user.password !== password)
    return res.status(400).json({ msg: "Wrong password" });

  res.json(user);
};