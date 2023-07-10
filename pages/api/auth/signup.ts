import { NextApiRequest, NextApiResponse } from "next";
import { connectToMongoDB } from '../../../lib/mongodb';
import User from '../../../models/users';
import { hash } from "bcryptjs";
import { IUser } from "../../../types";
import mongoose from 'mongoose';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await connectToMongoDB();

        if (req.method === "POST") {
            if (!req.body) return res.status(400).json({ error: "Data is missing" });

            const { fullName, email, password } = req.body;

            const userExists = await User.findOne({ email });

            if (userExists) {
                return res.status(409).json({ error: "User exists" });
            } else {
                if (password.length < 6) {
                    return res.status(409).json({ error: "Password must be more than 6 characters" });
                }
                const hashedPassword = await hash(password, 12);

                const data: IUser = {
                    fullName,
                    email,
                    password: hashedPassword,
                    __id: ""
                };

                const createdUser = await User.create(data);

                const user = {
                    email: createdUser.email,
                    fullName: createdUser.fullName,
                    __id: createdUser.__id
                };

                return res.status(201).json({
                    success: true,
                    user
                });
            }
        } else {
            res.status(405).json({ error: "Method Not Allowed" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default handler;
