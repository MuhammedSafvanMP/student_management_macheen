import { Request, Response } from "express";
import Attendance from "../models/attendance.model";
import Students from "../../student/models/student.model";
import mongoose from "mongoose";


interface RequestData {
    attendanceId?:  string ;
    attendance?: string;
    studentId?:  (string | number );
    name?:string;
    date?: Date | string | number;
    batch?: number;
    division?: number
};



// add attendance student

export const attendance_students = async (req: Request < RequestData >, res: Response  ): Promise<Response> => {
    const { studentId } = req.params;
    const { attendance } = req.body;

    const validAttendances: string [] = ["present", "late", "half day", "leave"];
    if (!validAttendances.includes(attendance)) {
        return res.status(400).json({ status: "ERROR", message: "Invalid attendance status" });
    }

    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    const student = await Students.findById(studentObjectId);
    if (!student) {
        return res.status(400).json({ status: "NOT_FOUND", message: "Student not found" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendanceRecord = await Attendance.findOne({
        students: studentObjectId,
        date: { $gte: startOfDay, $lt: endOfDay }
    });

    if (existingAttendanceRecord) {
        return res.status(400).json({ status: "ERROR", message: "Attendance  already recorded today" });
    }

    let attendanceRecord = await Attendance.findOne({
        attendance: attendance,
        date: { $gte: startOfDay, $lt: endOfDay }
    });

    if (attendanceRecord) {
        attendanceRecord.students.push(studentObjectId);
    } else {
        attendanceRecord = new Attendance({
            students: [studentObjectId],
            attendance,
            date: new Date()
        });
    }

    await attendanceRecord.save();

    return res.status(201).json({
        status: "OK",
        message: `Attendance recorded successfully as ${attendance}`,
        data: attendanceRecord
    });
};


// students attendance get all and filtering by attendance ("present", "late", "half day", "leave"), name adnd date 

type MatchValue = string | number | { $regex: RegExp } | { $gte?: Date, $lte?: Date };


export const all_attendance = async (req: Request< RequestData  >, res: Response ): Promise<Response> => {

    if(!req.query) {

        const allAttendance =  await Attendance.find();
        
        if(!allAttendance) return res.status(400).json({ status: "NOT_FOUND", message: "Attendance not found" });
        
        return res.status(200).json({ status: "OK", message: "Attendance found", data: allAttendance });
    }else{

         const { attendance, name, date, batch, division } = req.query;

        const matchValue: Record<string, MatchValue> = {};

        if (attendance) matchValue["attendance"] = attendance as string;

        if (name) matchValue["student_details.name"] = { $regex: new RegExp(name as string, "i") };

        if (date) {
            const parsedDate = new Date(date as string);
            if (!isNaN(parsedDate.getTime())) {
                const startOfDay = new Date(parsedDate);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(parsedDate);
                endOfDay.setHours(23, 59, 59, 999);

                matchValue["date"] = { $gte: startOfDay, $lte: endOfDay };
            } else {
                return res.status(400).json({ status: "ERROR", message: "Invalid date format" });
            }
        }

        if (batch) matchValue["student_details.batch"] = Number(batch);
        if (division) matchValue["student_details.division"] = Number(division);

        const filteredAttendance = await Attendance.aggregate([
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
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: matchValue,
            },
            {
                $group: {
                    _id: "$_id",
                    attendance: { $first: "$attendance" },
                    students: { $push: "$student_details" },
                    date: { $first: "$date" },
                },
            },
        ]);

        if (filteredAttendance.length === 0) {
            return res.status(404).json({ status: "NOT_FOUND", message: "Attendance not found", data: [] });
        }

        return res.status(200).json({ status: "OK", message: "Attendance found", data: filteredAttendance });
    }
}


