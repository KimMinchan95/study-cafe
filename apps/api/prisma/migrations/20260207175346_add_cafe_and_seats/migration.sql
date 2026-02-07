-- CreateEnum
CREATE TYPE "SeatState" AS ENUM ('IDLE', 'LOCKED', 'USING');

-- DropIndex
DROP INDEX "accounts_email_idx";

-- CreateTable
CREATE TABLE "cafe" (
    "cafe_id" BIGSERIAL NOT NULL,
    "business_name" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cafe_pkey" PRIMARY KEY ("cafe_id")
);

-- CreateTable
CREATE TABLE "cafe_images" (
    "image_id" BIGSERIAL NOT NULL,
    "cafe_id" BIGINT NOT NULL,
    "img_src" TEXT NOT NULL,
    "origin_name" TEXT NOT NULL,
    "identified_name" TEXT NOT NULL,
    "extensions" VARCHAR(10) NOT NULL,

    CONSTRAINT "cafe_images_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "seats" (
    "seat_id" BIGSERIAL NOT NULL,
    "cafe_id" BIGINT NOT NULL,
    "seat_name" VARCHAR(10) NOT NULL,
    "state" "SeatState" NOT NULL DEFAULT 'IDLE',
    "location" TEXT NOT NULL,
    "seat_number" INTEGER NOT NULL,
    "seat_type" VARCHAR(10) NOT NULL,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("seat_id")
);

-- CreateTable
CREATE TABLE "prices" (
    "price_id" BIGSERIAL NOT NULL,
    "cafe_id" BIGINT NOT NULL,
    "amount_subtotal" DECIMAL(18,2) NOT NULL,
    "amount_tax" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "amount_total" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("price_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cafe_business_name_key" ON "cafe"("business_name");

-- CreateIndex
CREATE UNIQUE INDEX "cafe_images_identified_name_key" ON "cafe_images"("identified_name");

-- AddForeignKey
ALTER TABLE "cafe_images" ADD CONSTRAINT "cafe_images_cafe_id_fkey" FOREIGN KEY ("cafe_id") REFERENCES "cafe"("cafe_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_cafe_id_fkey" FOREIGN KEY ("cafe_id") REFERENCES "cafe"("cafe_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_cafe_id_fkey" FOREIGN KEY ("cafe_id") REFERENCES "cafe"("cafe_id") ON DELETE RESTRICT ON UPDATE CASCADE;
