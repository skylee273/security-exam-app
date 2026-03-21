'use client';

import { useState, useEffect, useMemo } from 'react';
import { studyItems, categories, StudyItem } from '@/data/studyData';
import { questionBank, subjects, getQuestionsBySubject, getRandomQuestions, Question } from '@/data/questionBank';
import { practicalWeakness, categoryNames, WeaknessCard } from '@/data/practicalWeakness';
import {
  WindowsAuthDiagram,
  NetworkAttackDiagram,
  HeapAttackDiagram,
  NopSledDiagram,
  PamFlowDiagram,
  AndroidArchDiagram,
  SyslogSeverityDiagram,
  CipherRoundsDiagram,
} from '@/components/Diagrams';

// Icons
const Icons = {
  Sun: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
};

type ViewMode = 'study' | 'bank' | 'crypto' | 'practical';

// 학습 진행률 타입
interface LearningProgress {
  // 퀴즈 기록
  quizHistory: {
    date: string;
    score: number;
    total: number;
    type: 'quick' | 'practice' | 'exam';
  }[];
  // 문제별 정답 기록
  questionStats: {
    [questionId: string]: {
      correct: number;
      wrong: number;
      lastAttempt: string;
    };
  };
  // 과목별 통계
  subjectStats: {
    [subject: string]: {
      correct: number;
      wrong: number;
    };
  };
  // 학습 일자 (연속 학습 체크)
  studyDates: string[];
  // 총 학습 시간 (분)
  totalStudyMinutes: number;
  // 마지막 학습 시간
  lastStudyTime: string;
}

const defaultProgress: LearningProgress = {
  quizHistory: [],
  questionStats: {},
  subjectStats: {},
  studyDates: [],
  totalStudyMinutes: 0,
  lastStudyTime: '',
};

