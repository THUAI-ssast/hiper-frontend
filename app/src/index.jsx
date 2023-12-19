/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from "@solidjs/router";
import { HopeProvider } from '@hope-ui/solid'

import App from './App';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

function myApp() {
  return (
    <Router>
      <HopeProvider>
        <App />
      </HopeProvider>
    </Router >
  );
}

render(myApp, document.getElementById('root'));
