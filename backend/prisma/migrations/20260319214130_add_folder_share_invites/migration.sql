-- CreateTable
CREATE TABLE "FolderShareInvite" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "folderId" INTEGER NOT NULL,
    "ownerUserId" INTEGER NOT NULL,
    "invitedEmail" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "acceptedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FolderShareInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FolderShareInvite_token_key" ON "FolderShareInvite"("token");

-- AddForeignKey
ALTER TABLE "FolderShareInvite" ADD CONSTRAINT "FolderShareInvite_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FolderShareInvite" ADD CONSTRAINT "FolderShareInvite_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
