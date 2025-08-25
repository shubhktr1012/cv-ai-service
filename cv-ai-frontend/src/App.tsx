    // cv-ai-frontend/src/App.tsx
    import React from 'react';
    import './App.css'; // Assuming you still want the basic App.css
    import Chatbox from './Chatbox';

    function App() {
      return (
        <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Chatbox />
        </div>
      );
    }

    export default App;