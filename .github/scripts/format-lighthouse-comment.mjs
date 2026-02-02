import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const LIGHTHOUSE_RESULTS_DIR = '.lighthouseci';

function findLighthouseReport(resultsPath) {
    if (!existsSync(resultsPath)) {
        return null;
    }

    const files = readdirSync(resultsPath);

    // .lighthouseci 디렉토리 구조 확인
    // Lighthouse CI는 보통 다음과 같은 구조를 가집니다:
    // - .lighthouseci/lhr-*.json (Lighthouse 리포트)
    // - .lighthouseci/links.json (링크 정보)

    // 가장 큰 JSON 파일 찾기 (보통 리포트가 가장 큼)
    const jsonFiles = files
        .filter((f) => f.endsWith('.json'))
        .map((f) => {
            const filePath = join(resultsPath, f);
            const stat = statSync(filePath);
            return { name: f, path: filePath, size: stat.size };
        })
        .sort((a, b) => b.size - a.size);

    if (jsonFiles.length === 0) {
        return null;
    }

    // links.json이 아닌 가장 큰 파일 선택
    const reportFile =
        jsonFiles.find((f) => !f.name.includes('links')) || jsonFiles[0];

    try {
        const content = readFileSync(reportFile.path, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`파일 파싱 실패: ${reportFile.name}`, error.message);
        return null;
    }
}

function formatLighthouseComment() {
    const resultsPath = join(process.cwd(), LIGHTHOUSE_RESULTS_DIR);
    let comment = '## 🚀 Lighthouse 성능 점수\n\n';

    try {
        if (!existsSync(resultsPath)) {
            comment += '⚠️ Lighthouse 결과 디렉토리를 찾을 수 없습니다.\n';
            comment += `경로: ${resultsPath}\n`;
            return comment;
        }

        const files = readdirSync(resultsPath);
        comment += `디버그: 발견된 파일: ${files.join(', ')}\n\n`;

        const result = findLighthouseReport(resultsPath);

        if (!result) {
            comment += '⚠️ Lighthouse 리포트를 찾을 수 없습니다.\n';
            return comment;
        }

        // Lighthouse 리포트 구조 확인
        // Lighthouse 리포트는 보통 다음과 같은 구조를 가집니다:
        // { categories: { performance: { score: 0.95 }, ... } }

        let scores = {};
        if (result.categories) {
            scores = result.categories;
        } else if (result.lhr && result.lhr.categories) {
            // 일부 Lighthouse CI 버전은 lhr 안에 결과를 저장
            scores = result.lhr.categories;
        } else if (result.report && result.report.categories) {
            scores = result.report.categories;
        }

        const performance = scores.performance?.score
            ? Math.round(scores.performance.score * 100)
            : scores.performance?.score !== undefined
              ? Math.round(scores.performance.score * 100)
              : null;

        const accessibility = scores.accessibility?.score
            ? Math.round(scores.accessibility.score * 100)
            : scores.accessibility?.score !== undefined
              ? Math.round(scores.accessibility.score * 100)
              : null;

        const bestPractices = scores['best-practices']?.score
            ? Math.round(scores['best-practices'].score * 100)
            : scores['best-practices']?.score !== undefined
              ? Math.round(scores['best-practices'].score * 100)
              : null;

        const seo = scores.seo?.score
            ? Math.round(scores.seo.score * 100)
            : scores.seo?.score !== undefined
              ? Math.round(scores.seo.score * 100)
              : null;

        // 점수가 모두 null이면 디버그 정보 표시
        if (
            performance === null &&
            accessibility === null &&
            bestPractices === null &&
            seo === null
        ) {
            comment += '⚠️ Lighthouse 점수를 추출할 수 없습니다.\n\n';
            comment += '**디버그 정보:**\n';
            comment += '```json\n';
            comment += JSON.stringify(
                Object.keys(result).slice(0, 10),
                null,
                2
            );
            comment += '\n```\n';
            return comment;
        }

        comment += '| 항목 | 점수 |\n';
        comment += '|------|------|\n';
        comment += `| ⚡ Performance | ${performance ?? 'N/A'} |\n`;
        comment += `| ♿ Accessibility | ${accessibility ?? 'N/A'} |\n`;
        comment += `| ✅ Best Practices | ${bestPractices ?? 'N/A'} |\n`;
        comment += `| 🔍 SEO | ${seo ?? 'N/A'} |\n\n`;

        // 리포트 링크 찾기
        if (result.artifacts && result.artifacts.length > 0) {
            comment += `> 📊 [상세 리포트 보기](${result.artifacts[0]})\n`;
        } else if (result.links && result.links.report) {
            comment += `> 📊 [상세 리포트 보기](${result.links.report})\n`;
        }
    } catch (error) {
        comment += `⚠️ 결과 파싱 중 오류: ${error.message}\n`;
        comment += `\n스택: ${error.stack}\n`;
    }

    return comment;
}

// GitHub Actions에서 실행될 때
if (import.meta.url === `file://${process.argv[1]}`) {
    const comment = formatLighthouseComment();
    console.log(comment);
}

export { formatLighthouseComment };
