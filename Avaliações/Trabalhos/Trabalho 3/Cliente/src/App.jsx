import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Pacientes from "./pages/Pacientes"
import Medicos from "./pages/Medicos"
import Consultas from "./pages/Consultas"

function App(){
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index  />} />
        <Route path="/home" element={<Home  />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/medicos" element={<Medicos />} />
        <Route path="/consultas" element={<Consultas />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
