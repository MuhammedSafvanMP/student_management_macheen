import express from "express"
import { trycatch } from "../../shared/error/try.catch";
import { allbach } from "../controllers/batch.controller";
const Router = express.Router();


Router.get("/batch",  trycatch( allbach ));

export default Router;