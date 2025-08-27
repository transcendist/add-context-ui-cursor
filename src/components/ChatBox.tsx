'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';

// Types
interface DocumentData {
  id: string;
  display: string;
  description?: string;
}

interface RenderedMessage {
  id: string;
  content: string;
  timestamp: Date;
}

// Custom hook to detect clicks outside an element
const useOnClickOutside = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export default function ChatBox({ placeholders = ["Ask anything…"] }) {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<RenderedMessage[]>([]);
  const [suggestions, setSuggestions] = useState<DocumentData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestionsRef = useRef<HTMLUListElement>(null);
  useOnClickOutside(suggestionsRef, () => setShowSuggestions(false));

  // --- Placeholder Animation ---
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [placeholderOpacity, setPlaceholderOpacity] = useState(1);
  const [placeholderFilter, setPlaceholderFilter] = useState('brightness(1) blur(0px)');
  
  useEffect(() => {
    if (placeholders.length <= 1) return;
    const interval = setInterval(() => {
      setPlaceholderOpacity(0);
      setPlaceholderFilter('brightness(1.06) blur(0.5px)');
      setTimeout(() => {
        setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        setPlaceholderFilter('brightness(1.03) blur(0px)');
        setPlaceholderOpacity(1);
        setTimeout(() => setPlaceholderFilter('brightness(1) blur(0px)'), 220);
      }, 220);
    }, 2000); // Switched to 2 seconds
    return () => clearInterval(interval);
  }, [placeholders.length]);

  // --- Data Fetching ---
  const fetchSuggestions = useCallback(async (query: string) => {
    try {
      const response = await fetch(`/api/docs?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
      setActiveIndex(0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // --- Event Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setValue(text);

    const atIndex = text.lastIndexOf('@');
    if (atIndex !== -1) {
      const query = text.substring(atIndex + 1);
      fetchSuggestions(query);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (suggestion: DocumentData) => {
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1) {
      const prefix = value.substring(0, atIndex);
      const newValue = `${prefix}@[${suggestion.display}](${suggestion.id}) `;
      setValue(newValue);
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    console.log('Raw message value:', value);
    const newMessage: RenderedMessage = {
      id: Date.now().toString(),
      content: value,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setValue('');
  };

  // --- Rendering ---
  const renderValueWithHighlights = (text: string) => {
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;

    for (const match of text.matchAll(mentionRegex)) {
      const [fullMatch, display] = match;
      const index = match.index!;

      // Add the plain text part before the match
      if (index > lastIndex) {
        parts.push(text.substring(lastIndex, index));
      }

      // Add the styled mention
      parts.push(<strong key={index} className="mention-chip-inline">@{display}</strong>);
      
      lastIndex = index + fullMatch.length;
    }

    // Add any remaining text after the last mention
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Messages */}
      <div className="mb-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-gray-800">{renderValueWithHighlights(message.content)}</div>
            <div className="text-xs text-gray-400 mt-2">{message.timestamp.toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 relative">
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="flex-1 px-4 py-3 relative">
            <div className="relative">
              <input
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="custom-input"
                placeholder={placeholders[currentPlaceholderIndex]}
                style={{
                  color: value.includes('@[') ? 'transparent' : '#1f2937',
                  caretColor: '#1f2937',
                  transition: value.length === 0 ? 'opacity 220ms ease, filter 220ms ease' : 'none',
                  filter: value.length === 0 ? placeholderFilter : 'none',
                  opacity: value.length === 0 ? placeholderOpacity : 1,
                }}
              />
              <div className="custom-input-highlighter" aria-hidden="true">
                {renderValueWithHighlights(value)}
              </div>
            </div>
            {showSuggestions && (
              <ul className="suggestions-list" ref={suggestionsRef}>
                {suggestions.map((s, i) => (
                  <li
                    key={s.id}
                    className={`suggestion-item ${i === activeIndex ? 'active' : ''}`}
                    onClick={() => handleSelect(s)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <div className="suggestion-item__main">{s.display}</div>
                    {s.description && <div className="suggestion-item__sub">{s.description}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" disabled={!value.trim()} className="p-3 m-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
