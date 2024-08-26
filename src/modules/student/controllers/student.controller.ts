import { Request, Response } from "express";
import Student from "../models/student.model";
import Batch from "../../batches/models/batch.model";
import joi_validation from "../../shared/validations/joi.validation";


interface RequestData {
    name?:  string ;
    email?: string;
    division?:  number ;
    batch?: number
};


// Create a new student and division with a batch
export const createStudent = async (req: Request <RequestData>, res: Response ): Promise<Response> => {

    const { error, value } = joi_validation.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: "ERROR",
                message: error.details[0].message
            });
        }

        const student = await Student.create({
            name: value.name,
            email: value.email,
            division: value.division,
            batch: value.batch
        });

        const batchRecord = await Batch.findOneAndUpdate(
            { batch: value.batch }, 
            { $push: { students: student._id } },
            { new: true, upsert: true }
        );

        return res.status(201).json({ status: "OK", message: "Student created successfully",  data: batchRecord});   
};
