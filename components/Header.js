import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const Header = ({ onClear }) => {
  return html`
    <header className="bg-sky-400 p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-full shadow-inner">
          <span className="text-3xl">🤖</span>
        </div>
        <div>
          <h1 className="text-white font-fredoka text-xl tracking-wide">Sparky</h1>
          <p className="text-sky-100 text-xs font-medium uppercase tracking-widest">Your Friendly AI Buddy</p>
        </div>
      </div>
      <button 
        onClick=${onClear}
        className="text-white bg-sky-500 hover:bg-sky-600 px-3 py-1.5 rounded-full text-sm font-bold transition-all transform active:scale-95 flex items-center gap-1 shadow-sm"
      >
        <span>🔄</span> Reset
      </button>
    </header>
  `;
};

export default Header;