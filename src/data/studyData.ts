import { additionalStudyItems } from './additionalStudyItems';

export interface StudyItem {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  content: string;
  keyPoints?: string[];
  isWeakness?: boolean;
  tableComponent?: string;
}

export interface QuizItem {
  id: string;
  category: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  isWeakness?: boolean;
}

export const categories = [
  { id: 'crypto', name: '암호학', icon: '🔐' },
  { id: 'linux', name: '시스템 보안 - Linux', icon: '🐧' },
  { id: 'windows', name: '시스템 보안 - Windows', icon: '🪟' },
  { id: 'network', name: '네트워크 보안', icon: '🌐' },
  { id: 'app', name: '애플리케이션 보안', icon: '📱' },
  { id: 'memory', name: '메모리 공격', icon: '💾' },
  { id: 'malware', name: '악성코드', icon: '🦠' },
  { id: 'mobile', name: '모바일 보안', icon: '📲' },
  { id: 'tools', name: '보안 도구', icon: '🔧' },
  { id: 'law', name: '법규/관리', icon: '📋' },
];

// 정보보안기사 5과목 구조
export const examSubjects = [
  {
    id: 'subject1',
    name: '1과목: 시스템 보안',
    topics: '운영체제, 클라이언트/서버 보안, 시스템 취약점 점검',
    questionCount: 4,
  },
  {
    id: 'subject2',
    name: '2과목: 네트워크 보안',
    topics: '네트워크 일반, 네트워크 활용, 네트워크 기반 공격',
    questionCount: 4,
  },
  {
    id: 'subject3',
    name: '3과목: 애플리케이션 보안',
    topics: '웹 보안, 데이터베이스 보안, 소프트웨어 개발 보안',
    questionCount: 4,
  },
  {
    id: 'subject4',
    name: '4과목: 정보보안 일반',
    topics: '암호학, 접근통제, 보안 모델',
    questionCount: 4,
  },
  {
    id: 'subject5',
    name: '5과목: 정보보안 관리 및 법규',
    topics: 'ISMS-P, 개인정보보호법, 정보통신망법',
    questionCount: 4,
  },
];

