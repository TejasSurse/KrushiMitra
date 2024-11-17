// src/App.js
import React from 'react';
import CropForm from './componenets/CropForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecommendCrop from './pages/RecommendCrop';
import CropInfo from './componenets/CropInfo';

const App = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<CropForm />} />
          <Route path="/recommend-crop" element={<RecommendCrop />} />
          <Route path="/crop-info" element={<CropInfo />} /> 
          
        </Routes>
      </Router>
    );
  };
  

export default App;
