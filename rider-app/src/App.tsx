import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { RideMapScreen } from './screens/RideMapScreen'
import { CaptureScreen } from './screens/CaptureScreen'
import { MyLeadsScreen } from './screens/MyLeadsScreen'
import { LeadDetailScreen } from './screens/LeadDetailScreen'
import { EarningsScreen } from './screens/EarningsScreen'
import { MoreScreen } from './screens/MoreScreen'
import { RoleSwitcherScreen } from './screens/RoleSwitcherScreen'
import { SalesLayout } from './layout/SalesLayout'
import { SalesPipelineScreen } from './screens/sales/SalesPipelineScreen'
import { SalesDealScreen } from './screens/sales/SalesDealScreen'
import { CustomerLayout } from './layout/CustomerLayout'
import { CustomerDashboardScreen } from './screens/customer/CustomerDashboardScreen'
import { ShaftReadinessScreen } from './screens/customer/ShaftReadinessScreen'
import { TechnicianLayout } from './layout/TechnicianLayout'
import { TechnicianTodayScreen } from './screens/technician/TechnicianTodayScreen'
import { TechEarningsScreen } from './screens/technician/TechEarningsScreen'
import { QcLayout } from './layout/QcLayout'
import { QcQueueScreen } from './screens/qc/QcQueueScreen'
import { QcChecklistScreen } from './screens/qc/QcChecklistScreen'
import { SupplierLayout } from './layout/SupplierLayout'
import { SupplierOrderBoardScreen } from './screens/supplier/SupplierOrderBoardScreen'
import { KitPackingScreen } from './screens/supplier/KitPackingScreen'
import { AdminLayout } from './layout/AdminLayout'
import { AdminScreen } from './screens/admin/AdminScreen'
import { OwnerLayout } from './layout/OwnerLayout'
import { OwnerScreen } from './screens/owner/OwnerScreen'
import { CandidateLayout } from './layout/CandidateLayout'
import { CandidateScreen } from './screens/candidate/CandidateScreen'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/demo" element={<RoleSwitcherScreen />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<RideMapScreen />} />
          <Route path="/capture" element={<CaptureScreen />} />
          <Route path="/leads" element={<MyLeadsScreen />} />
          <Route path="/leads/:id" element={<LeadDetailScreen />} />
          <Route path="/earnings" element={<EarningsScreen />} />
          <Route path="/more" element={<MoreScreen />} />
        </Route>

        <Route element={<SalesLayout />}>
          <Route path="/sales" element={<SalesPipelineScreen />} />
          <Route path="/sales/:id" element={<SalesDealScreen />} />
        </Route>

        <Route element={<CustomerLayout />}>
          <Route path="/customer" element={<CustomerDashboardScreen />} />
          <Route path="/customer/:id" element={<CustomerDashboardScreen />} />
          <Route path="/customer/:id/shaft" element={<ShaftReadinessScreen />} />
        </Route>

        <Route element={<TechnicianLayout />}>
          <Route path="/technician" element={<TechnicianTodayScreen />} />
          <Route path="/technician/earnings" element={<TechEarningsScreen />} />
        </Route>

        <Route element={<QcLayout />}>
          <Route path="/qc" element={<QcQueueScreen />} />
          <Route path="/qc/:leadId/:type" element={<QcChecklistScreen />} />
        </Route>

        <Route element={<SupplierLayout />}>
          <Route path="/supplier" element={<SupplierOrderBoardScreen />} />
          <Route path="/supplier/:leadId" element={<KitPackingScreen />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminScreen />} />
        </Route>

        <Route element={<OwnerLayout />}>
          <Route path="/owner" element={<OwnerScreen />} />
        </Route>

        <Route element={<CandidateLayout />}>
          <Route path="/join" element={<CandidateScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
