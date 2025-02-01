import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Pacientes from "./pages/Pacientes"
import Medicos from "./pages/Medicos"
import Consultas from "./pages/Consultas"
import Registro from "./pages/Registro"
import NovoPaciente from "./pages/NovoPaciente"
import NovoMedico from "./pages/NovoMedico"
import NovaConsulta from "./pages/NovaConsulta"
import DetalhesPaciente from "./pages/DetalhesPaciente";
import DetalhesMedico from "./pages/DetalhesMedico";
import DetalhesConsulta from "./pages/DetalhesConsulta";
import EditarPaciente from "./pages/EditarPaciente";
import EditarMedico from "./pages/EditarMedico";
import EditarConsulta from "./pages/EditarConsulta";


function App(){
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index  />} />
        <Route path="/home" element={<Home  />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/medicos" element={<Medicos />} />
        <Route path="/consultas" element={<Consultas />} />
        <Route path="/pacientes/novo" element={<NovoPaciente />} />
        <Route path="/medicos/novo" element={<NovoMedico />} />
        <Route path="/consultas/nova" element={<NovaConsulta />} />
        <Route path="/pacientes/detalhes" element={<DetalhesPaciente />} />
        <Route path="/medicos/detalhes" element={<DetalhesMedico />} />
        <Route path="/consultas/detalhes" element={<DetalhesConsulta />} />
        <Route path="/pacientes/editar" element={<EditarPaciente />} />
        <Route path="/medicos/editar" element={<EditarMedico />} />
        <Route path="/consultas/editar" element={<EditarConsulta />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
