import { useState, useEffect } from 'react';
import { HtmlContent } from './components/HtmlContent';

export function Guide() {
  const [guideContent, setGuideContent] = useState('');

  useEffect(() => {
    const loadGuide = async () => {
      try {
        // Intentar cargar desde la raíz de public
        console.log('Loading guide...');
        const response = await fetch('/USAGE_GUIDE.md');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        console.log('Guide loaded successfully');
        setGuideContent(content);
      } catch (error) {
        console.error('Error loading guide:', error);
        setGuideContent('Error loading guide. Please try again later.');
      }
    };

    void loadGuide();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manual de Usuario - TallerTracker</h1>
        <div className="prose prose-lg max-w-none">
          <HtmlContent markdown={guideContent} />
        </div>
      </div>
    </div>
  );
}
