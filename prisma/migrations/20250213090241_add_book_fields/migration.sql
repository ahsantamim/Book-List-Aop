/*
  Warnings:

  - Made the column `description` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- First, add the columns as nullable
ALTER TABLE "Book" ADD COLUMN "genre" TEXT;
ALTER TABLE "Book" ADD COLUMN "temp_description" TEXT;

-- Update existing records with default values
UPDATE "Book" SET "genre" = 'Uncategorized' WHERE "genre" IS NULL;
UPDATE "Book" SET "temp_description" = COALESCE("description", '') WHERE "temp_description" IS NULL;

-- Drop the old description column
ALTER TABLE "Book" DROP COLUMN "description";

-- Rename the temp_description column
ALTER TABLE "Book" RENAME COLUMN "temp_description" TO "description";

-- Make the columns required
ALTER TABLE "Book" ALTER COLUMN "genre" SET NOT NULL;
ALTER TABLE "Book" ALTER COLUMN "description" SET NOT NULL;
