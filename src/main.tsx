import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { GamePage } from './pages/GamePage.tsx'
import { TitlePage } from './pages/TitlePage.tsx'
import { Game } from 'phaser'
import { Settings } from './pages/Settings.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TitlePage />} />
        <Route path='/game' element={<GamePage />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
