import { Request, Response } from "express";
import Batch from "../../batches/models/batch.model";



interface RequestData {
    name?:  string ;
    division?:  number ;
    batch?: number;
};

type MatchValue = number | string | { $regex: RegExp };


// find all baches and filter by (name, batch, division)

export const allbach = async (req: Request <RequestData>, res: Response): Promise<Response> => {

    if(!req.query){
        
            const allbach = await Batch.find();
            if (!allbach) {
                return res.status(404).json({ status: "NOT_FOUND", message: "No batches found", data: [] });
            }
            
        return res.status(200).json({ status: "OK", message: "Found all baches", data: allbach});
    }else{

    const { batch, division, name } = req.query;   

    const matchValue: Record<string, MatchValue> = {};
    
    if (batch)  matchValue.batch = Number(batch); 
    if (division) matchValue["student_details.division"] = Number(division); 
    if (name) matchValue["student_details.name"] = { $regex: new RegExp(name as string, "i") }; 
    
        const filteredBatches = await Batch.aggregate([
            {
                $lookup: {
                    from: "students", 
                    localField: "students",
                    foreignField: "_id",
                    as: "student_details",
                },
            },
            {
                $unwind: {
                    path: "$student_details",
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $match: matchValue 
            },
            {
                $group: {
                    _id: "$_id", 
                    batch: { $first: "$batch" },
                    students: { $push: "$student_details" } 
                }
            },
        ]);

        if (filteredBatches.length === 0) {
            return res.status(404).json({ status: "NOT_FOUND", message: "No batches found", data: [] });
        }

        return res.status(200).json({ status: "OK", message: "Filtered batches found", data: filteredBatches });    
    }
};


