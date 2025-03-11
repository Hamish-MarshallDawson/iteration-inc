// Import shared Prisma client
import { prisma } from "./globalPrisma.js";

export default async function handler(req, res) {

  try {
    // Extract the user's info from the request body
    const { firstName, lastName, email, password } = req.body;

    // Insert the new user into the database
    const newUser = await prisma.Users.create({
      data: {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Password: password,
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
