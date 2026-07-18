-- Add fileName column
ALTER TABLE "Review"
ADD COLUMN IF NOT EXISTS "fileName" TEXT;

-- Remove default from status
ALTER TABLE "Review"
ALTER COLUMN "status" DROP DEFAULT;