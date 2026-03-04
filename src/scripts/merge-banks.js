const fs = require('fs');

// Load both datasets
const data320 = JSON.parse(fs.readFileSync('./question-bank-2026-320.json', 'utf-8'));
const data1500 = JSON.parse(fs.readFileSync('./extracted-questions-1500.json', 'utf-8'));

console.log(`📊 320문제 데이터: ${data320.questions.length}개 항목`);
console.log(`📊 1500문제 데이터: ${data1500.length}개 항목`);

// Process function
function processQuestions(rawQuestions, startId = 1) {
  const processed = [];
  let id = startId;

  for (let i = 0; i < rawQuestions.length; i += 2) {
    const questionItem = rawQuestions[i];
    const answerItem = rawQuestions[i + 1];

    if (!questionItem || !answerItem) continue;

    // Find correct answer
    let answer = 0;
    let explanation = '';

    for (let j = 0; j < answerItem.options.length; j++) {
      const opt = answerItem.options[j];
      if (opt.includes('정답')) {
        answer = j;
        const explMatch = opt.match(/정답[\s\S]*?(?:정답입니다!|오답입니다\.)\s*([\s\S]*?)(?:다음 문제|최종결과|$)/);
        if (explMatch) {
          explanation = explMatch[1].trim().replace(/\n+/g, ' ');
        }
        break;
      }
    }

    if (!explanation && answerItem.rawContent) {
      const explMatch = answerItem.rawContent.match(/(?:정답입니다!|오답입니다\.)\s*([\s\S]*?)(?:다음 문제|최종결과)/);
      if (explMatch) {
        explanation = explMatch[1].trim().replace(/\n+/g, ' ');
      }
    }

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

    processed.push({
      id: id++,
      question: questionItem.text,
      options: cleanOptions.filter(o => o.length > 0),
      answer,
      explanation: explanation || '해설 없음',
      subject,
      source: questionItem.rawContent?.includes('320 문항') ? '2026기출' : '기본문제'
    });
  }

  return processed;
}

// Process both datasets
const questions320 = processQuestions(data320.questions, 1);
const questions1500 = processQuestions(data1500, questions320.length + 1);

console.log(`✅ 320 처리: ${questions320.length}개`);
console.log(`✅ 1500 처리: ${questions1500.length}개`);

// Remove duplicates based on question text similarity
const allQuestions = [...questions320];
const seen = new Set(questions320.map(q => q.question.substring(0, 50)));

for (const q of questions1500) {
  const key = q.question.substring(0, 50);
  if (!seen.has(key)) {
    seen.add(key);
    allQuestions.push({ ...q, id: allQuestions.length + 1 });
  }
}

console.log(`✅ 중복 제거 후: ${allQuestions.length}개`);

// Subject statistics
const subjectStats = {};
for (const q of allQuestions) {
  subjectStats[q.subject] = (subjectStats[q.subject] || 0) + 1;
}

console.log('\n📋 과목별 분포:');
for (const [subject, count] of Object.entries(subjectStats).sort()) {
  console.log(`  ${subject}: ${count}개`);
}

// Save merged data
const output = {
  metadata: {
    source: ['https://qz.cxz.fr/2026/', 'https://qz.cxz.fr/'],
    processedAt: new Date().toISOString(),
    totalQuestions: allQuestions.length,
    subjectDistribution: subjectStats
  },
  questions: allQuestions
};

fs.writeFileSync('./src/data/questionBank.json', JSON.stringify(output, null, 2));
console.log('\n💾 저장됨: ./src/data/questionBank.json');

// TypeScript export
const tsContent = `// 자동 생성된 통합 문제 은행
// 생성일: ${new Date().toISOString()}
// 총 문제: ${allQuestions.length}개 (2026기출 + 기본문제)

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  subject: string;
  source?: string;
}

export const questionBank: Question[] = ${JSON.stringify(allQuestions, null, 2)};

export const subjectDistribution = ${JSON.stringify(subjectStats, null, 2)};

export const subjects = [
  '1과목: 시스템 보안',
  '2과목: 네트워크 보안',
  '3과목: 애플리케이션 보안',
  '4과목: 정보보안 일반',
  '5과목: 정보보안 관리 및 법규'
];

export const getQuestionsBySubject = (subject: string) =>
  questionBank.filter(q => q.subject === subject);

export const getRandomQuestions = (count: number, subject?: string) => {
  const pool = subject ? getQuestionsBySubject(subject) : questionBank;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getExamSet = () => {
  const exam: Question[] = [];
  for (const subject of subjects) {
    const subjectQuestions = getQuestionsBySubject(subject);
    const shuffled = [...subjectQuestions].sort(() => Math.random() - 0.5);
    exam.push(...shuffled.slice(0, 20));
  }
  return exam;
};

export default questionBank;
`;

fs.writeFileSync('./src/data/questionBank.ts', tsContent);
console.log('💾 저장됨: ./src/data/questionBank.ts');

console.log('\n✅ 완료! 정보보안기사 문제 은행이 준비되었습니다.');
