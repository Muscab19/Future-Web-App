import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Apps from './Apps'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Apps />
  </BrowserRouter>
)
