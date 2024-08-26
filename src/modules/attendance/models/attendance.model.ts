import mongoose from "mongoose";

const attendance_schema = new mongoose.Schema({
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    }],
    attendance: {
        type: String,
        enum: ["present", "late" , "half day", "leave"],
        default: undefined
    },
    date:{
        type: Date,
        required: true
    }
}, {timestamps: true})

const Attendance = mongoose.model("Attendance", attendance_schema);
export default Attendance;