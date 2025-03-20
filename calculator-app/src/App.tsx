import React, { useState } from 'react';
import './App.css';

function App() {
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          a: parseFloat(num1),
          b: parseFloat(num2),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate sum');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Calculator</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              placeholder="Enter first number"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              placeholder="Enter second number"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Calculating...' : 'Add Numbers'}
          </button>
        </form>

        {result !== null && (
          <div className="result">
            <h2>Result: {result}</h2>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;