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
        <div style={{ border: '1px solid black', padding: '10px', width: '400px', height: '500px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '10px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>{msg}</div>
            ))}
            {loading && <div>AI: Thinking...</div>} {/* Display loading state */}
            {error && <div style={{ color: 'red' }}>AI: Error: {error.message}</div>} {/* Display error */}
          </div>
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              style={{ flexGrow: 1, padding: '8px' }}
              placeholder="Type your message..."
              disabled={loading} // Disable input while loading
            />
            <button onClick={handleSend} style={{ marginLeft: '10px', padding: '8px 15px' }} disabled={loading}>Send</button>
          </div>
        </div>
      );
    };

    export default Chatbox;