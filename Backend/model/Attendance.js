import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        studentName: {
            type: String,
            required: true,
            trim: true,
        },

        registrationNo: {
            type: String,
            required: true,
            trim: true,
        },

        date: {
            type: String,
            required: true,
            trim: true,
        },

        month: {
            type: Number,
            required: true,
        },

        year: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["Present", "Absent"],
            default: "Present",
        },

        batch: {
            type: String,
            default: "General",
        },

        markedBy: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// One attendance per student per day
attendanceSchema.index(
    {
        studentId: 1,
        date: 1,
    },
    {
        unique: true,
    }
);

export default mongoose.model("Attendance", attendanceSchema);