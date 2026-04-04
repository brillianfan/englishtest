
import React, { useState, useEffect, useRef } from 'react';
import { QuizPart } from '../types';
import Timer from './Timer';
import ConfirmationModal from './ConfirmationModal';
import { useLanguage } from '../contexts/LanguageContext';
import { generateSpeech } from '../services/geminiService';

interface QuizScreenProps {
  quizData: QuizPart[];
  onSubmit: (answers: (number | null)[][]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ quizData, onSubmit }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  
  const [userAnswers, setUserAnswers] = useState<(number | null)[][]>(
    () => quizData.map(part => Array(part.questions.length).fill(null))
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useLanguage();

  const currentPart = quizData[activeTab];
  const isListening = currentPart.type === 'listening';

  // Reset question index and audio when tab changes manually
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setActiveQuestionIndex(0);
    setAudioUrl(null);
  };

  useEffect(() => {
    if (currentPart.audioUrls) {
      setAudioUrl(null);
    }
  }, [activeQuestionIndex, currentPart.audioUrls]);

  const handlePlayAudio = async () => {
    if (currentPart.audioUrls && currentPart.audioUrls[activeQuestionIndex]) {
      setAudioUrl(currentPart.audioUrls[activeQuestionIndex]);
      return;
    }

    if (audioUrl) {
      audioRef.current?.play();
      return;
    }

    setIsAudioLoading(true);
    try {
      const base64Audio = await generateSpeech(currentPart.passage);
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      // We'll play it in the useEffect when audioUrl changes
    } catch (error) {
      console.error("Failed to play audio:", error);
      alert("Could not generate audio. Please try again.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl]);

  const handleAnswerSelect = (partIndex: number, questionIndex: number, optionIndex: number) => {
    setUserAnswers(prevAnswers => {
      const newAnswers = prevAnswers.map(part => [...part]);
      newAnswers[partIndex][questionIndex] = optionIndex;
      return newAnswers;
    });
  };

  const handlePrev = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    const currentPartQuestions = quizData[activeTab].questions;
    
    if (activeQuestionIndex < currentPartQuestions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
    } else if (activeTab < quizData.length - 1) {
      setActiveTab(prev => prev + 1);
      setActiveQuestionIndex(0);
      setAudioUrl(null);
    }
  };

  const handleFinishRequest = () => {
    const unansweredCount = userAnswers.flat().filter(ans => ans === null).length;
    if (unansweredCount > 0) {
      setIsConfirmModalOpen(true);
    } else {
      onSubmit(userAnswers);
    }
  };

  const handleConfirmSubmit = () => {
    onSubmit(userAnswers);
    setIsConfirmModalOpen(false);
  };

  const handleCancelSubmit = () => {
    setIsConfirmModalOpen(false);
  };

  const totalQuestions = quizData.reduce((acc, part) => acc + part.questions.length, 0);
  const answeredQuestionsCount = userAnswers.flat().filter(ans => ans !== null).length;
  const unansweredCount = totalQuestions - answeredQuestionsCount;

  const currentQuestion = currentPart.questions[activeQuestionIndex];
  const globalQuestionNumber = quizData.slice(0, activeTab).reduce((acc, part) => acc + part.questions.length, 0) + activeQuestionIndex + 1;

  const confirmationMessageKey = unansweredCount !== 1 ? 'confirmSubmitMessage_other' : 'confirmSubmitMessage_one';

  const isLastQuestionOfPart = activeQuestionIndex === currentPart.questions.length - 1;
  const isLastPart = activeTab === quizData.length - 1;

  return (
    <>
      <div className="w-full h-screen flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden">
          <div className="flex-shrink-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center px-6 shadow-sm z-10">
            <h1 className="text-lg font-bold text-gray-800 dark:text-white hidden md:block">{t('quizHeader')}</h1>
            <div className="flex items-center space-x-4">
                <Timer durationInSeconds={5400} onTimeUp={() => onSubmit(userAnswers)} />
                <button
                    onClick={handleFinishRequest}
                    className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded transition-colors shadow-sm"
                >
                    {t('submitTestButton')}
                </button>
            </div>
          </div>
          
          <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex overflow-x-auto">
            {quizData.map((part, index) => (
              <button
                key={index}
                onClick={() => handleTabChange(index)}
                className={`flex-shrink-0 py-3 px-6 font-medium text-sm focus:outline-none transition-colors duration-200 ${
                  activeTab === index 
                  ? 'bg-white dark:bg-gray-800 border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {part.type === 'reading' ? t('readingPartLabel', { partNumber: index + 1 }) : t('listeningPartLabel', { partNumber: index + 1 })}
              </button>
            ))}
          </div>

          <div className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
            
            <div className="md:w-1/2 h-1/2 md:h-full overflow-y-auto p-6 md:p-8 bg-white dark:bg-gray-800 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 shadow-inner flex flex-col">
              <div className="max-w-3xl mx-auto w-full flex-grow">
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-800 py-2 z-10">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">{currentPart.partTitle}</h2>
                  <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${isListening ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                    {isListening ? t('listeningType') : t('readingType')}
                  </span>
                </div>
                
                <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  {isListening ? (
                    <div className="flex flex-col items-center justify-center min-h-[200px] py-4 space-y-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 text-left w-full mb-4">
                        <h3 className="text-blue-800 dark:text-blue-300 font-bold mb-2 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Instructions
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-400 italic">
                          {(() => {
                            const listeningParts = quizData.filter(p => p.type === 'listening');
                            const currentListeningIndex = listeningParts.indexOf(currentPart) + 1;
                            return t(`listeningPart${currentListeningIndex}Instructions`);
                          })()}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center w-full max-w-md">
                        <div className="mb-4 flex justify-center">
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('listeningInstructions')}</p>
                        
                        {audioUrl && (
                          <audio 
                            ref={audioRef} 
                            src={audioUrl} 
                            controls 
                            className="w-full mb-4" 
                            referrerPolicy="no-referrer"
                            onPlay={() => console.log("Audio started playing")}
                            onError={(e) => {
                              console.error("Audio error:", e);
                              // If it's a Google Drive link and it fails, it might be a session issue
                              if (audioUrl.includes('drive.google.com') || audioUrl.includes('docs.google.com')) {
                                console.warn("Google Drive audio failed to load. This might be due to browser restrictions or file permissions.");
                              }
                            }}
                          />
                        )}
                        
                        <button
                          onClick={handlePlayAudio}
                          disabled={isAudioLoading}
                          className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all ${isAudioLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                        >
                          {isAudioLoading ? t('loadingAudio') : (audioUrl ? t('replayAudio') : t('playAudio'))}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap font-serif text-lg leading-loose">{currentPart.passage}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="md:w-1/2 h-1/2 md:h-full flex flex-col bg-gray-50 dark:bg-gray-900/50">
                <div className="flex-grow overflow-y-auto p-6 md:p-10">
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-6">
                            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold px-2.5 py-0.5 rounded mb-2">
                                {t('questionLabel', { questionNumber: globalQuestionNumber })}
                            </span>
                            <h3 className="text-lg md:text-xl font-medium text-gray-900 dark:text-white">
                                {currentQuestion.questionText}
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option, oIndex) => {
                                const isSelected = userAnswers[activeTab][activeQuestionIndex] === oIndex;
                                return (
                                    <label
                                        key={oIndex}
                                        className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 group ${
                                        isSelected
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800'
                                        }`}
                                    >
                                        <div className="flex items-center h-5">
                                            <input
                                                type="radio"
                                                name={`question-${activeTab}-${activeQuestionIndex}`}
                                                className="hidden"
                                                checked={isSelected}
                                                onChange={() => handleAnswerSelect(activeTab, activeQuestionIndex, oIndex)}
                                            />
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-400 dark:border-gray-500 group-hover:border-blue-500'
                                            }`}>
                                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                        </div>
                                        <div className="ml-3 text-base text-gray-700 dark:text-gray-200">
                                            {option}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <button
                        onClick={handlePrev}
                        disabled={activeQuestionIndex === 0}
                        className={`flex items-center px-4 py-2 rounded text-sm font-semibold ${
                            activeQuestionIndex === 0
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700'
                        }`}
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        {t('prevButton')}
                    </button>
                    
                    <div className="flex items-center">
                        <div className="flex space-x-1 mx-2 overflow-x-auto max-w-[150px] md:max-w-none hide-scrollbar">
                             {currentPart.questions.map((_, idx) => {
                                 const isAnswered = userAnswers[activeTab][idx] !== null;
                                 const isActive = idx === activeQuestionIndex;
                                 
                                 let bgClass = "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
                                 if (isActive) bgClass = "bg-blue-600 text-white ring-2 ring-blue-300 dark:ring-blue-800";
                                 else if (isAnswered) bgClass = "bg-gray-600 dark:bg-gray-500 text-white";

                                 return (
                                     <button
                                        key={idx}
                                        onClick={() => setActiveQuestionIndex(idx)}
                                        className={`w-8 h-8 rounded-sm text-xs font-bold flex items-center justify-center transition-all ${bgClass}`}
                                        title={`Question ${idx + 1}`}
                                     >
                                         {idx + 1}
                                     </button>
                                 )
                             })}
                        </div>
                    </div>

                    {!(isLastPart && isLastQuestionOfPart) ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold shadow-sm transition-colors"
                        >
                            {isLastQuestionOfPart ? t('nextPartButton') : t('nextButton')}
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    ) : (
                         <button
                            onClick={handleFinishRequest}
                            className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-bold shadow-sm transition-colors"
                        >
                            {t('finishButton')}
                        </button>
                    )}
                </div>
            </div>
          </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title="confirmSubmitTitle"
        message={confirmationMessageKey}
        messageReplacements={{ count: unansweredCount }}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        confirmText="confirmSubmitButton"
        cancelText="reviewAnswersButton"
      />
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default QuizScreen;
