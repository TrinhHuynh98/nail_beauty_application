import express from 'express';
import Product from '../models/Product.js';
import data from '../data.js';
import Users from '../models/User.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.remove({});
  const createProducts = await Product.insertMany(data.products);
  await Users.remove({});
  const createUsers = await Users.insertMany(data.users);
  res.send({ createProducts, createUsers });
});
export default seedRouter;
