'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  originalContent?: string;
  translatedTo?: string;
  timestamp: number;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

interface ChatHistoryContextType {
  sessions: ChatSession[];
  currentSessionId: string | null;
  currentSession: ChatSession | null;
  createSession: (title?: string) => string;
  deleteSession: (id: string) => void;
  switchSession: (id: string) => void;
  addMessage: (message: Message) => void;
  updateCurrentSessionTitle: (title: string) => void;
  clearCurrentSession: () => void;
  loadSessions: () => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

const SESSIONS_STORAGE_KEY = 'chatSessions';
const CURRENT_SESSION_KEY = 'currentSessionId';

export function ChatHistoryProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessionsState] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionIdState] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadSessionsFromStorage();
  }, []);

  const loadSessionsFromStorage = () => {
    try {
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
      const storedCurrentId = localStorage.getItem(CURRENT_SESSION_KEY);
      
      if (stored) {
        const parsedSessions = JSON.parse(stored) as ChatSession[];
        setSessionsState(parsedSessions);
        
        if (storedCurrentId && parsedSessions.some(s => s.id === storedCurrentId)) {
          setCurrentSessionIdState(storedCurrentId);
        } else if (parsedSessions.length > 0) {
          setCurrentSessionIdState(parsedSessions[0].id);
        }
      }
    } catch (e) {
      console.error('Could not load chat sessions from localStorage', e);
    }
  };

  const saveSessions = (updatedSessions: ChatSession[]) => {
    try {
      if (isMounted) {
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));
      }
    } catch (e) {
      console.error('Could not save chat sessions to localStorage', e);
    }
  };

  const saveCurrentSessionId = (id: string | null) => {
    try {
      if (isMounted && id) {
        localStorage.setItem(CURRENT_SESSION_KEY, id);
      } else if (!id) {
        localStorage.removeItem(CURRENT_SESSION_KEY);
      }
    } catch (e) {
      console.error('Could not save current session ID to localStorage', e);
    }
  };

  const createSession = (title?: string): string => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: title || `Chat ${new Date().toLocaleDateString()}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedSessions = [newSession, ...sessions];
    setSessionsState(updatedSessions);
    setCurrentSessionIdState(newSession.id);
    saveSessions(updatedSessions);
    saveCurrentSessionId(newSession.id);

    return newSession.id;
  };

  const deleteSession = (id: string) => {
    const updatedSessions = sessions.filter(s => s.id !== id);
    setSessionsState(updatedSessions);
    saveSessions(updatedSessions);

    if (currentSessionId === id) {
      const nextSession = updatedSessions.length > 0 ? updatedSessions[0] : null;
      setCurrentSessionIdState(nextSession?.id || null);
      saveCurrentSessionId(nextSession?.id || null);
    }
  };

  const switchSession = (id: string) => {
    if (sessions.some(s => s.id === id)) {
      setCurrentSessionIdState(id);
      saveCurrentSessionId(id);
    }
  };

  const addMessage = (message: Message) => {
    setSessionsState(prev =>
      prev.map(session =>
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, message], updatedAt: Date.now() }
          : session
      )
    );
  };

  const updateCurrentSessionTitle = (title: string) => {
    setSessionsState(prev =>
      prev.map(session =>
        session.id === currentSessionId
          ? { ...session, title, updatedAt: Date.now() }
          : session
      )
    );
  };

  const clearCurrentSession = () => {
    setSessionsState(prev =>
      prev.map(session =>
        session.id === currentSessionId
          ? { ...session, messages: [], updatedAt: Date.now() }
          : session
      )
    );
  };

  const loadSessions = () => {
    loadSessionsFromStorage();
  };

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  if (!isMounted) {
    return null;
  }

  return (
    <ChatHistoryContext.Provider
      value={{
        sessions,
        currentSessionId,
        currentSession,
        createSession,
        deleteSession,
        switchSession,
        addMessage,
        updateCurrentSessionTitle,
        clearCurrentSession,
        loadSessions,
      }}
    >
      {children}
    </ChatHistoryContext.Provider>
  );
}

export function useChatHistory() {
  const context = useContext(ChatHistoryContext);
  if (context === undefined) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
}
