import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FlaskConical, BookOpen, Settings, Database, ChevronDown, UserPlus, List } from 'lucide-react';
import Dashboard from './pages/Dashboard/Dashboard';
import PatientRegistration from './pages/Patients/PatientRegistration';
import PatientList from './pages/Patients/PatientList';
import Tests from './pages/Tests/Tests';
import References from './pages/Refrences/References';
import ControlCenter from './pages/Control center/ControlCenter';
import Masters from './pages/Masters/Masters';

// Top-level nav items (non-dropdown)
const topNavItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
];

const bottomNavItems = [
  { name: 'Tests',          path: '/tests',          icon: FlaskConical },
  { name: 'References',     path: '/references',     icon: BookOpen },
  { name: 'Control Center', path: '/control-center', icon: Settings },
  { name: 'Masters',        path: '/masters',        icon: Database },
];

const patientSubItems = [
  { name: 'Registration',  path: '/patients/register', icon: UserPlus },
  { name: 'Patient List',  path: '/patients/list',     icon: List },
];

function NavItem({ item }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-blue-600/10 text-blue-400 font-semibold'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`
      }
    >
      <Icon size={20} />
      <span>{item.name}</span>
    </NavLink>
  );
}

function PatientsDropdown() {
  const location = useLocation();
  const isPatientsActive = location.pathname.startsWith('/patients');
  const [open, setOpen] = useState(isPatientsActive);

  return (
    <div>
      {/* Patients parent button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-xl transition-all duration-200 ${
          isPatientsActive
            ? 'bg-blue-600/10 text-blue-400 font-semibold'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <Users size={20} />
          <span>Patients</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown sub-items */}
      {open && (
        <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-3">
          {patientSubItems.map((sub) => {
            const SubIcon = sub.icon;
            return (
              <NavLink
                key={sub.path}
                to={sub.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 font-semibold'
                      : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
                  }`
                }
              >
                <SubIcon size={16} />
                <span>{sub.name}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 text-slate-300 p-6 flex flex-col shadow-2xl z-10 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 mt-2 px-2">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <FlaskConical size={22} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Lab Panel</h1>
      </div>

      {/* Nav */}
      <nav className="space-y-1.5 flex-1 text-sm font-medium">
        {topNavItems.map((item) => <NavItem key={item.path} item={item} />)}
        <PatientsDropdown />
        {bottomNavItems.map((item) => <NavItem key={item.path} item={item} />)}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-600 px-2">
        PathologyLab v1.0.0
      </div>
    </aside>
  );
}

function Layout() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/"                  element={<Dashboard />} />
          <Route path="/patients/register" element={<PatientRegistration />} />
          <Route path="/patients/list"     element={<PatientList />} />
          <Route path="/tests"             element={<Tests />} />
          <Route path="/references"        element={<References />} />
          <Route path="/control-center"    element={<ControlCenter />} />
          <Route path="/masters"           element={<Masters />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
