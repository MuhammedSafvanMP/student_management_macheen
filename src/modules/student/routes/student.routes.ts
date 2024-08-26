import express from "express"
import { trycatch } from "../../shared/error/try.catch";
import { createStudent } from "../controllers/student.controller";
const Router = express.Router();


Router.post("/students",  trycatch(createStudent))

export default Router;