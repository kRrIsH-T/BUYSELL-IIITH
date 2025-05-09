import express from "express";
import { registerController, loginController, testController } from '../controllers/authController.js';
import { requireSignin, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

//register route
router.post('/register', registerController);

//login route
router.post('/login', loginController);

//test routes
router.get('/test', requireSignin, isAdmin, testController);

//protected route
router.get('/user-auth', requireSignin, (req, res) => {
    res.status(200).send({ok: true});
});

export default router;