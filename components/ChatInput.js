import React, { useState, useEffect, useCallback } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const QUICK_ACTIONS = [
  { label: "Tell me a story! 📖", prompt: "Can you tell me a short, happy story?" },
  { label: "Help with math ➕", prompt: "Can you help me with a simple math problem?" },
  { label: "Fun fact 🌍", prompt: "Tell me a cool fun fact about the world!" },
  { label: "Why is... 🤔", prompt: "Why is the..." }
];

const ChatInput = ({ onSend, disabled }) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.lang = 'en-US';

      recognizer.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        setInputValue(transcript);
      };

      recognizer.onend = () => {
        setIsRecording(false);
      };

      recognizer.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      setRecognition(recognizer);
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (!recognition) {
      alert("Oops! Your browser doesn't support voice recording yet. Maybe try Chrome? 😊");
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      setInputValue('');
      try {
        recognition.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Failed to start recognition", e);
      }
    }
  }, [recognition, isRecording]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSend(inputValue);
      setInputValue('');
      if (isRecording && recognition) recognition.stop();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return html`
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        ${QUICK_ACTIONS.map((action, idx) => html`
          <button
            key=${idx}
            disabled=${disabled || isRecording}
            onClick=${() => onSend(action.prompt)}
            className="text-xs bg-sky-50 text-sky-600 border border-sky-100 hover:bg-sky-100 px-3 py-1.5 rounded-full font-semibold transition-colors disabled:opacity-50"
          >
            ${action.label}
          </button>
        `)}
      </div>

      <form onSubmit=${handleSubmit} className="flex gap-2">
        <div className="relative flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value=${inputValue}
              onInput=${(e) => setInputValue(e.target.value)}
              onKeyDown=${handleKeyDown}
              placeholder=${isRecording ? "Listening to you... 👂" : "Type a message to Sparky..."}
              disabled=${disabled}
              className=${`w-full bg-sky-50 border-2 ${isRecording ? 'border-pink-300 ring-2 ring-pink-100' : 'border-sky-200'} focus:border-sky-400 focus:ring-0 rounded-2xl px-4 py-3 pr-12 transition-all outline-none text-gray-700 placeholder:text-sky-300 disabled:opacity-70`}
            />
            ${inputValue && !isRecording && html`
              <button
                type="submit"
                disabled=${disabled}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 disabled:bg-gray-200 transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            `}
          </div>

          <button
            type="button"
            onClick=${toggleRecording}
            disabled=${disabled}
            title=${isRecording ? "Stop recording" : "Record voice message"}
            className=${`p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center ${
              isRecording 
                ? 'bg-pink-500 text-white animate-pulse scale-110' 
                : 'bg-sky-100 text-sky-600 hover:bg-sky-200'
            } disabled:opacity-50 disabled:scale-100`}
          >
            ${isRecording ? html`
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth=${2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth=${2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H10a1 1 0 01-1-1v-4z" />
              </svg>
            ` : html`
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth=${2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            `}
          </button>
        </div>
      </form>
      <p className="text-[10px] text-center text-gray-400 italic">
        ${isRecording ? "Sparky is listening carefully... 👂" : "Sparky is an AI and sometimes makes mistakes. Check with a parent! 🌈"}
      </p>
    </div>
  `;
};

export default ChatInput;