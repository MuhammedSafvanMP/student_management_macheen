import mongoose from "mongoose";

const batch_schema = new mongoose.Schema({
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    }],
    batch: {
        type: Number,
        required: true,
        unique: true
    }
}, {timestamps: true})

const Batchs = mongoose.model("Bach", batch_schema);
export default Batchs;