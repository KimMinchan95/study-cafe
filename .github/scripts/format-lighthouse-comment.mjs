import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const LIGHTHOUSE_RESULTS_DIR = '.lighthouseci';

function formatLighthouseComment() {
    const resultsPath = join(process.cwd(), LIGHTHOUSE_RESULTS_DIR);
    let comment = '## 🚀 Lighthouse 성능 점수\n\n';

    try {
        if (!existsSync(resultsPath)) {
            comment += '⚠️ Lighthouse 결과 디렉토리를 찾을 수 없습니다.\n';
            return comment;
        }

        const files = readdirSync(resultsPath);
        const jsonFiles = files.filter((f) => f.endsWith('.json'));

        if (jsonFiles.length === 0) {
            comment += '⚠️ Lighthouse 결과 파일을 찾을 수 없습니다.\n';
            return comment;
        }

        const result = JSON.parse(
            readFileSync(join(resultsPath, jsonFiles[0]), 'utf-8')
        );

        const scores = result.categories || {};
        const performance = Math.round((scores.performance?.score || 0) * 100);
        const accessibility = Math.round(
            (scores.accessibility?.score || 0) * 100
        );
        const bestPractices = Math.round(
            (scores['best-practices']?.score || 0) * 100
        );
        const seo = Math.round((scores.seo?.score || 0) * 100);

        comment += '| 항목 | 점수 |\n';
        comment += '|------|------|\n';
        comment += `| ⚡ Performance | ${performance} |\n`;
        comment += `| ♿ Accessibility | ${accessibility} |\n`;
        comment += `| ✅ Best Practices | ${bestPractices} |\n`;
        comment += `| 🔍 SEO | ${seo} |\n\n`;

        if (result.artifacts && result.artifacts.length > 0) {
            comment += `> 📊 [상세 리포트 보기](${result.artifacts[0]})\n`;
        }
    } catch (error) {
        comment += `⚠️ 결과 파싱 중 오류: ${error.message}\n`;
    }

    return comment;
}

// GitHub Actions에서 실행될 때
if (import.meta.url === `file://${process.argv[1]}`) {
    const comment = formatLighthouseComment();
    console.log(comment);
}

export { formatLighthouseComment };
