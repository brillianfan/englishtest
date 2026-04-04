import React, { useState } from 'react';
import { StudentInfo } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface StudentInfoFormProps {
  onSubmit: (info: StudentInfo) => void;
}

const StudentInfoForm: React.FC<StudentInfoFormProps> = ({ onSubmit }) => {
  const [info, setInfo] = useState<StudentInfo>({
    fullName: '',
    studentId: '',
    classCode: ''
  });
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (info.fullName && info.studentId && info.classCode) {
      onSubmit(info);
    }
  };

  const isFormValid = info.fullName.trim() !== '' && info.studentId.trim() !== '' && info.classCode.trim() !== '';

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">{t('testTitle')}</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">{t('formPrompt')}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('fullNameLabel')}</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={info.fullName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('fullNamePlaceholder')}
            />
          </div>
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('studentIdLabel')}</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={info.studentId}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('studentIdPlaceholder')}
            />
          </div>
          <div>
            <label htmlFor="classCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('classCodeLabel')}</label>
            <input
              type="text"
              id="classCode"
              name="classCode"
              value={info.classCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('classCodePlaceholder')}
            />
          </div>
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            {t('startTestButton')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentInfoForm;