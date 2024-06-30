import express from "express";
import {login,register,userInfo} from "../controller/userController.js"
const router=express.Router();


router.post('/login',login);
router.get('/userInfo/:user_id',userInfo)
router.post('/register',register)

export default router;