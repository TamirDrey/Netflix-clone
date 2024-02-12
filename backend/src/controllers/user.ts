import User from "../models/user";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils";
import { Request, Response } from "express";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  const newUser = new User({
    name: name,
    email: email,
    password: bcrypt.hashSync(password),
  });

  const user = await newUser.save();

  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user),
  });
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const { password: passwordFromWebsite, email } = req.body;

  const user = await User.findOne({ email: email });
  if (user && bcrypt.compareSync(passwordFromWebsite, user.password)) {
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user),
    });
  } else {
    res.status(401).send({ message: "Invalid User/Password" });
  }
};
