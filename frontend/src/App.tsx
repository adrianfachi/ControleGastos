import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen text-slate-100">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-amber-300/80">Controle de gastos</p>
              <h1 className="text-lg font-semibold text-white sm:text-2xl">Cadastro, transações e totais</h1>
            </div>

            <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${isActive ? 'bg-amber-300 text-slate-950' : 'text-slate-200 hover:bg-white/10'}`
                }
              >
                Pessoas e totais
              </NavLink>
              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${isActive ? 'bg-amber-300 text-slate-950' : 'text-slate-200 hover:bg-white/10'}`
                }
              >
                Transações
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App