-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