// Diagram mapping
const diagramMap: Record<string, React.ComponentType> = {
  'windows-auth': WindowsAuthDiagram,
  'network-attacks': NetworkAttackDiagram,
  'heap-attacks': HeapAttackDiagram,
  'nop-sled': NopSledDiagram,
  'pam-options': PamFlowDiagram,
  'android-arch': AndroidArchDiagram,
  'syslog-severity': SyslogSeverityDiagram,
  'block-cipher-rounds': CipherRoundsDiagram,
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('study');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showWeaknessOnly, setShowWeaknessOnly] = useState(false);

  // Quiz state (문제은행에서 5개 랜덤)
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  // Question Bank state
  const [bankSubject, setBankSubject] = useState<string>('all');
  const [bankQuestions, setBankQuestions] = useState<Question[]>([]);
  const [bankIndex, setBankIndex] = useState(0);
  const [bankSelected, setBankSelected] = useState<number | null>(null);
  const [bankShowAnswer, setBankShowAnswer] = useState(false);
  const [bankScore, setBankScore] = useState({ correct: 0, total: 0 });
  const [bankMode, setBankMode] = useState<'practice' | 'exam'>('practice');

  // Practical exam subtab state
  const [practicalSubTab, setPracticalSubTab] = useState<'guide' | 'weakness'>('guide');
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());

  // 학습 진행률 state
  const [progress, setProgress] = useState<LearningProgress>(defaultProgress);
  const [sessionStartTime] = useState<Date>(new Date());

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('completedItems');
    if (saved) setCompletedItems(new Set(JSON.parse(saved)));

    const darkSaved = localStorage.getItem('darkMode');
    if (darkSaved) setDarkMode(JSON.parse(darkSaved));

    // 약점 암기 완료 카드 로드
    const masteredSaved = localStorage.getItem('masteredWeaknessCards');
    if (masteredSaved) setMasteredCards(new Set(JSON.parse(masteredSaved)));

    // 학습 진행률 로드
    const progressSaved = localStorage.getItem('learningProgress');
    if (progressSaved) {
      setProgress(JSON.parse(progressSaved));
    }

    // 오늘 학습 기록 추가
    const today = new Date().toISOString().split('T')[0];
    setProgress(prev => {
      if (!prev.studyDates.includes(today)) {
        return {
          ...prev,
          studyDates: [...prev.studyDates, today],
          lastStudyTime: new Date().toISOString(),
        };
      }
      return { ...prev, lastStudyTime: new Date().toISOString() };
    });
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem('completedItems', JSON.stringify([...completedItems]));
  }, [completedItems]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // 학습 진행률 저장
  useEffect(() => {
    localStorage.setItem('learningProgress', JSON.stringify(progress));
  }, [progress]);

  // 약점 암기 완료 카드 저장
  useEffect(() => {
    localStorage.setItem('masteredWeaknessCards', JSON.stringify([...masteredCards]));
  }, [masteredCards]);

  // 세션 종료 시 학습 시간 업데이트
  useEffect(() => {
    const updateStudyTime = () => {
      const minutes = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000);
      if (minutes > 0) {
        setProgress(prev => ({
          ...prev,
          totalStudyMinutes: prev.totalStudyMinutes + minutes,
        }));
      }
    };

    window.addEventListener('beforeunload', updateStudyTime);
    return () => window.removeEventListener('beforeunload', updateStudyTime);
  }, [sessionStartTime]);

  // 퀴즈 문제 로드 (페이지 로드 시 5개 랜덤)
  useEffect(() => {
    setQuizQuestions(getRandomQuestions(5));
  }, []);

  // 퀴즈 완료 시 기록
  useEffect(() => {
    if (showAnswer && currentQuizIndex === quizQuestions.length - 1 && quizScore.total > 0) {
      recordQuizComplete(quizScore.correct, quizScore.total, 'quick');
    }
  }, [showAnswer, currentQuizIndex, quizQuestions.length, quizScore]);

  // 문제은행 완료 시 기록
  useEffect(() => {
    if (bankShowAnswer && bankIndex === bankQuestions.length - 1 && bankScore.total > 0) {
      recordQuizComplete(bankScore.correct, bankScore.total, bankMode === 'exam' ? 'exam' : 'practice');
    }
  }, [bankShowAnswer, bankIndex, bankQuestions.length, bankScore, bankMode]);

  // Filter study items
  const filteredItems = studyItems.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWeakness = !showWeaknessOnly || item.isWeakness;
    return matchesCategory && matchesSearch && matchesWeakness;
  });

  // 카드 확장 시 상단으로 스크롤
  const handleCardExpand = (id: string) => {
    const newExpanded = expandedCard === id ? null : id;
    setExpandedCard(newExpanded);
    if (newExpanded) {
      setTimeout(() => {
        const element = document.getElementById(`card-${id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const studyProgress = Math.round((completedItems.size / studyItems.length) * 100);

  const toggleComplete = (id: string) => {
    const newSet = new Set(completedItems);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setCompletedItems(newSet);
  };

  // 문제 결과 기록
  const recordQuestionResult = (question: Question, isCorrect: boolean) => {
    const questionId = `${question.subject}-${question.question.substring(0, 30)}`;
    setProgress(prev => ({
      ...prev,
      questionStats: {
        ...prev.questionStats,
        [questionId]: {
          correct: (prev.questionStats[questionId]?.correct || 0) + (isCorrect ? 1 : 0),
          wrong: (prev.questionStats[questionId]?.wrong || 0) + (isCorrect ? 0 : 1),
          lastAttempt: new Date().toISOString(),
        },
      },
      subjectStats: {
        ...prev.subjectStats,
        [question.subject]: {
          correct: (prev.subjectStats[question.subject]?.correct || 0) + (isCorrect ? 1 : 0),
          wrong: (prev.subjectStats[question.subject]?.wrong || 0) + (isCorrect ? 0 : 1),
        },
      },
    }));
  };

  // 퀴즈 완료 기록
  const recordQuizComplete = (score: number, total: number, type: 'quick' | 'practice' | 'exam') => {
    setProgress(prev => ({
      ...prev,
      quizHistory: [
        ...prev.quizHistory,
        {
          date: new Date().toISOString(),
          score,
          total,
          type,
        },
      ],
    }));
  };

  // Quiz handlers (문제은행에서 랜덤 5개)
  const currentQuizQuestion = quizQuestions[currentQuizIndex];

  const handleQuizAnswer = (index: number) => {
    if (showAnswer || !currentQuizQuestion) return;
    setSelectedAnswer(index);
    setShowAnswer(true);
    const isCorrect = index === currentQuizQuestion.answer;
    setQuizScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    // 진행률 기록
    recordQuestionResult(currentQuizQuestion, isCorrect);
  };

  const nextQuiz = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setSelectedAnswer(null);
      setShowAnswer(false);
      setCurrentQuizIndex(prev => prev + 1);
    }
  };

  const resetQuiz = () => {
    setQuizQuestions(getRandomQuestions(5));
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setQuizScore({ correct: 0, total: 0 });
  };

  // Question Bank handlers
  const startBankQuiz = (mode: 'practice' | 'exam', subject?: string) => {
    setBankMode(mode);
    setBankScore({ correct: 0, total: 0 });
    setBankIndex(0);
    setBankSelected(null);
    setBankShowAnswer(false);

    if (mode === 'exam') {
      // 모의고사: 과목당 20문제 (총 100문제)
      const examQuestions: Question[] = [];
      for (const sub of subjects) {
        const subQuestions = getQuestionsBySubject(sub);
        const shuffled = [...subQuestions].sort(() => Math.random() - 0.5);
        examQuestions.push(...shuffled.slice(0, 20));
      }
      setBankQuestions(examQuestions);
    } else {
      // 연습 모드
      if (subject && subject !== 'all') {
        setBankQuestions(getRandomQuestions(20, subject));
      } else {
        setBankQuestions(getRandomQuestions(20));
      }
    }
  };

  const handleBankAnswer = (index: number) => {
    if (bankShowAnswer) return;
    setBankSelected(index);
    setBankShowAnswer(true);
    const currentQ = bankQuestions[bankIndex];
    const isCorrect = index === currentQ.answer;
    setBankScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    // 진행률 기록
    recordQuestionResult(currentQ, isCorrect);
  };

  const nextBankQuestion = () => {
    if (bankIndex < bankQuestions.length - 1) {
      setBankIndex(prev => prev + 1);
      setBankSelected(null);
      setBankShowAnswer(false);
    }
  };

  const currentBankQuestion = bankQuestions[bankIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              정보보안기사 학습앱
            </h1>
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {[
              { id: 'study', label: '학습', icon: '📚' },
              { id: 'bank', label: '문제은행', icon: '🏦' },
              { id: 'crypto', label: '암호학', icon: '🔐' },
              { id: 'practical', label: '실기대비', icon: '✍️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as ViewMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                  viewMode === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          {viewMode === 'study' && (
            <div className="relative mt-4">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Category Filter & Weakness Toggle */}
        {viewMode === 'study' && (
          <div className="mb-6">
            {/* Weakness Toggle */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowWeaknessOnly(!showWeaknessOnly)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  showWeaknessOnly
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>🎯</span>
                <span>약점만 보기</span>
                {showWeaknessOnly && <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">ON</span>}
              </button>
              {showWeaknessOnly && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredItems.length}개 약점
                </span>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                전체
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Study View */}
        {viewMode === 'study' && (
          <div className="grid gap-4">
            {filteredItems.map(item => (
              <div key={item.id} id={`card-${item.id}`}>
                <StudyCard
                  item={item}
                  isCompleted={completedItems.has(item.id)}
                  isExpanded={expandedCard === item.id}
                  onToggleComplete={() => toggleComplete(item.id)}
                  onToggleExpand={() => handleCardExpand(item.id)}
                  DiagramComponent={diagramMap[item.id]}
                />
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {showWeaknessOnly ? '약점 항목이 없습니다.' : '검색 결과가 없습니다.'}
              </div>
            )}
          </div>
        )}

        {/* Question Bank View */}
        {viewMode === 'bank' && (
          <div className="max-w-2xl mx-auto">
            {/* Mode Selection */}
            {bankQuestions.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🏦 문제 은행 <span className="text-sm font-normal text-gray-500">({questionBank.length}문제)</span>
                </h2>

                {/* Subject Distribution */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {subjects.map((sub, i) => {
                    const count = getQuestionsBySubject(sub).length;
                    return (
                      <div key={sub} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400">{sub}</div>
                        <div className="font-bold text-gray-900 dark:text-white">{count}문제</div>
                      </div>
                    );
                  })}
                </div>

                {/* Practice Mode */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">연습 모드</h3>
                  <div className="mb-3">
                    <select
                      value={bankSubject}
                      onChange={(e) => setBankSubject(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">전체 과목</option>
                      {subjects.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => startBankQuiz('practice', bankSubject)}
                    className="w-full py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600"
                  >
                    연습 시작 (20문제)
                  </button>
                </div>

                {/* Exam Mode */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">모의고사 모드</h3>
                  <button
                    onClick={() => startBankQuiz('exam')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:opacity-90"
                  >
                    모의고사 시작 (과목당 20문제 = 100문제)
                  </button>
                </div>
              </div>
            )}

            {/* Quiz in Progress */}
            {bankQuestions.length > 0 && currentBankQuestion && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      bankMode === 'exam' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {bankMode === 'exam' ? '모의고사' : '연습'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {bankIndex + 1} / {bankQuestions.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-primary-500">
                      정답률: {bankScore.total > 0 ? Math.round((bankScore.correct / bankScore.total) * 100) : 0}%
                    </span>
                    <button
                      onClick={() => setBankQuestions([])}
                      className="text-xs text-gray-500 hover:text-red-500"
                    >
                      종료
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full bg-primary-500 transition-all"
                    style={{ width: `${((bankIndex + 1) / bankQuestions.length) * 100}%` }}
                  />
                </div>

                {/* Subject Badge */}
                <div className="mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    {currentBankQuestion.subject}
                  </span>
                </div>

                {/* Question */}
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {currentBankQuestion.question}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {currentBankQuestion.options.map((option, index) => {
                    const isCorrect = index === currentBankQuestion.answer;
                    const isSelected = index === bankSelected;
                    let buttonClass = 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-transparent';
                    if (bankShowAnswer) {
                      if (isCorrect) buttonClass = 'bg-green-100 dark:bg-green-900/50 border-green-500';
                      else if (isSelected) buttonClass = 'bg-red-100 dark:bg-red-900/50 border-red-500';
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleBankAnswer(index)}
                        disabled={bankShowAnswer}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${buttonClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-gray-900 dark:text-white">{option}</span>
                          {bankShowAnswer && isCorrect && <span className="ml-auto text-green-500"><Icons.Check /></span>}
                          {bankShowAnswer && isSelected && !isCorrect && <span className="ml-auto text-red-500"><Icons.X /></span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Answer & Next */}
                {bankShowAnswer && (
                  <>
                    <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>해설:</strong> {currentBankQuestion.explanation}
                      </p>
                    </div>

                    {bankIndex < bankQuestions.length - 1 ? (
                      <button
                        onClick={nextBankQuestion}
                        className="mt-6 w-full py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 flex items-center justify-center gap-2"
                      >
                        다음 문제 <Icons.ChevronRight />
                      </button>
                    ) : (
                      <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30">
                        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
                          {bankMode === 'exam' ? '🎓 모의고사 완료!' : '✨ 연습 완료!'}
                        </h3>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary-500 mb-1">
                            {Math.round((bankScore.correct / bankScore.total) * 100)}점
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {bankScore.correct} / {bankScore.total} 정답
                          </div>
                        </div>
                        <button
                          onClick={() => setBankQuestions([])}
                          className="mt-4 w-full py-3 rounded-xl bg-primary-500 text-white font-medium"
                        >
                          다시 시작
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Crypto View - 암호학 암기 탭 */}
        {viewMode === 'crypto' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                🔐 암호학 총정리 (시험 전 필수 암기!)
              </h2>

              {/* 대칭키 vs 공개키 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary-500 mb-3">1. 대칭키 vs 공개키 암호</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">구분</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">대칭키</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">공개키</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-semibold">키 개수</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">n(n-1)/2</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">2n</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-semibold">속도</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-green-600">빠름</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-red-600">느림</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-semibold">키 배송</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-red-600">어려움</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-green-600">쉬움</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-semibold">예시</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">DES, AES, SEED, ARIA</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">RSA, ECC, Elgamal</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 대칭키 알고리즘 상세 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary-500 mb-3">2. 대칭키 알고리즘 비교 ⭐️</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">알고리즘</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">블록</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">키</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">라운드</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">구조</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">비고</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-red-500">DES</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">64bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">56bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">16</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">Feistel</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">미국, 취약</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-orange-500">3DES</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">64bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">168bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">16×3</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">Feistel×3</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">DES 3번 적용</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-blue-500">AES</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">128bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">128/192/256</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">10/12/14</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">SPN</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">미국 표준</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-green-500">SEED</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">128bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">128bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">16</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">Feistel</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">🇰🇷 한국</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-green-500">ARIA</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">128bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">128/192/256</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">12/14/16</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">SPN</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">🇰🇷 한국 표준</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-green-500">LEA</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">128bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">128/192/256</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">24/28/32</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">ARX</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">🇰🇷 경량암호</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-green-500">HIGHT</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">64bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">128bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">32</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">GFN</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">🇰🇷 IoT용</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>🇰🇷 한국 암호:</strong> SEED, ARIA, LEA, HIGHT (모두 대칭키!)
                  </p>
                </div>
              </div>

              {/* 블록 암호 운영모드 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary-500 mb-3">3. 블록 암호 운영모드 ⭐️⭐️ (자주 출제!)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">모드</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">IV</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">패딩</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">암호화 병렬</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">복호화 병렬</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">특징</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">ECB</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-red-500">❌</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">필요</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-green-500">✅</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-green-500">✅</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">단순, 패턴노출 취약</td>
                      </tr>
                      <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-blue-600">CBC ⭐️</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-green-500">✅</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">필요</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-red-500">❌</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-green-500 font-bold">✅</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">가장 많이 사용</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">CFB</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-green-500">✅</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-blue-500">불필요</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-red-500">❌</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-green-500">✅</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">스트림처럼</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">OFB</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-green-500">✅</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-blue-500">불필요</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-red-500">❌</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-red-500">❌</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">키스트림 미리 생성</td>
                      </tr>
                      <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-blue-600">CTR ⭐️</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">카운터</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-blue-500">불필요</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-green-500">✅</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-green-500">✅</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">카운터 암호화 (난수X!)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    <strong>⚠️ 시험 포인트:</strong><br/>
                    • CBC 복호화 = 병렬처리 <strong>가능!</strong> (암호화만 불가)<br/>
                    • CTR 키스트림 = <strong>1씩 증가하는 카운터를 암호화</strong> (난수 아님!)<br/>
                    • 패딩 필요 = ECB, CBC만!
                  </p>
                </div>
              </div>

              {/* 해시 함수 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary-500 mb-3">4. 해시 함수 출력 비트 ⭐️</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">알고리즘</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">출력 비트</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">암기법</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-red-50 dark:bg-red-900/20">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">MD5</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-red-500">128bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">MD5 = 128 (예외!)</td>
                      </tr>
                      <tr className="bg-red-50 dark:bg-red-900/20">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">SHA-1</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-red-500">160bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">SHA-1 = 160 (예외!)</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">SHA-224</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">224bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">숫자 그대로</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">SHA-256</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">256bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">숫자 그대로</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">SHA-384</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">384bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">숫자 그대로</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">SHA-512</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">512bit</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">숫자 그대로</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 공개키 알고리즘 수학적 기반 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary-500 mb-3">5. 공개키 알고리즘 수학적 기반</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">수학적 기반</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">알고리즘</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">용도</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-blue-50 dark:bg-blue-900/20">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-blue-600">소인수분해</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">RSA, Rabin</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">암호화, 서명</td>
                      </tr>
                      <tr className="bg-green-50 dark:bg-green-900/20">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-green-600">이산대수</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">Diffie-Hellman, Elgamal, DSA</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">키교환, 암호화, 서명</td>
                      </tr>
                      <tr className="bg-purple-50 dark:bg-purple-900/20">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold text-purple-600">타원곡선(이산대수)</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">ECC, ECDSA, ECDH</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">짧은 키로 높은 보안</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>암기:</strong> 이산대수 + 키교환 = <strong>Diffie-Hellman</strong>
                  </p>
                </div>
              </div>

              {/* 전자서명 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary-500 mb-3">6. 전자서명 종류</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">서명 종류</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">특징</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">용도</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">은닉서명</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">서명자가 내용 모름</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2"><strong>익명성</strong> (Ecash)</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">이중서명</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">두 정보를 분리 서명</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2"><strong>SET</strong> (전자상거래)</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">그룹서명</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">그룹 구성원 대표 서명</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">조직 대표</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">링서명</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">누가 서명했는지 모름</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">내부고발</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Kerberos */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary-500 mb-3">7. Kerberos 인증</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>구성요소:</strong> KDC (AS + TGS), 티켓, 타임스탬프
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>재생공격 방지:</strong> <span className="text-red-500 font-bold">타임스탬프</span>
                  </p>
                </div>
              </div>

              {/* 인증서 검증 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary-500 mb-3">8. 인증서 폐기 확인</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">방식</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2">특징</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">CRL</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">주기적 목록 배포 (오프라인)</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-bold">OCSP</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2"><strong>실시간</strong> 온라인 확인</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Practical Exam View - 실기 유형 대비 */}
        {viewMode === 'practical' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 서브탭 버튼 */}
            <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-xl shadow-card p-2">
              <button
                onClick={() => setPracticalSubTab('guide')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  practicalSubTab === 'guide'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                📋 시험안내
              </button>
              <button
                onClick={() => setPracticalSubTab('weakness')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  practicalSubTab === 'weakness'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                🔴 약점암기
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  practicalSubTab === 'weakness' ? 'bg-red-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {practicalWeakness.length - masteredCards.size}
                </span>
              </button>
            </div>

            {/* 시험안내 탭 */}
            {practicalSubTab === 'guide' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                ✍️ 실기시험 유형 대비
              </h2>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>정보보안기사 실기시험:</strong> 총 16문제 (단답형 10문제 + 서술형 6문제) / 100점 만점 / 60점 이상 합격
                </p>
              </div>

              {/* 단답형 유형 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary-500 mb-3 flex items-center gap-2">
                  📝 단답형 (10문제, 각 3점 = 30점)
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. 빈칸 채우기</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      문장에서 핵심 용어나 개념을 빈칸으로 제시
                    </p>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>예시:</strong> ( ① )은(는) 공격자가 희생자의 MAC 주소를 자신의 것으로 위조하여 네트워크 트래픽을 가로채는 공격이다.
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">정답: ARP Spoofing</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. 명령어/설정값</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      리눅스/윈도우 명령어, 설정 파일 내용
                    </p>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>예시:</strong> 리눅스에서 파일 권한을 rwxr-x--- 로 설정하는 chmod 명령어를 8진수로 작성하시오.
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">정답: chmod 750 파일명</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. 약어/용어 풀이</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      보안 약어의 풀네임이나 정의
                    </p>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>예시:</strong> SIEM의 풀네임을 영문으로 작성하시오.
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">정답: Security Information and Event Management</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 서술형 유형 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary-500 mb-3 flex items-center gap-2">
                  📄 서술형 (6문제, 각 10~14점 = 70점)
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. 개념 설명형</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      특정 보안 개념/기술의 정의, 특징, 절차 설명
                    </p>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>예시:</strong> 전자서명의 5가지 특징을 설명하시오.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. 로그/패킷 분석형</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      주어진 로그나 패킷을 보고 공격 유형 판단, 대응방안 제시
                    </p>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>예시:</strong> 아래 Snort 로그를 분석하여 공격 유형과 대응방안을 서술하시오.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. 설정/구성형</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      방화벽 정책, iptables 규칙, 보안 설정 작성
                    </p>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>예시:</strong> 외부에서 웹서버(192.168.1.10)의 80포트 접근만 허용하는 iptables 명령어를 작성하시오.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. 법규/관리형</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      개인정보보호법, ISMS-P 관련 절차/조치사항
                    </p>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>예시:</strong> 개인정보 유출 시 정보주체에게 통지해야 하는 5가지 항목을 쓰시오.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 자주 출제되는 주제 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary-500 mb-3 flex items-center gap-2">
                  🔥 자주 출제되는 주제
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">시스템 보안</h4>
                    <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                      <li>• 리눅스 파일 권한 (chmod, umask)</li>
                      <li>• SetUID/SetGID/Sticky Bit</li>
                      <li>• /etc/passwd, /etc/shadow 구조</li>
                      <li>• 버퍼 오버플로우 대응</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">네트워크 보안</h4>
                    <ul className="text-sm text-orange-600 dark:text-orange-400 space-y-1">
                      <li>• iptables 명령어 작성</li>
                      <li>• Snort 룰 작성/분석</li>
                      <li>• ARP/DNS Spoofing</li>
                      <li>• VPN, SSL/TLS</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">애플리케이션 보안</h4>
                    <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                      <li>• SQL Injection 방어</li>
                      <li>• XSS 취약점 대응</li>
                      <li>• 시큐어코딩</li>
                      <li>• 웹 취약점 분석</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">암호학/법규</h4>
                    <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                      <li>• 암호 알고리즘 비교</li>
                      <li>• 전자서명/PKI</li>
                      <li>• 개인정보보호법</li>
                      <li>• ISMS-P 인증 기준</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 실기 팁 */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">💡 실기 합격 팁</h4>
                <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
                  <li>• <strong>부분 점수</strong>를 노려라! 모르는 문제도 아는 만큼 적기</li>
                  <li>• 단답형은 <strong>정확한 용어</strong> 사용 (오타 주의)</li>
                  <li>• 서술형은 <strong>번호를 붙여서</strong> 체계적으로 작성</li>
                  <li>• <strong>시간 배분:</strong> 단답형 30분, 서술형 90분</li>
                  <li>• 최근 기출 트렌드 확인 필수 (KISA 보안 동향)</li>
                </ul>
              </div>
            </div>
            )}

            {/* 약점암기 탭 - 플래시카드 */}
            {practicalSubTab === 'weakness' && (
            <div className="space-y-6">
              {/* 진행 상황 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    🔴 약점 플래시카드
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      암기 완료: <span className="font-bold text-green-600">{masteredCards.size}</span> / {practicalWeakness.length}
                    </span>
                    {masteredCards.size > 0 && (
                      <button
                        onClick={() => setMasteredCards(new Set())}
                        className="text-xs text-red-500 hover:text-red-600 underline"
                      >
                        초기화
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(masteredCards.size / practicalWeakness.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  카드를 클릭하면 정답이 보입니다. 암기한 카드는 체크 표시하세요.
                </p>
              </div>

              {/* 카테고리별 카드 */}
              {(['system', 'network', 'application', 'crypto', 'law'] as const).map(category => {
                const cards = practicalWeakness.filter(w => w.category === category);
                const unmasteredCards = cards.filter(c => !masteredCards.has(c.id));
                if (unmasteredCards.length === 0 && masteredCards.size > 0) return null;

                return (
                  <div key={category} className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${
                        category === 'system' ? 'bg-red-500' :
                        category === 'network' ? 'bg-orange-500' :
                        category === 'application' ? 'bg-green-500' :
                        category === 'crypto' ? 'bg-blue-500' : 'bg-purple-500'
                      }`} />
                      {categoryNames[category]}
                      <span className="text-sm font-normal text-gray-500">
                        ({cards.filter(c => masteredCards.has(c.id)).length}/{cards.length} 완료)
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cards.map(card => (
                        <div
                          key={card.id}
                          className={`relative group cursor-pointer transition-all duration-300 ${
                            masteredCards.has(card.id) ? 'opacity-50' : ''
                          }`}
                        >
                          <div
                            onClick={() => {
                              setFlippedCards(prev => {
                                const next = new Set(prev);
                                if (next.has(card.id)) {
                                  next.delete(card.id);
                                } else {
                                  next.add(card.id);
                                }
                                return next;
                              });
                            }}
                            className={`min-h-[160px] p-4 rounded-xl border-2 transition-all duration-300 ${
                              flippedCards.has(card.id)
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600'
                            } ${masteredCards.has(card.id) ? 'border-green-400 dark:border-green-600' : ''}`}
                          >
                            {!flippedCards.has(card.id) ? (
                              // 앞면 - 질문
                              <div className="h-full flex flex-col">
                                <div className="flex-1">
                                  <div className="text-xs text-primary-500 font-semibold mb-2">{card.keyword}</div>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{card.question}</p>
                                </div>
                                {card.hint && (
                                  <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">💡 힌트: {card.hint}</p>
                                  </div>
                                )}
                                <div className="absolute bottom-2 right-2 text-xs text-gray-400">클릭하여 정답 보기</div>
                              </div>
                            ) : (
                              // 뒷면 - 정답
                              <div className="h-full flex flex-col">
                                <div className="flex-1">
                                  <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-2">정답</div>
                                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">{card.answer}</pre>
                                </div>
                                <div className="absolute bottom-2 right-2 text-xs text-gray-400">클릭하여 질문 보기</div>
                              </div>
                            )}
                          </div>

                          {/* 암기 완료 체크 버튼 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMasteredCards(prev => {
                                const next = new Set(prev);
                                if (next.has(card.id)) {
                                  next.delete(card.id);
                                } else {
                                  next.add(card.id);
                                }
                                return next;
                              });
                            }}
                            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              masteredCards.has(card.id)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100'
                            }`}
                            title={masteredCards.has(card.id) ? '암기 취소' : '암기 완료'}
                          >
                            <Icons.Check />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* 모두 완료 메시지 */}
              {masteredCards.size === practicalWeakness.length && (
                <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl shadow-card p-8 text-center text-white">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold mb-2">모든 약점 암기 완료!</h3>
                  <p className="text-green-100">실기 시험 준비 완벽! 화이팅!</p>
                </div>
              )}
            </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          정보보안기사 시험 대비 학습앱 | Made with Claude Code
        </div>
      </footer>
    </div>
  );
}

// 연속 학습일 계산
function calculateStreak(studyDates: string[]): number {
  if (studyDates.length === 0) return 0;

  const sortedDates = [...studyDates].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // 오늘 또는 어제 학습하지 않았으면 streak 0
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = new Date(sortedDates[i]);
    const prev = new Date(sortedDates[i + 1]);
    const diffDays = Math.round((current.getTime() - prev.getTime()) / 86400000);

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// 통계 카드 컴포넌트
function StatCard({ icon, label, value, subtext }: { icon: string; label: string; value: string; subtext: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      {subtext && <div className="text-xs text-primary-500 mt-1">{subtext}</div>}
    </div>
  );
}

// Markdown to HTML converter (테이블 지원)
function parseMarkdown(content: string): string {
  let html = content;

  // 1. 코드 블록 먼저 처리 (테이블과 충돌 방지)
  const codeBlocks: string[] = [];
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const index = codeBlocks.length;
    codeBlocks.push(`<pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs my-3 font-mono"><code>${code.trim()}</code></pre>`);
    return `__CODE_BLOCK_${index}__`;
  });

  // 2. 마크다운 테이블 → HTML 테이블
  html = html.replace(/\n(\|.+\|)\n(\|[-:| ]+\|)\n((?:\|.+\|\n?)+)/g, (_, header, separator, rows) => {
    const headerCells = header.split('|').filter((c: string) => c.trim()).map((c: string) => c.trim());
    const alignments = separator.split('|').filter((c: string) => c.trim()).map((c: string) => {
      c = c.trim();
      if (c.startsWith(':') && c.endsWith(':')) return 'center';
      if (c.endsWith(':')) return 'right';
      return 'left';
    });

    let tableHtml = '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse text-sm">';

    // Header
    tableHtml += '<thead><tr class="bg-gray-100 dark:bg-gray-700">';
    headerCells.forEach((cell: string, i: number) => {
      const align = alignments[i] || 'left';
      const boldCell = cell.replace(/\*\*([^*]+)\*\*/g, '$1');
      tableHtml += `<th class="border border-gray-300 dark:border-gray-600 px-3 py-2 font-semibold text-gray-900 dark:text-white text-${align}">${boldCell}</th>`;
    });
    tableHtml += '</tr></thead>';

    // Body
    tableHtml += '<tbody>';
    const rowLines = rows.trim().split('\n');
    rowLines.forEach((row: string, rowIndex: number) => {
      const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => c.trim());
      const bgClass = rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750';
      tableHtml += `<tr class="${bgClass}">`;
      cells.forEach((cell: string, i: number) => {
        const align = alignments[i] || 'left';
        // Bold 처리
        let processedCell = cell.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-primary-600 dark:text-primary-400">$1</strong>');
        // 인라인 코드 처리
        processedCell = processedCell.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
        tableHtml += `<td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-300 text-${align}">${processedCell}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table></div>';

    return tableHtml;
  });

  // 3. 인라인 코드
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono text-red-600 dark:text-red-400">$1</code>');

  // 4. Bold 텍스트
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-gray-900 dark:text-white font-semibold">$1</strong>');

  // 5. 리스트 처리
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-700 dark:text-gray-300">$1</li>');

  // 6. 연속 리스트 아이템을 ul로 감싸기
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="my-2 space-y-1">$&</ul>');

  // 7. 숫자 리스트
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-700 dark:text-gray-300">$2</li>');

  // 8. 코드 블록 복원
  codeBlocks.forEach((block, i) => {
    html = html.replace(`__CODE_BLOCK_${i}__`, block);
  });

  // 9. 줄바꿈 처리 (테이블과 코드 블록 제외 영역)
  html = html.replace(/\n\n/g, '</p><p class="my-2">');
  html = html.replace(/\n/g, '<br/>');

  return html;
}

// Study Card Component
function StudyCard({
  item,
  isCompleted,
  isExpanded,
  onToggleComplete,
  onToggleExpand,
  DiagramComponent,
}: {
  item: StudyItem;
  isCompleted: boolean;
  isExpanded: boolean;
  onToggleComplete: () => void;
  onToggleExpand: () => void;
  DiagramComponent?: React.ComponentType;
}) {
  const category = categories.find(c => c.id === item.category);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="p-4 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isCompleted ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            {isCompleted && <Icons.Check />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                {category?.icon} {category?.name}
              </span>
              {item.isWeakness && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                  약점
                </span>
              )}
              {DiagramComponent && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                  📊 시각화
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.subcategory}</p>
          </div>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
            <Icons.ChevronRight />
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
          {/* Diagram */}
          {DiagramComponent && (
            <div className="pt-4">
              <DiagramComponent />
            </div>
          )}

          {/* Content */}
          <div className="pt-4">
            <div
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(item.content)
              }}
            />
          </div>

          {/* Key Points */}
          {item.keyPoints && item.keyPoints.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300 mb-2">핵심 포인트</p>
              <ul className="space-y-1">
                {item.keyPoints.map((point, i) => (
                  <li key={i} className="text-sm text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
