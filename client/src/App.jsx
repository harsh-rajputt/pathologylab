import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FlaskConical, BookOpen, Settings, Database, ChevronDown, UserPlus, List, Building2, Network, ClipboardList, FileEdit, MessageSquare, SquarePlus, User, Globe, Pin, Gamepad2, Clock, UserCog, Layers, Boxes, ListChecks } from 'lucide-react';
import Dashboard from './pages/Dashboard/Dashboard';
import PatientRegistration from './pages/Patients/PatientRegistration';
import PatientList from './pages/Patients/PatientList';
import TestDepartment from './pages/Tests/TestDepartment';
import TestWings from './pages/Tests/TestWings';
import TestList from './pages/Tests/TestList';
import TestEntry from './pages/Tests/TestEntry';
import TestUnit from './pages/Tests/TestUnit';
import MultiTestSetting from './pages/Tests/MultiTestSetting';
import ProfileSetting from './pages/Tests/ProfileSetting';
import ReferenceDoctor from './pages/Refrences/ReferenceDoctor';
import CollectionCenter from './pages/Refrences/CollectionCenter';
import Profile from './pages/Control center/Profile';
import SmsEmail from './pages/Control center/SmsEmail';
import MenuPermission from './pages/Control center/MenuPermission';
import UserAccount from './pages/Control center/UserAccount';
import PageSetup from './pages/Control center/PageSetup';
import DatabaseServices from './pages/Control center/DatabaseServices';
import UserLog from './pages/Control center/UserLog';
import UserRole from './pages/Control center/UserRole';
import Masters from './pages/Masters/Masters';

// Top-level nav items (non-dropdown)
const topNavItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
];

const bottomNavItems = [
  { name: 'Masters',        path: '/masters',        icon: Database },
];

const patientSubItems = [
  { name: 'Registration',  path: '/patients/register', icon: UserPlus },
  { name: 'Patient List',  path: '/patients/list',     icon: List },
];

const testSubItems = [
  { name: 'Department', path: '/tests/department', icon: Building2 },
  { name: 'Wings',      path: '/tests/wings',      icon: Network },
  { name: 'Test Lists', path: '/tests/list',       icon: ClipboardList },
  { name: 'Test Entry', path: '/tests/entry',      icon: FileEdit },
  { name: 'Test Unit',  path: '/tests/unit',       icon: Layers },
  { name: 'Multi Test', path: '/tests/multi-test', icon: Boxes },
  { name: 'Profile Setting', path: '/tests/profile', icon: ListChecks },
];

const referenceSubItems = [
  { name: 'Reference & Doctor', path: '/references/doctor', icon: MessageSquare },
  { name: 'Collection Center',  path: '/references/collection-center', icon: SquarePlus },
];

