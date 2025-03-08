-- CreateEnum
CREATE TYPE "Action" AS ENUM ('Turn On', 'Turn Off');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('Once', 'Daily', 'Weekly', 'Monthly');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Online', 'Offline', 'Defective');

-- CreateEnum
CREATE TYPE "User Type" AS ENUM ('Home Dweller', 'Home Manager', 'Admin');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Home Dweller', 'Home Manager', 'Admin');

-- CreateEnum
CREATE TYPE "action" AS ENUM ('Turn On', 'Turn Off');

-- CreateEnum
CREATE TYPE "devicetype" AS ENUM ('Light', 'Thermostat', 'Robot', 'Speaker', 'Coffee Machine', 'Other');

-- CreateEnum
CREATE TYPE "freq" AS ENUM ('Once', 'Daily', 'Weekly', 'Monthly');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('Online', 'Offline', 'Defective');

-- CreateEnum
CREATE TYPE "usertype" AS ENUM ('Home Dweller', 'Home Manager', 'Admin');

-- CreateTable
CREATE TABLE "Test2" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Test2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Devices" (
    "DeviceID" SERIAL NOT NULL,
    "UserID" INTEGER,
    "DeviceName" VARCHAR(100),
    "DeviceType" "devicetype",
    "Status" "status",
    "EnergyUsed" TEXT,

    CONSTRAINT "Devices_pkey" PRIMARY KEY ("DeviceID")
);

-- CreateTable
CREATE TABLE "EnergyUse" (
    "EnergyUseID" SERIAL NOT NULL,
    "DeviceID" INTEGER,
    "UserID" INTEGER,
    "Timestamp" TIMESTAMP(6),
    "EnergyUsed" DECIMAL,

    CONSTRAINT "Energy Use_pkey" PRIMARY KEY ("EnergyUseID")
);

-- CreateTable
CREATE TABLE "Recommendations" (
    "RecID" SERIAL NOT NULL,
    "UserID" INTEGER,
    "DeviceID" INTEGER,
    "DeviceConditions" TEXT,
    "EnvConditions" TEXT,
    "SuggestedAction" TEXT,

    CONSTRAINT "Recommendations_pkey" PRIMARY KEY ("RecID")
);

-- CreateTable
CREATE TABLE "Rooms" (
    "RoomID" SERIAL NOT NULL,
    "UserID" INTEGER,
    "RoomName" VARCHAR(100),
    "DeviceID" INTEGER,
    "DeviceName" VARCHAR(50),

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("RoomID")
);

-- CreateTable
CREATE TABLE "Schedules" (
    "ScheduleID" SERIAL NOT NULL,
    "DeviceID" INTEGER,
    "UserID" INTEGER,
    "Frequency" "freq",
    "StartTime" TIMESTAMP(6),
    "EndTime" TIMESTAMP(6),

    CONSTRAINT "Schedules_pkey" PRIMARY KEY ("ScheduleID")
);

-- CreateTable
CREATE TABLE "SecurityLogs" (
    "LogID" SERIAL NOT NULL,
    "UserID" INTEGER,
    "EventDescription" TEXT,
    "Timestamp" TIMESTAMP(6),

    CONSTRAINT "Security Logs_pkey" PRIMARY KEY ("LogID")
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "ActivityID" SERIAL NOT NULL,
    "UserID" INTEGER,
    "DeviceID" TEXT,
    "Timestamp" TIMESTAMP(6),
    "Action" "action",

    CONSTRAINT "User Activity_pkey" PRIMARY KEY ("ActivityID")
);

-- CreateTable
CREATE TABLE "Users" (
    "UserID" SERIAL NOT NULL,
    "FirstName" VARCHAR(25) NOT NULL,
    "LastName" VARCHAR(32) NOT NULL,
    "Email" VARCHAR(100) NOT NULL,
    "Password" VARCHAR(100),
    "EnergyGoal" DECIMAL,
    "UserType" "usertype",

    CONSTRAINT "Uses_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "Usertest" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Usertest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Test2_email_key" ON "Test2"("email");

-- AddForeignKey
ALTER TABLE "Devices" ADD CONSTRAINT "UserID" FOREIGN KEY ("UserID") REFERENCES "Users"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EnergyUse" ADD CONSTRAINT "DeviceID" FOREIGN KEY ("DeviceID") REFERENCES "Devices"("DeviceID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EnergyUse" ADD CONSTRAINT "UserID" FOREIGN KEY ("UserID") REFERENCES "Users"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Recommendations" ADD CONSTRAINT "DeviceID" FOREIGN KEY ("DeviceID") REFERENCES "Devices"("DeviceID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Recommendations" ADD CONSTRAINT "UserID" FOREIGN KEY ("UserID") REFERENCES "Users"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "DeviceID" FOREIGN KEY ("DeviceID") REFERENCES "Devices"("DeviceID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "UserID" FOREIGN KEY ("UserID") REFERENCES "Users"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Schedules" ADD CONSTRAINT "DeviceID" FOREIGN KEY ("DeviceID") REFERENCES "Devices"("DeviceID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Schedules" ADD CONSTRAINT "UserID" FOREIGN KEY ("UserID") REFERENCES "Users"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SecurityLogs" ADD CONSTRAINT "constraint_1" FOREIGN KEY ("UserID") REFERENCES "Users"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserID" FOREIGN KEY ("UserID") REFERENCES "Users"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION;
