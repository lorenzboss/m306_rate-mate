-- CreateTable
CREATE TABLE "User" (
    "UserID" TEXT NOT NULL,
    "Role" INTEGER NOT NULL,
    "EMail" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Salt" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "Review" (
    "ReviewID" TEXT NOT NULL,
    "FKReceiverId" TEXT NOT NULL,
    "FKOwnerId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("ReviewID")
);

-- CreateTable
CREATE TABLE "Rating" (
    "RatingID" TEXT NOT NULL,
    "Rating" INTEGER NOT NULL,
    "FKReviewId" TEXT NOT NULL,
    "FKAspectId" TEXT NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("RatingID")
);

-- CreateTable
CREATE TABLE "Aspect" (
    "AspectID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,

    CONSTRAINT "Aspect_pkey" PRIMARY KEY ("AspectID")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttempt" TIMESTAMP(3),
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_EMail_key" ON "User"("EMail");

-- CreateIndex
CREATE INDEX "LoginAttempt_username_ip_idx" ON "LoginAttempt"("username", "ip");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_FKReceiverId_fkey" FOREIGN KEY ("FKReceiverId") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_FKOwnerId_fkey" FOREIGN KEY ("FKOwnerId") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_FKReviewId_fkey" FOREIGN KEY ("FKReviewId") REFERENCES "Review"("ReviewID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_FKAspectId_fkey" FOREIGN KEY ("FKAspectId") REFERENCES "Aspect"("AspectID") ON DELETE RESTRICT ON UPDATE CASCADE;
