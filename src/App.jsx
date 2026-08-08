import { BrowserRouter, Routes, Route } from "react-router-dom"

function Landing() {
  return (
    <div className="min-h-screen bg-green-100 p-10">
      <h1 className="text-5xl font-bold text-green-950">
        HealTogether Landing
      </h1>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-blue-100 p-10">
      <h1 className="text-5xl font-bold">
        Dashboard Works
      </h1>
    </div>
  )
}

function Medicines() {
  return (
    <div className="min-h-screen bg-yellow-100 p-10">
      <h1 className="text-5xl font-bold">
        Medicines Works
      </h1>
    </div>
  )
}

function Emergency() {
  return (
    <div className="min-h-screen bg-red-100 p-10">
      <h1 className="text-5xl font-bold">
        Emergency Works
      </h1>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App