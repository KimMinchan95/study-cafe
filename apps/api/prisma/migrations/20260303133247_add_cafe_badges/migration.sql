-- CreateTable
CREATE TABLE "cafe_badges" (
    "badge_id" BIGSERIAL NOT NULL,
    "cafe_id" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "bg_color" VARCHAR(10) NOT NULL DEFAULT '#ffffff',
    "text_color" VARCHAR(10) NOT NULL DEFAULT '#000000',

    CONSTRAINT "cafe_badges_pkey" PRIMARY KEY ("badge_id")
);

-- AddForeignKey
ALTER TABLE "cafe_badges" ADD CONSTRAINT "cafe_badges_cafe_id_fkey" FOREIGN KEY ("cafe_id") REFERENCES "cafe"("cafe_id") ON DELETE RESTRICT ON UPDATE CASCADE;
