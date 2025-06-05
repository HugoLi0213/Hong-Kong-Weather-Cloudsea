import { useLanguage } from '@/contexts/LanguageContext';

export function TestDashboard() {
  const { t } = useLanguage();
  
  return (
    <div className="p-4">
      <h1>Test: {t('overview')}</h1>
      <p>Language system is working!</p>
    </div>
  );
}
