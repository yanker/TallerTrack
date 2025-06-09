import { useState, useEffect } from 'react';
import { HtmlContent } from './components/HtmlContent';

export function Guide() {
  const [guideContent, setGuideContent] = useState('');
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    fetch(`${baseUrl}USAGE_GUIDE.md`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((content) => {
        console.log('Guide content loaded successfully');
        setGuideContent(content);
      })
      .catch((error) => {
        console.error('Error loading guide:', error);
        setGuideContent('Error loading guide. Please try again later.');
      });
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
