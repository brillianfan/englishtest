import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

const QuizGenerator: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="text-center p-8">
      <LoadingSpinner message={t('generatingMessage')} />
      <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto">
        {t('testInstructions', { minutes: 90 })}
      </p>
    </div>
  );
};

export default QuizGenerator;