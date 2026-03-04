// 단톡방 자료에서 추출한 추가 기출문제 (1~27회)
// 출처: 쿵땡님 자료, 쑴님 자료, 바나나님 자료

import { Question } from './questionBank';

export const additionalQuestions: Question[] = [
  // ========== 1과목: 시스템 보안 ==========
  {
    id: 10001,
    question: "유닉스에서 현재 실행되고 있는 프로세스 정보가 기록되며, 숨겨진 프로세스를 찾기 위해 참조하는 경로는?",
    options: ["/var", "/proc", "/tmp", "/etc"],
    answer: 1,
    explanation: "/proc은 프로세스 정보를 담고 있는 가상 파일 시스템으로, 현재 실행 중인 프로세스 정보를 확인할 수 있습니다.",
    subject: "1과목: 시스템 보안",
    source: "기출 1~27회"
  },
  {
    id: 10002,
    question: "리눅스에서 사용자의 가장 최근 로그인 시각과 접근 호스트 정보가 기록되는 로그 파일은?",
    options: ["wtmp", "btmp", "lastlog", "utmp"],
    answer: 2,
    explanation: "lastlog는 각 사용자의 가장 최근 로그인 시각과 접근 호스트 정보를 기록합니다. wtmp는 로그인/로그아웃 이력, btmp는 로그인 실패 기록, utmp는 현재 로그인 사용자입니다.",
    subject: "1과목: 시스템 보안",
    source: "기출 1~27회"
  },
  {
    id: 10003,
    question: "리눅스에서 SU(Switch User) 명령어 사용 시 권한 변경(성공 또는 실패) 로그가 기록되는 파일은?",
    options: ["messages", "secure", "sulog", "auth.log"],
    answer: 2,
    explanation: "sulog는 su 명령어 사용 시 권한 변경 시도(성공/실패)를 기록하는 로그 파일입니다.",
    subject: "1과목: 시스템 보안",
    source: "기출 1~27회"
  },
  {
    id: 10004,
    question: "시스템에 로그인한 모든 사용자가 실행한 명령어 정보가 기록되는 파일은?",
    options: ["history", "acct/pacct", "lastlog", "wtmp"],
    answer: 1,
    explanation: "acct(또는 pacct)는 프로세스 어카운팅 파일로, 사용자가 실행한 모든 명령어 정보를 기록합니다.",
    subject: "1과목: 시스템 보안",
    source: "기출 1~27회"
  },
  {
    id: 10005,
    question: "/etc/passwd 파일에서 'test01:x:100:1000:/home/exam:/bin/bash'의 1000은 무엇을 의미하는가?",
    options: ["UID", "GID", "패스워드 만료일", "로그인 횟수"],
    answer: 1,
    explanation: "/etc/passwd 파일 구조: 사용자명:x:UID:GID:설명:홈디렉토리:셸. 1000은 GID(그룹 ID)입니다.",
    subject: "1과목: 시스템 보안",
    source: "기출 1~27회"
  },
  {
    id: 10006,
    question: "윈도우에서 모든 계정의 로그인에 대한 검증 및 시스템 자원에 대한 접근 권한을 검사하는 구성요소는?",
    options: ["SAM", "LSA", "SRM", "GINA"],
    answer: 1,
    explanation: "LSA(Local Security Authority)는 모든 계정의 로그인 검증 및 시스템 자원 접근 권한을 검사합니다. SAM은 패스워드 정보 관리, SRM은 SID 기반 접근 제어입니다.",
    subject: "1과목: 시스템 보안",
    source: "기출 1~27회"
  },
  {
    id: 10007,
    question: "윈도우 인증에서 인증된 사용자에게 SID를 부여하고, SID를 기반으로 파일이나 디렉터리에 대한 접근 허용 여부를 결정하는 구성요소는?",
    options: ["LSA", "SAM", "SRM", "Kerberos"],
    answer: 2,
    explanation: "SRM(Security Reference Monitor)은 인증된 사용자에게 SID를 부여하고, SID를 기반으로 파일/디렉터리 접근을 제어합니다.",
    subject: "1과목: 시스템 보안",
    source: "기출 1~27회"
  },
  {
    id: 10008,
    question: "chmod -s {파일명} 명령어의 의미로 올바른 것은?",
    options: [
      "파일에 읽기 권한 부여",
      "파일에 실행 권한 부여",
      "파일의 SetUID/SetGID 비트 제거",
      "파일의 Sticky Bit 설정"
    ],
    answer: 2,
    explanation: "chmod -s는 파일에 설정된 SetUID(4000) 또는 SetGID(2000) 특수 비트를 제거합니다.",
    subject: "1과목: 시스템 보안",
    source: "기출 1~27회"
  },
  {
    id: 10009,
    question: "find / -user root -type f \\( -perm -4000 -o -perm -2000 \\) 명령어가 검색하는 대상은?",
    options: [
      "root 소유의 실행 가능한 파일",
      "root 소유의 SetUID 또는 SetGID가 설정된 파일",
      "root 그룹의 모든 파일",
      "root 소유의 Sticky Bit가 설정된 파일"
    ],
    answer: 1,
    explanation: "-perm -4000은 SetUID, -perm -2000은 SetGID가 설정된 파일을 검색합니다. root 소유의 특수 비트 설정 파일은 권한 상승 공격에 악용될 수 있어 점검이 필요합니다.",
    subject: "1과목: 시스템 보안",
    source: "기출 1~27회"
  },
  {
    id: 10010,
    question: "Apache 설정에서 디렉터리에 업로드 가능한 최대 파일 크기를 제한하는 지시자는?",
    options: ["MaxRequestLen", "LimitRequestBody", "MaxFileSize", "UploadLimit"],
    answer: 1,
    explanation: "LimitRequestBody는 Apache에서 요청 본문(업로드 파일 포함)의 최대 크기를 바이트 단위로 제한합니다.",
    subject: "1과목: 시스템 보안",
    source: "기출 1~27회"
  },

  // ========== 2과목: 네트워크 보안 ==========
  {
    id: 10011,
    question: "LAN 스위칭 기법 중 프레임의 헤더(목적지 주소)만을 보고 경로를 결정해 주는 방식은?",
    options: ["Store and Forward", "Cut through", "Fragment Free", "Adaptive"],
    answer: 1,
    explanation: "Cut through는 프레임 헤더의 목적지 주소만 확인하여 빠르게 포워딩합니다. Store and Forward는 전체 프레임 수신 후 처리, Fragment Free는 64바이트까지 확인합니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10012,
    question: "LAN 스위칭 기법 중 프레임의 앞 64바이트만을 읽어 에러를 처리하고 목적지 포트로 포워드하는 방식은?",
    options: ["Cut through", "Store and Forward", "Modified Cut through (Fragment Free)", "Express Forward"],
    answer: 2,
    explanation: "Fragment Free(Modified Cut through)는 최소 프레임 크기인 64바이트까지 확인하여 충돌 감지 후 포워딩합니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10013,
    question: "EAP를 통해 인증을 수행하고 AES-CCMP 기반 암호화를 지원하는 무선랜 보안 표준은?",
    options: ["WEP", "WPA", "WPA2", "WPA3"],
    answer: 2,
    explanation: "WPA2는 802.11i 표준으로 EAP 인증과 AES-CCMP 암호화를 지원합니다. WEP은 RC4, WPA는 TKIP를 사용합니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10014,
    question: "VLAN 할당 방법 중 관리자가 각 스위치에서 직접 할당하는 방식을 무엇이라 하는가?",
    options: ["동적 VLAN", "정적 VLAN (포트 기반)", "프로토콜 기반 VLAN", "서브넷 기반 VLAN"],
    answer: 1,
    explanation: "정적 VLAN(Static VLAN, 포트 기반)은 관리자가 스위치 포트별로 VLAN을 직접 할당합니다. 동적 VLAN은 MAC 주소 등을 기반으로 자동 할당됩니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10015,
    question: "IPSec의 세부 프로토콜 중 무결성 보장과 메시지 인증이 가능한 것은?",
    options: ["ESP", "AH", "IKE", "ISAKMP"],
    answer: 1,
    explanation: "AH(Authentication Header)는 무결성 보장과 메시지 인증을 제공합니다. ESP는 기밀성(암호화)도 추가로 제공합니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10016,
    question: "IPSec의 세부 프로토콜 중 암호화를 통한 기밀성 유지가 가능한 것은?",
    options: ["AH", "ESP", "IKE", "ISAKMP"],
    answer: 1,
    explanation: "ESP(Encapsulating Security Payload)는 암호화를 통한 기밀성과 함께 무결성, 인증도 제공합니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10017,
    question: "라우팅 프로토콜 중 거리 벡터 알고리즘을 사용하며, 가장 오래되고 널리 사용되는 내부 라우팅 프로토콜은?",
    options: ["OSPF", "RIP", "EIGRP", "BGP"],
    answer: 1,
    explanation: "RIP(Routing Information Protocol)은 거리 벡터 알고리즘을 사용하는 가장 오래된 내부 라우팅 프로토콜입니다. 최대 홉 수는 15입니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10018,
    question: "라우팅 프로토콜 중 링크 상태 알고리즘을 사용하며, 링크 상태 변화 시에만 라우팅 정보를 교환하는 내부 라우팅 프로토콜은?",
    options: ["RIP", "OSPF", "EIGRP", "BGP"],
    answer: 1,
    explanation: "OSPF(Open Shortest Path First)는 링크 상태 알고리즘을 사용하며, 변화가 있을 때만 LSA(Link State Advertisement)를 전송합니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10019,
    question: "시스코에서 제안한 라우팅 프로토콜로, 거리 벡터와 링크 상태 알고리즘의 장점을 수용한 하이브리드 라우팅 프로토콜은?",
    options: ["RIP", "OSPF", "EIGRP", "IS-IS"],
    answer: 2,
    explanation: "EIGRP(Enhanced Interior Gateway Routing Protocol)는 시스코가 개발한 하이브리드 라우팅 프로토콜로, 빠른 수렴 속도가 장점입니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10020,
    question: "ARP 테이블의 IP 주소와 MAC 주소 매핑 정보를 조작하여 중간에서 데이터를 가로채는 공격 기법은?",
    options: ["DNS Spoofing", "IP Spoofing", "ARP Spoofing", "Session Hijacking"],
    answer: 2,
    explanation: "ARP Spoofing은 가짜 ARP 응답을 보내 피해자의 ARP 테이블을 조작하여 트래픽을 가로채는 MITM 공격입니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10021,
    question: "DNS의 캐시 정보를 조작하여 가짜 사이트로 접속을 유도하는 공격 기법은?",
    options: ["ARP Spoofing", "DNS Cache Poisoning", "Pharming", "Session Hijacking"],
    answer: 1,
    explanation: "DNS Cache Poisoning은 DNS 서버나 클라이언트의 캐시에 잘못된 IP 주소를 삽입하여 가짜 사이트로 유도합니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10022,
    question: "네트워크 진입 시 단말과 사용자를 인증하고, 단말에 대한 지속적인 보안 취약점 점검과 통제를 통해 내부 시스템을 보호하는 솔루션은?",
    options: ["DLP", "NAC", "IPS", "UTM"],
    answer: 1,
    explanation: "NAC(Network Access Control)는 네트워크 접근 제어 솔루션으로, 단말 인증과 보안 상태 점검을 수행합니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10023,
    question: "C2 서버와 통신할 때 도메인명을 지속적으로 변경하여 보안 장비의 탐지를 우회하는 기법은?",
    options: ["Fast Flux", "DGA", "DNS Tunneling", "Domain Fronting"],
    answer: 1,
    explanation: "DGA(Domain Generation Algorithm)는 알고리즘으로 도메인을 동적 생성하여 C2 통신을 은닉합니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10024,
    question: "NTLM, LanMan 해시를 탈취하여 원격 서버 인증을 시도하는 공격 기법은?",
    options: ["Brute Force", "Pass the Hash", "Credential Stuffing", "Rainbow Table"],
    answer: 1,
    explanation: "Pass the Hash는 평문 패스워드 없이 해시 값만으로 인증을 통과하는 공격입니다. NTLM 인증의 취약점을 악용합니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },
  {
    id: 10025,
    question: "IDS에서 정상적인 행위를 이상 행위로 판단하여 탐지하는 상황을 무엇이라 하는가?",
    options: ["미탐 (False Negative)", "오탐 (False Positive)", "정탐 (True Positive)", "정상 (True Negative)"],
    answer: 1,
    explanation: "오탐(False Positive)은 정상을 비정상으로 잘못 판단하는 것입니다. 미탐(False Negative)은 비정상을 정상으로 놓치는 것입니다.",
    subject: "2과목: 네트워크 보안",
    source: "기출 1~27회"
  },

  // ========== 3과목: 애플리케이션 보안 ==========
  {
    id: 10026,
    question: "DB와 연결되어 있는 애플리케이션의 입력값을 조작하여 의도하지 않은 결과를 반환하도록 하는 공격 기법은?",
    options: ["XSS", "SQL Injection", "CSRF", "Command Injection"],
    answer: 1,
    explanation: "SQL Injection은 사용자 입력에 SQL 구문을 삽입하여 데이터베이스를 조작하는 공격입니다.",
    subject: "3과목: 애플리케이션 보안",
    source: "기출 1~27회"
  },
  {
    id: 10027,
    question: "게시판, 웹, 메일 등에 삽입된 악의적인 스크립트에 의해 쿠키 및 기타 개인정보를 특정 사이트로 전송시키는 공격 기법은?",
    options: ["SQL Injection", "XSS (Cross-Site Scripting)", "CSRF", "Clickjacking"],
    answer: 1,
    explanation: "XSS(Cross-Site Scripting)는 악성 스크립트를 삽입하여 사용자의 브라우저에서 실행시키는 공격입니다.",
    subject: "3과목: 애플리케이션 보안",
    source: "기출 1~27회"
  },
  {
    id: 10028,
    question: "적절한 검증 절차를 수행하지 않은 사용자 입력값이 운영체제 명령어의 일부로 전달되어 의도하지 않은 시스템 명령어가 실행되는 공격은?",
    options: ["SQL Injection", "XSS", "OS Command Injection", "LDAP Injection"],
    answer: 2,
    explanation: "OS Command Injection은 시스템 명령어를 삽입하여 서버에서 임의의 명령을 실행하는 공격입니다.",
    subject: "3과목: 애플리케이션 보안",
    source: "기출 1~27회"
  },
  {
    id: 10029,
    question: "공격 대상이 이미 시스템에 접속되어 세션이 연결되어 있는 상태를 가로채는 공격 기법은?",
    options: ["Session Fixation", "Session Hijacking", "Cookie Poisoning", "Session Replay"],
    answer: 1,
    explanation: "Session Hijacking은 활성화된 세션을 탈취하여 인증 없이 시스템에 접근하는 공격입니다.",
    subject: "3과목: 애플리케이션 보안",
    source: "기출 1~27회"
  },
  {
    id: 10030,
    question: "필 짐머만에 의해 개발되었으며 현재 가장 많이 사용되고 있는 이메일 보안 기술은?",
    options: ["S/MIME", "PGP", "PEM", "DKIM"],
    answer: 1,
    explanation: "PGP(Pretty Good Privacy)는 필 짐머만이 개발한 이메일 암호화 기술로, 공개키 암호화와 대칭키 암호화를 결합합니다.",
    subject: "3과목: 애플리케이션 보안",
    source: "기출 1~27회"
  },
  {
    id: 10031,
    question: "엑셀에서 외부 데이터를 전달하는 프로토콜로, 이 기능이 활성화될 시 악용될 수 있는 것은?",
    options: ["OLE", "DDE", "COM", "DCOM"],
    answer: 1,
    explanation: "DDE(Dynamic Data Exchange)는 Windows 애플리케이션 간 데이터 교환 프로토콜로, 악성 매크로 실행에 악용될 수 있습니다.",
    subject: "3과목: 애플리케이션 보안",
    source: "기출 1~27회"
  },
  {
    id: 10032,
    question: "Apache 설정에서 디렉터리 인덱싱 취약점을 대응하기 위해 삭제해야 하는 지시자는?",
    options: ["FollowSymLinks", "Indexes", "ExecCGI", "MultiViews"],
    answer: 1,
    explanation: "Indexes 옵션이 설정되면 디렉터리 내 파일 목록이 노출됩니다. 이를 제거하여 디렉터리 인덱싱 취약점을 방지합니다.",
    subject: "3과목: 애플리케이션 보안",
    source: "기출 1~27회"
  },
  {
    id: 10033,
    question: "클라우드 서비스 이용을 중지했지만 DNS의 CNAME 설정을 삭제하지 않아 공격자가 피싱 사이트로 악용하는 공격은?",
    options: ["DNS Hijacking", "Subdomain Takeover", "DNS Amplification", "Domain Fronting"],
    answer: 1,
    explanation: "Subdomain Takeover는 CNAME이 가리키는 서비스가 해지된 후 공격자가 해당 서비스를 등록하여 서브도메인을 탈취하는 공격입니다.",
    subject: "3과목: 애플리케이션 보안",
    source: "기출 1~27회"
  },

  // ========== 4과목: 정보보안 일반 ==========
  {
    id: 10034,
    question: "DB 암호화 기법 중 암복호화 모듈이 API 라이브러리 형태로 각 애플리케이션 서버에 설치되고, 응용프로그램에서 암복호화 모듈을 호출하는 방식은?",
    options: ["Plug-in 방식", "API 방식", "TDE 방식", "Hybrid 방식"],
    answer: 1,
    explanation: "API 방식은 애플리케이션 서버에 암호화 라이브러리를 설치하고 응용프로그램이 직접 호출합니다.",
    subject: "4과목: 정보보안 일반",
    source: "기출 1~27회"
  },
  {
    id: 10035,
    question: "DB 암호화 기법 중 DBMS에 내장되어 있는 암호화 기능을 이용하여 암복호화 처리를 수행하는 방식은?",
    options: ["API 방식", "Plug-in 방식", "TDE (Transparent Data Encryption)", "Tokenization"],
    answer: 2,
    explanation: "TDE(Transparent Data Encryption)는 DBMS에 내장된 암호화 기능으로, 데이터 파일 수준에서 자동으로 암복호화를 수행합니다.",
    subject: "4과목: 정보보안 일반",
    source: "기출 1~27회"
  },
  {
    id: 10036,
    question: "접근통제 정책 중 사용자나 사용자 그룹에 근거한 사용자 중심의 접근 제어를 수행하는 방법은?",
    options: ["MAC", "DAC", "RBAC", "ABAC"],
    answer: 1,
    explanation: "DAC(Discretionary Access Control)은 데이터 소유자가 사용자나 그룹 단위로 접근 권한을 부여하는 방식입니다.",
    subject: "4과목: 정보보안 일반",
    source: "기출 1~27회"
  },
  {
    id: 10037,
    question: "접근통제 정책 중 모든 객체에 정보의 비밀수준에 근거하여 보안 레벨이 주어지고 허가된 사용자만 접근 가능하도록 제어하는 방법은?",
    options: ["DAC", "MAC", "RBAC", "ABAC"],
    answer: 1,
    explanation: "MAC(Mandatory Access Control)은 시스템이 보안 등급에 따라 강제로 접근을 제어하는 방식입니다. 군사/정부 기관에서 주로 사용됩니다.",
    subject: "4과목: 정보보안 일반",
    source: "기출 1~27회"
  },
  {
    id: 10038,
    question: "접근통제 정책 중 사용자와 객체 상호관계를 역할을 기반으로 접근 권한을 부여하는 방법은?",
    options: ["DAC", "MAC", "RBAC", "LBAC"],
    answer: 2,
    explanation: "RBAC(Role-Based Access Control)은 사용자의 역할(Role)에 따라 접근 권한을 부여하는 방식으로, 관리가 용이합니다.",
    subject: "4과목: 정보보안 일반",
    source: "기출 1~27회"
  },
  {
    id: 10039,
    question: "개인정보 가명처리 기법 중 수치 데이터를 임의의 자리 수 기준으로 올림 또는 내림 처리하는 기법은?",
    options: ["총계처리", "랜덤 라운딩", "범위 방법", "데이터 마스킹"],
    answer: 1,
    explanation: "랜덤 라운딩은 수치 데이터를 무작위로 올림 또는 내림 처리하여 원본 값을 숨기는 가명처리 기법입니다.",
    subject: "4과목: 정보보안 일반",
    source: "기출 1~27회"
  },
  {
    id: 10040,
    question: "여러 개의 프로세스가 공유자원에 동시에 접근할 때 접근하는 순서에 따라 비정상적인 결과가 발생하는 상황을 악용하는 공격 기법은?",
    options: ["Buffer Overflow", "Race Condition", "Integer Overflow", "Format String"],
    answer: 1,
    explanation: "Race Condition은 두 개 이상의 프로세스가 공유 자원에 동시 접근할 때 실행 순서에 따라 결과가 달라지는 취약점입니다.",
    subject: "4과목: 정보보안 일반",
    source: "기출 1~27회"
  },

  // ========== 5과목: 정보보안 관리 및 법규 ==========
  {
    id: 10041,
    question: "개인정보영향평가 수행 안내서에 따른 위험도 산정 공식에서 '위험도 = 자산가치(영향도) + ((A) * (B)) * (C)'의 (A)에 해당하는 것은?",
    options: ["법적 준거성", "침해요인 발생 가능성", "기술적 취약성", "관리적 보안수준"],
    answer: 1,
    explanation: "위험도 산정 공식: 자산가치(영향도) + (침해요인 발생 가능성 * 법적 준거성) * 2",
    subject: "5과목: 정보보안 관리 및 법규",
    source: "기출 1~27회"
  },
  {
    id: 10042,
    question: "ISO 31000 위험평가 방법론 절차 중 운영 실패, 공급망 중단 또는 인재 격차와 같은 외부 및 내부 위험을 고려하여 잠재된 위험을 식별하는 단계는?",
    options: ["위험분석", "위험식별", "위험평가", "위험처리"],
    answer: 1,
    explanation: "ISO 31000 위험평가 절차: 위험식별 → 위험분석 → 위험평가. 위험식별은 잠재적 위험을 찾아내는 첫 단계입니다.",
    subject: "5과목: 정보보안 관리 및 법규",
    source: "기출 1~27회"
  },
  {
    id: 10043,
    question: "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)의 3개 영역에 해당하지 않는 것은?",
    options: ["관리체계 수립 및 운영", "보호대책 요구사항", "개인정보 처리 단계별 요구사항", "기술적 보안 요구사항"],
    answer: 3,
    explanation: "ISMS-P 인증 3개 영역: 1) 관리체계 수립 및 운영, 2) 보호대책 요구사항, 3) 개인정보 처리 단계별 요구사항",
    subject: "5과목: 정보보안 관리 및 법규",
    source: "기출 1~27회"
  },
  {
    id: 10044,
    question: "정보보안 거버넌스의 정의로 올바른 것은?",
    options: [
      "기업의 IT 인프라를 관리하는 체계",
      "정보의 무결성, 서비스 연속성, 정보자산 보호를 위한 기업 거버넌스의 부분집합",
      "보안 소프트웨어 개발 생명주기",
      "침해사고 대응 절차"
    ],
    answer: 1,
    explanation: "정보보안 거버넌스는 기업 거버넌스의 부분집합으로, 정보 무결성, 서비스 연속성, 정보자산 보호를 위한 전략적 방향을 제시합니다.",
    subject: "5과목: 정보보안 관리 및 법규",
    source: "기출 1~27회"
  },
  {
    id: 10045,
    question: "위험관리의 3요소에서 '보호해야 할 대상'을 의미하는 것은?",
    options: ["위협", "취약점", "자산", "위험"],
    answer: 2,
    explanation: "위험관리 3요소: 자산(보호 대상), 위협(손실 원인), 취약점(위협에 의한 손실 가능성을 높이는 약점)",
    subject: "5과목: 정보보안 관리 및 법규",
    source: "기출 1~27회"
  },
  {
    id: 10046,
    question: "위험분석 방법 중 시스템에 관한 전문적인 지식을 가진 전문가 집단을 구성하고, 토론을 통해 위험을 분석하는 방법은?",
    options: ["시나리오법", "델파이법", "순위결정법", "과거자료분석법"],
    answer: 1,
    explanation: "델파이법은 전문가 집단의 의견을 수렴하여 위험을 분석하는 정성적 분석 방법입니다.",
    subject: "5과목: 정보보안 관리 및 법규",
    source: "기출 1~27회"
  },
  {
    id: 10047,
    question: "재해 발생으로 업무 프로세스가 중단되는 경우 예상되는 재무적 손실 등을 고려하여 업무 중요도를 평가하고 RTO, RPO를 결정하는 절차는?",
    options: ["위험분석", "BIA (업무영향분석)", "BCP", "DRP"],
    answer: 1,
    explanation: "BIA(Business Impact Analysis)는 업무 중단 시 영향을 분석하여 RTO(목표 복구 시간), RPO(목표 복구 지점)를 결정합니다.",
    subject: "5과목: 정보보안 관리 및 법규",
    source: "기출 1~27회"
  },
  {
    id: 10048,
    question: "침해사고 대응 7단계에서 '사고 탐지' 다음 단계는?",
    options: ["대응 전략 체계화", "초기 대응", "사고 조사", "보고서 작성"],
    answer: 1,
    explanation: "침해사고 대응 7단계: 사고 전 준비 → 사고 탐지 → 초기 대응 → 대응 전략 체계화 → 사고 조사 → 보고서 작성 → 해결",
    subject: "5과목: 정보보안 관리 및 법규",
    source: "기출 1~27회"
  },
  {
    id: 10049,
    question: "사이버 킬 체인의 7단계를 확장하여 14단계로 구성된 모델은?",
    options: ["ATT&CK Framework", "MITRE ATT&CK", "Diamond Model", "Kill Chain Extended"],
    answer: 1,
    explanation: "MITRE ATT&CK은 사이버 킬 체인을 확장하여 공격 기술과 전술을 14단계로 세분화한 프레임워크입니다.",
    subject: "5과목: 정보보안 관리 및 법규",
    source: "기출 1~27회"
  },
  {
    id: 10050,
    question: "보안 취약점 평가 기준으로, 기밀성/무결성/가용성, 시간성, 악영향, 환경적 요소를 고려하여 공격의 난이도와 피해 규모를 점수화하는 것은?",
    options: ["CVE", "CVSS", "CWE", "CPE"],
    answer: 1,
    explanation: "CVSS(Common Vulnerability Scoring System)는 취약점의 심각도를 0~10점으로 평가하는 표준 시스템입니다.",
    subject: "5과목: 정보보안 관리 및 법규",
    source: "기출 1~27회"
  }
];

// 총 추가 문제 수
export const additionalQuestionsCount = additionalQuestions.length;
