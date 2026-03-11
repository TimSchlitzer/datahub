import React from 'react';
import ReactDOM from 'react-dom';

import { App } from '@src/App';
// Must be imported before App to ensure i18n is initialised before any component renders
import '@src/i18n/config';
import reportWebVitals from '@src/reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
