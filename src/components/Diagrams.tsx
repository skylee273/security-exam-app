'use client';

import React from 'react';

// Windows 인증 흐름 다이어그램
export function WindowsAuthDiagram() {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-x-auto">
      <svg viewBox="0 0 600 200" className="w-full max-w-2xl mx-auto">
        {/* GINA */}
        <rect x="20" y="70" width="100" height="60" rx="8" fill="#3182F6" />
        <text x="70" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">GINA</text>
        <text x="70" y="115" textAnchor="middle" fill="white" fontSize="10">로그인 UI</text>

        {/* Arrow 1 */}
        <path d="M120 100 L160 100" stroke="#6B7684" strokeWidth="2" markerEnd="url(#arrow)" />

        {/* LSA */}
        <rect x="170" y="70" width="100" height="60" rx="8" fill="#34C759" />
        <text x="220" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">LSA</text>
        <text x="220" y="115" textAnchor="middle" fill="white" fontSize="10">인증 정책</text>

        {/* Arrow 2 */}
        <path d="M270 100 L310 100" stroke="#6B7684" strokeWidth="2" markerEnd="url(#arrow)" />

        {/* SAM */}
        <rect x="320" y="70" width="100" height="60" rx="8" fill="#FF9500" />
        <text x="370" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">SAM</text>
        <text x="370" y="115" textAnchor="middle" fill="white" fontSize="10">계정 DB</text>

        {/* Arrow 3 */}
        <path d="M420 100 L460 100" stroke="#6B7684" strokeWidth="2" markerEnd="url(#arrow)" />

        {/* SRM */}
        <rect x="470" y="70" width="100" height="60" rx="8" fill="#FF3B30" />
        <text x="520" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">SRM</text>
        <text x="520" y="115" textAnchor="middle" fill="white" fontSize="10">권한 검증</text>

        {/* Arrow marker definition */}
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#6B7684" />
          </marker>
        </defs>

        {/* Labels */}
        <text x="70" y="150" textAnchor="middle" fill="#8B95A1" fontSize="9">Ctrl+Alt+Del</text>
        <text x="220" y="150" textAnchor="middle" fill="#8B95A1" fontSize="9">토큰 발급</text>
        <text x="370" y="150" textAnchor="middle" fill="#8B95A1" fontSize="9">해시 저장</text>
        <text x="520" y="150" textAnchor="middle" fill="#8B95A1" fontSize="9">ACL 체크</text>
      </svg>
    </div>
  );
}

