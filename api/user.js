import { prisma } from "./globalPrisma.js";
// Import the global prisma object  

// Import the bcrypt library
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {

    // Extract the action and data from the request body
    const { action, ...data } = req.body;

    // Switch statement to handle different actions
    switch (action) {
    //----------------------------------------User Registration------------------------------------------------------  
      case "register":

        const hashedPassword = await bcrypt.hash(data.password, 10);  // Hash the password
        
        let machine = await prisma.Machines.findFirst({              // Check if the machine already exists
          where: { MachineSerialCode: data.machineSerialCode },     
        });

        // If the machine does not exist, create a new machine
        if (!machine) {
          machine = await prisma.Machines.create({
            data: {
              MachineSerialCode: data.machineSerialCode,
              MachineName: `${data.firstName}'s ${data.machineName}` || "Unknown Device",
            },
          });
        }

        // Create a new user
        const newUser = await prisma.Users.create({
          data: { 
            FirstName: data.firstName,
            LastName: data.lastName,
            Email: data.email,
            Password: hashedPassword,
            EnergyGoal: 1000,             // Default energy goal
            UserType: "Home_Dweller",     // Default user type
            MachineID: machine.MachineID
        },
        });


        // Log the user registration event
        await prisma.SecurityLogs.create({
          data: {
            UserID: newUser.UserID,
            EventDescription: `New user registered (${newUser.Email})`,
            Timestamp: new Date(),
            MachineID: machine.MachineID
          },
        });

        // Return a success message and the newly created user
        return res.status(201).json({ message: "User registered successfully", user: newUser });


      //----------------------------------------Chcek Email------------------------------------------------------

      case "checkEmail":
        // Check if the email already exists
        const existingUser = await prisma.Users.findFirst({ 
            where: { Email: data.email } 
        });
        // If the email exists, return an error message
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        // If the email does not exist, return a success message
        return res.status(200).json({  message: "Email available" });

      //----------------------------------------Reset Password------------------------------------------------------
      case "resetPassword":
        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

        // Find the user by email
        const user = await prisma.Users.findFirst({
          where: { Email: data.email },
        });
        // Update the user's password
        await prisma.Users.update({
          where: { UserID: user.UserID },
          data: { Password: hashedNewPassword },
        });
        // Log the password reset event
        await prisma.SecurityLogs.create({
          data: {
            UserID: user.UserID,
            EventDescription: `User reset password (${user.Email})`,
            Timestamp: new Date(),
            MachineID: user.MachineID
          },
        });
        // Return a success message
        return res.status(200).json({ message: "Password reset successfully" });

      //----------------------------------------Update Email------------------------------------------------------

      case "updateEmail":
        // Find the user by old email
        const user2 = await prisma.Users.findFirst({
          where: { Email: data.oldEmail },
        });
        // Update the user's email
        await prisma.Users.update({
          where: { UserID: user2.UserID  },
          data: { Email: data.newEmail },
        });
        // Log the email update event
        await prisma.SecurityLogs.create({
          data: {
            UserID: user2.UserID,
            EventDescription: `User updated email from ${data.oldEmail} to ${data.newEmail}`,
            Timestamp: new Date(),
            MachineID: user2.MachineID
          },
        });
        // Return a success message
        return res.status(200).json({ message: "Email updated successfully" });

      //----------------------------------------Fetfch energy goal------------------------------------------------------
      case "getEnergyGoal":
        // Fetch the user's energy goal
        const user3 = await prisma.Users.findUnique({
          where: { UserID: data.userID },
          select: { EnergyGoal: true }
        });
        return res.status(200).json({ energyGoal: user3.EnergyGoal });
      
      //----------------------------------------Set energy goal------------------------------------------------------
      case "updateEnergyGoal":
        await prisma.users.update({
          where: { UserID: data.userID },
          data: { EnergyGoal: data.newEnergyGoal },
        });

        // Log the energy goal update event
        await prisma.SecurityLogs.create({
          data: {
            UserID: data.userID,
            EventDescription: `Energy goal update to ${data.newEnergyGoal } on Profile ID: ${data.userID }`,
            Timestamp: new Date(),
            MachineID: data.machineID
          },
        });
        return res.status(200).json({ message: "Energy goal updated successfully" });

      //----------------------------------------User profile remove------------------------------------------------------ 
      // not use 
      case "removeProfile":
        // Delete all related data for the this user
        await prisma.Devices.deleteMany({ where: { UserID: data.userID } });
        await prisma.UserActivity.deleteMany({ where: { UserID: data.userID } });
        await prisma.Recommendations.deleteMany({ where: { UserID: data.userID } });
        await prisma.Schedules.deleteMany({ where: { UserID: data.userID } });
        await prisma.EnergyUse.deleteMany({ where: { UserID: data.userID} });
        await prisma.SecurityLogs.deleteMany({ where: { UserID: data.userID} });
        await prisma.UserAwards.deleteMany({ where: { UserID: data.userID} });

        // Delete the user profile
        await prisma.Users.delete({
          where: { UserID: data.userID },
        });

        // Log the profile removal event
        await prisma.SecurityLogs.create({
          data: {
            UserID: data.userID,
            EventDescription: `Removed User Profile ID: ${data.userID }`,
            Timestamp: new Date(),
            MachineID: data.machineID
          },
        });
        return res.status(200).json({ message: "Profile removed successfully" });

      //----------------------------------------Default ------------------------------------------------------
      default:
        return res.status(400).json({ message: "Invalid action" });

    }
  } catch (error) {
    
    console.error("Database Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
