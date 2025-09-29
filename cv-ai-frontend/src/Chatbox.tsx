    // cv-ai-frontend/src/Chatbox.tsx
    import React, { useState } from 'react';
    import { gql, useMutation } from '@apollo/client';

    const SEND_MESSAGE_MUTATION = gql`
        mutation AskCV($question: String!) {
            askCV(question: $question)
        }
    `;

    const Chatbox: React.FC = () => {
      const [messages, setMessages] = useState<string[]>([]);
      const [input, setInput] = useState<string>('');

      const [askCV, { loading, error }] = useMutation(SEND_MESSAGE_MUTATION);

      const handleSend = async () => {
        if (input.trim()) {
          const userMessage = input;  
          setMessages((prevMessages) => [...prevMessages, `You: ${userMessage}`]);
          // In a later step, we'll send this 'input' to the backend
          setInput('');

          try {
            // Call the GraphQL mutation with the correct variable name
            const { data } = await askCV({ variables: { question: userMessage } }); // Changed sendMessage to askCV and message to question
    
            if (data && data.askCV) { // Check data.askCV directly as it returns a String
              setMessages((prevMessages) => [...prevMessages, `AI: ${data.askCV}`]);
            } else {
              setMessages((prevMessages) => [...prevMessages, `AI: Error - No valid response received.`]);
            }
          } catch (e) {
            console.error("Error sending message:", e);
            setMessages((prevMessages) => [...prevMessages, `AI: Error - Could not send message.`]);
          }
        }
      };

      return (
        <div
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e8ecf3 100%)',
            border: '1px solid #e3e7ee',
            borderRadius: '18px',
            boxShadow: '0 4px 24px 0 rgba(60,72,100,0.08)',
            padding: '0',
            width: '420px',
            height: '540px',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
          }}
        >
          <div
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: '24px 20px 12px 20px',
              marginBottom: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((msg, index) => {
              const isUser = msg.startsWith('You:');
              const content = msg.replace(/^You: |^AI: /, '');
              return (
                <div
                  key={index}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    background: isUser ? '#e6f0ff' : '#fff',
                    color: isUser ? '#1a3e72' : '#222b3a',
                    border: isUser ? '1px solid #b3d4fc' : '1px solid #e3e7ee',
                    borderRadius: isUser
                      ? '16px 16px 4px 16px'
                      : '16px 16px 16px 4px',
                    padding: '10px 16px',
                    maxWidth: '75%',
                    fontSize: '15px',
                    boxShadow: isUser
                      ? '0 1px 4px 0 rgba(60,72,100,0.04)'
                      : '0 1px 4px 0 rgba(60,72,100,0.06)',
                    marginBottom: '0',
                  }}
                >
                  {!isUser && (
                    <span
                      style={{
                        fontWeight: 600,
                        color: '#6b7a90',
                        fontSize: '13px',
                        marginRight: '6px',
                        letterSpacing: '0.01em',
                      }}
                    >
                      AI
                    </span>
                  )}
                  {content}
                </div>
              );
            })}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: '#fff',
                  color: '#222b3a',
                  border: '1px solid #e3e7ee',
                  borderRadius: '16px 16px 16px 4px',
                  padding: '10px 16px',
                  maxWidth: '75%',
                  fontSize: '15px',
                  boxShadow: '0 1px 4px 0 rgba(60,72,100,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: '#6b7a90',
                    fontSize: '13px',
                    marginRight: '6px',
                    letterSpacing: '0.01em',
                  }}
                >
                  AI
                </span>
                <span>
                  <span className="dot-flashing" style={{
                    display: 'inline-block',
                    width: '1.2em',
                    height: '1em',
                    verticalAlign: 'middle',
                  }}>
                    <span style={{
                      display: 'inline-block',
                      width: '0.25em',
                      height: '0.25em',
                      background: '#b3b9c9',
                      borderRadius: '50%',
                      marginRight: '0.15em',
                      animation: 'dotFlashing 1s infinite linear alternate',
                    }}></span>
                    <span style={{
                      display: 'inline-block',
                      width: '0.25em',
                      height: '0.25em',
                      background: '#b3b9c9',
                      borderRadius: '50%',
                      marginRight: '0.15em',
                      animation: 'dotFlashing 1s 0.2s infinite linear alternate',
                    }}></span>
                    <span style={{
                      display: 'inline-block',
                      width: '0.25em',
                      height: '0.25em',
                      background: '#b3b9c9',
                      borderRadius: '50%',
                      animation: 'dotFlashing 1s 0.4s infinite linear alternate',
                    }}></span>
                  </span>
                  <style>
                    {`
                      @keyframes dotFlashing {
                        0% { opacity: 0.2; }
                        50%, 100% { opacity: 1; }
                      }
                    `}
                  </style>
                </span>
              </div>
            )}
            {error && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: '#fff0f0',
                  color: '#c0392b',
                  border: '1px solid #f5c6cb',
                  borderRadius: '16px 16px 16px 4px',
                  padding: '10px 16px',
                  maxWidth: '75%',
                  fontSize: '15px',
                  boxShadow: '0 1px 4px 0 rgba(60,72,100,0.06)',
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: '#c0392b',
                    fontSize: '13px',
                    marginRight: '6px',
                    letterSpacing: '0.01em',
                  }}
                >
                  AI
                </span>
                Error: {error.message}
              </div>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              borderTop: '1px solid #e3e7ee',
              padding: '16px 20px',
              background: '#f6f8fa',
              borderRadius: '0 0 18px 18px',
              gap: '10px',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              style={{
                flexGrow: 1,
                padding: '10px 14px',
                border: '1px solid #d1d7e0',
                borderRadius: '12px',
                fontSize: '15px',
                outline: 'none',
                background: '#fff',
                color: '#222b3a',
                transition: 'border 0.2s',
                boxShadow: '0 1px 2px 0 rgba(60,72,100,0.03)',
              }}
              placeholder="Type your message..."
              disabled={loading}
              autoFocus
            />
            <button
              onClick={handleSend}
              style={{
                background: loading
                  ? 'linear-gradient(90deg, #b3b9c9 0%, #d1d7e0 100%)'
                  : 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 22px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading
                  ? 'none'
                  : '0 2px 8px 0 rgba(60,72,100,0.08)',
                transition: 'background 0.2s, box-shadow 0.2s',
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      );
    };

    export default Chatbox;