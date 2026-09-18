/** Screen id -> route + the canonical reference PNG it is compared against. */
export const SCREENS = [
  // Lead flow
  { id: 'S-R-01-home',       path: '/',        ref: 'a_tall_smartphone_ui_screenshot_in_marathi_of_a_ma.png' },
  { id: 'S-R-02-leads',      path: '/leads',   ref: 'a_vertical_smartphone_screenshot_of_a_marathi_app.png' },
  { id: 'S-R-03-capture',    path: '/capture', ref: 'a_tall_smartphone_ui_screenshot_mobile_app_with.png' },
  { id: 'S-R-04-sitephotos', path: '/photos',  ref: 'a_smartphone_app_screenshot_ui_portrait_mobile_sc.png' },
  { id: 'S-R-05-payout',     path: '/payout',  ref: 'a_vertical_smartphone_app_ui_screenshot_clean_mob.png' },
  { id: 'S-R-06-success',    path: '/success', ref: 'a_clean_mobile_app_success_confirmation_screen_sm.png' },
  { id: 'S-R-07-leaddetail', path: '/leads/l1',ref: 'a_clean_mobile_app_ui_screenshot_portrait_fixed.png' },
  // Record / compliance flow
  { id: 'S-R-08-records',    path: '/records',                 ref: 'a_vertical_smartphone_screenshot_of_a_marathi_mobi.png' },
  { id: 'S-R-09-recdetail',  path: '/records/r1',              ref: 'a_tall_portrait_mobile_app_ui_screenshot_with_mara.png' },
  { id: 'S-R-10-progress',   path: '/records/r1/progress',     ref: 'a_vertical_smartphone_app_screenshot_ui_mockup_i.png' },
  { id: 'S-R-11-documents',  path: '/records/r1/documents',    ref: 'a_clean_smartphone_ui_screenshot_mobile_app_in_m.png' },
  { id: 'S-R-12-fees',       path: '/records/r1/fees',         ref: 'a_clean_smartphone_app_ui_screenshot_portrait_ori.png' },
  { id: 'S-R-13-feepaid',    path: '/records/r1/fees/paid',    ref: 'a_mobile_app_screenshot_ui_screen_portrait_smar.png' },
  // Account
  { id: 'S-R-14-notifications', path: '/notifications', ref: 'a_tall_mobile_app_ui_screenshot_clean_flat_design.png' },
  { id: 'S-R-15-profile',       path: '/profile',       ref: 'a_smartphone_app_ui_screenshot_vertical_mobile_sc.png' },
  { id: 'S-R-16-feedback',      path: '/feedback',      ref: 'a_tall_vertical_smartphone_app_screenshot_mobile.png' },
  // Built from the documents, not from a mockup — there is no reference image
  // for any screen where the real money moves. Still fully QA-gated.
  { id: 'S-P-01-pipeline',      path: '/pipeline',      ref: null },
];

export const VIEWPORT = { width: 430, height: 932 };
