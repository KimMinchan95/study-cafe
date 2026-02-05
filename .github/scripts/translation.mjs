import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// workflow-config.json에서 설정 읽기
const configPath = path.join(__dirname, '..', 'workflow-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// 번역할 파일 경로 설정 (input -> output 매핑)
const translatePairs = config['translation-files'].map((file) => ({
    input: path.join(__dirname, '..', '..', file.input),
    output: path.join(__dirname, '..', '..', file.output),
}));

// 단일 파일 처리 함수
const processFile = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        console.log(`처리 중: ${inputPath} -> ${outputPath}`);

        fs.readFile(inputPath, 'utf8', (err, data) => {
            if (err) {
                console.error(
                    `파일을 읽는 중 오류가 발생했습니다 (${inputPath}):`,
                    err
                );
                reject(err);
                return;
            }

            try {
                // JSON 파싱
                const inputJson = JSON.parse(data);

                // JSON 객체 순회
                for (const key in inputJson) {
                    const obj = inputJson[key];
                    // 내부 객체의 속성을 순회
                    for (const prop in obj) {
                        // 각 속성의 값을 해당 속성의 키와 동일하게 변경
                        obj[prop] = prop;
                    }
                }

                // 수정된 JSON 객체를 문자열로 변환
                const outputJsonString = JSON.stringify(inputJson, null, 4);

                // 수정된 JSON을 새 파일로 쓰기
                fs.writeFile(outputPath, outputJsonString, (err) => {
                    if (err) {
                        console.error(
                            `파일을 쓰는 중 오류가 발생했습니다 (${outputPath}):`,
                            err
                        );
                        reject(err);
                        return;
                    }
                    console.log(`✅ 성공적으로 생성됨: ${outputPath}`);
                    resolve();
                });
            } catch (error) {
                console.error(
                    `JSON을 파싱하는 중 오류가 발생했습니다 (${inputPath}):`,
                    error
                );
                reject(error);
            }
        });
    });
};

// 모든 파일 처리
const processAllFiles = async () => {
    console.log(`총 ${translatePairs.length}개의 파일을 처리합니다...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const pair of translatePairs) {
        try {
            await processFile(pair.input, pair.output);
            successCount++;
        } catch (error) {
            errorCount++;
        }
    }

    console.log(`\n📊 처리 완료:`);
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
};

// 실행
processAllFiles();
