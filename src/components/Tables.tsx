'use client';

import React from 'react';

// 공통 테이블 스타일
const tableStyles = {
  wrapper: "overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700",
  table: "w-full text-sm",
  th: "bg-gray-100 dark:bg-gray-800 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700",
  td: "px-4 py-3 border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300",
  lastTd: "px-4 py-3 text-gray-700 dark:text-gray-300",
};

// Syslog Severity 테이블
export function SyslogSeverityTable() {
  const data = [
    { code: 0, name: 'emerg', desc: '시스템 사용 불가', color: 'bg-red-600', textColor: 'text-white' },
    { code: 1, name: 'alert', desc: '즉시 조치 필요', color: 'bg-red-500', textColor: 'text-white' },
    { code: 2, name: 'crit', desc: '치명적 상태', color: 'bg-orange-500', textColor: 'text-white' },
    { code: 3, name: 'err', desc: '오류', color: 'bg-orange-400', textColor: 'text-white' },
    { code: 4, name: 'warning', desc: '경고', color: 'bg-yellow-400', textColor: 'text-gray-900' },
    { code: 5, name: 'notice', desc: '정상이지만 중요', color: 'bg-blue-400', textColor: 'text-white' },
    { code: 6, name: 'info', desc: '정보 메시지', color: 'bg-green-400', textColor: 'text-white' },
    { code: 7, name: 'debug', desc: '디버그', color: 'bg-gray-400', textColor: 'text-white' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-red-500">
        <span>⚠️</span>
        <span>숫자가 낮을수록 심각!</span>
      </div>
      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th}>코드</th>
              <th className={tableStyles.th}>Severity</th>
              <th className={tableStyles.th}>설명</th>
              <th className={tableStyles.th}>레벨</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.code} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${item.color} ${item.textColor} font-bold`}>
                    {item.code}
                  </span>
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} font-mono font-medium`}>
                  {item.name}
                </td>
                <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                  {item.desc}
                </td>
                <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${((8 - item.code) / 8) * 100}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Syslog Facility 테이블
