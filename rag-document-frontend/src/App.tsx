    // cv-ai-frontend/src/App.tsx
    import React from 'react';
    import './App.css';
    import Chatbox from './Chatbox';
    import FileUpload from './FileUpload';

    function App() {
      return (
        <div className="App">
          <header className="App-header">
            <h1>AI Document Assistant</h1>
            <p>Upload a document, and get instant answers to your questions.</p>
          </header>
          <main className="App-main">
            <FileUpload />
            <Chatbox />
          </main>
          <footer className="App-footer">
            <p>
              Developed by <span className="font-bold">Shubh Khatri</span>. Connect with me on{' '}
              <a href="https://github.com/shubhktr1012" target="_blank" rel="noopener noreferrer">GitHub</a> &bull;{' '}
              <a href="https://linkedin.com/in/shubh-khatri" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </p>
          </footer>
        </div>
      );
    }

    export default App;