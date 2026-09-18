import { createBrowserRouter } from 'react-router-dom';
import { RiderHome } from '@/screens/RiderHome';
import { RiderLeads } from '@/screens/RiderLeads';
import { RiderCapture } from '@/screens/RiderCapture';
import { RiderSitePhotos } from '@/screens/RiderSitePhotos';
import { RiderPayout } from '@/screens/RiderPayout';
import { RiderSuccess } from '@/screens/RiderSuccess';
import { RiderLeadDetail } from '@/screens/RiderLeadDetail';
import { Placeholder } from '@/screens/Placeholder';

/** Screen IDs map 1:1 to routes so the capture harness can address them. */
export const SCREEN_ROUTES = [
  { id: 'S-R-01-home', path: '/' },
  { id: 'S-R-02-leads', path: '/leads' },
  { id: 'S-R-03-capture', path: '/capture' },
  { id: 'S-R-04-sitephotos', path: '/photos' },
  { id: 'S-R-05-payout', path: '/payout' },
  { id: 'S-R-06-success', path: '/success' },
  { id: 'S-R-07-leaddetail', path: '/leads/l1' },
] as const;

export const router = createBrowserRouter([
  { path: '/', element: <RiderHome /> },
  { path: '/leads', element: <RiderLeads /> },
  { path: '/leads/:id', element: <RiderLeadDetail /> },
  { path: '/capture', element: <RiderCapture /> },
  { path: '/photos', element: <RiderSitePhotos /> },
  { path: '/payout', element: <RiderPayout /> },
  { path: '/success', element: <RiderSuccess /> },
  { path: '/earnings', element: <Placeholder titleKey="tab.earnings" /> },
  { path: '/profile', element: <Placeholder titleKey="tab.profile" /> },
  { path: '/notifications', element: <Placeholder titleKey="chrome.notifications" /> },
]);
