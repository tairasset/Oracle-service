
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Finds the root DOM element where the React application will be mounted.
 * Throws an error if the element with the ID 'root' is not found in the HTML.
 */
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

/**
 * Creates a React root for the application.
 * This is the entry point for rendering the React component tree into the DOM.
 */
const root = ReactDOM.createRoot(rootElement);

/**
 * Renders the main App component into the root element.
 * React.StrictMode is used to highlight potential problems in the application during development.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
