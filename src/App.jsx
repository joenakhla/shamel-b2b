import { Routes, Route } from "react-router-dom"
import ShamelB2B from "./ShamelB2B.jsx"
import VezeetaSurgical from "./VezeetaSurgical.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<ShamelB2B />} />
      <Route path="/surgical" element={<VezeetaSurgical />} />
      <Route path="/surgical/*" element={<VezeetaSurgical />} />
    </Routes>
  )
}

export default App
