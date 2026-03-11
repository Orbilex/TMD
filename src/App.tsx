import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Demo from './pages/Demo';
import CreatorDemo from './pages/CreatorDemo';
import { CreatorProvider } from './context/CreatorContext';

export default function App() {
  return (
    <CreatorProvider>
      {   
      }
      <BrowserRouter> {}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/creatordemo" element={<CreatorDemo />} />
        </Routes>
      </BrowserRouter>
    </CreatorProvider>
  );
}
