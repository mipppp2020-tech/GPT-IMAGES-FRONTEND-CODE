import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { RideMapScreen } from './screens/RideMapScreen'
import { CaptureScreen } from './screens/CaptureScreen'
import { MyLeadsScreen } from './screens/MyLeadsScreen'
import { LeadDetailScreen } from './screens/LeadDetailScreen'
import { EarningsScreen } from './screens/EarningsScreen'
import { MoreScreen } from './screens/MoreScreen'
import { RoleSwitcherScreen } from './screens/RoleSwitcherScreen'
import { RoleStubScreen } from './screens/RoleStubScreen'
import { SalesLayout } from './layout/SalesLayout'
import { SalesPipelineScreen } from './screens/sales/SalesPipelineScreen'
import { SalesDealScreen } from './screens/sales/SalesDealScreen'

function App() {
  return (
    <BrowserRouter>
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

        {/* Stubs — each replaced by its own phase's real screens, one at a time */}
        <Route path="/customer" element={<RoleStubScreen role="customer" />} />
        <Route path="/technician" element={<RoleStubScreen role="technician" />} />
        <Route path="/qc" element={<RoleStubScreen role="qc" />} />
        <Route path="/supplier" element={<RoleStubScreen role="supplier" />} />
        <Route path="/admin" element={<RoleStubScreen role="admin" />} />
        <Route path="/owner" element={<RoleStubScreen role="owner" />} />
        <Route path="/join" element={<RoleStubScreen role="join" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