export const studyItems: StudyItem[] = [
  // ==================== 암호학 ====================
  {
    id: 'hash-size',
    category: 'crypto',
    subcategory: '해시 함수',
    title: '해시 함수 출력 크기',
    tableComponent: 'HashFunctionTable',
    content: `
**해시 함수란?**
임의 길이의 입력을 고정 길이의 출력으로 변환하는 일방향 함수

**특성:**
- 일방향성: 해시값에서 원본 복원 불가
- 충돌 저항성: 같은 해시를 가진 두 입력 찾기 어려움
- 눈사태 효과: 입력이 조금만 바뀌어도 해시값 완전히 변경

**취약점:**
- MD5, SHA-1은 충돌 공격에 취약하여 더 이상 권장되지 않음
- 현재는 SHA-256 이상 사용 권장
    `,
    keyPoints: ['MD5=128bit', 'SHA-1=160bit', 'SHA-256=256bit', 'MD5/SHA-1 취약'],
    isWeakness: true,
  },
  {
    id: 'block-cipher-rounds',
    category: 'crypto',
    subcategory: '블록 암호',
    title: '블록 암호 라운드 수',
    tableComponent: 'BlockCipherTable',
    content: `
**블록 암호란?**
평문을 고정된 크기의 블록으로 나누어 암호화하는 방식

**주요 구조:**
1. **페이스텔 구조 (Feistel)**
   - DES, 3DES, SEED 사용
   - 블록을 좌우로 나누어 반복 처리
   - 암호화/복호화 구조 동일 (하드웨어 효율적)

2. **SPN 구조 (Substitution-Permutation Network)**
   - AES, ARIA 사용
   - 치환(S-box)과 순열(P-box) 반복
   - 더 빠른 확산 효과

**AES 라운드 공식:**
라운드 수 = (키 비트 / 32) + 6
- AES-128: 128/32 + 6 = 10라운드
- AES-192: 192/32 + 6 = 12라운드
- AES-256: 256/32 + 6 = 14라운드
    `,
    keyPoints: ['DES=16라운드', 'AES-128=10라운드', 'IDEA=8.5라운드', 'AES는 SPN, DES는 Feistel'],
    isWeakness: true,
  },
  {
    id: 'block-modes',
    category: 'crypto',
    subcategory: '블록 암호',
    title: '블록 암호 운용 모드',
    content: `
**왜 운용 모드가 필요한가?**
같은 평문 블록이 항상 같은 암호문이 되면 패턴 노출 위험!

| 모드 | IV | 특징 | 장단점 |
|------|-----|------|--------|
| **ECB** | X | 각 블록 독립 암호화 | 패턴 노출 (펭귄 문제), 사용 금지 |
| **CBC** | O | 이전 암호문과 XOR | 가장 많이 사용, 순차 처리 |
| **CFB** | O | 스트림 암호처럼 | 실시간 통신용 |
| **OFB** | O | 키 스트림 생성 | 에러 전파 없음 |
| **CTR** | O (Nonce) | 카운터 암호화 | 병렬 처리 가능, 빠름 |
| **GCM** | O | CTR + 인증 태그 | 기밀성 + 무결성 제공 |

**IV(Initialization Vector)란?**
- 같은 키로 같은 평문을 암호화해도 다른 결과가 나오게 하는 초기값
- 비밀이 아니어도 됨, 하지만 반복 사용 금지
- CBC에서 IV가 예측 가능하면 BEAST 공격에 취약
    `,
    keyPoints: ['ECB는 IV 불필요하지만 취약', 'CBC가 가장 보편적', 'CTR은 병렬 처리 가능', 'GCM은 인증 기능 포함'],
    isWeakness: true,
  },
  {
    id: 'dh-vulnerability',
    category: 'crypto',
    subcategory: '키 교환',
    title: 'Diffie-Hellman 키 교환',
    content: `
**동작 원리:**
1. Alice와 Bob이 공개된 값 (g, p) 합의
2. Alice: 비밀값 a 선택 → A = g^a mod p 전송
3. Bob: 비밀값 b 선택 → B = g^b mod p 전송
4. 공통 키 계산: K = B^a = A^b = g^(ab) mod p

**수학적 기반:**
- 이산 로그 문제의 어려움에 기반
- g^a mod p에서 a를 찾는 것은 매우 어려움

**취약점: MITM (Man-in-the-Middle)**
\`\`\`
Alice ←→ Eve(공격자) ←→ Bob
   K1 = g^(ae)     K2 = g^(eb)
\`\`\`
- 상호 인증 없이 키 교환만 수행
- 중간자가 양쪽과 각각 키 교환 가능
- 공격자가 모든 통신 내용 열람/변조 가능

**해결책:**
- **STS (Station-to-Station) 프로토콜**: DH + 디지털 서명
- **인증서 기반 DH**: PKI 활용
- **ECDH**: 타원곡선 기반 (더 짧은 키로 동일 보안)
    `,
    keyPoints: ['MITM 공격에 취약', '상호 인증 없음', 'STS 프로토콜로 해결', '이산로그 문제 기반'],
    isWeakness: true,
  },

  // ==================== Linux ====================
  {
    id: 'passwd-structure',
    category: 'linux',
    subcategory: '계정 관리',
    title: '/etc/passwd 파일 구조',
    content: `
**파일 구조:**
\`\`\`
username:x:UID:GID:comment:home_dir:shell
   ①    ② ③   ④    ⑤       ⑥       ⑦
\`\`\`

**각 필드 설명:**
| 필드 | 설명 | 예시 |
|------|------|------|
| ① username | 로그인 이름 | root, admin |
| ② password | x = shadow 사용 | x (암호는 /etc/shadow) |
| ③ UID | 사용자 ID | 0=root, 1000+ 일반 |
| ④ GID | 그룹 ID | 0=root 그룹 |
| ⑤ comment | 사용자 설명 | Full Name |
| ⑥ home | 홈 디렉토리 | /home/user |
| ⑦ shell | 로그인 쉘 | /bin/bash |

**보안 점검 포인트:**
1. **UID 0 중복 검사** - root 외에 UID 0인 계정 존재 시 위험!
\`\`\`bash
awk -F: '($3 == 0) {print $1}' /etc/passwd
\`\`\`

2. **불필요한 쉘 할당 검사**
\`\`\`bash
# 로그인 불필요 계정은 /sbin/nologin 또는 /bin/false 사용
games:x:5:60:games:/usr/games:/sbin/nologin
\`\`\`

3. **빈 패스워드 검사**
\`\`\`bash
awk -F: '($2 == "") {print $1}' /etc/passwd
\`\`\`
    `,
    keyPoints: ['UID 0 = root 권한', 'UID 0 중복 시 보안 취약', 'x는 shadow 사용 의미', '불필요 계정은 nologin'],
    isWeakness: true,
  },
  {
    id: 'log-files',
    category: 'linux',
    subcategory: '로그',
    title: 'Linux 로그 파일 (utmp/wtmp/btmp)',
    tableComponent: 'LinuxLogTable',
    content: `
**로그 파일의 중요성:**
- 침입 탐지 및 사후 분석의 핵심 자료
- 로그 변조/삭제는 공격자의 주요 목표

**바이너리 vs 텍스트:**
- 바이너리 로그: 전용 명령어로만 조회 (cat 사용 불가!)
- 텍스트 로그: cat, tail, grep 등으로 조회 가능

**주요 명령어:**
\`\`\`bash
# 현재 로그인 사용자 (utmp)
who
w

# 로그인 이력 (wtmp)
last
last -n 10  # 최근 10개

# 로그인 실패 (btmp) - root 권한 필요
lastb
lastb -n 10

# 마지막 로그인 (lastlog)
lastlog
lastlog -u username
\`\`\`

**로그 로테이션:**
- /etc/logrotate.conf에서 설정
- 오래된 로그 압축/삭제 자동화
    `,
    keyPoints: ['utmp/wtmp/btmp/lastlog는 바이너리!', 'cat으로 못 봄', 'utmp=현재, wtmp=이력, btmp=실패'],
    isWeakness: true,
  },
  {
    id: 'syslog-facility',
    category: 'linux',
    subcategory: '로그',
    title: 'Syslog Facility 코드',
    tableComponent: 'SyslogFacilityTable',
    content: `
**Syslog란?**
시스템 로그를 중앙 집중식으로 관리하는 표준 프로토콜

**구성 요소:**
- **Facility**: 로그를 생성한 프로그램 종류
- **Severity**: 로그의 심각도 수준
- **메시지**: 실제 로그 내용

**설정 파일:** /etc/rsyslog.conf 또는 /etc/syslog.conf

**설정 문법:**
\`\`\`
facility.severity    action
\`\`\`

**예시:**
\`\`\`
# 모든 인증 로그를 /var/log/auth.log에 기록
auth,authpriv.*     /var/log/auth.log

# 경고 이상만 기록
*.warning           /var/log/warnings

# 원격 서버로 전송
*.*                 @192.168.1.100
\`\`\`

**자주 출제되는 코드:**
- 0 = kern (커널)
- 4 = auth (인증)
- 9 = cron (스케줄러)
- 10 = authpriv (private 인증)
    `,
    keyPoints: ['0=kern', '4=auth', '9=cron', '10=authpriv'],
    isWeakness: true,
  },
  {
    id: 'syslog-severity',
    category: 'linux',
    subcategory: '로그',
    title: 'Syslog Severity (심각도)',
    tableComponent: 'SyslogSeverityTable',
    content: `
**Severity 레벨:**
숫자가 낮을수록 심각한 상황!

**실무 활용:**
\`\`\`bash
# /etc/rsyslog.conf 설정 예시

# err 이상(0~3)만 기록
*.err               /var/log/errors

# warning 이상(0~4)만 기록
*.warning           /var/log/warnings

# info 이상(0~6) 기록 (debug 제외)
*.info              /var/log/messages
\`\`\`

**비교 연산자:**
- \`=\` : 해당 레벨만
- \`.none\` : 해당 facility 제외
- \`*\` : 모든 레벨

**암기법:**
"Emergency Alert! Critical Error Warning, Notice Info Debug"
(E-A-C-E-W-N-I-D: 0-1-2-3-4-5-6-7)
    `,
    keyPoints: ['숫자 낮을수록 심각', '0=emerg 가장 심각', '7=debug 가장 가벼움'],
    isWeakness: true,
  },
  {
    id: 'pam-options',
    category: 'linux',
    subcategory: 'PAM',
    title: 'PAM 모듈 옵션',
    tableComponent: 'PamOptionsTable',
    content: `
**PAM (Pluggable Authentication Modules)이란?**
리눅스 인증을 모듈화하여 유연하게 관리하는 프레임워크

**PAM 설정 파일 위치:**
- /etc/pam.d/ 디렉토리 내 서비스별 파일
- /etc/pam.d/system-auth (시스템 전체)
- /etc/pam.d/password-auth (패스워드 인증)

**계정 잠금 설정 예시:**
\`\`\`
# /etc/pam.d/system-auth
auth required pam_faillock.so preauth deny=3 unlock_time=600
auth required pam_faillock.so authfail deny=3 unlock_time=600
\`\`\`

**설정 해석:**
- deny=3: 3회 실패 시 잠금
- unlock_time=600: 600초(10분) 후 자동 해제
- preauth: 인증 전 실패 카운트 확인
- authfail: 인증 실패 시 카운트 증가

**잠금 상태 확인/해제:**
\`\`\`bash
# 잠금 상태 확인
faillock --user username

# 잠금 해제
faillock --user username --reset
\`\`\`
    `,
    keyPoints: ['deny=계정잠금', 'retry=재시도허용', '시간은 초 단위', '10분=600초'],
    isWeakness: true,
  },
  {
    id: 'umask',
    category: 'linux',
    subcategory: '권한',
    title: 'umask 계산',
    content: `
**umask란?**
새 파일/디렉토리 생성 시 제거할 권한을 지정하는 마스크

**기본 권한:**
- 파일: 666 (rw-rw-rw-)
- 디렉토리: 777 (rwxrwxrwx)

**계산 방법:**
\`\`\`
최종 권한 = 기본 권한 - umask

예: umask 022
파일: 666 - 022 = 644 (rw-r--r--)
디렉토리: 777 - 022 = 755 (rwxr-xr-x)

예: umask 027
파일: 666 - 027 = 640 (rw-r-----)
디렉토리: 777 - 027 = 750 (rwxr-x---)
\`\`\`

**주의: 비트 연산!**
- 실제로는 AND NOT 연산
- 666 & ~022 = 644
- 하지만 시험에서는 단순 뺄셈으로 계산

**umask 설정:**
\`\`\`bash
# 현재 umask 확인
umask

# umask 설정
umask 027

# 영구 설정: ~/.bashrc 또는 /etc/profile
\`\`\`

**보안 권장 umask:**
- 일반 사용자: 022 (그룹/기타 쓰기 금지)
- 보안 민감: 077 (소유자만 접근)
    `,
    keyPoints: ['파일 기본 666', '디렉토리 기본 777', 'umask 022가 일반적'],
  },
  {
    id: 'suid-sgid',
    category: 'linux',
    subcategory: '권한',
    title: 'SUID/SGID 찾기',
    content: `
**SUID (Set User ID) - 4000**
실행 시 파일 소유자의 권한으로 실행

\`\`\`bash
# passwd 명령어가 SUID인 이유
# 일반 사용자도 /etc/shadow 수정 필요
ls -l /usr/bin/passwd
-rwsr-xr-x 1 root root ... /usr/bin/passwd
    ^-- s = SUID 설정됨
\`\`\`

**SGID (Set Group ID) - 2000**
실행 시 파일 그룹의 권한으로 실행
디렉토리에 설정 시: 새 파일이 디렉토리 그룹 상속

**Sticky Bit - 1000**
디렉토리에서 소유자만 파일 삭제 가능 (예: /tmp)

**보안 점검:**
\`\`\`bash
# SUID 파일 찾기
find / -perm -4000 -type f 2>/dev/null

# SGID 파일 찾기
find / -perm -2000 -type f 2>/dev/null

# SUID 또는 SGID
find / -perm /6000 -type f 2>/dev/null

# 소유자 없는 파일 (삭제된 계정)
find / -nouser -o -nogroup 2>/dev/null
\`\`\`

**위험한 SUID 파일:**
- vi/vim (쉘 탈출 가능)
- find (명령 실행 옵션)
- python/perl (스크립트 실행)
    `,
    keyPoints: ['SUID=4000', 'SGID=2000', 'Sticky=1000', '-perm -4000으로 검색'],
  },

  // ==================== Windows ====================
  {
    id: 'windows-auth',
    category: 'windows',
    subcategory: '인증',
    title: 'Windows 인증 구성 요소',
    tableComponent: 'WindowsAuthTable',
    content: `
**인증 흐름:**
\`\`\`
사용자 → GINA(UI) → LSA(정책) → SAM(DB) 조회
                          ↓
                    인증 성공 시
                          ↓
                    SRM(권한 검증)
\`\`\`

**상세 동작:**
1. **GINA**: Ctrl+Alt+Del 신호 수신, 로그인 화면 표시
2. **LSA**: 입력된 자격 증명을 SAM/AD와 비교
3. **SAM**: NTLM 해시로 저장된 패스워드 확인
4. **SRM**: 접근 토큰 생성, 이후 모든 접근 권한 검증

**SAM 파일 보안:**
- 경로: C:\\Windows\\System32\\config\\SAM
- 부팅 중에는 잠겨 있어 직접 접근 불가
- 오프라인 공격: 부팅 디스크로 복사 후 크래킹

**관련 공격:**
- Pass-the-Hash: 해시만으로 인증 (평문 불필요)
- Mimikatz: 메모리에서 자격 증명 추출
    `,
    keyPoints: ['SAM=계정DB', 'LSA=인증정책', 'SRM=권한검증', 'GINA는 Vista 이후 대체됨'],
  },
  {
    id: 'admin-security',
    category: 'windows',
    subcategory: '계정 관리',
    title: 'Administrator 계정 보안',
    content: `
**보안 설정 체크리스트:**

| 항목 | 올바른 설정 | 잘못된 설정 |
|------|-------------|-------------|
| 패스워드 | 복잡도 높게 (대소문자+숫자+특수) | 단순 패스워드 |
| 계정명 | 변경 권장 | Administrator 유지 |
| 그룹 | 불필요한 그룹만 제거 | 모든 그룹 제거 ❌ |
| 익명 SID | 변환 허용 안 함 | 허용 |
| 원격 접속 | 제한 또는 금지 | 무제한 허용 |

**주의: "모든 그룹 제거"는 오답!**
- Administrator는 Administrators 그룹에 반드시 소속
- 모든 그룹 제거 시 관리 기능 상실

**로컬 보안 정책 설정:**
\`\`\`
secpol.msc → 로컬 정책 → 보안 옵션
- 계정: Administrator 계정 이름 바꾸기
- 네트워크 액세스: 익명 SID/이름 변환 허용 → 사용 안 함
\`\`\`

**감사 정책:**
- 로그온 이벤트 감사: 성공/실패 모두 기록
- 계정 관리 감사: 계정 변경 추적
    `,
    keyPoints: ['계정명 변경 권장', '모든 그룹 제거는 오답!', '익명 SID 변환 금지'],
    isWeakness: true,
  },
  {
    id: 'rdp-attacks',
    category: 'windows',
    subcategory: '원격 접속',
    title: 'RDP 공격 유형',
    content: `
**RDP (Remote Desktop Protocol)**
윈도우 원격 데스크톱 서비스 프로토콜 (기본 포트: 3389)

**주요 공격 유형:**

1. **RDP Hijacking (세션 하이재킹)**
   - 이미 연결된 세션을 탈취
   - tscon 명령어 악용
   \`\`\`
   tscon [세션ID] /dest:[대상세션] /password:[암호]
   \`\`\`
   - SYSTEM 권한 필요

2. **RDP Brute Force**
   - 패스워드 무차별 대입 공격
   - 계정 잠금 정책으로 방어

3. **BlueKeep (CVE-2019-0708)**
   - 사전 인증 단계 취약점
   - 원격 코드 실행 가능
   - Windows 7, Server 2008 영향

**방어 방법:**
- NLA (Network Level Authentication) 활성화
- 계정 잠금 정책 설정
- RDP 게이트웨이 사용
- 포트 변경 (3389 → 다른 포트)
- VPN 통한 접근만 허용
- 다중 인증 (MFA) 적용
    `,
    keyPoints: ['Hijacking=세션탈취', 'tscon 명령 사용', 'BlueKeep=CVE-2019-0708', '기본 포트 3389'],
    isWeakness: true,
  },

  // ==================== 네트워크 ====================
  {
    id: 'network-attacks',
    category: 'network',
    subcategory: '공격 유형',
    title: '네트워크 공격 4대 유형',
    tableComponent: 'NetworkAttackTable',
    content: `
**공격 분류 체계:**

**능동적 공격 vs 수동적 공격:**
- 수동적: Sniffing (탐지 어려움)
- 능동적: Spoofing, Hijacking, Tunneling (탐지 가능)

**계층별 공격:**
- L2: ARP Spoofing, MAC Flooding
- L3: IP Spoofing, ICMP 공격
- L4: TCP Hijacking, SYN Flooding
- L7: DNS Spoofing, HTTP Hijacking

**실무 방어 전략:**
1. 암호화: HTTPS, SSH, VPN
2. 인증: 802.1X, PKI
3. 모니터링: IDS/IPS, SIEM
4. 네트워크 분리: VLAN, 세그멘테이션
    `,
    keyPoints: ['Sniffing=도청', 'Spoofing=위조', 'Hijacking=탈취', 'Tunneling=은닉'],
    isWeakness: true,
  },
  {
    id: 'ip-class',
    category: 'network',
    subcategory: 'IP',
    title: 'IP 클래스 구분',
    content: `
**IPv4 클래스 구조:**

| 클래스 | 첫 옥텟 | 선행 비트 | 네트워크/호스트 | 사용 목적 |
|--------|---------|-----------|-----------------|-----------|
| A | 0-127 | 0xxx | 8/24 bit | 대규모 네트워크 |
| B | 128-191 | 10xx | 16/16 bit | 중규모 네트워크 |
| C | 192-223 | 110x | 24/8 bit | 소규모 네트워크 |
| D | 224-239 | 1110 | - | 멀티캐스트 |
| E | 240-255 | 1111 | - | 예약 (연구용) |

**사설 IP 대역:**
- Class A: 10.0.0.0/8
- Class B: 172.16.0.0/12 (172.16~172.31)
- Class C: 192.168.0.0/16

**특수 IP:**
- 127.0.0.0/8: 루프백 (localhost)
- 169.254.0.0/16: APIPA (DHCP 실패 시)
- 0.0.0.0: 모든 인터페이스 / 기본 라우트
- 255.255.255.255: 제한된 브로드캐스트

**서브넷 계산:**
\`\`\`
호스트 수 = 2^(호스트 비트) - 2
/24 = 2^8 - 2 = 254개 호스트
/25 = 2^7 - 2 = 126개 호스트
\`\`\`
    `,
    keyPoints: ['A=0~127', 'B=128~191', 'C=192~223', 'D=멀티캐스트'],
    isWeakness: true,
  },
  {
    id: 'nmap-responses',
    category: 'network',
    subcategory: '스캔',
    title: 'nmap 스캔 응답',
    content: `
**nmap 스캔 유형별 응답:**

**TCP SYN 스캔 (-sS):**
| 포트 상태 | 응답 | 설명 |
|-----------|------|------|
| Open | SYN+ACK | 서비스 실행 중 |
| Closed | RST | 포트 닫힘 |
| Filtered | 무응답/ICMP | 방화벽 차단 |

**TCP Connect 스캔 (-sT):**
- 완전한 3-way handshake
- 로그에 기록됨 (탐지 용이)

**UDP 스캔 (-sU):**
- Open: 응답 또는 무응답
- Closed: ICMP Port Unreachable

**주요 옵션:**
\`\`\`bash
# 기본 SYN 스캔
nmap -sS 192.168.1.1

# 서비스 버전 탐지
nmap -sV 192.168.1.1

# OS 탐지
nmap -O 192.168.1.1

# 전체 스캔
nmap -A 192.168.1.1

# 스텔스 스캔 (느림)
nmap -sS -T0 192.168.1.1
\`\`\`

**탐지 회피:**
- -T0~T5: 타이밍 조절 (낮을수록 느리고 은밀)
- -D: 디코이 (가짜 IP 추가)
- --spoof-mac: MAC 위조
    `,
    keyPoints: ['Open=SYN+ACK', 'Closed=RST', 'Filtered=무응답', '-sS=SYN 스캔'],
    isWeakness: true,
  },
  {
    id: 'firewall-types',
    category: 'network',
    subcategory: '방화벽',
    title: '방화벽 구성 유형 4가지',
    content: `
**방화벽 구성 유형:**

\`\`\`
1. Screening Router (패킷 필터링 라우터)
┌─────────────────────────────────────────────────┐
│ [외부] ──── [Router] ──── [내부]                 │
│                                                  │
│ • 라우터 1대만 사용                               │
│ • L3/L4 패킷 필터링만 수행                        │
│ • 가장 단순한 구조                                │
└─────────────────────────────────────────────────┘

2. Bastion Host (Dual-homed Gateway)
┌─────────────────────────────────────────────────┐
│ [외부] ──── [Bastion Host] ──── [내부]           │
│               (NIC 2개)                          │
│                                                  │
│ • 듀얼홈드 호스트 1대                             │
│ • 라우팅 비활성화, 모든 트래픽이 호스트 통과       │
│ • 프록시 서버 역할                                │
└─────────────────────────────────────────────────┘

3. Screened Host
┌─────────────────────────────────────────────────┐
│ [외부] ── [Screening Router] ── [Bastion] ── [내부] │
│                                                  │
│ • 스크리닝 라우터 1대 + 베스천 호스트 1대          │
│ • 라우터가 1차 필터링, 베스천이 2차 검사           │
│ • 2단계 방어                                      │
└─────────────────────────────────────────────────┘

4. Screened Subnet (★ 가장 안전)
┌─────────────────────────────────────────────────┐
│ [외부] ── [Router1] ── [ DMZ ] ── [Router2] ── [내부] │
│                       [Bastion]                  │
│                                                  │
│ • Screen Router 2대 + Dual-homed Host 1대        │
│ • 완전한 DMZ 서브넷 형성                          │
│ • 3중 방어 (가장 안전한 구조)                      │
└─────────────────────────────────────────────────┘
\`\`\`

**암기법:**
| 구성 요소 | 방화벽 유형 |
|-----------|-------------|
| 라우터 **1대** | Screening Router |
| 듀얼홈드 **1대** | Bastion Host |
| 라우터 1대 + 베스천 1대 | Screened Host |
| **라우터 2대 + 듀얼홈드 1대** | **Screened Subnet** |

**핵심 포인트:**
- DMZ를 만들려면 최소 2개의 필터링 지점 필요
- Screened Subnet = 외부 라우터 + DMZ + 내부 라우터
- 듀얼홈드(Dual-homed) = NIC 2개를 가진 호스트
    `,
    keyPoints: [
      '라우터 2대 + 듀얼홈드 1대 = Screened Subnet',
      'Screened Subnet이 가장 안전 (3중 방어)',
      '듀얼홈드 1대만 = Bastion Host',
      'DMZ = 라우터 2대 사이 공간'
    ],
    isWeakness: true,
  },
  {
    id: 'switch-sniffing',
    category: 'network',
    subcategory: '스니핑',
    title: '스위치 환경 스니핑 기법 4가지',
    content: `
**왜 스위치에서 스니핑이 어려운가?**
\`\`\`
[허브 환경]                    [스위치 환경]
  A ─┐                           A ─┐
  B ─┼─ HUB ─ 모든 포트 전송       B ─┼─ SWITCH ─ 해당 포트만 전송
  C ─┘   (브로드캐스트)            C ─┘   (MAC 테이블 기반)
      ↓                              ↓
  스니핑 쉬움                    스니핑 어려움 → 특수 기법 필요
\`\`\`

---

## 1. ARP Spoofing (ARP Cache Poisoning)

**원리:** ARP 응답을 위조하여 트래픽을 공격자에게 우회

\`\`\`
[정상 상태]
PC-A (10.0.0.1) ←→ Gateway (10.0.0.254)
     MAC: AA:AA        MAC: GG:GG

[공격 후]
                    ┌─────────────┐
PC-A ──────────────→│  공격자 C   │──────────────→ Gateway
     "GW는 CC:CC"    │  (스니핑)   │  "A는 CC:CC"
                    └─────────────┘

공격자가 양쪽에 거짓 ARP 응답 전송:
  → PC-A에게: "Gateway MAC = CC:CC (공격자)"
  → Gateway에게: "PC-A MAC = CC:CC (공격자)"
  → 모든 트래픽이 공격자를 경유 (MITM)
\`\`\`

**공격 명령어 (arpspoof):**
\`\`\`bash
arpspoof -i eth0 -t 10.0.0.1 10.0.0.254  # 피해자에게
arpspoof -i eth0 -t 10.0.0.254 10.0.0.1  # 게이트웨이에게
echo 1 > /proc/sys/net/ipv4/ip_forward   # 포워딩 활성화
\`\`\`

**방어:** Static ARP, ARP 감시 (arpwatch), 802.1X, VLAN

---

## 2. MAC Flooding (Switch Jamming)

**원리:** CAM 테이블 오버플로우 → 스위치가 허브처럼 동작

\`\`\`
[정상 스위치]
┌──────────────────────────┐
│ CAM Table (MAC 테이블)    │
│ Port1: AA:AA             │
│ Port2: BB:BB             │
│ Port3: CC:CC             │
│ (여유 공간 있음)          │
└──────────────────────────┘
     ↓ 해당 포트로만 전송

[MAC Flooding 공격]
┌──────────────────────────┐
│ CAM Table (가득 참!)      │
│ XX:01, XX:02, XX:03...   │
│ 수만 개의 가짜 MAC 주입    │
│ ❌ 정상 MAC 저장 불가     │
└──────────────────────────┘
     ↓ 모르는 MAC → 모든 포트 전송 (Flooding)
     ↓ 허브처럼 동작 → 스니핑 가능!
\`\`\`

**공격 도구:** macof (dsniff 패키지)
\`\`\`bash
macof -i eth0  # 초당 수천 개 가짜 MAC 전송
\`\`\`

**방어:** Port Security, MAC 개수 제한, 802.1X

---

## 3. SPAN/Port Mirroring 악용

**원리:** 스위치의 관리 기능을 악용하여 트래픽 복제

\`\`\`
[SPAN 설정 예시]
┌─────────────────────────────────────┐
│            SWITCH                   │
│  Port1 ──┐                          │
│  Port2 ──┼── 트래픽 복사 ──→ Port10  │
│  Port3 ──┘     (SPAN)      (모니터) │
└─────────────────────────────────────┘

정상 용도: 네트워크 모니터링, IDS 연결
악용: 공격자가 스위치 접근 → SPAN 설정 → 도청
\`\`\`

**Cisco 스위치 SPAN 설정:**
\`\`\`
switch(config)# monitor session 1 source interface fa0/1
switch(config)# monitor session 1 destination interface fa0/10
\`\`\`

**방어:** 스위치 관리자 접근 통제, 설정 변경 감사

---

## 4. ICMP Redirect

**원리:** 가짜 ICMP Redirect 메시지로 라우팅 경로 변경

\`\`\`
[정상]
PC ────────────────→ Gateway ────→ Internet

[공격]
공격자가 ICMP Redirect 전송:
"더 좋은 경로가 있어! 나한테 보내!"

PC ────→ 공격자 ────→ Gateway ────→ Internet
         (스니핑)
\`\`\`

**방어:** ICMP Redirect 비활성화
\`\`\`bash
sysctl -w net.ipv4.conf.all.accept_redirects=0
\`\`\`

---

## 비교 정리표

| 기법 | 계층 | 원리 | 결과 |
|------|------|------|------|
| **ARP Spoofing** | L2 | ARP 테이블 위조 | MITM |
| **MAC Flooding** | L2 | CAM 테이블 오버플로우 | 스위치 → 허브화 |
| **SPAN 악용** | L2 | 포트 미러링 설정 | 트래픽 복제 |
| **ICMP Redirect** | L3 | 라우팅 경로 변경 | 트래픽 우회 |

**DNS Spoofing은 스니핑이 아님!** (L7 스푸핑 공격)
    `,
    keyPoints: [
      'ARP Spoofing = ARP 위조로 MITM',
      'MAC Flooding = CAM 오버플로우 → 허브화',
      'SPAN = 포트 미러링 악용',
      'DNS Spoofing은 스니핑 X (스푸핑)'
    ],
    isWeakness: true,
  },
  {
    id: 'cyber-kill-chain',
    category: 'network',
    subcategory: 'APT',
    title: '사이버 킬 체인 7단계',
    content: `
**Lockheed Martin 사이버 킬 체인 (Cyber Kill Chain)**

APT(지능형 지속 공격)의 단계별 진행 과정을 모델화

**7단계:**
\`\`\`
1. 정찰 (Reconnaissance)
   └→ 타겟 정보 수집, OSINT, 취약점 조사

2. 무기화 (Weaponization)
   └→ 악성코드 제작, 익스플로잇 + 페이로드 결합

3. 전달 (Delivery)
   └→ 이메일 첨부, 악성 링크, 워터링홀

4. 익스플로잇 (Exploitation)
   └→ 취약점 공격 실행, 코드 실행

5. 설치 (Installation)
   └→ 백도어, RAT, 웹쉘 설치

6. 명령 및 제어 (C2, Command & Control)
   └→ C2 서버와 통신 채널 구축, 원격 제어

7. 행동 및 탈출 (Actions on Objectives)
   └→ 데이터 탈취, 시스템 파괴, 흔적 삭제
\`\`\`

**암기법:** "정무전 익설명행"
- **정**찰 → **무**기화 → **전**달 → **익**스플로잇 → **설**치 → **명**령제어 → **행**동

**주의:**
- "스니핑"은 정찰에서 사용하는 **기법**이지 단계 이름이 아님
- "탈옥"은 iOS 용어로 킬 체인과 무관
- 마지막 단계는 "행동 및 탈출" (Actions on Objectives)
    `,
    keyPoints: [
      '7단계: 정찰→무기화→전달→익스플로잇→설치→C2→행동',
      '첫 단계 = 정찰 (Reconnaissance)',
      '마지막 = 행동 및 탈출 (Actions)',
      '암기: 정무전 익설명행'
    ],
    isWeakness: true,
  },
  {
    id: 'nids-hids',
    category: 'network',
    subcategory: 'IDS',
    title: 'NIDS vs HIDS',
    content: `
**IDS (Intrusion Detection System) 분류:**

| 구분 | NIDS | HIDS |
|------|------|------|
| 위치 | 네트워크 | 호스트 |
| 감시 대상 | 패킷 | 파일, 프로세스, 로그 |
| 암호화 트래픽 | 분석 어려움 | 분석 가능 |
| 내부자 공격 | 탐지 어려움 | 탐지 가능 |
| 설치 범위 | 네트워크당 1개 | 호스트마다 설치 |
| 예시 | Snort, Suricata | OSSEC, Tripwire |

**탐지 방식:**

1. **시그니처 기반 (오용 탐지)**
   - 알려진 공격 패턴 매칭
   - 장점: 오탐 낮음, 빠름
   - 단점: 새로운 공격 탐지 불가

2. **이상 탐지 (Anomaly)**
   - 정상 행동 학습 후 이탈 탐지
   - 장점: 제로데이 탐지 가능
   - 단점: 오탐 높음, 학습 필요

3. **상태 기반 (Stateful)**
   - 연결 상태 추적
   - 분할된 공격 탐지 가능

**IDS vs IPS:**
- IDS: 탐지만 (수동적)
- IPS: 탐지 + 차단 (능동적)
    `,
    keyPoints: ['NIDS=네트워크', 'HIDS=호스트', '시그니처=알려진 공격', '이상탐지=제로데이 가능'],
    isWeakness: true,
  },

  // ==================== 메모리 공격 ====================
  {
    id: 'heap-attacks',
    category: 'memory',
    subcategory: '힙 공격',
    title: 'Heap Overflow vs Heap Spray',
    content: `
**메모리 구조:**
\`\`\`
높은 주소
┌─────────────┐
│    Stack    │ ← 지역변수, 리턴주소
├─────────────┤
│      ↓      │
│    빈 공간   │
│      ↑      │
├─────────────┤
│    Heap     │ ← 동적 할당 (malloc)
├─────────────┤
│    BSS      │ ← 초기화 안 된 전역변수
├─────────────┤
│    Data     │ ← 초기화된 전역변수
├─────────────┤
│    Code     │ ← 실행 코드
└─────────────┘
낮은 주소
\`\`\`

**Heap Overflow:**
- 힙 버퍼의 경계를 초과하여 쓰기
- 인접한 힙 메타데이터 또는 다른 객체 덮어쓰기
- 함수 포인터, vtable 등을 조작하여 코드 실행

**Heap Spray:**
- 힙 영역을 NOP Sled + Shellcode로 가득 채움
- 점프 주소를 정확히 몰라도 공격 성공률 증가
- 브라우저 취약점 공격에 주로 사용
- JavaScript의 대량 문자열 할당 활용

**차이점:**
- Overflow: 경계 초과 → 덮어쓰기
- Spray: 대량 배치 → 확률적 적중
    `,
    keyPoints: ['Overflow=경계초과 덮어쓰기', 'Spray=대량 쉘코드 배치', 'Spray는 브라우저 공격에 사용'],
    isWeakness: true,
  },
  {
    id: 'nop-sled',
    category: 'memory',
    subcategory: '기법',
    title: 'NOP Sled (NOP 슬라이드)',
    content: `
**NOP Sled란?**
쉘코드 앞에 NOP (No Operation) 명령어를 대량으로 배치하는 기법

**동작 원리:**
\`\`\`
메모리:
┌────────────────────────────────────┐
│ NOP NOP NOP NOP NOP NOP │ SHELLCODE │
│ 90  90  90  90  90  90  │   공격코드  │
└────────────────────────────────────┘
      ↓                         ↓
    착륙 지점 (넓음)          실행 목표

점프 주소가 NOP 영역 어디든 떨어지면
→ 미끄러지듯 슬라이드
→ 결국 쉘코드 도달
→ 공격 성공!
\`\`\`

**NOP 명령어:**
- x86: 0x90
- ARM: 다양한 무해한 명령어 사용

**왜 필요한가?**
- ASLR로 정확한 주소 예측 어려움
- 큰 착륙 지점을 만들어 확률 높임

**탐지 방법:**
- 연속된 NOP 바이트 패턴 탐지
- 실행 불가능 영역에서의 코드 실행 감지

**대응 기법:**
- DEP (Data Execution Prevention): 데이터 영역 실행 금지
- ASLR: 메모리 주소 무작위화
- Stack Canary: 스택 변조 탐지
    `,
    keyPoints: ['NOP=0x90', '착륙지점 확대용', '정확한 주소 몰라도 공격 가능'],
    isWeakness: true,
  },
  {
    id: 'dirty-cow-pipe',
    category: 'memory',
    subcategory: '커널 취약점',
    title: 'Dirty COW / Dirty Pipe',
    content: `
**Dirty COW (CVE-2016-5195)**

**취약점 원리:**
- Copy-On-Write (COW) 메커니즘의 경쟁 조건
- 읽기 전용 메모리 매핑에 쓰기 가능

**COW란?**
\`\`\`
프로세스 A, B가 같은 페이지 공유
    ↓
A가 쓰기 시도
    ↓
커널이 페이지 복사 (Copy)
    ↓
복사본에 쓰기 (Write)
\`\`\`

**공격 방법:**
1. /etc/passwd를 읽기 전용으로 매핑
2. 경쟁 조건 유발 (madvise + write 반복)
3. COW 전에 원본 페이지에 쓰기 성공
4. root 패스워드 변경 또는 UID 0 계정 생성

---

**Dirty Pipe (CVE-2022-0847)**

**취약점 원리:**
- 파이프 버퍼의 PIPE_BUF_FLAG_CAN_MERGE 플래그 미초기화
- splice() 시스템 콜을 통해 읽기 전용 파일 수정

**영향받는 버전:**
- Linux 커널 5.8 이상

**공통점:**
| 항목 | Dirty COW | Dirty Pipe |
|------|-----------|------------|
| 결과 | 읽기 전용 파일 수정 | 동일 |
| 권한 상승 | 가능 | 가능 |
| 원인 | 경쟁 조건 | 플래그 미초기화 |
    `,
    keyPoints: ['읽기전용 파일 수정 가능', '권한 상승 공격', 'COW=경쟁조건', 'Pipe=플래그 미초기화'],
    isWeakness: true,
  },

  // ==================== 악성코드 ====================
  {
    id: 'malware-components',
    category: 'malware',
    subcategory: '구성요소',
    title: 'Payload / Trigger / Exploit',
    content: `
**악성코드 3요소:**

**1. Payload (페이로드)**
실제 악성 행위를 수행하는 코드

\`\`\`
종류:
- 파일 삭제/암호화 (랜섬웨어)
- 정보 탈취 (스파이웨어)
- 백도어 설치
- 봇넷 참여
- 크립토마이닝
\`\`\`

**2. Trigger (트리거)**
페이로드가 실행되는 조건

\`\`\`
종류:
- 시간 기반: 특정 날짜/시간 (논리 폭탄)
- 이벤트 기반: 특정 파일 실행, 사용자 행동
- 조건 기반: 특정 조건 충족 시
- 원격 명령: C2 서버로부터 명령 수신
\`\`\`

**3. Exploit (익스플로잇)**
취약점을 이용하여 시스템에 침투하는 코드

\`\`\`
종류:
- 메모리 취약점 (버퍼 오버플로우)
- 웹 취약점 (SQL 인젝션, XSS)
- 권한 상승 취약점
- 제로데이 익스플로잇
\`\`\`

**관계:**
\`\`\`
Exploit(침투) → Trigger(대기) → Payload(실행)
\`\`\`
    `,
    keyPoints: ['Payload=악성행위', 'Trigger=실행조건', 'Exploit=취약점공격'],
    isWeakness: true,
  },

  // ==================== 모바일 ====================
  {
    id: 'android-arch',
    category: 'mobile',
    subcategory: 'Android',
    title: 'Android 아키텍처',
    content: `
**Android 시스템 구조 (아래→위):**

\`\`\`
┌─────────────────────────────────────┐
│         Applications                 │
│    (Gmail, Chrome, 사용자 앱)        │
├─────────────────────────────────────┤
│      Application Framework           │
│  Activity Manager, Content Provider  │
│  Package Manager, Window Manager     │
├─────────────────────────────────────┤
│  Android Runtime │    Libraries      │
│    (ART/Dalvik)  │ (OpenGL, SQLite)  │
├─────────────────────────────────────┤
│   HAL (Hardware Abstraction Layer)   │  ★ 자주 출제!
│     카메라, 오디오, 센서 드라이버     │
├─────────────────────────────────────┤
│           Linux Kernel               │
│   드라이버, 메모리 관리, 보안        │
└─────────────────────────────────────┘
\`\`\`

**HAL (Hardware Abstraction Layer):**
- 하드웨어와 상위 계층 사이의 인터페이스
- 하드웨어 종속성 추상화
- 제조사별 드라이버 구현 통일

**ART vs Dalvik:**
- Dalvik: JIT 컴파일 (실행 시 변환)
- ART: AOT 컴파일 (설치 시 변환) → 더 빠름

**주요 컴포넌트:**
- Activity: 화면 단위
- Service: 백그라운드 작업
- Content Provider: 데이터 공유
- Broadcast Receiver: 시스템 이벤트 수신
    `,
    keyPoints: ['HAL=하드웨어 추상화 계층', 'ART가 Dalvik보다 빠름', '4대 컴포넌트 암기'],
    isWeakness: true,
  },
  {
    id: 'android-concepts',
    category: 'mobile',
    subcategory: 'Android',
    title: 'Android 보안 개념',
    content: `
**Intent:**
컴포넌트 간 통신 메커니즘

\`\`\`
명시적 Intent: 특정 컴포넌트 지정
암시적 Intent: 조건에 맞는 컴포넌트 자동 선택
\`\`\`

**AndroidManifest.xml:**
앱의 모든 정보를 선언하는 필수 파일

\`\`\`xml
<manifest>
    <uses-permission android:name="android.permission.CAMERA"/>
    <uses-permission android:name="android.permission.INTERNET"/>

    <application>
        <activity android:name=".MainActivity"
                  android:exported="false">  <!-- 외부 접근 차단 -->
        </activity>
    </application>
</manifest>
\`\`\`

**보안 설정 (build.gradle):**
\`\`\`gradle
buildTypes {
    release {
        minifyEnabled true    // ProGuard 난독화
        shrinkResources true  // 미사용 리소스 제거
        proguardFiles getDefaultProguardFile('proguard-android.txt')
    }
}
\`\`\`

**minifyEnabled:**
- true: ProGuard로 코드 난독화
- 클래스/메서드 이름을 의미없는 문자로 변경
- 리버스 엔지니어링 어렵게 만듦

**보안 위협:**
- 디컴파일: APK를 소스코드로 역변환
- 리패키징: 앱 변조 후 재배포
- 루팅 탐지 우회: 탈옥 기기에서 악용
    `,
    keyPoints: ['Intent=컴포넌트 통신', 'Manifest=권한 선언', 'minifyEnabled=난독화'],
    isWeakness: true,
  },

  // ==================== 보안 도구 ====================
  {
    id: 'hydra',
    category: 'tools',
    subcategory: '패스워드 크래킹',
    title: 'Hydra 옵션',
    tableComponent: 'HydraOptionsTable',
    content: `
**Hydra란?**
네트워크 서비스에 대한 온라인 패스워드 크래킹 도구

**기본 사용법:**
\`\`\`bash
hydra -l [사용자] -P [패스워드파일] [대상] [서비스]

# 예시
hydra -l admin -P passwords.txt 192.168.1.1 ssh
hydra -L users.txt -P pass.txt ftp://192.168.1.1
hydra -l root -P wordlist.txt 192.168.1.1 mysql
\`\`\`

**지원 서비스:**
SSH, FTP, Telnet, HTTP, HTTPS, SMB, MySQL, MSSQL, PostgreSQL, RDP, VNC 등

**속도 vs 탐지:**
- -t 높음: 빠르지만 탐지 용이, 계정 잠금 위험
- -t 낮음: 느리지만 은밀

**방어 방법:**
- 계정 잠금 정책
- Fail2ban (자동 IP 차단)
- 강력한 패스워드 정책
- 다중 인증 (MFA)
    `,
    keyPoints: ['소문자=단일값', '대문자=파일', '-l/-L, -p/-P 구분'],
    isWeakness: true,
  },
  {
    id: 'security-tools',
    category: 'tools',
    subcategory: '취약점 스캐너',
    title: '보안 도구 분류',
    content: `
**웹 취약점 스캐너:**
| 도구 | 특징 |
|------|------|
| Nikto | 웹 서버 취약점 스캐너, Perl 기반 |
| OWASP ZAP | 웹 앱 동적 분석, 프록시 기능 |
| Burp Suite | 웹 프록시, 수동+자동 테스트 |
| SQLmap | SQL 인젝션 자동화 |

**네트워크 스캐너:**
| 도구 | 특징 |
|------|------|
| Nmap | 포트/서비스/OS 스캔 |
| Nessus | 종합 취약점 스캐너 (상용) |
| OpenVAS | Nessus 오픈소스 대안 |

**시스템 보안:**
| 도구 | 특징 |
|------|------|
| COPS | Unix 보안 감사 (구버전) |
| SARA | 네트워크 취약점 (SATAN 후속) |
| Tripwire | 파일 무결성 검사 |
| AIDE | 파일 무결성 (Tripwire 대안) |
| chkrootkit | 루트킷 탐지 |
| rkhunter | 루트킷/백도어 탐지 |

**패킷 분석:**
| 도구 | 특징 |
|------|------|
| Wireshark | GUI 패킷 분석기 |
| tcpdump | CLI 패킷 캡처 |
| tshark | Wireshark CLI 버전 |
    `,
    keyPoints: ['Nikto=웹서버', 'COPS=Unix감사', 'Tripwire=무결성'],
    isWeakness: true,
  },

  // ==================== 법규 ====================
  {
    id: 'csap-isms',
    category: 'law',
    subcategory: '인증',
    title: 'CSAP / ISMS-P 유효기간',
    content: `
**ISMS-P (정보보호 및 개인정보보호 관리체계):**

| 항목 | 내용 |
|------|------|
| 인증 기관 | KISA |
| 유효기간 | **3년** |
| 사후심사 | 매년 1회 |
| 갱신심사 | 만료 전 갱신 |
| 의무 대상 | ISP, IDC, 대형 쇼핑몰 등 |

**CSAP (클라우드 보안 인증):**

| 항목 | 내용 |
|------|------|
| 인증 기관 | KISA |
| 유효기간 | **3년** |
| 대상 | 클라우드 서비스 제공자 |
| 등급 | 상/중/하 |

**기타 인증:**
| 인증 | 유효기간 | 대상 |
|------|----------|------|
| ISO 27001 | 3년 | 정보보안 관리 |
| CC 인증 | 제품별 상이 | 보안 제품 |
| PCI DSS | 1년 | 카드 결제 |

**의무 인증 대상:**
- 정보통신서비스 매출액 100억 이상
- 정보통신서비스 일평균 이용자 100만 명 이상
- 의료, 교육, 금융 등 법정 의무 대상
    `,
    keyPoints: ['ISMS-P=3년', 'CSAP=3년', '매년 사후심사'],
    isWeakness: true,
  },
];