const controlCenterSubItems = [
  { name: 'Profile',           path: '/control-center/profile',           icon: User },
  { name: 'SMS & Email',       path: '/control-center/sms-email',         icon: Globe },
  { name: 'Menu Permission',   path: '/control-center/menu-permission',   icon: Pin },
  { name: 'User Account',      path: '/control-center/user-account',      icon: Users },
  { name: 'Page Setup',        path: '/control-center/page-setup',        icon: Gamepad2 },
  { name: 'Database Services', path: '/control-center/database-services', icon: Database },
  { name: 'User Log',          path: '/control-center/user-log',          icon: Clock },
  { name: 'User Role',         path: '/control-center/user-role',         icon: UserCog },
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

function PatientsDropdown({ isOpen, onToggle }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith('/patients');

  return (
    <div>
      {/* Patients parent button */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-xl transition-all duration-200 ${
          isActive
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
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown sub-items */}
      {isOpen && (
        <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-3">
          {patientSubItems.map((sub) => {
            const SubIcon = sub.icon;
            return (
              <NavLink
                key={sub.path}
                to={sub.path}
                className={({ isActive: isSubActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                    isSubActive
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

function TestsDropdown({ isOpen, onToggle }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith('/tests');

  return (
    <div>
      {/* Tests parent button */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-blue-600/10 text-blue-400 font-semibold'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <FlaskConical size={20} />
          <span>Tests</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown sub-items */}
      {isOpen && (
        <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-3">
          {testSubItems.map((sub) => {
            const SubIcon = sub.icon;
            return (
              <NavLink
                key={sub.path}
                to={sub.path}
                className={({ isActive: isSubActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                    isSubActive
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

function ReferencesDropdown({ isOpen, onToggle }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith('/references');

  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-blue-600/10 text-blue-400 font-semibold'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <BookOpen size={20} />
          <span>References</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-3">
          {referenceSubItems.map((sub) => {
            const SubIcon = sub.icon;
            return (
              <NavLink
                key={sub.path}
                to={sub.path}
                className={({ isActive: isSubActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                    isSubActive
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

function ControlCenterDropdown({ isOpen, onToggle }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith('/control-center');

  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-blue-600/10 text-blue-400 font-semibold'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <Settings size={20} />
          <span>Control Center</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-3">
          {controlCenterSubItems.map((sub) => {
            const SubIcon = sub.icon;
            return (
              <NavLink
                key={sub.path}
                to={sub.path}
                className={({ isActive: isSubActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                    isSubActive
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
  const location = useLocation();
  
  // Initialize accordion state based on current URL path
  const [openDropdown, setOpenDropdown] = useState(() => {
    if (location.pathname.startsWith('/patients')) return 'patients';
    if (location.pathname.startsWith('/tests')) return 'tests';
    if (location.pathname.startsWith('/references')) return 'references';
    if (location.pathname.startsWith('/control-center')) return 'control-center';
    return null;
  });

  const handleToggle = (dropdownName) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

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
      <nav className="space-y-1.5 flex-1 text-sm font-medium overflow-y-auto pr-2 pb-4 
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-slate-700
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-slate-600"
      >
        {topNavItems.map((item) => <NavItem key={item.path} item={item} />)}
        <PatientsDropdown 
          isOpen={openDropdown === 'patients'} 
          onToggle={() => handleToggle('patients')} 
        />
        <TestsDropdown 
          isOpen={openDropdown === 'tests'} 
          onToggle={() => handleToggle('tests')} 
        />
        <ReferencesDropdown 
          isOpen={openDropdown === 'references'} 
          onToggle={() => handleToggle('references')} 
        />
        <ControlCenterDropdown 
          isOpen={openDropdown === 'control-center'} 
          onToggle={() => handleToggle('control-center')} 
        />
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
          <Route path="/tests/department"  element={<TestDepartment />} />
          <Route path="/tests/wings"       element={<TestWings />} />
          <Route path="/tests/list"        element={<TestList />} />
          <Route path="/tests/entry"       element={<TestEntry />} />
          <Route path="/tests/unit"        element={<TestUnit />} />
          <Route path="/tests/multi-test"  element={<MultiTestSetting />} />
          <Route path="/tests/profile"     element={<ProfileSetting />} />
          <Route path="/references/doctor" element={<ReferenceDoctor />} />
          <Route path="/references/collection-center" element={<CollectionCenter />} />
          <Route path="/control-center/profile"           element={<Profile />} />
          <Route path="/control-center/sms-email"         element={<SmsEmail />} />
          <Route path="/control-center/menu-permission"   element={<MenuPermission />} />
          <Route path="/control-center/user-account"      element={<UserAccount />} />
          <Route path="/control-center/page-setup"        element={<PageSetup />} />
          <Route path="/control-center/database-services" element={<DatabaseServices />} />
          <Route path="/control-center/user-log"          element={<UserLog />} />
          <Route path="/control-center/user-role"         element={<UserRole />} />
          <Route path="/masters"                          element={<Masters />} />
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
