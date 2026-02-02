import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

const SIZE_LIMIT_RESULTS = 'apps/web/size-limit-results.txt';
const NEXT_BUILD_DIR = 'apps/web/.next';

function parseSize(sizeStr) {
    // "50.08 KB" -> bytes
    const match = sizeStr.match(/([\d.]+)\s*(B|KB|MB|GB)/i);
    if (!match) return 0;
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    const multipliers = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
    };
    return value * (multipliers[unit] || 1);
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function parseSizeLimitOutput(output) {
    const results = [];
    const lines = output.split('\n');

    let currentBundle = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // 번들 이름 찾기 (예: "App bundle" 또는 경로)
        if (
            line &&
            !line.includes('Size:') &&
            !line.includes('Limit:') &&
            !line.includes('✅') &&
            !line.includes('❌') &&
            !line.includes('passed') &&
            !line.includes('exceeded') &&
            line !== ''
        ) {
            // 이전 번들 저장
            if (currentBundle && currentBundle.size && currentBundle.limit) {
                results.push(currentBundle);
            }
            currentBundle = {
                name: line,
                size: null,
                limit: null,
                passed: null,
            };
        }

        // Size 추출
        const sizeMatch = line.match(/Size:\s*([\d.]+\s*(?:B|KB|MB|GB))/i);
        if (sizeMatch && currentBundle) {
            currentBundle.size = parseSize(sizeMatch[1]);
        }

        // Limit 추출
        const limitMatch = line.match(/Limit:\s*([\d.]+\s*(?:B|KB|MB|GB))/i);
        if (limitMatch && currentBundle) {
            currentBundle.limit = parseSize(limitMatch[1]);
        }

        // 통과 여부 확인
        if (line.includes('✅') || line.includes('passed')) {
            if (currentBundle) currentBundle.passed = true;
        } else if (line.includes('❌') || line.includes('exceeded')) {
            if (currentBundle) currentBundle.passed = false;
        }
    }

    // 마지막 번들 저장
    if (currentBundle && currentBundle.size && currentBundle.limit) {
        results.push(currentBundle);
    }

    return results;
}

function formatBundleSizeComment() {
    let comment = '## 📦 번들 크기 분석\n\n';

    try {
        // size-limit 텍스트 결과 파싱
        const sizeLimitPath = join(process.cwd(), SIZE_LIMIT_RESULTS);
        if (existsSync(sizeLimitPath)) {
            const sizeLimitOutput = readFileSync(sizeLimitPath, 'utf-8');

            // size-limit 출력이 있는지 확인
            if (sizeLimitOutput.trim().length > 0) {
                const results = parseSizeLimitOutput(sizeLimitOutput);

                if (results.length > 0) {
                    comment += '### size-limit 분석 결과\n\n';
                    comment += '| 번들 | 크기 | 한계 | 상태 |\n';
                    comment += '|------|------|------|------|\n';

                    let allPassed = true;
                    results.forEach((result) => {
                        const size = formatBytes(result.size);
                        const limit = formatBytes(result.limit);
                        const passed =
                            result.passed !== null ? result.passed : true;
                        const status = passed ? '✅' : '❌';
                        allPassed = allPassed && passed;

                        comment += `| ${result.name} | ${size} | ${limit} | ${status} |\n`;
                    });

                    comment += '\n';
                    if (!allPassed) {
                        comment +=
                            '⚠️ **일부 번들이 크기 제한을 초과했습니다.**\n\n';
                    } else {
                        comment +=
                            '✅ **모든 번들이 크기 제한 내에 있습니다.**\n\n';
                    }
                } else {
                    // 파싱 실패 시 원본 출력 포함
                    comment += '### size-limit 출력\n\n';
                    comment += '```\n';
                    comment += sizeLimitOutput.substring(0, 1000); // 처음 1000자만
                    comment += '\n```\n\n';
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

        // size-limit 결과가 없어도 빌드 크기는 표시
        if (!existsSync(join(process.cwd(), SIZE_LIMIT_RESULTS))) {
            comment +=
                '\n> 💡 size-limit 결과를 찾을 수 없습니다. 빌드 크기만 표시합니다.\n';
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
