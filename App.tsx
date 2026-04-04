import React, { useState, useCallback } from 'react';
import { QuizData, QuizState, StudentInfo, QuizPart } from './types';
import { generateFullTest } from './services/geminiService';
import StudentInfoForm from './components/StudentInfoForm';
import QuizGenerator from './components/QuizGenerator';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[i], array[j]];
  }
  return array;
};

const processQuizPart = (part: QuizPart): QuizPart => {
  return {
    ...part,
    questions: part.questions.map(question => {
      const correctAnswerValue = question.options[question.correctAnswerIndex];
      const shuffledOptions = shuffleArray([...question.options]);
      const newCorrectIndex = shuffledOptions.indexOf(correctAnswerValue);
      return {
        ...question,
        options: shuffledOptions,
        correctAnswerIndex: newCorrectIndex
      };
    })
  };
};

const processQuizData = (quizData: QuizData): QuizData => {
  return {
    reading: quizData.reading.map(processQuizPart),
    listening: quizData.listening.map(processQuizPart)
  };
};

const AppInternal: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>(QuizState.STUDENT_INFO);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const { t } = useLanguage();

  const handleStartQuiz = useCallback(async () => {
    setQuizState(QuizState.GENERATING);
    setError(null);
    try {
      const data = await generateFullTest();
      const processedData = processQuizData(data);
      setQuizData(processedData);
      setQuizState(QuizState.IN_PROGRESS);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setQuizState(QuizState.ERROR);
    }
  }, []);

  const handleStudentInfoSubmit = useCallback((info: StudentInfo) => {
    setStudentInfo(info);
    handleStartQuiz();
  }, [handleStartQuiz]);

  const handleSubmitQuiz = useCallback((userAnswers: (number | null)[][]) => {
    if (!quizData || !studentInfo) return;

    const allParts = [...quizData.reading, ...quizData.listening];
    let calculatedScore = 0;
    allParts.forEach((part, partIndex) => {
      part.questions.forEach((question, questionIndex) => {
        const userAnswer = userAnswers[partIndex][questionIndex];
        if (userAnswer !== null && userAnswer === question.correctAnswerIndex) {
          calculatedScore++;
        }
      });
    });

    setScore(calculatedScore);

    // Prepare data payload matching the Google Script keys
    const payload = {
      hoTen: studentInfo.fullName,
      mssv: studentInfo.studentId,
      maLop: studentInfo.classCode,
      diem: calculatedScore,
      thoiGian: new Date().toISOString()
    };

    fetch('https://script.google.com/macros/s/AKfycbzKVQ8ZV0-VClE8RKniXNtIG_GmIdZYlgSPupiaqThrxdWfe1M5rbX5SQSCwuEY0V2W-w/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log('Score submitted successfully');
    }).catch((err) => {
      console.error('Failed to submit score:', err);
    });

    setQuizState(QuizState.COMPLETED);
  }, [quizData, studentInfo]);

  const handleRestartQuiz = () => {
    setStudentInfo(null);
    setQuizData(null);
    setScore(0);
    setError(null);
    setQuizState(QuizState.STUDENT_INFO);
  };
  
  const renderContent = () => {
    switch (quizState) {
      case QuizState.STUDENT_INFO:
        return <StudentInfoForm onSubmit={handleStudentInfoSubmit} />;

      case QuizState.GENERATING:
        return <QuizGenerator />;
        
      case QuizState.IN_PROGRESS:
        if (!quizData) return null;
        const allParts = [...quizData.reading, ...quizData.listening];
        return <QuizScreen quizData={allParts} onSubmit={handleSubmitQuiz} />;
      
      case QuizState.COMPLETED:
        const totalQuestions = quizData ? (quizData.reading.reduce((total, part) => total + part.questions.length, 0) + quizData.listening.reduce((total, part) => total + part.questions.length, 0)) : 75;
        return <ResultsScreen score={score} totalQuestions={totalQuestions} studentInfo={studentInfo} />;
      
      case QuizState.ERROR:
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">{t('errorTitle')}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={handleRestartQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              {t('tryAgainButton')}
            </button>
          </div>
        );
        
      default:
        return <StudentInfoForm onSubmit={handleStudentInfoSubmit} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans p-4 transition-colors duration-500 relative">
      <LanguageSwitcher />
      <main className="w-full">
        {renderContent()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AppInternal />
        </LanguageProvider>
    )
}

export default App;