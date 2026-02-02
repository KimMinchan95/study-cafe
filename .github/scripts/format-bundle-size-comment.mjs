import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

const NEXT_BUILD_DIR = 'apps/web/.next';

function getDirectorySize(dirPath) {
    if (!existsSync(dirPath)) {
        return 0;
    }

    let size = 0;
    const files = readdirSync(dirPath);

    files.forEach((file) => {
        const filePath = join(dirPath, file);
        const stat = statSync(filePath);

        if (stat.isDirectory()) {
            size += getDirectorySize(filePath);
        } else {
            size += stat.size;
        }
    });

    return size;
}

function formatBundleSizeComment() {
    const buildDir = join(process.cwd(), NEXT_BUILD_DIR);
    let comment = '## 📦 번들 크기 분석\n\n';

    try {
        if (!existsSync(buildDir)) {
            comment += '⚠️ 빌드 디렉토리를 찾을 수 없습니다.\n';
            return comment;
        }

        const totalSize = getDirectorySize(buildDir);
        const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
        const sizeInKB = (totalSize / 1024).toFixed(2);

        comment += `**총 빌드 크기**: ${sizeInMB} MB (${sizeInKB} KB)\n\n`;

        // 주요 디렉토리별 크기 분석
        const staticDir = join(buildDir, 'static');
        if (existsSync(staticDir)) {
            const staticSize = getDirectorySize(staticDir);
            const staticMB = (staticSize / 1024 / 1024).toFixed(2);
            comment += `- **Static assets**: ${staticMB} MB\n`;
        }

        comment +=
            '\n> 💡 더 정확한 분석을 원하시면 [size-limit](https://github.com/ai/size-limit) 패키지 사용을 권장합니다.';
    } catch (error) {
        comment += `⚠️ 크기 분석 중 오류: ${error.message}\n`;
    }

    return comment;
}

// GitHub Actions에서 실행될 때
if (import.meta.url === `file://${process.argv[1]}`) {
    const comment = formatBundleSizeComment();
    console.log(comment);
}

export { formatBundleSizeComment };
