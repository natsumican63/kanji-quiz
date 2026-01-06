
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  onSpeak: (text: string) => void;
  disabled: boolean;
  selectedAnswer: string | null;
  correctAnswer: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ question, onAnswer, onSpeak, disabled, selectedAnswer, correctAnswer }) => {
  const [shakingOption, setShakingOption] = useState<string | null>(null);

  const handleOptionSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation(); 
    onSpeak(text);
  };

  const handleAnswerClick = (option: string) => {
    if (disabled) return;
    if (option !== correctAnswer) {
      setShakingOption(option);
      setTimeout(() => setShakingOption(null), 400);
    }
    onAnswer(option);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-[3rem] shadow-xl overflow-hidden border-8 border-yellow-300 transform transition-all duration-300">
      <div className="bg-yellow-100 p-6 md:p-10 text-center border-b-8 border-yellow-300">
        <p className="text-2xl font-bold text-orange-600 mb-4">この かんじは なにかな？</p>
        <div className="flex justify-center items-center py-4 bg-white rounded-3xl shadow-inner min-h-[160px]">
          <h1 className="text-6xl md:text-8xl font-black text-slate-800 tracking-wider whitespace-nowrap px-6">
            {question.kanji}
          </h1>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === correctAnswer;
          const isShaking = shakingOption === option;
          
          let bgColor = "bg-sky-400 hover:bg-sky-500";
          let textColor = "text-white";
          let ringColor = "";

          if (selectedAnswer && isCorrect) {
            bgColor = "bg-green-500 scale-105";
            ringColor = "ring-8 ring-green-100";
          } else if (option === shakingOption) {
            bgColor = "bg-gray-300";
          } else if (selectedAnswer && !isCorrect) {
            bgColor = "bg-gray-100";
            textColor = "text-gray-400";
          }

          return (
            <div key={index} className="flex items-center gap-4 w-full">
              {/* メインの回答ボタン */}
              <button
                onClick={() => handleAnswerClick(option)}
                disabled={disabled || isShaking}
                className={`
                  ${bgColor} ${textColor} ${ringColor}
                  ${isShaking ? 'animate-shake' : ''}
                  flex-grow relative py-6 px-6 rounded-3xl text-4xl md:text-5xl font-black 
                  shadow-lg transition-all duration-300 active:scale-95
                  flex items-center gap-4 min-h-[110px]
                `}
              >
                <span className="bg-white text-sky-600 w-14 h-14 rounded-full flex items-center justify-center shadow-md text-3xl font-black shrink-0">
                  {index === 0 ? 'A' : 'B'}
                </span>
                <span className="text-left leading-tight overflow-hidden text-ellipsis">
                  {option}
                </span>
                {selectedAnswer && isCorrect && <span className="ml-auto text-5xl animate-bounce shrink-0">⭕</span>}
              </button>

              {/* 独立した読み上げボタン */}
              {!selectedAnswer && (
                <button
                  onClick={(e) => handleOptionSpeak(e, option)}
                  title="おとをきく"
                  className="bg-pink-400 hover:bg-pink-500 text-white w-20 h-20 md:w-24 md:h-24 rounded-full shadow-[0_6px_0_0_#be185d] active:shadow-none active:translate-y-1 transition-all flex flex-col items-center justify-center shrink-0 border-4 border-white"
                >
                  <span className="text-3xl md:text-4xl">🔊</span>
                  <span className="text-xs md:text-sm font-black mt-1">きく</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizCard;
