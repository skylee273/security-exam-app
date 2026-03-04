/**
 * 퀴즈 문제 추출 도구 (API 키 불필요)
 *
 * 사용법:
 * npx ts-node src/scripts/extract-questions.ts
 */

const SITE_URL = process.argv[2] || 'https://qz.cxz.fr/';
const PASSWORD = '1841';
const MAX_QUESTIONS = parseInt(process.argv[3] || '1500');

interface ExtractedQuestion {
  number: number;
  text: string;
  options: string[];
  rawContent: string;
}

async function extractQuestions() {
  const { chromium } = await import('playwright');
  const fs = await import('fs');

  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  📚 정보보안기사 문제 추출 도구                           ║
╠═══════════════════════════════════════════════════════════╣
║  대상: ${SITE_URL.padEnd(43)}║
╚═══════════════════════════════════════════════════════════╝
  `);

  const browser = await chromium.launch({
    headless: true,  // 백그라운드 실행
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  const questions: ExtractedQuestion[] = [];

  try {
    // 1. 사이트 접속
    console.log('📄 사이트 접속 중...');
    await page.goto(SITE_URL);
    await page.waitForLoadState('networkidle');

    // 2. 비밀번호 입력
    console.log('🔑 비밀번호 입력 중...');
    await page.waitForSelector('input', { timeout: 10000 });
    await page.fill('input', PASSWORD);
    await page.keyboard.press('Enter');

    // 퀴즈 페이지 로딩 대기
    await page.waitForTimeout(2000);
    console.log('✅ 로그인 성공!\n');

    // 3. 문제 추출 시작
    let questionNumber = 1;
    let consecutiveErrors = 0;
    const maxErrors = 5;
    const maxQuestions = MAX_QUESTIONS;

    while (questionNumber <= maxQuestions && consecutiveErrors < maxErrors) {
      try {
        // 페이지 내용 가져오기
        const bodyText = await page.evaluate(() => document.body.innerText);

        // 문제 번호와 텍스트 파싱
        const questionMatch = bodyText.match(/(\d+)\.\s*([\s\S]*?)(?=①|$)/);
        const optionsMatch = bodyText.match(/①\s*([\s\S]*?)(?=②|$)/);
        const option2Match = bodyText.match(/②\s*([\s\S]*?)(?=③|$)/);
        const option3Match = bodyText.match(/③\s*([\s\S]*?)(?=④|$)/);
        const option4Match = bodyText.match(/④\s*([\s\S]*?)(?=제출|문항|$)/);

        const currentQuestion = questionMatch ? questionMatch[2].trim() : '';
        const options = [
          optionsMatch ? optionsMatch[1].trim() : '',
          option2Match ? option2Match[1].trim() : '',
          option3Match ? option3Match[1].trim() : '',
          option4Match ? option4Match[1].trim() : '',
        ];

        if (!currentQuestion) {
          console.log(`⚠️ 문제 ${questionNumber}: 문제 텍스트를 찾을 수 없음`);
          consecutiveErrors++;

          // 다른 패턴 시도
          const altMatch = bodyText.match(/문제\s*(\d+)[:\s]*([\s\S]*?)(?=①|1\.|$)/);
          if (altMatch) {
            console.log(`   대체 패턴 발견: ${altMatch[2].substring(0, 30)}...`);
          }

          await page.waitForTimeout(1000);
          continue;
        }

        // 진행 상황 출력
        const progress = Math.round((questionNumber / maxQuestions) * 100);
        console.log(`📝 문제 ${questionNumber}/${maxQuestions} (${progress}%) - ${currentQuestion.substring(0, 40)}...`);

        // 문제 저장
        questions.push({
          number: questionNumber,
          text: currentQuestion,
          options: options.filter(o => o.length > 0),
          rawContent: bodyText.substring(0, 500),
        });

        // 아무 답이나 선택 (1번)하고 다음으로
        await page.keyboard.press('1');
        await page.waitForTimeout(200);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);

        questionNumber++;
        consecutiveErrors = 0;

        // 중간 저장 (50문제마다)
        if (questionNumber % 50 === 0) {
          const tempPath = `./extracted-questions-${questionNumber}.json`;
          fs.writeFileSync(tempPath, JSON.stringify(questions, null, 2));
          console.log(`\n💾 중간 저장: ${tempPath} (${questions.length}개)\n`);
        }

      } catch (error) {
        console.error(`❌ 문제 ${questionNumber} 처리 중 오류:`, error);
        consecutiveErrors++;
        await page.waitForTimeout(2000);
      }
    }

    // 최종 결과 저장
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📊 추출 완료`);
    console.log(`${'═'.repeat(60)}`);
    console.log(`총 추출 문제: ${questions.length}개`);

    const finalPath = `./question-bank-${new Date().toISOString().slice(0, 10)}.json`;
    fs.writeFileSync(finalPath, JSON.stringify({
      metadata: {
        source: SITE_URL,
        extractedAt: new Date().toISOString(),
        totalQuestions: questions.length,
      },
      questions
    }, null, 2));

    console.log(`\n💾 최종 저장: ${finalPath}`);

    // 처음 5개 문제 미리보기
    console.log(`\n📋 문제 미리보기 (처음 5개):`);
    questions.slice(0, 5).forEach(q => {
      console.log(`\n[${q.number}] ${q.text.substring(0, 60)}...`);
      q.options.forEach((opt, i) => {
        console.log(`   ${i + 1}) ${opt.substring(0, 40)}...`);
      });
    });

  } catch (error) {
    console.error('🚨 치명적 오류:', error);

    // 에러 발생해도 지금까지 수집한 것 저장
    if (questions.length > 0) {
      const errorPath = `./question-bank-partial-${Date.now()}.json`;
      const fs = await import('fs');
      fs.writeFileSync(errorPath, JSON.stringify(questions, null, 2));
      console.log(`\n💾 부분 저장: ${errorPath} (${questions.length}개)`);
    }
  }

  await browser.close();
  return questions;
}

extractQuestions().catch(console.error);
