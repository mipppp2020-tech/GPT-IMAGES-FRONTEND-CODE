import { createHashRouter } from 'react-router-dom';
import { RiderHome } from '@/screens/RiderHome';
import { RiderLeads } from '@/screens/RiderLeads';
import { RiderCapture } from '@/screens/RiderCapture';
import { RiderSitePhotos } from '@/screens/RiderSitePhotos';
import { RiderPayout } from '@/screens/RiderPayout';
import { RiderSuccess } from '@/screens/RiderSuccess';
import { RiderLeadDetail } from '@/screens/RiderLeadDetail';
import { RiderRecords } from '@/screens/RiderRecords';
import { RiderRecordDetail } from '@/screens/RiderRecordDetail';
import { RiderProgress } from '@/screens/RiderProgress';
import { RiderDocuments } from '@/screens/RiderDocuments';
import { RiderFees } from '@/screens/RiderFees';
import { RiderFeePaid } from '@/screens/RiderFeePaid';
import { RiderNotifications } from '@/screens/RiderNotifications';
import { RiderProfile } from '@/screens/RiderProfile';
import { RiderFeedback } from '@/screens/RiderFeedback';
import { MoneyPipeline } from '@/screens/MoneyPipeline';
import { RiderEarnings } from '@/screens/RiderEarnings';
import { NotFound } from '@/screens/NotFound';

/**
 * Hash routing, deliberately.
 *
 * This app is deployed as static files. With history routing a deep link like
 * /leads asks the host for a file that does not exist, which 404s on GitHub
 * Pages and most object stores unless you add rewrite rules per host. The
 * hash never reaches the server, so the same build works everywhere and a
 * link shared to a phone opens the screen it names.
 */
export const router = createHashRouter([
  /* Lead flow */
  { path: '/', element: <RiderHome />, errorElement: <NotFound /> },
  { path: '/leads', element: <RiderLeads /> },
  { path: '/leads/:id', element: <RiderLeadDetail /> },
  { path: '/capture', element: <RiderCapture /> },
  { path: '/photos', element: <RiderSitePhotos /> },
  { path: '/payout', element: <RiderPayout /> },
  { path: '/success', element: <RiderSuccess /> },

  /* Record / compliance flow */
  { path: '/records', element: <RiderRecords /> },
  { path: '/records/:id', element: <RiderRecordDetail /> },
  { path: '/records/:id/progress', element: <RiderProgress /> },
  { path: '/records/:id/documents', element: <RiderDocuments /> },
  { path: '/records/:id/fees', element: <RiderFees /> },
  { path: '/records/:id/fees/paid', element: <RiderFeePaid /> },

  /* The money pipeline — the end-to-end workflow, engine-driven */
  { path: '/pipeline', element: <MoneyPipeline /> },

  /* Account */
  { path: '/notifications', element: <RiderNotifications /> },
  { path: '/profile', element: <RiderProfile /> },
  { path: '/feedback', element: <RiderFeedback /> },
  { path: '/earnings', element: <RiderEarnings /> },

  /*
   * Any other hash. A shared link that loses a character must not drop a
   * rider onto the router's English stack trace.
   */
  { path: '*', element: <NotFound /> },
]);
