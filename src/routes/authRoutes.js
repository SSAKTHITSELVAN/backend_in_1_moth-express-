import express from 'express';
import {register, login, getUserInfo, refresh } from '../controllers/authController.js';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authMiddleware, authorizeRoles("ADMIN"), getUserInfo);
router.post('/refresh', refresh);

export default router;