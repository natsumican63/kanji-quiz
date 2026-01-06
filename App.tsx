
import React, { useState, useCallback } from 'react';
import { PREFECTURES, VEHICLES, ANIMALS, FRUITS } from './constants';
import { QuizQuestion, QuizState, QuizCategory, QuizItem } from './types';
import QuizCard from './components/QuizCard';
import { AudioService } from './services/audioService';

const QUESTIONS_COUNT = 5;
const POSITIVE_FEEDBACKS = [
  "すごい！てんさいだね！",
  "やったー！だいせいかい！",
  "そのちょうし！がんばれー！",
  "よく しっているね！",
  "せいかい！ぱちぱちぱちー！"
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<QuizState>('START');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trivia, setTrivia] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState<QuizCategory | null>(null);

  const nextQuestion = useCallback((isLast: boolean) => {
    setShowModal(false);
    if (!isLast) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTrivia('');
      setIsProcessing(false);
    } else {
      AudioService.playFinish();
      setGameState('RESULT');
      setIsProcessing(false);
    }
  }, []);

  const generateQuiz = useCallback((selectedCategory: QuizCategory) => {
    let dataSource: QuizItem[];
    switch (selectedCategory) {
      case 'PREFECTURES': dataSource = PREFECTURES; break;
      case 'VEHICLES': dataSource = VEHICLES; break;
      case 'ANIMALS': dataSource = ANIMALS; break;
      case 'FRUITS': dataSource = FRUITS; break;
      default: dataSource = PREFECTURES;
    }

    const shuffled = [...dataSource].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, QUESTIONS_COUNT);
    
    const quizQuestions: QuizQuestion[] = selected.map(item => {
      let wrongItem: QuizItem;
      do {
        wrongItem = dataSource[Math.floor(Math.random() * dataSource.length)];
      } while (wrongItem.kanji === item.kanji);

      const options = [item.hiragana, wrongItem.hiragana].sort(() => 0.5 - Math.random());
      
      return {
        kanji: item.kanji,
        correct: item.hiragana,
        wrong: wrongItem.hiragana,
        options,
        segments: item.segments
      };
    });

    setCategory(selectedCategory);
    setQuestions(quizQuestions);
    setGameState('QUIZ');
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setTrivia('');
    setIsProcessing(false);
    setShowModal(false);
  }, []);

  const handleAnswer = async (answer: string) => {
    if (isProcessing) return;
    
    const currentQuestion = questions[currentIndex];
    const isCorrect = answer === currentQuestion.correct;
    
    if (isCorrect) {
      setIsProcessing(true);
      setSelectedAnswer(answer);
      setShowModal(true);
      
      // 正解の名称を読み上げ
      AudioService.speak(currentQuestion.correct);
      AudioService.playCorrect();
      
      const randomFeedback = POSITIVE_FEEDBACKS[Math.floor(Math.random() * POSITIVE_FEEDBACKS.length)];
      setTrivia(randomFeedback);

      // 自動で次の問題へ
      setTimeout(() => {
        nextQuestion(currentIndex + 1 >= QUESTIONS_COUNT);
      }, 3500);
    }
  };

  const handleManualSpeak = (text: string) => {
    AudioService.speak(text);
  };

  return (
    <div className="min-h-screen bg-[#fffcf0] text-slate-800 p-4 flex flex-col items-center justify-center overflow-x-hidden font-['BIZ_UDPGothic']">
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-yellow-400 to-sky-400 z-50"></div>

      {gameState === 'START' && (
        <div className="text-center space-y-12 animate-in fade-in zoom-in duration-500 max-w-6xl w-full">
          <div className="relative inline-block px-4">
            <span className="absolute -top-12 -right-6 text-7xl transform rotate-12 hidden sm:block">✨</span>
            <span className="absolute -bottom-12 -left-6 text-7xl transform -rotate-12 hidden sm:block">⭐</span>
            <h1 className="text-5xl md:text-8xl font-black text-orange-500 drop-shadow-lg leading-tight">
              かんじクイズに<br/>
              <span className="text-sky-500">ちょうせん！</span>
            </h1>
          </div>
          
          <p className="text-3xl md:text-4xl font-black text-slate-500 px-4">
            どの クイズを するかな？
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 max-w-4xl mx-auto">
            <button
              onClick={() => generateQuiz('PREFECTURES')}
              className="group relative bg-orange-400 hover:bg-orange-500 text-white p-8 rounded-[3rem] shadow-[0_12px_0_0_#c2410c] active:shadow-none active:translate-y-2 transition-all flex flex-col items-center space-y-4"
            >
              <span className="text-7xl md:text-8xl group-hover:scale-110 transition-transform">🗾</span>
              <span className="text-3xl md:text-4xl font-black">とどうふけん</span>
            </button>

            <button
              onClick={() => generateQuiz('VEHICLES')}
              className="group relative bg-sky-400 hover:bg-sky-500 text-white p-8 rounded-[3rem] shadow-[0_12px_0_0_#0369a1] active:shadow-none active:translate-y-2 transition-all flex flex-col items-center space-y-4"
            >
              <span className="text-7xl md:text-8xl group-hover:scale-110 transition-transform">🚑</span>
              <span className="text-3xl md:text-4xl font-black">のりもの</span>
            </button>

            <button
              onClick={() => generateQuiz('ANIMALS')}
              className="group relative bg-green-500 hover:bg-green-600 text-white p-8 rounded-[3rem] shadow-[0_12px_0_0_#15803d] active:shadow-none active:translate-y-2 transition-all flex flex-col items-center space-y-4"
            >
              <span className="text-7xl md:text-8xl group-hover:scale-110 transition-transform">🦁</span>
              <span className="text-3xl md:text-4xl font-black">どうぶつ</span>
            </button>

            <button
              onClick={() => generateQuiz('FRUITS')}
              className="group relative bg-pink-400 hover:bg-pink-500 text-white p-8 rounded-[3rem] shadow-[0_12px_0_0_#be185d] active:shadow-none active:translate-y-2 transition-all flex flex-col items-center space-y-4"
            >
              <span className="text-7xl md:text-8xl group-hover:scale-110 transition-transform">🍎</span>
              <span className="text-3xl md:text-4xl font-black">くだもの</span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'QUIZ' && (
        <div className="w-full flex flex-col items-center space-y-6 max-w-3xl">
          <QuizCard 
            question={questions[currentIndex]} 
            onAnswer={handleAnswer}
            onSpeak={handleManualSpeak}
            disabled={!!selectedAnswer}
            selectedAnswer={selectedAnswer}
            correctAnswer={questions[currentIndex].correct}
          />

          {/* Modal Overlay */}
          {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
              <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl border-[12px] border-orange-300 p-8 md:p-12 text-center animate-pop relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-6 bg-orange-100"></div>
                
                <p className="text-4xl md:text-5xl font-black text-orange-500 mb-10 mt-4 animate-bounce">
                  ✨ {trivia} ✨
                </p>

                <div className="bg-orange-50 py-12 px-4 rounded-[3rem] border-4 border-orange-100 mb-10 overflow-x-auto">
                  <div className="flex justify-center items-end whitespace-nowrap min-w-max mx-auto px-4">
                    {questions[currentIndex].segments.map((segment, idx) => (
                      <ruby key={idx} className="text-7xl md:text-9xl font-black text-slate-800 mx-1">
                        {segment.k}
                        <rt className="font-black">{segment.h}</rt>
                      </ruby>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center items-center gap-6">
                   <div className="text-6xl animate-spin-slow">🎊</div>
                   <div className="text-3xl md:text-4xl font-black text-slate-500">
                      つぎへ いくよ！
                   </div>
                   <div className="text-6xl animate-spin-slow">🎊</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {gameState === 'RESULT' && (
        <div className="text-center space-y-10 animate-in zoom-in duration-500 max-w-2xl w-full">
          <div className="relative">
             <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-9xl">👑</div>
             <h1 className="text-7xl font-black text-slate-800 pt-4">おめでとう！</h1>
          </div>
          
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-[12px] border-yellow-300 w-full">
            <p className="text-5xl md:text-6xl font-black text-orange-500 mb-6">
              ぜんぶ できたね！
            </p>
            <p className="text-3xl md:text-4xl font-bold text-slate-500 leading-relaxed">
              よく がんばりました！<br/>かんじマスターだね！
            </p>
          </div>

          <div className="flex flex-col space-y-6 px-6">
            <button
              onClick={() => category && generateQuiz(category)}
              className="bg-sky-500 hover:bg-sky-600 text-white text-4xl font-black py-8 px-12 rounded-[2rem] shadow-[0_10px_0_0_#0369a1] active:shadow-none active:translate-y-2 transition-all"
            >
              もういっかい！
            </button>
            <button
              onClick={() => setGameState('START')}
              className="text-slate-400 text-2xl font-black hover:text-slate-600 transition-colors"
            >
              さいしょに もどる
            </button>
          </div>
        </div>
      )}

      {/* Background Decor */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-yellow-200 rounded-full blur-3xl opacity-40 -z-10"></div>
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-sky-200 rounded-full blur-3xl opacity-40 -z-10"></div>
    </div>
  );
};

export default App;
