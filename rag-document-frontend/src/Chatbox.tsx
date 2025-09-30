    // cv-ai-frontend/src/Chatbox.tsx
    import React, { useState, useRef, useEffect } from 'react';
    import { gql, useMutation } from '@apollo/client';

    const SEND_MESSAGE_MUTATION = gql`
        mutation AskCV($question: String!) {
            askCV(question: $question)
        }
    `;

    interface Message {
      id: number;
      text: string;
      sender: 'user' | 'ai';
      timestamp: string;
    }

    const Chatbox: React.FC = () => {
      const [messages, setMessages] = useState<Message[]>([
        {
          id: Date.now(),
          text: "Hello! I'm an AI assistant. Ask me anything about the CV.",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      const [input, setInput] = useState<string>('');
      const messagesEndRef = useRef<null | HTMLDivElement>(null);

      const [askCV, { loading, error }] = useMutation(SEND_MESSAGE_MUTATION);

      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

      useEffect(() => {
        scrollToBottom();
      }, [messages]);

      const handleSend = async () => {
        if (input.trim()) {
          const userMessageText = input;
          const newUserMessage: Message = {
            id: Date.now(),
            text: userMessageText,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prevMessages) => [...prevMessages, newUserMessage]);
          setInput('');

          try {
            const { data } = await askCV({ variables: { question: userMessageText } });
    
            if (data && data.askCV) {
              const aiMessage: Message = {
                id: Date.now() + 1,
                text: data.askCV,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              setMessages((prevMessages) => [...prevMessages, aiMessage]);
            } else {
              const aiErrorMessage: Message = {
                id: Date.now() + 1,
                text: 'Error - No valid response received.',
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              setMessages((prevMessages) => [...prevMessages, aiErrorMessage]);
            }
          } catch (e) {
            console.error("Error sending message:", e);
            const aiConnectionError: Message = {
              id: Date.now() + 1,
              text: 'Error - Could not send message.',
              sender: 'ai',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prevMessages) => [...prevMessages, aiConnectionError]);
          }
        }
      };

      return (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.07)',
            padding: '0',
            width: '100%',
            maxWidth: '580px',
            height: '75vh',
            maxHeight: '720px',
            minHeight: '450px',
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
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const content = msg.text;
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    background: isUser ? '#3b82f6' : '#f1f5f9',
                    color: isUser ? '#ffffff' : '#1e293b',
                    border: '1px solid transparent',
                    borderRadius: isUser
                      ? '20px 20px 4px 20px'
                      : '20px 20px 20px 4px',
                    padding: '10px 16px',
                    maxWidth: '75%',
                    fontSize: '15px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    marginBottom: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    {content}
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', alignSelf: 'flex-end', marginTop: '4px' }}>
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: '#f1f5f9',
                  color: '#1e293b',
                  border: '1px solid transparent',
                  borderRadius: '20px 20px 20px 4px',
                  padding: '10px 16px',
                  maxWidth: '75%',
                  fontSize: '15px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
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
                      .chat-input:focus {
                        border-color: #3b82f6;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                      }
                      .send-button:not(:disabled):hover {
                        transform: translateY(-1px);
                        box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
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
                  background: '#fff0f0', // Keep error background distinct
                  color: '#c0392b',      // Keep error text color distinct
                  border: '1px solid #f5c6cb', // Keep error border distinct
                  borderRadius: '18px 18px 18px 6px',
                  padding: '10px 16px',
                  maxWidth: '75%',
                  fontSize: '15px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
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
            <div ref={messagesEndRef} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              borderTop: '1px solid #e2e8f0',
              padding: '16px 20px',
              background: '#ffffff',
              borderRadius: '0 0 22px 22px',
              gap: '10px',
            }}
          >
            <input
              className="chat-input"
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
                padding: '12px 16px',
                border: '1px solid transparent',
                borderRadius: '14px',
                fontSize: '15px',
                outline: 'none',
                background: '#f1f5f9',
                color: '#1e293b',
                transition: 'border 0.2s, box-shadow 0.2s',
                boxShadow: 'none',
              }}
              placeholder="Type your message..."
              disabled={loading}
              autoFocus
            />
            <button
              className="send-button"
              onClick={handleSend}
              style={{
                background: loading
                  ? '#d1d5db'
                  : '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 24px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading
                  ? 'none'
                  : '0 4px 12px rgba(59, 130, 246, 0.3)',
                transition: 'background 0.2s, box-shadow 0.2s, transform 0.2s',
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