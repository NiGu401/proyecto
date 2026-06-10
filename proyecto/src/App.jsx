import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Inicio2 from './pages/index'
import Comida from './pages/Comida'
import Postres from './pages/Postres'
import Menu from './pages/Menu'
import Pedidos from './pages/Pedidos'

import AgendaEventos from './pages/AgendaEventos'

import Contacto from './pages/Contacto'
import AdminPanel from './pages/AdminPanel'
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
          <Route path='/' element={<Inicio2/>}/>
          
          <Route path='/comida' element={<Comida/>}/>
          <Route path='/postres' element={<Postres/>}/>
          <Route path='/menu' element={<Menu/>}/>
          <Route path='/pedidos' element={<Pedidos/>}/>

          <Route path='/agenda-eventos' element={<AgendaEventos/>}/>

          <Route path='/contacto' element={<Contacto/>}/>
          <Route path='/admin-panel' element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPanel/>
            </ProtectedRoute>
          }/>
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
