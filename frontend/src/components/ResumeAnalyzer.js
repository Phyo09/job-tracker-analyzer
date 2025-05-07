import React, { useState } from 'react';
import axios from 'axios';

function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resume || !jdText) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job_description', jdText);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/analyze', formData);
      setResult(response.data);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Failed to analyze. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Resume Analyzer</h2>
      <form onSubmit={handleAnalyze}>
        <div className="mb-3">
          <label className="form-label">Upload Resume (text-based PDF)</label>
          <input type="file" className="form-control" accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Paste Job Description</label>
          <textarea className="form-control" rows="6"
            value={jdText} onChange={(e) => setJdText(e.target.value)} required />
        </div>
        <button className="btn btn-success" type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {result && (
        <div className="mt-4">
          <h4>Similarity Score: {result.similarity_score}%</h4>
          <p><strong>Missing Keywords:</strong></p>
          <div className="mb-3">
            {result.missing_keywords.length === 0 ? (
              <span className="text-success">None! Great match.</span>
            ) : (
              result.missing_keywords.map((word, i) => (
                <span key={i} className="badge bg-warning text-dark me-2 mb-1">{word}</span>
              ))
            )}
          </div>

          <h5>Resume Preview:</h5>
          <div className="border p-3" style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f8f9fa' }}>
            {result.resume_text}
          </div>
        </div>
      )}

    </div>
  );
}

export default ResumeAnalyzer;
