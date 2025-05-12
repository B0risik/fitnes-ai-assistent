import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';
import User   from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Пользователь существует' });

    const hash  = await bcrypt.hash(password, 10);
    const user  = await User.create({ email, password: hash });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Неверные данные' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Неверные данные' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}
