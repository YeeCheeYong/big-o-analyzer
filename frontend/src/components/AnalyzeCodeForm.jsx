import React, { useState } from 'react';

const AnalyzeCodeForm = ({ analyzeCode }) => {
  const [codeSnippet, setCodeSnippet] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (codeSnippet) {
      analyzeCode(codeSnippet);
      setCodeSnippet('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={codeSnippet}
        onChange={(e) => setCodeSnippet(e.target.value)}
        placeholder="Enter your code snippet here"
        rows="8"
        cols="50"
      />
      <br />
      <button type="submit">Analyze Code</button>
    </form>
  );
};

export default AnalyzeCodeForm;
