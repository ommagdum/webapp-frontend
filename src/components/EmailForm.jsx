import { useState } from 'react';

const EmailForm = ({ onSubmit, disabled }) => {
  const [emailContent, setEmailContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailContent.trim()) {
      onSubmit(emailContent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        disabled={disabled}
        placeholder="Enter email content to check"
        className="w-full p-2 border rounded min-h-[100px]"
        required
      />
      <button 
        type="submit"
        disabled={disabled || !emailContent.trim()}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Check Email
      </button>
    </form>
  );
};

export default EmailForm;