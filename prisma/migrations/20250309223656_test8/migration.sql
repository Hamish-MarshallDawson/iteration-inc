-- CreateTable
CREATE TABLE "Test8" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Test8_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test6" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Test6_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test7" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Test7_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Test8_email_key" ON "Test8"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Test6_email_key" ON "Test6"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Test7_email_key" ON "Test7"("email");
