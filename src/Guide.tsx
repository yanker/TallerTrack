import { useState, useEffect } from 'react';
import { HtmlContent } from './components/HtmlContent';

export function Guide() {
  const [guideContent, setGuideContent] = useState('');

  useEffect(() => {    fetch('/USAGE_GUIDE.md')
      .then((response) => response.text())
      .then((content) => setGuideContent(content))
      .catch((error) => console.error('Error loading guide:', error));
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
