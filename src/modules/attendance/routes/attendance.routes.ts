import express from "express"
import { trycatch } from "../../shared/error/try.catch";
import { all_attendance, attendance_students } from "../controllers/attendance.controller";
const Router = express.Router();


Router.post("/:studentId/attendance",  trycatch(  attendance_students ));
Router.get("/attendance",  trycatch( all_attendance ));


export default Router;
