/**
 * 정보보안기사 모의고사 자동 풀이 도구
 * 대상: https://qz.cxz.fr/2026/
 *
 * 사용법:
 * npm install playwright @anthropic-ai/sdk
 * npx playwright install chromium
 * ANTHROPIC_API_KEY=sk-xxx npx ts-node src/scripts/cxz-solver.ts
 */

import Anthropic from '@anthropic-ai/sdk';

const SITE_URL = 'https://qz.cxz.fr/2026/';
const PASSWORD = '1841';
const TOTAL_QUESTIONS = 320;

interface QuizResult {
  questionNumber: number;
  questionText: string;
  options: string[];
  selectedAnswer: number;
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
  timestamp: string;
}

// Claude API로 정답 분석
async function analyzeWithClaude(
  client: Anthropic,
  questionNumber: number,
  questionText: string,
  options: string[]
): Promise<{ answer: number; reasoning: string; confidence: 'high' | 'medium' | 'low' }> {

  const prompt = `당신은 정보보안기사 시험 전문가입니다. 20년간 기출문제를 분석한 경험이 있습니다.

다음 문제의 정답을 분석하세요:

[문제 ${questionNumber}]
${questionText}

[선택지]
① ${options[0] || ''}
② ${options[1] || ''}
③ ${options[2] || ''}
④ ${options[3] || ''}

정답 분석 후 반드시 다음 JSON 형식으로만 응답하세요:
{
  "answer": 1,
  "reasoning": "정답 이유를 간단히 설명",
  "confidence": "high"
}

- answer: 1, 2, 3, 4 중 하나
- confidence: "high"(확실), "medium"(대체로 확실), "low"(불확실)`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const jsonMatch = content.text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      console.log('⚠️ JSON 파싱 실패, 기본값 사용');
      return { answer: 1, reasoning: 'JSON 파싱 실패', confidence: 'low' };
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Claude API 오류:', error);
    return { answer: 1, reasoning: 'API 오류', confidence: 'low' };
  }
}

