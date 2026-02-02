import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const LIGHTHOUSE_RESULTS_DIR = '.lighthouseci';

function findLighthouseReport(resultsPath) {
    if (!existsSync(resultsPath)) {
        return null;
    }

    const files = readdirSync(resultsPath);

    // Lighthouse CI는 보통 다음과 같은 구조를 가집니다:
    // - .lighthouseci/lhr-*.json (Lighthouse 리포트)
    // - .lighthouseci/links.json (링크 정보)
    // - .lighthouseci/assertion-results.json (검증 결과)

    // 1. lhr-*.json 파일 우선 찾기 (Lighthouse 리포트)
    const lhrFiles = files
        .filter((f) => f.startsWith('lhr-') && f.endsWith('.json'))
        .map((f) => {
            const filePath = join(resultsPath, f);
            const stat = statSync(filePath);
            return { name: f, path: filePath, size: stat.size };
        })
        .sort((a, b) => b.size - a.size);

    if (lhrFiles.length > 0) {
        try {
            const content = readFileSync(lhrFiles[0].path, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            console.error(`파일 파싱 실패: ${lhrFiles[0].name}`, error.message);
        }
    }

    // 2. report.json 파일 찾기 (대체 형식)
    const reportFiles = files
        .filter((f) => f.includes('report') && f.endsWith('.json'))
        .map((f) => {
            const filePath = join(resultsPath, f);
            const stat = statSync(filePath);
            return { name: f, path: filePath, size: stat.size };
        })
        .sort((a, b) => b.size - a.size);

    if (reportFiles.length > 0) {
        try {
            const content = readFileSync(reportFiles[0].path, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            console.error(
                `파일 파싱 실패: ${reportFiles[0].name}`,
                error.message
            );
        }
    }

    // 3. 가장 큰 JSON 파일 찾기 (fallback)
    const jsonFiles = files
        .filter(
            (f) =>
                f.endsWith('.json') &&
                !f.includes('links') &&
                !f.includes('assertion') &&
                !f.includes('manifest')
        )
        .map((f) => {
            const filePath = join(resultsPath, f);
            const stat = statSync(filePath);
            return { name: f, path: filePath, size: stat.size };
        })
        .sort((a, b) => b.size - a.size);

    if (jsonFiles.length > 0) {
        try {
            const content = readFileSync(jsonFiles[0].path, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            console.error(
                `파일 파싱 실패: ${jsonFiles[0].name}`,
                error.message
            );
        }
    }

    return null;
}

function getReportLink(resultsPath) {
    const linksPath = join(resultsPath, 'links.json');
    if (!existsSync(linksPath)) {
        return null;
    }

    try {
        const content = readFileSync(linksPath, 'utf-8');
        const links = JSON.parse(content);
        return links.report || links.url || null;
    } catch (error) {
        console.error('links.json 파싱 실패:', error.message);
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

        const result = findLighthouseReport(resultsPath);

        if (!result) {
            comment += '⚠️ Lighthouse 리포트를 찾을 수 없습니다.\n';
            const files = readdirSync(resultsPath);
            comment += `\n발견된 파일: ${files.join(', ')}\n`;
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

        const getScore = (category) => {
            const score = scores[category]?.score;
            return score !== undefined && score !== null
                ? Math.round(score * 100)
                : null;
        };

        const performance = getScore('performance');
        const accessibility = getScore('accessibility');
        const bestPractices = getScore('best-practices');
        const seo = getScore('seo');

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
                {
                    topLevelKeys: Object.keys(result).slice(0, 10),
                    hasCategories: !!result.categories,
                    hasLhr: !!result.lhr,
                    hasReport: !!result.report,
                },
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
        const reportLink =
            getReportLink(resultsPath) ||
            result.artifacts?.[0] ||
            result.links?.report ||
            result.links?.url;

        if (reportLink) {
            comment += `> 📊 [상세 리포트 보기](${reportLink})\n`;
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
