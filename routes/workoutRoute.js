import express from "express";
import {startExercise,addWorkout} from "../controller/workoutConroller.js"
const router=express.Router();

router.post('/startExcercise/:excercise_id',startExercise);

router.post('/addWorkout',addWorkout)

export default router;