import ReactMarkdown from 'react-markdown';

interface HtmlContentProps {
  markdown: string;
  className?: string;
}

export function HtmlContent({ markdown, className = '' }: HtmlContentProps) {
  return (
    <div className={`prose ${className}`}>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}