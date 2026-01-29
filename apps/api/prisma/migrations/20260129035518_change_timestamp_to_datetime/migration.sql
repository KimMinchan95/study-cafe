/*
  Warnings:

  - The `created_at` column on the `accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_at` column on the `accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `last_login_at` column on the `accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `email_verified_at` column on the `accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "name" SET DEFAULT 'USER',
DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3),
DROP COLUMN "last_login_at",
ADD COLUMN     "last_login_at" TIMESTAMP(3),
DROP COLUMN "email_verified_at",
ADD COLUMN     "email_verified_at" TIMESTAMP(3);
