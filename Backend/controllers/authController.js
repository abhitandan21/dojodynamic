import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const {
      name,
      mobile,
      password,
      registrationNo,
      fatherName,
      dob,
      address
    } = req.body;

    // REQUIRED FIELD CHECK
    if (!name || !mobile || !password || !registrationNo) {
      return res.status(400).json({
        msg: "All required fields are mandatory"
      });
    }

    // REGISTRATION NUMBER FORMAT CHECK
    const regRegex = /^AMAASA\/\d{4}\/\d{3}$/;

    if (!regRegex.test(registrationNo)) {
      return res.status(400).json({
        msg: "Registration number must be like AMAASA/2025/034"
      });
    }

    // MOBILE NUMBER VALIDATION
    const mobileRegex = /^[0-9]{10}$/;

    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        msg: "Mobile number must be 10 digits"
      });
    }

    // DUPLICATE CHECK
    const existingUser = await User.findOne({
      $or: [
        { mobile },
        { registrationNo }
      ]
    });

    if (existingUser) {

      if (existingUser.mobile === mobile) {
        return res.status(400).json({
          msg: "Mobile number already registered"
        });
      }

      if (existingUser.registrationNo === registrationNo) {
        return res.status(400).json({
          msg: "Registration number already exists"
        });
      }
    }

    // PASSWORD HASH
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({
      name,
      mobile,
      password: hashedPassword,
      registrationNo: registrationNo.toUpperCase(),
      fatherName,
      dob,
      address
    });

    res.status(201).json({
      msg: "Signup successful",
      user
    });

  } catch (error) {

    console.error(error);

    // DUPLICATE KEY ERROR
    if (error.code === 11000) {
      return res.status(400).json({
        msg: "Mobile or Registration Number already exists"
      });
    }

    res.status(500).json({
      msg: error.message
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {

    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        msg: "All fields required"
      });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET || "testsecret",
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,
      user
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: error.message
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {

    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        msg: "Mobile and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        msg: "Password must be at least 6 characters"
      });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        msg: "No account found with this mobile number"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      msg: "Password reset successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: error.message
    });
  }
};