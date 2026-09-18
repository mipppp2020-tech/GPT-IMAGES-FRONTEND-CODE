import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { RideMapScreen } from './screens/RideMapScreen'
import { CaptureScreen } from './screens/CaptureScreen'
import { MyLeadsScreen } from './screens/MyLeadsScreen'
import { LeadDetailScreen } from './screens/LeadDetailScreen'
import { EarningsScreen } from './screens/EarningsScreen'
import { MoreScreen } from './screens/MoreScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<RideMapScreen />} />
          <Route path="/capture" element={<CaptureScreen />} />
          <Route path="/leads" element={<MyLeadsScreen />} />
          <Route path="/leads/:id" element={<LeadDetailScreen />} />
          <Route path="/earnings" element={<EarningsScreen />} />
          <Route path="/more" element={<MoreScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
