import Enquiry from "../model/Enquiry.js";

export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, program, message } = req.body;

    // Basic validation
    if (!name || !email || !program || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    const enquiry = new Enquiry({
      name,
      email,
      phone,
      program,
      message
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};