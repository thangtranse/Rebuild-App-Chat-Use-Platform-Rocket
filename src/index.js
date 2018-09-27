import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CpmUploadFile from './components/cpmUploadFile'
// import Hello from './components/Hello';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App /> , document.getElementById('root'));

registerServiceWorker();