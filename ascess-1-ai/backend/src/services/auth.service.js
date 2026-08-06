import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { userQueries } from '../supabase/queries.js';
import { ApiError } from '../utils/response.js';

export const registerUser = async ({ email, password, fullName }) => {
  const existingUser = await userQueries.findByEmail(email);
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists.');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await userQueries.create({
    email,
    password_hash: passwordHash,
    full_name: fullName,
  });

  const token = generateToken(newUser);
  return { user: sanitizeUser(newUser), token };
};

export const loginUser = async ({ email, password }) => {
  const user = await userQueries.findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid email or password credentials.');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password credentials.');
  }

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

const sanitizeUser = (user) => {
  const { password_hash, ...rest } = user;
  return rest;
};
