import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <div className="container">
          <div className="calculator">
            <InputSection />
            <ResultsSection />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;