export function SyslogFacilityTable() {
  const data = [
    { code: 0, name: 'kern', desc: '커널 메시지', category: '시스템' },
    { code: 1, name: 'user', desc: '사용자 프로세스', category: '사용자' },
    { code: 2, name: 'mail', desc: '메일 시스템', category: '서비스' },
    { code: 3, name: 'daemon', desc: '시스템 데몬', category: '시스템' },
    { code: 4, name: 'auth', desc: '보안/인증 (login, su)', category: '보안' },
    { code: 5, name: 'syslog', desc: 'syslogd 자체 메시지', category: '시스템' },
    { code: 6, name: 'lpr', desc: '프린터', category: '서비스' },
    { code: 7, name: 'news', desc: '뉴스 서브시스템', category: '서비스' },
    { code: 9, name: 'cron', desc: 'cron 데몬', category: '시스템' },
    { code: 10, name: 'authpriv', desc: '보안/인증 (private)', category: '보안' },
    { code: '16-23', name: 'local0-7', desc: '사용자 정의', category: '커스텀' },
  ];

  const categoryColors: Record<string, string> = {
    '시스템': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    '사용자': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    '서비스': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    '보안': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    '커스텀': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <div className={tableStyles.wrapper}>
      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th className={tableStyles.th}>코드</th>
            <th className={tableStyles.th}>Facility</th>
            <th className={tableStyles.th}>설명</th>
            <th className={tableStyles.th}>분류</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={item.code} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} font-mono font-bold`}>
                {item.code}
              </td>
              <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} font-mono`}>
                {item.name}
              </td>
              <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                {item.desc}
              </td>
              <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[item.category]}`}>
                  {item.category}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 해시 함수 테이블
export function HashFunctionTable() {
  const data = [
    { name: 'MD5', bits: 128, bytes: 16, secure: false, usage: '파일 무결성 (비권장)' },
    { name: 'SHA-1', bits: 160, bytes: 20, secure: false, usage: 'Git 커밋 해시 (비권장)' },
    { name: 'SHA-224', bits: 224, bytes: 28, secure: true, usage: '제한된 환경' },
    { name: 'SHA-256', bits: 256, bytes: 32, secure: true, usage: '디지털 서명, 인증서' },
    { name: 'SHA-384', bits: 384, bytes: 48, secure: true, usage: 'TLS 1.3' },
    { name: 'SHA-512', bits: 512, bytes: 64, secure: true, usage: '고보안 환경' },
  ];

  return (
    <div className="space-y-3">
      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th}>알고리즘</th>
              <th className={tableStyles.th}>출력 (bit)</th>
              <th className={tableStyles.th}>출력 (byte)</th>
              <th className={tableStyles.th}>보안성</th>
              <th className={tableStyles.th}>용도</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} font-mono font-bold`}>
                  {item.name}
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} text-center`}>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-mono">
                    {item.bits}
                  </span>
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} text-center font-mono`}>
                  {item.bytes}
                </td>
                <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                  {item.secure ? (
                    <span className="text-green-500">✓ 안전</span>
                  ) : (
                    <span className="text-red-500">✗ 취약</span>
                  )}
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} text-xs`}>
                  {item.usage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm">
        <strong className="text-yellow-700 dark:text-yellow-300">암기 팁:</strong>
        <span className="text-yellow-600 dark:text-yellow-400 ml-2">
          MD5=128, SHA-1=160, SHA-256=256 (이름에 숫자가 있으면 그게 bit 수!)
        </span>
      </div>
    </div>
  );
}

// 블록 암호 라운드 테이블
export function BlockCipherTable() {
  const data = [
    { name: 'DES', rounds: 16, block: 64, key: 56, note: '페이스텔 구조' },
    { name: '3DES', rounds: 48, block: 64, key: 168, note: 'DES 3회 반복' },
    { name: 'AES-128', rounds: 10, block: 128, key: 128, note: 'SPN 구조' },
    { name: 'AES-192', rounds: 12, block: 128, key: 192, note: 'SPN 구조' },
    { name: 'AES-256', rounds: 14, block: 128, key: 256, note: 'SPN 구조' },
    { name: 'IDEA', rounds: 8.5, block: 64, key: 128, note: '8라운드 + 출력변환' },
    { name: 'SEED', rounds: 16, block: 128, key: 128, note: '국산 암호' },
    { name: 'ARIA', rounds: '12/14/16', block: 128, key: '128/192/256', note: '국산 암호' },
  ];

  return (
    <div className="space-y-3">
      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th}>알고리즘</th>
              <th className={tableStyles.th}>라운드</th>
              <th className={tableStyles.th}>블록 (bit)</th>
              <th className={tableStyles.th}>키 (bit)</th>
              <th className={tableStyles.th}>특징</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} font-mono font-bold`}>
                  {item.name}
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} text-center`}>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full font-bold">
                    {item.rounds}
                  </span>
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} text-center font-mono`}>
                  {item.block}
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} text-center font-mono`}>
                  {item.key}
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} text-xs text-gray-500 dark:text-gray-400`}>
                  {item.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
        <strong className="text-blue-700 dark:text-blue-300">암기 팁:</strong>
        <span className="text-blue-600 dark:text-blue-400 ml-2">
          AES 라운드 = (키 크기 / 32) + 6 → 128/32+6=10, 192/32+6=12, 256/32+6=14
        </span>
      </div>
    </div>
  );
}

