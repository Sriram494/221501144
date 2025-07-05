import { useState } from 'react'
import './App.css';

const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [ttl, setTtl] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [error, setError] = useState('');

  const isValidUrl = (urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleShorten = (e) => {
    e.preventDefault();
    setError('');

    if (!longUrl) {
      setError('Please enter a URL.');
      return;
    }

    if (!isValidUrl(longUrl)) {
      setError('Please enter a valid URL.');
      return;
    }

    if (customUrl && !/^[a-zA-Z0-9_-]+$/.test(customUrl)) {
      setError('Custom URL can only contain letters, numbers, underscores, and hyphens.');
      return;
    }

    const shortCode = customUrl || generateShortCode();

    const existing = shortenedUrls.find(
      (item) => item.longUrl === longUrl || item.shortCode === shortCode
    );
    if (existing) {
      if (existing.longUrl === longUrl) {
        setError('This URL has already been shortened.');
      } else {
        setError('This custom URL is already in use.');
      }
      return;
    }

    const newShortenedUrl = {
      shortCode,
      longUrl,
      ttl: ttl ? parseInt(ttl, 10) : null,
    };

    setShortenedUrls([newShortenedUrl, ...shortenedUrls]);
    setLongUrl('');
    setCustomUrl('');
    setTtl('');
  };

  return (
    <div className="App">
      <h1>URL Shortener</h1>
      <form onSubmit={handleShorten}>
        <input
          type="text"
          placeholder="Enter a long URL to shorten"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Custom short URL (optional)"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
        />
        <input
          type="number"
          placeholder="Minutes to live (optional)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
          min="1"
        />
        <button type="submit">Shorten</button>
      </form>
      {error && <p>{error}</p>}

      {shortenedUrls.length > 0 && (
        <div>
          <h2>Shortened URLs</h2>
          <ul>
            {shortenedUrls.map((item) => (
              <li key={item.shortCode}>
                <span>{item.longUrl}</span>
                <span>
                  <a href={item.longUrl} target="_blank" rel="noopener noreferrer">
                    {`https://short.ly/${item.shortCode}`}
                  </a>
                  {item.ttl && ` (expires in ${item.ttl} min)`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
