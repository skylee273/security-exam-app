// 실기 약점 키워드 플래시카드 데이터
// 기출 풀이 중 틀린 문제에서 추출

export interface WeaknessCard {
  id: string;
  keyword: string;
  question: string;
  answer: string;
  category: 'system' | 'network' | 'application' | 'crypto' | 'law';
  hint?: string;
}

export const practicalWeakness: WeaknessCard[] = [
  // 시스템 보안
  {
    id: 'w1',
    keyword: '/etc/shadow',
    question: '리눅스에서 사용자 패스워드 해시가 저장되는 파일은?',
    answer: '/etc/shadow\n\n- 루트만 읽기 가능 (권한: 400 또는 000)\n- /etc/passwd는 사용자 정보만 저장\n- 필드: 사용자명:해시:최종변경일:최소:최대:경고:비활성:만료',
    category: 'system',
    hint: 'shadow = 그림자 = 숨겨진 비밀번호',
  },
  {
    id: 'w2',
    keyword: '웹 셸 (Web Shell)',
    question: '공격자가 웹 서버에 업로드하여 원격 명령을 실행할 수 있는 악성 스크립트는?',
    answer: '웹 셸 (Web Shell)\n\n- 파일 업로드 취약점 악용\n- PHP, JSP, ASP 등의 스크립트 형태\n- 대응: 확장자 필터링, 실행권한 제거, 웹방화벽',
    category: 'application',
    hint: '웹 + 셸(명령창) = 웹에서 명령어 실행',
  },
  {
    id: 'w3',
    keyword: '위험분석 3기법',
    question: 'ISMS-P 위험분석의 3가지 기법은?',
    answer: '1. 기준선 접근법 (Baseline)\n   - 표준 체크리스트 기반, 빠르고 쉬움\n\n2. 상세 위험분석 (Detailed)\n   - 자산별 위협/취약점 상세 분석\n\n3. 복합적 접근법 (Combined)\n   - 두 방법을 조합, 효율적 분석',
    category: 'law',
    hint: '기(본)-상(세)-복(합)',
  },
  {
    id: 'w4',
    keyword: '정보통신망법 제2조',
    question: '정보통신망법 제2조에서 "정보통신망"의 정의는?',
    answer: '정보통신망\n\n전기통신설비를 이용하거나 전기통신설비와 컴퓨터 및 컴퓨터의 이용기술을 활용하여 정보를 수집·가공·저장·검색·송신 또는 수신하는 정보통신체계\n\n※ "정보통신서비스"는 별도 정의됨 (주의!)',
    category: 'law',
    hint: '정보통신망 ≠ 정보통신서비스',
  },
  {
    id: 'w5',
    keyword: 'lastcomm',
    question: '리눅스에서 사용자별 명령어 실행 이력을 확인하는 명령어는?',
    answer: 'lastcomm\n\n- 프로세스 회계(accounting) 기능 사용\n- /var/account/pacct 파일 참조\n\n비교:\n- last: 로그인 기록 (/var/log/wtmp)\n- lastb: 실패한 로그인 (/var/log/btmp)\n- lastlog: 마지막 로그인 시간',
    category: 'system',
    hint: 'lastcomm = last + command(명령어)',
  },
  {
    id: 'w6',
    keyword: 'Certificate Pinning',
    question: 'MITM 공격을 방지하기 위해 앱에서 특정 인증서만 신뢰하도록 하는 기술은?',
    answer: '인증서 고정 (Certificate Pinning)\n\n- 앱에 서버 인증서/공개키 해시를 미리 저장\n- 연결 시 저장된 값과 비교하여 검증\n- 가짜 인증서를 이용한 MITM 공격 차단\n\n※ SSL Pinning이라고도 함',
    category: 'crypto',
    hint: 'Pin(고정) + Certificate(인증서) = 인증서를 고정',
  },
  {
    id: 'w7',
    keyword: 'NULL 바이트 인젝션',
    question: '파일 업로드 시 확장자 검사를 우회하기 위해 %00을 삽입하는 공격은?',
    answer: 'NULL 바이트 인젝션\n\n- C언어 문자열 종료 문자(\\0) 악용\n- 예: malware.php%00.jpg\n- 서버는 .jpg로 인식, 실행 시 .php로 처리\n\n대응: 확장자 화이트리스트, 파일 재생성',
    category: 'application',
    hint: 'NULL(\\0) = 문자열 끝 표시 악용',
  },
  {
    id: 'w8',
    keyword: '보안관제 3요소',
    question: '보안관제 업무의 3가지 핵심 요소는?',
    answer: '보안관제 3요소\n\n1. 탐지 (Detection)\n   - 보안 이벤트/위협 식별\n\n2. 분석 (Analysis)\n   - 탐지된 이벤트 상세 조사\n\n3. 대응 (Response)\n   - 위협 제거 및 복구 조치',
    category: 'law',
    hint: '탐-분-대 (탐지→분석→대응)',
  },
  {
    id: 'w9',
    keyword: '위험대응 4가지',
    question: '위험관리에서 위험에 대응하는 4가지 전략은?',
    answer: '위험대응 4가지\n\n1. 위험 수용 (Accept)\n   - 위험을 감수하고 진행\n\n2. 위험 감소 (Reduce/Mitigate)\n   - 보안대책 적용하여 위험 낮춤\n\n3. 위험 회피 (Avoid)\n   - 위험 활동 자체를 중단\n\n4. 위험 전가 (Transfer)\n   - 보험, 외주 등으로 위험 이전',
    category: 'law',
    hint: '수-감-회-전 (수용/감소/회피/전가)',
  },
  {
    id: 'w10',
    keyword: '개인정보보호법 제25조 (CCTV)',
    question: '개인정보보호법에서 영상정보처리기기(CCTV) 설치 제한을 규정하는 조항은?',
    answer: '개인정보보호법 제25조\n\n설치 가능 장소:\n- 법령에서 구체적으로 허용한 경우\n- 범죄 예방 및 수사\n- 시설 안전 및 화재 예방\n- 교통정보 수집·분석\n\n설치 금지 장소:\n- 목욕실, 화장실, 탈의실 등 사생활 침해 장소',
    category: 'law',
    hint: '25조 = CCTV (이오 = 25)',
  },
  {
    id: 'w11',
    keyword: 'HTTP 응답분할 CRLF',
    question: 'HTTP 응답 헤더에 개행문자를 삽입하여 응답을 조작하는 공격과 사용되는 문자는?',
    answer: 'HTTP 응답분할 (Response Splitting)\n\nCRLF 문자 사용:\n- CR (Carriage Return): \\r, %0D\n- LF (Line Feed): \\n, %0A\n\n공격 원리:\n- 헤더에 %0D%0A 삽입\n- 새로운 응답 헤더/본문 주입 가능\n\n대응: 입력값 검증, 개행문자 필터링',
    category: 'application',
    hint: 'CR=\\r(캐리지리턴) LF=\\n(라인피드)',
  },
  {
    id: 'w12',
    keyword: '사이버 킬체인 7단계',
    question: '록히드마틴의 사이버 킬체인 7단계를 순서대로 나열하시오.',
    answer: '사이버 킬체인 7단계\n\n1. 정찰 (Reconnaissance)\n2. 무기화 (Weaponization)\n3. 전달 (Delivery)\n4. 취약점 공격 (Exploitation)\n5. 설치 (Installation)\n6. 명령 및 제어 (C&C, C2)\n7. 목표 실행 (Actions on Objectives)\n\n※ 각 단계에서 공격 차단 가능',
    category: 'network',
    hint: '정-무-전-취-설-명-목',
  },
  {
    id: 'w13',
    keyword: 'SSRF vs 파밍',
    question: 'SSRF(Server-Side Request Forgery)와 파밍(Pharming)의 차이점은?',
    answer: 'SSRF (Server-Side Request Forgery)\n- 서버가 공격자가 지정한 URL로 요청\n- 내부망 접근, 메타데이터 탈취\n- 예: http://내부서버/admin\n\n파밍 (Pharming)\n- DNS 변조로 가짜 사이트 유도\n- 사용자가 정상 URL 입력해도 피싱사이트로\n- 예: hosts 파일 변조, DNS 캐시 포이즈닝',
    category: 'application',
    hint: 'SSRF=서버가 요청 / 파밍=사용자가 요청',
  },
  {
    id: 'w14',
    keyword: 'VLAN 명령어',
    question: 'Cisco 스위치에서 VLAN 정보를 확인하는 명령어는?',
    answer: 'show vlan\n\n관련 명령어:\n- show vlan brief: 요약 정보\n- show vlan id [번호]: 특정 VLAN\n- vlan [번호]: VLAN 생성 모드 진입\n- name [이름]: VLAN 이름 지정\n\nVLAN = 논리적 네트워크 분리',
    category: 'network',
    hint: 'show vlan = VLAN 보기',
  },
  {
    id: 'w15',
    keyword: '자산 그룹핑',
    question: 'ISMS-P에서 유사한 특성을 가진 자산을 묶어 관리하는 기법은?',
    answer: '자산 그룹핑 (Asset Grouping)\n\n목적:\n- 유사 자산을 그룹화하여 효율적 관리\n- 위험분석 시간 단축\n- 일관된 보안대책 적용\n\n그룹핑 기준:\n- 용도, 기능, 위치, 중요도\n- 예: 웹서버 그룹, DB서버 그룹',
    category: 'law',
    hint: '비슷한 것끼리 묶어서 관리',
  },
  {
    id: 'w16',
    keyword: 'Smurf 공격',
    question: 'ICMP Echo Reply를 이용한 DDoS 공격으로, Direct Broadcast를 악용하는 공격은?',
    answer: 'Smurf 공격\n\n공격 원리:\n1. 공격자가 출발지를 피해자 IP로 위조\n2. Broadcast 주소로 ICMP Echo Request 전송\n3. 네트워크의 모든 호스트가 피해자에게 Reply\n\n대응:\n- 라우터에서 Directed Broadcast 차단\n- no ip directed-broadcast',
    category: 'network',
    hint: 'Smurf = 작은 스머프들이 우르르 몰려옴',
  },
  {
    id: 'w17',
    keyword: '위험관리계획',
    question: 'ISMS-P에서 위험관리 계획 수립 시 포함해야 할 주요 내용은?',
    answer: '위험관리계획 포함 내용\n\n1. 위험관리 체계\n   - 조직, 역할, 책임\n\n2. 위험분석 방법론\n   - 기준선/상세/복합적 접근법\n\n3. 위험 평가 기준\n   - 수용 가능 위험 수준\n\n4. 보호대책 선정 기준\n   - 비용 대비 효과 분석',
    category: 'law',
    hint: 'ISMS-P 2.1.3 위험 관리',
  },
  {
    id: 'w18',
    keyword: '물리적 보호대책 3가지',
    question: 'ISMS-P에서 물리적 보호대책의 3가지 핵심 영역은?',
    answer: '물리적 보호대책 3가지\n\n1. 보호구역 지정 (통제구역)\n   - 제한/통제/금지 구역 분류\n\n2. 출입통제\n   - 인가된 인원만 접근 허용\n   - 출입 기록 관리\n\n3. 반입/반출 통제\n   - 정보자산 반출입 절차\n   - 휴대용 저장매체 관리',
    category: 'law',
    hint: '구역-출입-반출입',
  },
  {
    id: 'w19',
    keyword: 'IPSec VPN',
    question: 'IPSec의 두 가지 모드와 두 가지 프로토콜을 설명하시오.',
    answer: 'IPSec VPN\n\n【모드】\n- 전송모드: IP 페이로드만 암호화 (End-to-End)\n- 터널모드: 전체 패킷 암호화 (Gateway-to-Gateway)\n\n【프로토콜】\n- AH: 인증, 무결성 (암호화 X)\n- ESP: 인증 + 무결성 + 기밀성(암호화)\n\n※ ESP가 더 많이 사용됨',
    category: 'network',
    hint: '모드(전송/터널) + 프로토콜(AH/ESP)',
  },
  {
    id: 'w20',
    keyword: 'NetBIOS 서비스 바인딩',
    question: 'NetBIOS 서비스가 취약한 이유와 비활성화 방법은?',
    answer: 'NetBIOS 서비스 바인딩\n\n【취약 이유】\n- 포트 137,138,139 (NetBIOS)\n- 포트 139,445 (SMB)\n- 랜섬웨어가 악용하여 원격코드 실행\n\n【비활성화 방법】\nncpa.cpl → TCP/IPv4 속성\n→ 고급 → WINS 탭\n→ "NetBIOS over TCP/IP 사용 안 함" 선택',
    category: 'system',
    hint: 'ncpa.cpl → WINS 탭 → NetBIOS 사용 안 함',
  },
  {
    id: 'w21',
    keyword: '자산중요도 CIA',
    question: '위험분석 시 자산중요도 설정 개념과 중요사항 3가지는?',
    answer: '자산중요도 설정\n\n【개념】\n자산가치 산정 시 단기적 손실과 장기적 영향을 포함하여 사고 발생 시 영향 규모 파악\n\n【중요사항 3가지】\n1. 기밀성 (Confidentiality)\n2. 무결성 (Integrity)\n3. 가용성 (Availability)\n\n※ CIA Triad로 평가하여 손실비용 최소화',
    category: 'law',
    hint: 'CIA = 기밀성, 무결성, 가용성',
  },
  {
    id: 'w22',
    keyword: '쉘(Shell)',
    question: '쉘(Shell)의 정의와 기능 2가지를 설명하시오.',
    answer: '쉘 (Shell)\n\n【정의】\n명령어 해석기/번역기로 사용자 명령의 입출력을 수행하며 프로그램 실행\n\n【종류】\nBourne Shell, C Shell, Korn Shell, Bash(리눅스 표준)\n\n【기능 2가지】\n1. 명령어 해석 및 실행: ls, cp 등 → Kernel에 전달\n2. 프로그램 실행 환경 제공: 쉘 스크립트로 여러 명령 실행',
    category: 'system',
    hint: '쉘 = 명령어 해석기 (Kernel과 사용자 사이)',
  },
  {
    id: 'w23',
    keyword: 'Oracle Audit',
    question: 'Oracle 감사(Audit) 파라미터와 외부 저장 이유는?',
    answer: 'Oracle Audit 설정\n\n【주요 파라미터】\n- audit_file_dest: 감사파일 저장 경로\n- audit_sys_operations: SYS 계정 감사 (TRUE/FALSE)\n- audit_trail: 감사 활성화 (DB/XML/OS/NONE)\n\n【DB 테이블 저장】\nALTER SYSTEM SET audit_trail = DB;\n→ SYS.AUD$ 테이블에 저장\n\n【외부저장 이유】\n- 접근통제 (직무분리, 최소권한)\n- 무결성 (공격자 로그삭제 방지)\n- 법률: 안전성확보조치 제8조(3)항',
    category: 'system',
    hint: 'audit_trail = DB → SYS.AUD$ 테이블',
  },
  {
    id: 'w24',
    keyword: '배너 정보 노출',
    question: 'telnet/vsftpd 배너 노출의 위험과 조치방안은?',
    answer: '배너 정보 노출 취약점\n\n【위험】\n- OS/서비스 버전으로 CVE 취약점 확인 가능\n- EOS 시스템 대상 공격 가능\n\n【telnet 조치】\n1. SSH로 대체 (암호화)\n2. netstat -antp로 23번포트 확인\n3. iptables로 IP 제한\n4. TCP Wrapper (hosts.allow/deny)\n\n【vsftpd 조치】\n1. anonymous_enable=NO (익명 차단)\n2. iptables로 허용 IP만 등록\n3. Snort로 브루트포스 탐지',
    category: 'system',
    hint: 'telnet→SSH, vsftpd→anonymous_enable=NO',
  },
];

// 카테고리별 통계
export const getWeaknessByCategory = (category: WeaknessCard['category']) => {
  return practicalWeakness.filter(w => w.category === category);
};

// 카테고리 한글명
export const categoryNames: Record<WeaknessCard['category'], string> = {
  system: '시스템 보안',
  network: '네트워크 보안',
  application: '애플리케이션 보안',
  crypto: '암호학',
  law: '법규/관리',
};