// PAM 옵션 테이블
export function PamOptionsTable() {
  const data = [
    { option: 'deny', type: '숫자', desc: '로그인 실패 시 계정 잠금 횟수', example: 'deny=3', important: true },
    { option: 'retry', type: '숫자', desc: '같은 세션에서 재시도 허용 횟수', example: 'retry=3', important: false },
    { option: 'unlock_time', type: '초', desc: '계정 잠금 해제까지 시간', example: 'unlock_time=600', important: true },
    { option: 'root_unlock_time', type: '초', desc: 'root 계정 잠금 해제 시간', example: 'root_unlock_time=600', important: false },
    { option: 'even_deny_root', type: '플래그', desc: 'root 계정에도 잠금 적용', example: 'even_deny_root', important: false },
    { option: 'no_reset', type: '플래그', desc: '성공 시에도 실패 카운트 유지', example: 'no_reset', important: false },
  ];

  return (
    <div className="space-y-3">
      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th}>옵션</th>
              <th className={tableStyles.th}>타입</th>
              <th className={tableStyles.th}>설명</th>
              <th className={tableStyles.th}>예시</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.option} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${item.important ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} font-mono font-bold`}>
                  {item.important && <span className="text-yellow-500 mr-1">★</span>}
                  {item.option}
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}`}>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {item.type}
                  </span>
                </td>
                <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                  {item.desc}
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} font-mono text-xs`}>
                  {item.example}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm">
          <strong className="text-red-700 dark:text-red-300">deny vs retry 차이:</strong>
          <ul className="mt-1 text-red-600 dark:text-red-400 text-xs space-y-1">
            <li>• deny = 계정 <strong>잠금</strong> (보안 정책)</li>
            <li>• retry = 재입력 <strong>기회</strong> (사용자 편의)</li>
          </ul>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
          <strong className="text-blue-700 dark:text-blue-300">시간 변환:</strong>
          <ul className="mt-1 text-blue-600 dark:text-blue-400 text-xs space-y-1">
            <li>• 1분 = 60초</li>
            <li>• 10분 = <strong>600</strong>초 (자주 출제!)</li>
            <li>• 1시간 = 3600초</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Linux 로그 파일 테이블
export function LinuxLogTable() {
  const data = [
    { file: 'utmp', path: '/var/run/utmp', content: '현재 로그인 사용자', format: '바이너리', command: 'who, w', icon: '👤' },
    { file: 'wtmp', path: '/var/log/wtmp', content: '로그인/로그아웃 이력', format: '바이너리', command: 'last', icon: '📋' },
    { file: 'btmp', path: '/var/log/btmp', content: '로그인 실패 기록', format: '바이너리', command: 'lastb', icon: '🚫' },
    { file: 'lastlog', path: '/var/log/lastlog', content: '마지막 로그인 정보', format: '바이너리', command: 'lastlog', icon: '🕐' },
    { file: 'messages', path: '/var/log/messages', content: '시스템 일반 로그', format: '텍스트', command: 'cat, tail', icon: '📝' },
    { file: 'secure', path: '/var/log/secure', content: '인증 관련 로그', format: '텍스트', command: 'cat, tail', icon: '🔐' },
  ];

  return (
    <div className="space-y-3">
      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th}>파일</th>
              <th className={tableStyles.th}>경로</th>
              <th className={tableStyles.th}>내용</th>
              <th className={tableStyles.th}>형식</th>
              <th className={tableStyles.th}>확인 명령어</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.file} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} font-mono font-bold`}>
                  <span className="mr-2">{item.icon}</span>
                  {item.file}
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} font-mono text-xs`}>
                  {item.path}
                </td>
                <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                  {item.content}
                </td>
                <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    item.format === '바이너리'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {item.format}
                  </span>
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} font-mono text-xs`}>
                  {item.command}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm">
        <strong className="text-red-700 dark:text-red-300">⚠️ 주의:</strong>
        <span className="text-red-600 dark:text-red-400 ml-2">
          utmp, wtmp, btmp, lastlog는 <strong>바이너리</strong> 파일! cat으로 볼 수 없음!
        </span>
      </div>
    </div>
  );
}

// Windows 인증 구성요소 테이블
export function WindowsAuthTable() {
  const data = [
    {
      name: 'GINA',
      fullName: 'Graphical Identification and Authentication',
      role: '로그인 UI 담당',
      detail: 'Ctrl+Alt+Del 처리, 사용자 인증 정보 수집',
      note: 'Vista 이후 Credential Provider로 대체',
      layer: 'UI'
    },
    {
      name: 'LSA',
      fullName: 'Local Security Authority',
      role: '인증 정책 관리',
      detail: '로컬 보안 정책 적용, 감사 로그 생성, 보안 토큰 발급',
      note: '핵심 보안 서브시스템',
      layer: '정책'
    },
    {
      name: 'SAM',
      fullName: 'Security Account Manager',
      role: '계정 데이터베이스',
      detail: '사용자 계정 정보와 패스워드 해시 저장',
      note: '경로: %SystemRoot%\\System32\\config\\SAM',
      layer: 'DB'
    },
    {
      name: 'SRM',
      fullName: 'Security Reference Monitor',
      role: '접근 권한 검증',
      detail: 'ACL 기반 권한 체크, 커널 모드에서 동작',
      note: '최종 접근 허가/거부 결정',
      layer: '커널'
    },
  ];

  const layerColors: Record<string, string> = {
    'UI': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    '정책': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    'DB': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    '커널': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="space-y-3">
      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th}>구성요소</th>
              <th className={tableStyles.th}>역할</th>
              <th className={tableStyles.th}>상세</th>
              <th className={tableStyles.th}>계층</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                  <div className="font-bold text-primary-500">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.fullName}</div>
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} font-medium`}>
                  {item.role}
                </td>
                <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                  <div className="text-xs">{item.detail}</div>
                  <div className="text-xs text-gray-400 mt-1">{item.note}</div>
                </td>
                <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${layerColors[item.layer]}`}>
                    {item.layer}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 네트워크 공격 유형 테이블
