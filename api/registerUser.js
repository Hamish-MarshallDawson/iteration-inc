// Import shared Prisma client
import { prisma } from "./globalPrisma.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {

  try {
    // Extract the user's info from the request body
    const { firstName, lastName, email, password } = req.body;

    // Hash the password before store it to database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await prisma.Users.create({
      data: {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Password: hashedPassword,
        EnergyGoal: 100,
        UserType: "Home_Dweller", // Default user type
      },
    });

    // If insertion success, return a 200 response 
    res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (error) {
    // If error happened, return a generic 500 Internal Server Error response to the client
    console.error("Database Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