// 메인 함수
async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error(`
╔═══════════════════════════════════════════════════════════╗
║  ❌ ANTHROPIC_API_KEY 환경변수가 필요합니다              ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  실행 방법:                                               ║
║  ANTHROPIC_API_KEY=sk-ant-xxx npx ts-node \\              ║
║    src/scripts/cxz-solver.ts                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
    process.exit(1);
  }

  // Playwright 동적 import
  const { chromium } = await import('playwright');
  const fs = await import('fs');

  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  🔐 정보보안기사 모의고사 자동 풀이 도구                  ║
╠═══════════════════════════════════════════════════════════╣
║  대상: ${SITE_URL.padEnd(43)}║
║  총 문제: ${String(TOTAL_QUESTIONS).padEnd(42)}║
╚═══════════════════════════════════════════════════════════╝
  `);

  // Claude 클라이언트 초기화
  const client = new Anthropic({ apiKey });

  // 브라우저 시작
  console.log('🚀 브라우저 시작...');
  const browser = await chromium.launch({
    headless: false,  // 화면 보이게
    slowMo: 100       // 동작 속도 조절 (ms)
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // 결과 저장 배열
  const results: QuizResult[] = [];
  let correctCount = 0;
  let wrongCount = 0;

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

    // 3. 문제 풀이 시작
    let questionNumber = 1;
    let consecutiveErrors = 0;
    const maxErrors = 5;

    while (questionNumber <= TOTAL_QUESTIONS && consecutiveErrors < maxErrors) {
      try {
        // 페이지 내용 가져오기
        const pageContent = await page.content();

        // 문제 텍스트 추출 (페이지 구조에 따라 조정 필요)
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
          await page.waitForTimeout(1000);
          continue;
        }

        // 진행 상황 출력
        const progress = Math.round((questionNumber / TOTAL_QUESTIONS) * 100);
        console.log(`\n${'─'.repeat(60)}`);
        console.log(`📝 문제 ${questionNumber}/${TOTAL_QUESTIONS} (${progress}%)`);
        console.log(`${'─'.repeat(60)}`);
        console.log(`Q: ${currentQuestion.substring(0, 70)}${currentQuestion.length > 70 ? '...' : ''}`);

        // Claude로 정답 분석
        const analysis = await analyzeWithClaude(client, questionNumber, currentQuestion, options);

        const confidenceEmoji = {
          high: '🟢',
          medium: '🟡',
          low: '🔴'
        }[analysis.confidence];

        console.log(`\n${confidenceEmoji} AI 분석: ${analysis.answer}번 (${analysis.confidence})`);
        console.log(`   이유: ${analysis.reasoning.substring(0, 60)}...`);

        // 정답 입력 (1-4)
        await page.keyboard.press(String(analysis.answer) as '1' | '2' | '3' | '4');
        await page.waitForTimeout(300);

        // 제출 (Enter)
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);

        // 결과 저장
        results.push({
          questionNumber,
          questionText: currentQuestion,
          options,
          selectedAnswer: analysis.answer,
          reasoning: analysis.reasoning,
          confidence: analysis.confidence,
          timestamp: new Date().toISOString(),
        });

        // 결과 확인 (페이지에서 정답/오답 표시 확인)
        const resultText = await page.evaluate(() => document.body.innerText);
        if (resultText.includes('정답') || resultText.includes('correct')) {
          correctCount++;
          console.log(`   ✅ 정답!`);
        } else if (resultText.includes('오답') || resultText.includes('wrong')) {
          wrongCount++;
          console.log(`   ❌ 오답`);
        }

        // 다음 문제로
        questionNumber++;
        consecutiveErrors = 0;

        // API 속도 제한 방지
        await page.waitForTimeout(1000);

        // 중간 저장 (10문제마다)
        if (questionNumber % 10 === 0) {
          const tempPath = `./quiz-progress-${Date.now()}.json`;
          fs.writeFileSync(tempPath, JSON.stringify(results, null, 2));
          console.log(`\n💾 중간 저장: ${tempPath}`);
        }

      } catch (error) {
        console.error(`❌ 문제 ${questionNumber} 처리 중 오류:`, error);
        consecutiveErrors++;
        await page.waitForTimeout(2000);
      }
    }

    // 최종 결과 출력
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📊 최종 결과`);
    console.log(`${'═'.repeat(60)}`);
    console.log(`총 문제: ${results.length}개`);
    console.log(`정답: ${correctCount}개`);
    console.log(`오답: ${wrongCount}개`);

    if (results.length > 0) {
      const accuracy = ((correctCount / results.length) * 100).toFixed(1);
      console.log(`정답률: ${accuracy}%`);
    }

    // 확신도별 통계
    const highConf = results.filter(r => r.confidence === 'high').length;
    const medConf = results.filter(r => r.confidence === 'medium').length;
    const lowConf = results.filter(r => r.confidence === 'low').length;

    console.log(`\n확신도 분포:`);
    console.log(`  🟢 높음: ${highConf}개`);
    console.log(`  🟡 중간: ${medConf}개`);
    console.log(`  🔴 낮음: ${lowConf}개 (검토 필요)`);

    // 최종 결과 저장
    const finalPath = `./quiz-final-${new Date().toISOString().slice(0, 10)}.json`;
    fs.writeFileSync(finalPath, JSON.stringify({
      summary: {
        totalQuestions: results.length,
        correct: correctCount,
        wrong: wrongCount,
        accuracy: correctCount / results.length,
        confidenceDistribution: { high: highConf, medium: medConf, low: lowConf }
      },
      results
    }, null, 2));

    console.log(`\n💾 최종 결과 저장: ${finalPath}`);

    // 낮은 확신도 문제 목록
    if (lowConf > 0) {
      console.log(`\n⚠️ 검토가 필요한 문제 (확신도 낮음):`);
      results
        .filter(r => r.confidence === 'low')
        .slice(0, 10)
        .forEach(r => {
          console.log(`  - 문제 ${r.questionNumber}: ${r.questionText.substring(0, 40)}...`);
        });
    }

  } catch (error) {
    console.error('🚨 치명적 오류:', error);
  }

  console.log('\n브라우저를 닫으려면 아무 키나 누르세요...');
  await page.waitForTimeout(60000 * 10); // 10분 대기

  await browser.close();
}

main().catch(console.error);