export function NetworkAttackTable() {
  const data = [
    {
      type: 'Sniffing',
      korean: '도청/스니핑',
      desc: '네트워크 패킷을 몰래 캡처하여 정보 수집',
      example: 'Wireshark, tcpdump, 무차별 모드(Promiscuous)',
      defense: '암호화 통신 (HTTPS, SSH)',
      icon: '👁️',
      color: 'bg-blue-500'
    },
    {
      type: 'Spoofing',
      korean: '위조/스푸핑',
      desc: 'IP, MAC, DNS 등 주소 정보를 위조',
      example: 'ARP Spoofing, DNS Spoofing, IP Spoofing',
      defense: '정적 ARP, DNSSEC',
      icon: '🎭',
      color: 'bg-purple-500'
    },
    {
      type: 'Hijacking',
      korean: '가로채기/하이재킹',
      desc: '이미 수립된 세션을 탈취하여 통신 가로채기',
      example: 'TCP Session Hijacking, RDP Hijacking',
      defense: '암호화, 세션 토큰 관리',
      icon: '🏴‍☠️',
      color: 'bg-red-500'
    },
    {
      type: 'Tunneling',
      korean: '터널링',
      desc: '허용된 프로토콜 내에 데이터를 숨겨 전송',
      example: 'DNS Tunneling, ICMP Tunneling',
      defense: '프로토콜 분석, 이상 탐지',
      icon: '🚇',
      color: 'bg-green-500'
    },
  ];

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.type} className={`rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700`}>
          <div className={`${item.color} px-4 py-2 flex items-center gap-3`}>
            <span className="text-2xl">{item.icon}</span>
            <div>
              <div className="font-bold text-white">{item.type}</div>
              <div className="text-sm text-white/80">{item.korean}</div>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{item.desc}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="font-medium text-gray-500 dark:text-gray-400 mb-1">공격 예시</div>
                <div className="text-gray-700 dark:text-gray-300">{item.example}</div>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="font-medium text-green-600 dark:text-green-400 mb-1">방어 방법</div>
                <div className="text-green-700 dark:text-green-300">{item.defense}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Hydra 옵션 테이블
export function HydraOptionsTable() {
  const data = [
    { option: '-l', desc: '단일 로그인명', example: '-l admin', type: '단일' },
    { option: '-L', desc: '로그인명 파일', example: '-L users.txt', type: '파일' },
    { option: '-p', desc: '단일 패스워드', example: '-p password123', type: '단일' },
    { option: '-P', desc: '패스워드 파일', example: '-P wordlist.txt', type: '파일' },
    { option: '-t', desc: '병렬 연결 수', example: '-t 16', type: '설정' },
    { option: '-vV', desc: '상세 출력', example: '-vV', type: '설정' },
    { option: '-s', desc: '포트 지정', example: '-s 2222', type: '설정' },
    { option: '-o', desc: '결과 파일 저장', example: '-o result.txt', type: '설정' },
  ];

  return (
    <div className="space-y-3">
      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th}>옵션</th>
              <th className={tableStyles.th}>설명</th>
              <th className={tableStyles.th}>예시</th>
              <th className={tableStyles.th}>타입</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.option} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} font-mono font-bold text-lg`}>
                  {item.option}
                </td>
                <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                  {item.desc}
                </td>
                <td className={`${i === data.length - 1 ? tableStyles.lastTd : tableStyles.td} font-mono text-xs`}>
                  {item.example}
                </td>
                <td className={i === data.length - 1 ? tableStyles.lastTd : tableStyles.td}>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    item.type === '단일' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                    item.type === '파일' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {item.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="font-bold text-red-700 dark:text-red-300 mb-2">⚠️ 대소문자 구분 필수!</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="font-mono"><span className="text-blue-500">소문자</span> = 단일 값</div>
            <div className="text-gray-600 dark:text-gray-400">-l admin → 로그인명 1개</div>
            <div className="text-gray-600 dark:text-gray-400">-p pass → 패스워드 1개</div>
          </div>
          <div className="space-y-1">
            <div className="font-mono"><span className="text-orange-500">대문자</span> = 파일 (리스트)</div>
            <div className="text-gray-600 dark:text-gray-400">-L file → 로그인명 여러 개</div>
            <div className="text-gray-600 dark:text-gray-400">-P file → 패스워드 여러 개</div>
          </div>
        </div>
      </div>
    </div>
  );
}
