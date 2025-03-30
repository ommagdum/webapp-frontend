import { useState, useEffect } from 'react';

const EmailForm = ({ onSubmit, disabled }) => {
  const [emailContent, setEmailContent] = useState('');

  useEffect(() => {
    const savedContent = localStorage.getItem('tempEmailContent');
    if (savedContent) {
      setEmailContent(savedContent);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailContent.trim()) {
      onSubmit(emailContent);
      localStorage.removeItem('tempEmailContent');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        disabled={disabled}
        placeholder="Paste email content here..."
        className="w-full p-4 border rounded-lg mb-4 min-h-[200px]"
        required
      />
      <button 
        type="submit"
        disabled={disabled || !emailContent.trim()}
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        Analyze Now
      </button>
    </form>
  );
};

export default EmailForm;