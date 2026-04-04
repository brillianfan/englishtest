import React, { useMemo } from 'react';
import { StudentInfo } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  studentInfo: StudentInfo | null;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, studentInfo }) => {
  const { t } = useLanguage();

  const percentage = useMemo(() => {
    return totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  }, [score, totalQuestions]);
  
  const feedback = useMemo(() => {
    if (percentage >= 90) return { message: t('feedbackExcellent'), color: "text-green-500" };
    if (percentage >= 75) return { message: t('feedbackGreat'), color: "text-blue-500" };
    if (percentage >= 50) return { message: t('feedbackGood'), color: "text-yellow-500" };
    return { message: t('feedbackPractice'), color: "text-red-500" };
  }, [percentage, t]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl text-center p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{t('resultsHeader')}</h2>
            
            {studentInfo && (
              <div className="mb-6 text-left p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-800 dark:text-white"><span className="font-semibold">{t('fullNameLabel')}:</span> {studentInfo.fullName}</p>
                <p className="text-gray-800 dark:text-white"><span className="font-semibold">{t('studentIdLabel')}:</span> {studentInfo.studentId}</p>
                <p className="text-gray-800 dark:text-white"><span className="font-semibold">{t('classCodeLabel')}:</span> {studentInfo.classCode}</p>
              </div>
            )}

            <p className={`text-2xl font-semibold mb-6 ${feedback.color}`}>{feedback.message}</p>
            
            <div className="my-12">
                <p className="text-lg text-gray-600 dark:text-gray-300">{t('yourScoreLabel')}</p>
                <p className="text-7xl font-bold text-gray-800 dark:text-white my-2">
                    {score}<span className="text-3xl text-gray-500 dark:text-gray-400"> / {totalQuestions}</span>
                </p>
                <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{percentage}%</p>
            </div>
            
             <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <p className="text-md font-semibold text-gray-700 dark:text-gray-200">{t('screenshotInstruction')}</p>
                <a
                    href="https://drive.google.com/drive/folders/1Phqudwi8dMDFd8SKuk_VqRAWtgVLmuvO?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-block py-3 px-6 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-lg transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                    {t('uploadScreenshotButton')}
                </a>
            </div>
        </div>
    </div>
  );
};

export default ResultsScreen;