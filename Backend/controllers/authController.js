import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, mobile, password } = req.body;

    // ✅ validation
    if (!name || !mobile || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // ✅ check existing user
    const exist = await User.findOne({ mobile });
    if (exist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ create user safely
    const user = await User.create({
      name,
      mobile,
      password: hashedPassword
    });

    res.status(201).json({
      msg: "Signup successful",
      user
    });

  } catch (error) {
    console.error(error); // 🔥 important
    res.status(500).json({ msg: error.message });
  }
};



// LOGIN (thoda clean version)
export const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "testsecret",
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};