import mongoose from "mongoose";

const student_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    division: {
        type: Number,
        required: true
    },
    batch: {
        type: Number,
        required: true
    },
    date:{
        type: Date,
        default: new Date().toDateString(),
        required: true
    }
}, {timestamps: true})

const Studetns = mongoose.model("Student", student_schema);
export default Studetns;