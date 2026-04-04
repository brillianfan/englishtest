import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    const buttonStyle = "px-3 py-1 rounded-md text-sm font-medium transition-colors";
    const activeStyle = "bg-blue-600 text-white";
    const inactiveStyle = "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600";

    return (
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-md flex items-center space-x-1 z-10">
            <button 
                onClick={() => setLanguage('en')} 
                className={`${buttonStyle} ${language === 'en' ? activeStyle : inactiveStyle}`}
                aria-pressed={language === 'en'}
            >
                EN
            </button>
            <button 
                onClick={() => setLanguage('vi')} 
                className={`${buttonStyle} ${language === 'vi' ? activeStyle : inactiveStyle}`}
                aria-pressed={language === 'vi'}
            >
                VI
            </button>
        </div>
    );
};

export default LanguageSwitcher;
