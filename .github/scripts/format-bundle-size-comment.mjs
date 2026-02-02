import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

const SIZE_LIMIT_RESULTS = 'apps/web/size-limit-results.json';
const NEXT_BUILD_DIR = 'apps/web/.next';

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatBundleSizeComment() {
    let comment = '## 📦 번들 크기 분석\n\n';

    try {
        // size-limit 결과가 있으면 우선 사용
        const sizeLimitPath = join(process.cwd(), SIZE_LIMIT_RESULTS);
        if (existsSync(sizeLimitPath)) {
            const sizeLimitResults = JSON.parse(
                readFileSync(sizeLimitPath, 'utf-8')
            );

            if (sizeLimitResults && sizeLimitResults.length > 0) {
                comment += '### size-limit 분석 결과\n\n';
                comment += '| 번들 | 크기 | 한계 | 상태 |\n';
                comment += '|------|------|------|------|\n';

                let allPassed = true;
                sizeLimitResults.forEach((result) => {
                    const size = formatBytes(result.size);
                    const limit = formatBytes(result.limit);
                    const passed = result.passed;
                    const status = passed ? '✅' : '❌';
                    allPassed = allPassed && passed;

                    comment += `| ${result.name || result.path} | ${size} | ${limit} | ${status} |\n`;
                });

                comment += '\n';
                if (!allPassed) {
                    comment +=
                        '⚠️ **일부 번들이 크기 제한을 초과했습니다.**\n\n';
                } else {
                    comment +=
                        '✅ **모든 번들이 크기 제한 내에 있습니다.**\n\n';
                }
            }
        }

        // 추가로 전체 빌드 크기 정보 제공
        const buildDir = join(process.cwd(), NEXT_BUILD_DIR);
        if (existsSync(buildDir)) {
            const getDirectorySize = (dirPath) => {
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
            };

            const totalSize = getDirectorySize(buildDir);
            comment += `### 전체 빌드 크기\n\n`;
            comment += `**총 빌드 크기**: ${formatBytes(totalSize)}\n\n`;

            // 주요 디렉토리별 크기 분석
            const staticDir = join(buildDir, 'static');
            if (existsSync(staticDir)) {
                const staticSize = getDirectorySize(staticDir);
                comment += `- **Static assets**: ${formatBytes(staticSize)}\n`;
            }
        } else if (!existsSync(join(process.cwd(), SIZE_LIMIT_RESULTS))) {
            comment +=
                '⚠️ 빌드 디렉토리 또는 size-limit 결과를 찾을 수 없습니다.\n';
        }
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
