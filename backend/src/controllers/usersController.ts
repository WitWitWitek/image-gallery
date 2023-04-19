import { RequestHandler } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { mailOptions, transporter } from "../lib/nodemailer";
import jwt from "jsonwebtoken";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;

interface UserType {
  username: string;
}

export const getAllUsers: RequestHandler = asyncHandler(async (req, res) => {
  const allUsers: UserType[] = await User.find().select("-password");
  if (allUsers?.length === 0) {
    res.status(400).json({ message: "No users found!" });
    return;
  }
  res.status(200).json(allUsers);
});

export const createNewUser: RequestHandler = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    res.status(400).json({ message: "Credentials are required!" });
    return;
  }

  const userExist = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .exec();
  if (userExist) {
    res.status(408).json({ message: "User already exists!" });
    return;
  }

  const userEmailExist = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .exec();
  if (userEmailExist) {
    res
      .status(408)
      .json({ message: "Your email already registered. Try to log in!" });
    return;
  }

  if (!PASSWORD_REGEX.test(password)) {
    res.status(401).json({ message: "Invalid password!" });
    return;
  }

  const hashedPwd = await bcrypt.hash(password, 10);
  const userObject = { username, email, password: hashedPwd };

  const user = await User.create(userObject);

  jwt.sign(
    {
      UserInfo: {
        userId: user._id,
      },
    },
    process.env.EMAIL_SECRET as string,
    { expiresIn: "10m" },
    (err, emailToken) => {
      try {
        transporter.sendMail({
          ...mailOptions(
            email,
            `https://image-gallery-kim0.onrender.com/confirmation/${emailToken}`
          ), // http://localhost:3000
        });
      } catch (err) {
        // dac res blad
        console.log(err);
      }
    }
  );

  if (user) {
    res.status(201).json({
      message: `New user ${username} created. Confirm your account via email.`,
    });
  } else {
    res.status(400).json({ message: "Invalid user data received." });
  }
});

export const confirmUser: RequestHandler = asyncHandler(async (req, res) => {
  const { emailToken } = req.params;
  jwt.verify(
    emailToken,
    process.env.EMAIL_SECRET as string,
    async (err, decoded) => {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return res.status(400).json({ message: "Token expired" });
        } else if (err instanceof jwt.JsonWebTokenError) {
          return res.status(400).json({ message: "Invalid token" });
        }
        return res
          .status(400)
          .json({ message: "Unexpected error occured. Try again." });
      }
      if (typeof decoded === "object" && "UserInfo" in decoded) {
        const { userId } = decoded.UserInfo;
        const userFound = await User.findById(userId);
        if (userFound?.confirmed) {
          return res
            .status(200)
            .json({ message: "User is already confirmed. Please log in." });
        }
        await User.updateOne({ _id: userId }, { $set: { confirmed: true } });
        res.status(200).json({ message: "User confirmed. Please log in." });
      }
    }
  );
});

export const resendConfirmationEmail: RequestHandler = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Credentials are required!" });
      return;
    }

    const user = await User.findOne({ email })
      .collation({ locale: "en", strength: 2 })
      .exec();
    if (!user) {
      res
        .status(408)
        .json({ message: "Your email is not registered. Sign up!" });
      return;
    }

    jwt.sign(
      {
        UserInfo: {
          userId: user._id,
        },
      },
      process.env.EMAIL_SECRET as string,
      { expiresIn: "10m" },
      (err, emailToken) => {
        try {
          transporter.sendMail({
            ...mailOptions(
              email,
              `https://image-gallery-kim0.onrender.com/confirmation/${emailToken}`
            ), //http://localhost:3000
          });
        } catch (err) {
          // dac res blad
          console.log(err);
        }
      }
    );

    res.status(201).json({ message: "Confirmation e-mail has been sent." });
  }
);

export const updateUserPassword: RequestHandler = asyncHandler(
  async (req, res) => {
    const { username, password, newPassword } = req.body;

    if (!username || !password || !newPassword) {
      res.status(400).json({ message: "All fields are required!" });
      return;
    }

    const userExist = await User.findOne({ username }).exec();
    if (!userExist) {
      res.status(404).json({ message: "User doesn't exists" });
      return;
    }

    const pwdsMatch = await bcrypt.compare(password, userExist.password);
    if (!pwdsMatch) {
      res.status(400).json({ message: "Invalid old password!" });
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      res.status(400).json({ message: "Invalid new password!" });
      return;
    }
    const hashedPwd = await bcrypt.hash(newPassword, 10);

    await User.updateOne({ username }, { $set: { password: hashedPwd } });

    res.status(201).json({ message: "Your password has been updated!" });
  }
);
