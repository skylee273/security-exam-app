import { NextRequest, NextResponse } from 'next/server';

const subjectPrompts: Record<string, { name: string; topics: string }> = {
  subject1: {
    name: '1과목: 시스템 보안',
    topics: '운영체제 보안 (리눅스/윈도우), 클라이언트 보안, 서버 보안, 시스템 취약점 점검, 권한 관리, 로그 분석, PAM, 계정 관리',
  },
  subject2: {
    name: '2과목: 네트워크 보안',
    topics: '네트워크 프로토콜, OSI 7계층, TCP/IP, 방화벽, IDS/IPS, VPN, 네트워크 공격 (Sniffing, Spoofing, DoS), nmap 스캔',
  },
  subject3: {
    name: '3과목: 애플리케이션 보안',
    topics: '웹 보안 (XSS, CSRF, SQL Injection), OWASP Top 10, 데이터베이스 보안, 소프트웨어 개발 보안 (시큐어 코딩), 인증/세션 관리',
  },
  subject4: {
    name: '4과목: 정보보안 일반',
    topics: '암호학 (대칭키/비대칭키, 해시, 전자서명), 접근통제 모델 (MAC, DAC, RBAC), 보안 모델 (BLP, Biba), 키 관리, PKI',
  },
  subject5: {
    name: '5과목: 정보보안 관리 및 법규',
    topics: 'ISMS-P, 개인정보보호법, 정보통신망법, 전자서명법, 위험 관리, 보안 정책, BCP/DRP, 보안 거버넌스',
  },
};

export async function POST(request: NextRequest) {
  try {
    const { apiKey, subject, difficulty, count = 1 } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    const subjectInfo = subjectPrompts[subject] || subjectPrompts.subject1;
    const questionsToGenerate = Math.min(count, 5); // 최대 5문제씩

    const prompt = `당신은 정보보안기사 시험 출제 전문가입니다. 20년간 기출문제를 분석하고 출제해온 경험이 있습니다.

다음 조건에 맞는 정보보안기사 시험 문제 ${questionsToGenerate}개를 생성하세요:

과목: ${subjectInfo.name}
출제 범위: ${subjectInfo.topics}
난이도: ${difficulty || '중'}

요구사항:
1. 실제 정보보안기사 시험 스타일로 출제
2. 4지선다 객관식
3. 함정이 있는 선택지 포함
4. 실무에서 자주 혼동하는 개념 출제
5. 각 문제는 서로 다른 주제에서 출제
6. "다음 중 올바른/올바르지 않은 것은?" 형태의 문제 포함

반드시 다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "questions": [
    {
      "question": "문제 내용",
      "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
      "answer": 0,
      "explanation": "정답 해설",
      "keyPoint": "핵심 암기 포인트",
      "trap": "출제자가 의도한 함정"
    }
  ]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || 'API request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
