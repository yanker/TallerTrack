import { useState, useEffect } from 'react';
import { HtmlContent } from './components/HtmlContent';

export function Guide() {
  const [guideContent, setGuideContent] = useState('');

  useEffect(() => {
    // Try multiple possible paths for the guide file
    const paths: string[] = [
      '/docs/USAGE_GUIDE.md',
      '/USAGE_GUIDE.md',
      '/public/docs/USAGE_GUIDE.md',
      '/public/USAGE_GUIDE.md'
    ];

    const tryLoadGuide = async (attemptPaths: string[]): Promise<boolean> => {
      for (const path of attemptPaths) {
        try {
          console.log(`Trying to load guide from: ${path}`);
          const response = await fetch(path);
          if (response.ok) {
            const content = await response.text();
            console.log(`Guide loaded successfully from ${path}`);
            setGuideContent(content);
            return true;
          }
        } catch (error) {
          console.log(`Failed to load from ${path}:`, error);
        }
      }
      return false;
    };

    void tryLoadGuide(paths).then(success => {
      if (!success) {
        console.error('Failed to load guide from all paths');
        setGuideContent('Error loading guide. Please try again later.');
      }
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
