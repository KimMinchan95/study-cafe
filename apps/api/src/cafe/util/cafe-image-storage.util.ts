import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

/** ServeStatic이 제공하는 URL prefix (app.module의 serveRoot) */
export const CAFE_IMAGES_URL_PREFIX = '/cafe-images';

/**
 * 업로드 파일 저장 루트 (app.module의 UPLOADS_ROOT와 동일)
 * - 로컬: {api 프로젝트 루트}/uploads (예: apps/api/uploads)
 * - Docker: /usr/src/app/apps/api/uploads (WORKDIR 기준)
 */
function getUploadsRoot(): string {
    return join(process.cwd(), 'uploads');
}

/**
 * 카페 이미지 1개를 디스크에 저장하고 DB용 메타데이터 반환
 */
export function saveCafeImage(
    cafeId: bigint,
    file: Express.Multer.File,
): { imgSrc: string; originName: string; identifiedName: string; extensions: string } {
    const originalname = file.originalname ?? 'image';
    const ext = getSafeExtension(originalname);
    const identifiedName = `${randomUUID()}.${ext}`;
    const dir = join(getUploadsRoot(), 'cafe', String(cafeId));
    mkdirSync(dir, { recursive: true });
    const filePath = join(dir, identifiedName);
    writeFileSync(filePath, file.buffer);

    const imgSrc = `${CAFE_IMAGES_URL_PREFIX}/cafe/${cafeId}/${identifiedName}`;
    const originName = originalname;

    return {
        imgSrc,
        originName,
        identifiedName,
        extensions: ext,
    };
}

/** 확장자 추출 (최대 10자, schema VarChar(10)) */
function getSafeExtension(originalname: string | undefined): string {
    if (!originalname || !originalname.includes('.')) return 'bin';
    const ext = originalname.slice(originalname.lastIndexOf('.') + 1);
    return ext.slice(0, 10).toLowerCase() || 'bin';
}
