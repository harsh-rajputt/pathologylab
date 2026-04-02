import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import PatientRegistration from './pages/Patients/PatientRegistration';
import PatientList from './pages/Patients/PatientList';
import ResultEntry from './pages/Patients/ResultEntry';
import ResultPrint from './pages/Patients/ResultPrint';
import PrintReport from './pages/Patients/PrintReport';
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

import Sidebar from './components/Sidebar';

function Layout() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/"                  element={<Dashboard />} />
          <Route path="/patients/register" element={<PatientRegistration />} />
          <Route path="/patients/list"     element={<PatientList />} />
          <Route path="/patients/result-entry" element={<ResultEntry />} />
          <Route path="/patients/result-print" element={<ResultPrint />} />
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
      <Routes>
        <Route path="/print-report" element={<PrintReport />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}

