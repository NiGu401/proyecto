import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Comida from './pages/Comida'
import Postres from './pages/Postres'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './pages/ProtectedRoute'
import Header from './componentes/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/comida' element={<Comida/>}/>
          <Route path='/postres' element={<Postres/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/registro' element={<Registro/>}/>
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