// 단톡방 자료 학습 내용 병합
export const allStudyItems: StudyItem[] = [...studyItems, ...additionalStudyItems];

export const quizItems: QuizItem[] = [
  {
    id: 'q1',
    category: 'linux',
    question: '리눅스 PAM 모듈에서 패스워드가 3회 틀렸을 때 10분 동안 계정을 잠그는 설정은?',
    options: [
      'deny 3 unlock_time 10',
      'deny 3 unlock_time 600',
      'retry 3 unlock_time 10',
      'retry 3 unlock_time 600',
    ],
    answer: 1,
    explanation: 'deny는 계정 잠금, retry는 재시도 허용. 10분 = 600초',
    isWeakness: true,
  },
  {
    id: 'q2',
    category: 'windows',
    question: '윈도우 관리자 계정 보안설정으로 올바르지 않은 것은?',
    options: [
      '복잡도가 높은 패스워드 설정',
      'Administrator 소속 그룹에서 모든 그룹 제거',
      'Administrator 계정 이름 변경',
      '익명 SID 변환 허용 안 함',
    ],
    answer: 1,
    explanation: '모든 그룹을 제거하면 관리자 권한이 상실됨. 불필요한 그룹만 제거해야 함.',
    isWeakness: true,
  },
  {
    id: 'q3',
    category: 'memory',
    question: '힙 영역에 NOP와 쉘코드를 반복 배치하여 공격 성공률을 높이는 기법은?',
    options: [
      'Heap Overflow',
      'Heap Corruption',
      'Heap Spray',
      'Heap Feng Shui',
    ],
    answer: 2,
    explanation: 'Heap Spray는 힙 전체에 쉘코드를 뿌려서 점프 주소 예측을 용이하게 함',
    isWeakness: true,
  },
  {
    id: 'q4',
    category: 'linux',
    question: '리눅스에서 로그인 실패 기록을 저장하는 바이너리 파일은?',
    options: [
      'utmp',
      'wtmp',
      'lastlog',
      'btmp',
    ],
    answer: 3,
    explanation: 'btmp는 로그인 실패 기록, wtmp는 로그인/로그아웃 이력, utmp는 현재 로그인 사용자',
    isWeakness: true,
  },
];
