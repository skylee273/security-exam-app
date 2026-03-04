/**
 * 정보보안기사 모의고사 자동 풀이 도구
 *
 * 사용법:
 * npx ts-node src/scripts/auto-solver.ts "https://example.com/quiz"
 */

import Anthropic from '@anthropic-ai/sdk';

// Playwright는 동적 import (설치 필요)
// npm install playwright @anthropic-ai/sdk

interface Question {
  number: number;
  text: string;
  options: string[];
}

interface Answer {
  questionNumber: number;
  selectedOption: number;
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
}

interface QuizResult {
  question: Question;
  answer: Answer;
  isCorrect?: boolean;
  correctAnswer?: number;
}

// Claude API로 정답 분석
async function analyzeQuestion(
  client: Anthropic,
  question: Question
): Promise<Answer> {
  const prompt = `당신은 정보보안기사 시험 전문가입니다.

다음 문제의 정답을 분석하세요:

문제 ${question.number}:
${question.text}

선택지:
${question.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}

반드시 다음 JSON 형식으로만 응답하세요:
{
  "selectedOption": 1,
  "reasoning": "정답 이유 설명",
  "confidence": "high"
}

selectedOption은 1~4 중 하나입니다.
confidence는 "high", "medium", "low" 중 하나입니다.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse response');
  }

  const result = JSON.parse(jsonMatch[0]);
  return {
    questionNumber: question.number,
    selectedOption: result.selectedOption - 1, // 0-indexed
    reasoning: result.reasoning,
    confidence: result.confidence,
  };
}

// 메인 자동 풀이 함수
async function solveQuiz(url: string, apiKey: string) {
  // Playwright 동적 import
  const { chromium } = await import('playwright');

  console.log('🚀 브라우저 시작...');
  const browser = await chromium.launch({ headless: false }); // 화면 보이게
  const page = await browser.newPage();

  console.log(`📄 페이지 로딩: ${url}`);
  await page.goto(url);
  await page.waitForLoadState('networkidle');

  // Claude 클라이언트 초기화
  const client = new Anthropic({ apiKey });

  const results: QuizResult[] = [];
  let questionNumber = 1;
  let hasMoreQuestions = true;

  while (hasMoreQuestions) {
    try {
      console.log(`\n📝 문제 ${questionNumber} 분석 중...`);

      // 문제 텍스트 추출 (사이트 구조에 따라 selector 수정 필요)
      const questionText = await page.locator('.question-text, .quiz-question, [class*="question"]').first().textContent();

      // 선택지 추출
      const optionElements = await page.locator('.option, .answer-option, [class*="option"], input[type="radio"] + label').all();
      const options: string[] = [];

      for (const el of optionElements) {
        const text = await el.textContent();
        if (text) options.push(text.trim());
      }

      if (!questionText || options.length === 0) {
        console.log('⚠️ 문제를 찾을 수 없습니다. selector 확인 필요');
        break;
      }

      const question: Question = {
        number: questionNumber,
        text: questionText.trim(),
        options,
      };

      console.log(`   문제: ${question.text.substring(0, 50)}...`);
      console.log(`   선택지: ${options.length}개`);

      // Claude로 정답 분석
      const answer = await analyzeQuestion(client, question);
      console.log(`   AI 분석: ${answer.selectedOption + 1}번 (${answer.confidence})`);
      console.log(`   이유: ${answer.reasoning.substring(0, 50)}...`);

      // 정답 클릭
      const targetOption = optionElements[answer.selectedOption];
      if (targetOption) {
        await targetOption.click();
        console.log(`   ✓ ${answer.selectedOption + 1}번 선택 완료`);
      }

      results.push({ question, answer });

      // 다음 문제 또는 제출 버튼 확인
      const nextButton = page.locator('button:has-text("다음"), button:has-text("Next"), [class*="next"]').first();
      const submitButton = page.locator('button:has-text("제출"), button:has-text("Submit"), [class*="submit"]').first();

      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(1000); // 페이지 전환 대기
        questionNumber++;
      } else if (await submitButton.isVisible()) {
        console.log('\n🎯 모든 문제 완료! 제출하시겠습니까?');
        // 자동 제출하지 않고 사용자 확인 대기
        // await submitButton.click();
        hasMoreQuestions = false;
      } else {
        hasMoreQuestions = false;
      }

    } catch (error) {
      console.error(`❌ 오류 발생:`, error);
      hasMoreQuestions = false;
    }
  }

  // 결과 요약
  console.log('\n' + '='.repeat(50));
  console.log('📊 풀이 결과 요약');
  console.log('='.repeat(50));
  console.log(`총 문제: ${results.length}개`);

  const highConfidence = results.filter(r => r.answer.confidence === 'high').length;
  const mediumConfidence = results.filter(r => r.answer.confidence === 'medium').length;
  const lowConfidence = results.filter(r => r.answer.confidence === 'low').length;

  console.log(`확신도 높음: ${highConfidence}개`);
  console.log(`확신도 중간: ${mediumConfidence}개`);
  console.log(`확신도 낮음: ${lowConfidence}개 ⚠️ 검토 필요`);

  // 낮은 확신도 문제 출력
  if (lowConfidence > 0) {
    console.log('\n⚠️ 검토가 필요한 문제:');
    results
      .filter(r => r.answer.confidence === 'low')
      .forEach(r => {
        console.log(`  - 문제 ${r.question.number}: ${r.question.text.substring(0, 40)}...`);
        console.log(`    선택: ${r.answer.selectedOption + 1}번, 이유: ${r.answer.reasoning}`);
      });
  }

  // 결과 파일 저장
  const fs = await import('fs');
  const resultPath = `./quiz-results-${Date.now()}.json`;
  fs.writeFileSync(resultPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 결과 저장: ${resultPath}`);

  console.log('\n브라우저를 닫으려면 아무 키나 누르세요...');
  // 브라우저 열어두기 (수동 확인용)
  await page.waitForTimeout(60000 * 5); // 5분 대기

  await browser.close();
  return results;
}

// CLI 실행
const url = process.argv[2];
const apiKey = process.env.ANTHROPIC_API_KEY;

if (!url) {
  console.log(`
╔════════════════════════════════════════════════════════╗
║     정보보안기사 모의고사 자동 풀이 도구                  ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  사용법:                                                ║
║  ANTHROPIC_API_KEY=sk-xxx npx ts-node auto-solver.ts URL ║
║                                                        ║
║  예시:                                                  ║
║  ANTHROPIC_API_KEY=sk-ant-xxx npx ts-node \\            ║
║    src/scripts/auto-solver.ts \\                        ║
║    "https://example.com/quiz"                          ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
  process.exit(1);
}

if (!apiKey) {
  console.error('❌ ANTHROPIC_API_KEY 환경변수가 필요합니다.');
  process.exit(1);
}

solveQuiz(url, apiKey).catch(console.error);

export { solveQuiz, analyzeQuestion };
export type { Question, Answer, QuizResult };
