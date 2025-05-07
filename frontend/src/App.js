import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TrackerForm from './components/TrackerForm';
import ResumeAnalyzer from './components/ResumeAnalyzer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<TrackerForm />} />
        <Route path="/analyze" element={<ResumeAnalyzer />} />
      </Routes>
    </Router>
  );
}

export default App;

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