// 네트워크 공격 유형 다이어그램
export function NetworkAttackDiagram() {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {[
          { name: 'Sniffing', desc: '도청', icon: '👁️', color: 'bg-blue-500' },
          { name: 'Spoofing', desc: '위조', icon: '🎭', color: 'bg-purple-500' },
          { name: 'Hijacking', desc: '탈취', icon: '🏴‍☠️', color: 'bg-red-500' },
          { name: 'Tunneling', desc: '은닉', icon: '🚇', color: 'bg-green-500' },
        ].map((attack) => (
          <div key={attack.name} className={`${attack.color} rounded-xl p-4 text-white text-center`}>
            <div className="text-2xl mb-1">{attack.icon}</div>
            <div className="font-bold">{attack.name}</div>
            <div className="text-sm opacity-80">{attack.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 힙 스프레이 vs 힙 오버플로우
export function HeapAttackDiagram() {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-x-auto">
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        {/* Heap Overflow */}
        <div className="flex-1 max-w-xs">
          <h4 className="text-center font-bold mb-3 text-gray-900 dark:text-white">Heap Overflow</h4>
          <div className="space-y-1">
            <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center text-xs">정상 데이터</div>
            <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center text-xs">정상 데이터</div>
            <div className="h-8 bg-red-400 rounded flex items-center justify-center text-xs text-white font-bold">OVERFLOW →</div>
            <div className="h-8 bg-red-200 dark:bg-red-900 rounded flex items-center justify-center text-xs">덮어쓰기!</div>
          </div>
          <p className="text-xs text-center mt-2 text-gray-500">경계 초과 → 인접 메모리 손상</p>
        </div>

        {/* Heap Spray */}
        <div className="flex-1 max-w-xs">
          <h4 className="text-center font-bold mb-3 text-gray-900 dark:text-white">Heap Spray</h4>
          <div className="grid grid-cols-4 gap-1">
            {Array(16).fill(0).map((_, i) => (
              <div key={i} className="h-6 bg-orange-300 dark:bg-orange-700 rounded flex items-center justify-center text-xs">
                {i % 4 === 3 ? '💀' : 'NOP'}
              </div>
            ))}
          </div>
          <p className="text-xs text-center mt-2 text-gray-500">힙 전체에 쉘코드 뿌리기</p>
        </div>
      </div>
    </div>
  );
}

// NOP Sled 시각화
export function NopSledDiagram() {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex-1 h-10 bg-gradient-to-r from-blue-300 to-blue-500 rounded-l-lg flex items-center justify-center text-xs text-white">
            NOP NOP NOP NOP NOP NOP →
          </div>
          <div className="w-20 h-10 bg-red-500 rounded-r-lg flex items-center justify-center text-xs text-white font-bold">
            SHELLCODE
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-gray-500">점프 →</span>
          <span className="text-blue-500">미끄러짐 →</span>
          <span className="text-red-500">실행!</span>
        </div>
        <p className="text-xs text-center mt-3 text-gray-500 dark:text-gray-400">
          NOP (0x90) = 아무것도 안 함 → 큰 착륙지점 생성
        </p>
      </div>
    </div>
  );
}

// PAM 설정 흐름
export function PamFlowDiagram() {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-x-auto">
      <svg viewBox="0 0 500 150" className="w-full max-w-xl mx-auto">
        {/* 로그인 시도 */}
        <rect x="20" y="50" width="80" height="50" rx="8" fill="#3182F6" />
        <text x="60" y="80" textAnchor="middle" fill="white" fontSize="11">로그인 시도</text>

        <path d="M100 75 L130 75" stroke="#6B7684" strokeWidth="2" markerEnd="url(#arrow2)" />

        {/* PAM 체크 */}
        <rect x="140" y="50" width="80" height="50" rx="8" fill="#FF9500" />
        <text x="180" y="72" textAnchor="middle" fill="white" fontSize="11">PAM</text>
        <text x="180" y="88" textAnchor="middle" fill="white" fontSize="9">deny=3</text>

        {/* 분기 */}
        <path d="M220 75 L260 75" stroke="#6B7684" strokeWidth="2" />

        {/* 성공 */}
        <path d="M260 75 L260 40 L320 40" stroke="#34C759" strokeWidth="2" markerEnd="url(#arrow-green)" />
        <rect x="320" y="20" width="80" height="40" rx="8" fill="#34C759" />
        <text x="360" y="45" textAnchor="middle" fill="white" fontSize="11">로그인 성공</text>

        {/* 실패 3회 */}
        <path d="M260 75 L260 110 L320 110" stroke="#FF3B30" strokeWidth="2" markerEnd="url(#arrow-red)" />
        <rect x="320" y="90" width="80" height="40" rx="8" fill="#FF3B30" />
        <text x="360" y="107" textAnchor="middle" fill="white" fontSize="10">3회 실패</text>
        <text x="360" y="120" textAnchor="middle" fill="white" fontSize="9">→ 잠금</text>

        {/* unlock_time */}
        <path d="M400 110 L440 110" stroke="#6B7684" strokeWidth="2" markerEnd="url(#arrow2)" />
        <text x="470" y="115" textAnchor="middle" fill="#8B95A1" fontSize="10">600초 후 해제</text>

        <defs>
          <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#6B7684" />
          </marker>
          <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#34C759" />
          </marker>
          <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#FF3B30" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

// Android 아키텍처
export function AndroidArchDiagram() {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <div className="max-w-xs mx-auto space-y-2">
        {[
          { name: 'Applications', color: 'bg-blue-400', desc: '앱 레이어' },
          { name: 'Application Framework', color: 'bg-blue-500', desc: 'Activity, Content Provider' },
          { name: 'Android Runtime + Libraries', color: 'bg-green-500', desc: 'ART, OpenGL' },
          { name: 'HAL', color: 'bg-orange-500', desc: '하드웨어 추상화 계층', highlight: true },
          { name: 'Linux Kernel', color: 'bg-gray-700', desc: '커널' },
        ].map((layer, i) => (
          <div
            key={layer.name}
            className={`${layer.color} ${layer.highlight ? 'ring-2 ring-yellow-400' : ''} rounded-lg p-3 text-white text-center`}
          >
            <div className="font-bold text-sm">{layer.name}</div>
            <div className="text-xs opacity-80">{layer.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Syslog Severity 시각화
export function SyslogSeverityDiagram() {
  const severities = [
    { code: 0, name: 'emerg', color: 'bg-red-600' },
    { code: 1, name: 'alert', color: 'bg-red-500' },
    { code: 2, name: 'crit', color: 'bg-orange-500' },
    { code: 3, name: 'err', color: 'bg-orange-400' },
    { code: 4, name: 'warning', color: 'bg-yellow-500' },
    { code: 5, name: 'notice', color: 'bg-blue-400' },
    { code: 6, name: 'info', color: 'bg-green-400' },
    { code: 7, name: 'debug', color: 'bg-gray-400' },
  ];

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <div className="flex items-end justify-center gap-1 h-32">
        {severities.map((s) => (
          <div key={s.code} className="flex flex-col items-center">
            <div
              className={`${s.color} w-8 rounded-t`}
              style={{ height: `${(8 - s.code) * 12 + 20}px` }}
            />
            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">{s.code}</span>
            <span className="text-xs text-gray-500 dark:text-gray-500" style={{ fontSize: '9px' }}>{s.name}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-center mt-2 text-gray-500">← 심각 | 경미 →</p>
    </div>
  );
}

// 암호화 라운드 비교
export function CipherRoundsDiagram() {
  const ciphers = [
    { name: 'DES', rounds: 16, color: 'bg-blue-400' },
    { name: '3DES', rounds: 48, color: 'bg-blue-500' },
    { name: 'AES-128', rounds: 10, color: 'bg-green-400' },
    { name: 'AES-192', rounds: 12, color: 'bg-green-500' },
    { name: 'AES-256', rounds: 14, color: 'bg-green-600' },
    { name: 'IDEA', rounds: 8.5, color: 'bg-purple-400' },
  ];

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <div className="space-y-2 max-w-md mx-auto">
        {ciphers.map((c) => (
          <div key={c.name} className="flex items-center gap-2">
            <span className="w-20 text-xs text-right text-gray-600 dark:text-gray-400">{c.name}</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-5 overflow-hidden">
              <div
                className={`${c.color} h-full rounded-full flex items-center justify-end pr-2`}
                style={{ width: `${(c.rounds / 48) * 100}%` }}
              >
                <span className="text-xs text-white font-bold">{c.rounds}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
