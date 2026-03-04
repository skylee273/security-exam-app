const fs = require('fs');

// Load raw data
const rawData = JSON.parse(fs.readFileSync('./question-bank-2026-02-16.json', 'utf-8'));
console.log(`📊 원본 데이터: ${rawData.questions.length}개 항목`);

// Process questions - each question appears twice (question + answer screen)
const processedQuestions = [];
let id = 1;

for (let i = 0; i < rawData.questions.length; i += 2) {
  const questionItem = rawData.questions[i];
  const answerItem = rawData.questions[i + 1];

  if (!questionItem || !answerItem) continue;

  // Find correct answer
  let answer = 0;
  let explanation = '';

  for (let j = 0; j < answerItem.options.length; j++) {
    const opt = answerItem.options[j];
    if (opt.includes('정답')) {
      answer = j;

      // Extract explanation
      const explMatch = opt.match(/정답[\s\S]*?(?:정답입니다!|오답입니다\.)\s*([\s\S]*?)(?:다음 문제|최종결과|$)/);
      if (explMatch) {
        explanation = explMatch[1].trim().replace(/\n+/g, ' ');
      }
      break;
    }
  }

  // Try rawContent for explanation
  if (!explanation && answerItem.rawContent) {
    const explMatch = answerItem.rawContent.match(/(?:정답입니다!|오답입니다\.)\s*([\s\S]*?)(?:다음 문제|최종결과)/);
    if (explMatch) {
      explanation = explMatch[1].trim().replace(/\n+/g, ' ');
    }
  }

  // Clean options
  const cleanOptions = questionItem.options.map(opt =>
    opt.replace(/\s*(정답|내 답|채점 결과[\s\S]*)$/g, '').trim()
  );

  // Determine subject
  const text = questionItem.text + ' ' + cleanOptions.join(' ');
  let subject = '기타';

  if (/개인정보|보호법|정보통신망법|ISMS|위험\s*관리|BCP|DRP|법규|정책|거버넌스|과징금|손해배상/.test(text)) {
    subject = '5과목: 정보보안 관리 및 법규';
  } else if (/암호|해시|SHA|AES|DES|RSA|대칭키|비대칭키|전자서명|PKI|인증서|키\s*교환|Diffie|MAC|블록\s*암호|스트림\s*암호/.test(text)) {
    subject = '4과목: 정보보안 일반';
  } else if (/SQL\s*Injection|XSS|CSRF|OWASP|웹\s*보안|HTTP|쿠키|세션|API|웹\s*서버|httpd|웹\s*애플리케이션|클릭재킹/.test(text)) {
    subject = '3과목: 애플리케이션 보안';
  } else if (/네트워크|방화벽|IDS|IPS|VPN|TCP|UDP|IP주소|OSI|패킷|스니핑|스푸핑|DoS|DDoS|포트|Nmap|라우팅|BGP|무선\s*LAN|WPA/.test(text)) {
    subject = '2과목: 네트워크 보안';
  } else if (/리눅스|윈도우|운영체제|커널|레지스트리|로그|PAM|권한|파일\s*시스템|inode|프로세스|메모리|버퍼\s*오버플로우|악성코드|루트킷|chmod/.test(text)) {
    subject = '1과목: 시스템 보안';
  }

  processedQuestions.push({
    id: id++,
    question: questionItem.text,
    options: cleanOptions.filter(o => o.length > 0),
    answer,
    explanation: explanation || '해설 없음',
    subject
  });
}

console.log(`✅ 처리된 문제: ${processedQuestions.length}개`);

// Subject statistics
const subjectStats = {};
for (const q of processedQuestions) {
  subjectStats[q.subject] = (subjectStats[q.subject] || 0) + 1;
}

console.log('\n📋 과목별 분포:');
for (const [subject, count] of Object.entries(subjectStats).sort()) {
  console.log(`  ${subject}: ${count}개`);
}

// Save processed data
const output = {
  metadata: {
    source: 'https://qz.cxz.fr/',
    processedAt: new Date().toISOString(),
    totalQuestions: processedQuestions.length,
    subjectDistribution: subjectStats
  },
  questions: processedQuestions
};

fs.writeFileSync('./src/data/questionBank.json', JSON.stringify(output, null, 2));
console.log('\n💾 저장됨: ./src/data/questionBank.json');

// TypeScript export
const tsContent = `// 자동 생성된 문제 은행
// 생성일: ${new Date().toISOString()}
// 총 문제: ${processedQuestions.length}개

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;  // 0-indexed
  explanation: string;
  subject: string;
}

export const questionBank: Question[] = ${JSON.stringify(processedQuestions, null, 2)};

export const subjectDistribution = ${JSON.stringify(subjectStats, null, 2)};

export const getQuestionsBySubject = (subject: string) =>
  questionBank.filter(q => q.subject === subject);

export const getRandomQuestions = (count: number, subject?: string) => {
  const pool = subject ? getQuestionsBySubject(subject) : questionBank;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export default questionBank;
`;

fs.writeFileSync('./src/data/questionBank.ts', tsContent);
console.log('💾 저장됨: ./src/data/questionBank.ts');

// Preview
console.log('\n📋 문제 미리보기 (처음 3개):');
for (const q of processedQuestions.slice(0, 3)) {
  console.log(`\n[${q.id}] ${q.subject}`);
  console.log(`Q: ${q.question.substring(0, 60)}...`);
  console.log(`정답: ${q.answer + 1}번`);
  console.log(`해설: ${q.explanation.substring(0, 60)}...`);
}
