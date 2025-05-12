import { Router } from 'express';
import { body }   from 'express-validator';
import validate   from '../middlewares/validate.js';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

router.post(
  '/register',
  [ body('email').isEmail(), body('password').isLength({ min: 8 }) ],
  validate,
  register
);

router.post(
  '/login',
  [ body('email').isEmail(), body('password').isLength({ min: 8 }) ],
  validate,
  login
);

export default router;
