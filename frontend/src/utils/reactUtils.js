/**
 * React Utilities for Hermes compatibility
 * This file ensures React hooks are properly initialized
 */

// Ensure React is properly initialized
import React from 'react';

// Re-export React to be used as default import
export default React;

// Export all commonly used React APIs
export const {
  memo,
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  useDebugValue,
  createContext,
  createElement,
  Fragment
} = React;
