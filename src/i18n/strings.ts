/**
 * AIEC i18n
 *
 * Marathi is the PRIMARY product language, not a translation target. Every
 * string here marked [REF] is transcribed verbatim from a canonical reference
 * image; per source requirement §7 these are geometry and must not be
 * reworded, shortened, or "improved" to make a layout fit.
 *
 * English exists to exercise the opposite expansion direction during layout
 * QA. Devanagari runs taller (matras above and below the baseline) and often
 * wider; if a container survives both, it survives the field.
 */

import { mrRecords, enRecords } from './strings.records';

export type Lang = 'mr' | 'en';

const mrCore = {
  /* ---------------------------------------------------------- app chrome */
  'brand.name': 'AIEC',
  'brand.tagline': 'उंच इमारती, सुरक्षित भविष्य',        // [REF]
  'chrome.city': 'पुणे',                                  // [REF]
  'chrome.greeting': 'नमस्कार',                           // [REF]
  'chrome.riderName': 'संदीप पाटील',                      // [REF]
  'chrome.riderLevel': 'रायडर · लेव्हल 1',                // [REF]
  'chrome.notifications': 'सूचना',
  'chrome.back': 'मागे',                                  // [REF]
  'chrome.help': 'मदत',                                   // [REF]
  'chrome.search': 'शोधा',
  'chrome.language': 'भाषा',

  /* ------------------------------------------------------------- tab bar */
  'tab.home': 'मुख्य स्क्रीन',                            // [REF]
  'tab.leads': 'माझे लीड्स',                              // [REF]
  'tab.earnings': 'कमाई',                                 // [REF]
  'tab.profile': 'माझे प्रोफाइल',                         // [REF]

  /* ----------------------------------------------------------- lifecycle */
  'lifecycle.new': 'नवीन लीड',                            // [REF] legend
  'lifecycle.selling': 'विक्री प्रक्रियेत',                // [REF]
  'lifecycle.won': 'जिंकले (शाफ्ट प्रतीक्षेत)',            // [REF]
  'lifecycle.material': 'मटेरियल मार्गावर',                // [REF]
  'lifecycle.installing': 'इंस्टॉलेशन सुरू',               // [REF]
  'lifecycle.done': 'पुर्ण झाले',                          // [REF]
  'lifecycle.blocked': 'अडचणीत',                          // [REF]
  'lifecycle.closed': 'रद्द / बंद',                       // [REF]

  /* ------------------------------------------------------- home (S-R-01) */
  'home.title': 'आजचा दिवस, नवी संधी!',                   // [REF]
  'home.subtitle': 'अधिक शाफ्ट, अधिक कुटुंबांचे सुरक्षित भविष्य.', // [REF]
  'home.earningsToday': 'आजचे कमाई',                      // [REF]
  'home.statAppointments': 'आजची नेमणूक',                 // [REF]
  'home.statNearby': 'आजचे लीड्स (परिसरात)',              // [REF]
  'home.statWeek': 'या आठवड्याची कमाई',                   // [REF]
  'home.searchPlaceholder': 'येथे शोधा (भाग, सोसायटी, पत्ता)', // [REF]
  'home.filter': 'फ़िल्टर',                                // [REF]
  'home.nearbyTitle': 'जवळील संधी',                       // [REF]
  'home.seeAll': 'सर्व पहा',                              // [REF]
  'home.captureLead': 'लीड कॅप्चर करा',                   // [REF]
  'home.viewDetails': 'तपशील पहा',                        // [REF]
  'home.showRoute': 'मार्ग दाखवा',                        // [REF]
  'home.myLocation': 'माझे स्थान',                        // [REF]
  'home.safetyTitle': 'सुरक्षित राइडिंग, सुरक्षित भविष्य.', // [REF]
  'home.safetyBody': 'हेल्मेट वापरा · नियमांचे पालन करा · आपले आणि इतरांचे जीवन मौल्यवान आहे.', // [REF]

  /* ------------------------------------------------- my leads (S-R-02) */
  'leads.title': 'माझे लीड्स',                            // [REF]
  'leads.subtitle': 'तुम्ही शोधलेले प्रत्येक लीड, मोठ्या संधीकडे एक पाऊल.', // [REF]
  'leads.newCapture': 'नवा लीड कॅप्चर करा',               // [REF]
  'leads.statTotal': 'एकूण',                              // [REF]
  'leads.statNew': 'नवीन',                                // [REF]
  'leads.statFollowUp': 'फॉलो-अप',                        // [REF]
  'leads.statWon': 'जिंकले',                              // [REF]
  'leads.searchPlaceholder': 'लीड शोधा (इमारत, परिसर, नाव)', // [REF]
  'leads.sortNewest': 'नवीन प्रथम',                       // [REF]
  'leads.call': 'कॉल करा',                                // [REF]
  'leads.viewStatus': 'स्थिती पहा',                       // [REF]
  'leads.viewProgress': 'प्रगती पहा',                     // [REF]
  'leads.earnPotential': 'संभाव्य कमाई',                  // [REF]
  'leads.earned': 'मिळाले',                               // [REF]
  'leads.tip': 'टीप: अधिक कमाईसाठी लीडवर वेळेत फॉलो-अप करा.', // [REF]
  'leads.tipBody': 'लवकर उत्तर द्यायल्याने तुमच्या लीडचे मूल्य वाढते.', // [REF]
  'leads.empty': 'अद्याप एकही लीड नाही',
  'leads.emptyBody': 'जवळच्या बांधकाम साइटचा फोटो घ्या आणि पहिले लीड सबमिट करा.',

  /* -------------------------------------------- capture step 1 (S-R-03) */
  'capture.title': 'नवीन लीड कॅप्चर करा',                 // [REF]
  'capture.subtitle': 'फोटो घ्या, आम्ही बाकी माहिती आपोआप भरू.', // [REF]
  'capture.perLead': 'प्रत्येक वैध लीड',                  // [REF]
  'capture.perLeadHint': 'स्पष्ट फोटो = पूर्ण कमाई',      // [REF]
  'capture.step1': 'फोटो घ्या',                           // [REF]
  'capture.step2': 'तपासणी (आपोआप)',                      // [REF]
  'capture.step3': 'तपशील पुष्टी करा',                    // [REF]
  'capture.step4': 'सबमिट करा',                           // [REF]
  'capture.locationOn': 'लोकेशन चालू आहे',                // [REF]
  'capture.accuracy': 'अचूकता: 8 मीटर',                   // [REF]
  'capture.flashOff': 'फ्लॅश बंद',                        // [REF]
  'capture.frameTitle': 'इमारत फ्रेममध्ये आणा',           // [REF]
  'capture.frameBody': 'संपूर्ण इमारत स्पष्ट दिसली पाहिजे', // [REF]
  'capture.galleryOff': 'गॅलरी उपलब्ध नाही',              // [REF]
  'capture.galleryHint': 'फक्त कॅमेरा वापरा',             // [REF]
  'capture.switchCamera': 'कॅमेरा बदला',                  // [REF]
  'capture.switchHint': 'समोर / मागील',                   // [REF]
  'capture.shutter': 'फोटो घ्या',
  'capture.tipsTitle': 'चांगल्या फोटोसाठी टिप्स',          // [REF]
  'capture.tip1': 'संपूर्ण इमारत दिसली पाहिजे',           // [REF]
  'capture.tip2': 'परिसर (रस्ता, बोर्ड) दिसू द्या',       // [REF]
  'capture.tip3': 'पुरेशी उजेडात फोटो घ्या',              // [REF]

  /* -------------------------------------------- capture step 3 (S-R-04) */
  'photos.title': 'साइटचे फोटो अपलोड करा',                // [REF]
  'photos.subtitle': 'साइटची सद्यस्थिती दाखवणारे किमान 5 फोटो अपलोड करा.', // [REF]
  'photos.qualityTitle': 'चांगले फोटो कसे घ्यावेत?',       // [REF]
  'photos.q1': 'स्पष्ट आणि प्रकाशात',                     // [REF]
  'photos.q2': 'संपूर्ण बांधकाम भाग दिसेल असे',           // [REF]
  'photos.q3': 'विविध कोनातून',                           // [REF]
  'photos.q4': 'प्रत्येक फोटोला योग्य कॅप्शन द्या',        // [REF]
  'photos.front': 'समोरील बाजू',                          // [REF]
  'photos.left': 'डावी बाजू',                             // [REF]
  'photos.rear': 'मागील बाजू',                            // [REF]
  'photos.inside': 'आतील भाग',                            // [REF]
  'photos.roof': 'छताचा भाग',                             // [REF]
  'photos.addMore': 'आणखी फोटो जोडा',                     // [REF]
  'photos.addMoreHint': '(कमाल 10 फोटो)',                 // [REF]
  'photos.notesLabel': 'अतिरिक्त नोंदी (पर्यायी)',         // [REF]
  'photos.notesPlaceholder': 'या साइटबाबत काही अतिरिक्त माहिती असल्यास लिहा...', // [REF]
  'photos.back': 'मागे',                                  // [REF]
  'photos.next': 'पुढील करा',                             // [REF]

  /* ------------------------------------------------- payout (S-R-05) */
  'payout.title': 'साईट पाहणी पूर्ण झाली!',               // [REF]
  'payout.subtitle': 'सर्व आवश्यक माहिती तपासली गेली आहे.', // [REF]
  'payout.sectionTitle': 'पेमेंट तपशील',                  // [REF]
  'payout.earnLabel': 'या लीडसाठी मिळणारे कमाई',          // [REF]
  'payout.gross': 'मूळ रक्कम',                            // [REF]
  'payout.tds': 'TDS (5%)',                               // [REF]
  'payout.net': 'तुमच्या खात्यात जमा होणारी रक्कम',        // [REF]
  'payout.methodTitle': 'पेमेंट पद्धत',                    // [REF]
  'payout.upi': 'UPI (शिफारसील)',                         // [REF]
  'payout.upiHint': 'तुमच्या UPI वर थेट रक्कम जमा होईल.',  // [REF]
  'payout.linked': 'जोडलेले',                             // [REF]
  'payout.change': 'बदला',                                // [REF]
  'payout.bank': 'बँक खाते',                              // [REF]
  'payout.bankHint': 'नोंदणीकृत बँक खात्यात जमा होईल.',    // [REF]
  'payout.wallet': 'वॉलेट (AIEC वॉलेट)',                  // [REF]
  'payout.walletHint': 'तुमच्या AIEC वॉलेटमध्ये जमा होईल.', // [REF]
  'payout.slaNote': 'पेमेंट 24 तासांत प्रक्रिया केले जाईल.', // [REF]
  'payout.slaHelp': 'कोणतीही अडचण आल्यास आमच्या सहाय्य टीमशी संपर्क करा.', // [REF]
  'payout.submit': 'सबमिट करा',                           // [REF]

  /* ------------------------------------------------ success (S-R-06) */
  'success.title': 'लीड यशस्वीरित्या सबमिट केली!',         // [REF]
  'success.subtitle': 'तुमची माहिती सुरक्षितपणे नोंदवली गेली आहे.', // [REF]
  'success.praiseTitle': 'छान काम!',                      // [REF]
  'success.praiseBody': 'तुम्ही AIEC च्या सुरक्षित घरांच्या मोहिमेत एक पाऊल पुढे टाकले आहे.', // [REF]
  'success.detailTitle': 'लीड तपशील',                     // [REF]
  'success.refLabel': 'लीड क्रमांक',                      // [REF]
  'success.submittedAt': 'सबमिट तारीख',                   // [REF]
  'success.amount': 'पेमेंट रक्कम',                        // [REF]
  'success.method': 'पेमेंट पद्धत',                        // [REF]
  'success.state': 'स्थिती',                              // [REF]
  'success.stateValue': 'यशस्वी',                         // [REF]
  'success.nextLabel': 'पुढील पायरी',                     // [REF]
  'success.nextValue': 'AIEC टीमकडून पडताळणी',            // [REF]
  'success.teamTitle': 'आमची टीम आता ही माहिती तपासेल.',   // [REF]
  'success.teamBody': 'तपासणी पूर्ण झाल्यावर तुम्हाला ॲपमध्ये सूचित केले जाईल.', // [REF]
  'success.moreTitle': 'अधिक लीड सबमिट करा',              // [REF]
  'success.moreBody': 'जास्त लीड = जास्त कमाई',            // [REF]
  'success.goHome': 'मुख्य स्क्रीनवर जा',                  // [REF]
  'success.addNew': 'नवीन लीड जोडा',                      // [REF]

  /* -------------------------------------------- lead detail (S-R-07) */
  'detail.back': 'मागे',                                  // [REF]
  'detail.share': 'शेअर',                                 // [REF]
  'detail.photosCount': 'फोटो पहा',                       // [REF]
  'detail.distanceAway': 'मीटर अंतरावर',                  // [REF]
  'detail.leadDate': 'लीड तारीख',                         // [REF]
  'detail.buildingType': 'इमारत प्रकार',                   // [REF]
  'detail.residential': 'रहिवासी',                        // [REF]
  'detail.floors': 'मजले',                                // [REF]
  'detail.liftNeed': 'लिफ्ट गरज',                         // [REF]
  'detail.passenger': '1 (प्रवासी)',                      // [REF]
  'detail.journeyTitle': 'स्थिती आणि पुढील टप्पे',         // [REF]
  'detail.journeyAll': 'संपूर्ण प्रवास पहा',               // [REF]
  'detail.aiTitle': 'AI सूचना',                           // [REF]
  'detail.aiBody': 'ही लीड सक्षम दिसते. परिसरात 3 समान प्रकल्प आहेत. 2 दिवसात फॉलो-अप करा.', // [REF]
  'detail.followUp': 'फॉलो-अप करा',                       // [REF]
  'detail.contactTitle': 'ग्राहक संपर्क',                  // [REF]
  'detail.siteRep': 'साईट प्रतिनिधी',                     // [REF]
  'detail.callAction': 'कॉल',                             // [REF]
  'detail.messageAction': 'मेसेज',                        // [REF]
  'detail.moreAction': 'अधिक',                            // [REF]
  'detail.importantTitle': 'महत्त्वाची माहिती',            // [REF]
  'detail.importantBody': 'नवीन प्रोजेक्ट, आर्किटेक्टशी चर्चा केली. 8-10 व्यक्तींची लिफ्ट शक्यता, बजेट चर्चा प्रलंबित.', // [REF]
  'detail.mapTitle': 'नकाशामध्ये स्थान',                   // [REF]
  'detail.showDirection': 'दिशा दाखवा',                   // [REF]
  'detail.earnFromLead': 'या लीडवये संभाव्य कमाई',         // [REF]
  'detail.nextAction': 'पुढील कृती करा',                  // [REF]

  /* ------------------------------------------------ status grammar UI */
  'status.reason': 'कारण',
  'status.custody': 'सध्या कोणाकडे',
  'status.clock': 'वेळ',
  'status.consequence': 'पुढे काय',
  'custody.rider': 'तुमच्याकडे',
  'custody.aiec': 'AIEC टीमकडे',
  'custody.customer': 'ग्राहकाकडे',
  'custody.vendor': 'व्हेंडरकडे',
  'custody.system': 'सिस्टमकडे',

  /* --------------------------------------------------------- gates §12 */
  'gate.locked': 'सध्या बंद',
  'gate.why': 'का बंद आहे',
  'gate.who': 'कोण उघडू शकते',
  'gate.need': 'काय आवश्यक आहे',
  'gate.next': 'नंतर काय होईल',
  'gate.evidenceProgress': '{total} पैकी {done} पूर्ण',

  /* ------------------------------------------------------- offline §13 */
  'offline.title': 'ऑफलाइन — तुमचे काम सुरक्षित आहे',
  'offline.body': 'नेटवर्क परत आल्यावर हे आपोआप पाठवले जाईल. ॲप बंद केले तरी माहिती जतन राहील.',
  'offline.queued': 'रांगेत {count}',
  'offline.syncing': 'पाठवत आहे...',
  'offline.storedLocally': 'फोनमध्ये जतन केले',

  /* ------------------------------------------------------------ common */
  'common.rupee': '₹',
  'common.metre': 'मीटर',
  'common.km': 'किमी',
  'common.away': 'दूर',
  'common.required': 'आवश्यक',
  'common.optional': 'पर्यायी',
  'common.of': '/',
} as const;

/** The full Marathi dictionary: core rider surfaces plus the record flow. */
export const mr = { ...mrCore, ...mrRecords } as const;

export type StringKey = keyof typeof mr;

/** English is the expansion-test locale, not the primary. */
const enCore: Record<keyof typeof mrCore, string> = {
  'brand.name': 'AIEC',
  'brand.tagline': 'Tall buildings, safe futures',
  'chrome.city': 'Pune',
  'chrome.greeting': 'Hello',
  'chrome.riderName': 'Sandeep Patil',
  'chrome.riderLevel': 'Rider · Level 1',
  'chrome.notifications': 'Notifications',
  'chrome.back': 'Back',
  'chrome.help': 'Help',
  'chrome.search': 'Search',
  'chrome.language': 'Language',
  'tab.home': 'Home',
  'tab.leads': 'My leads',
  'tab.earnings': 'Earnings',
  'tab.profile': 'Profile',
  'lifecycle.new': 'New lead',
  'lifecycle.selling': 'In sales process',
  'lifecycle.won': 'Won (awaiting shaft)',
  'lifecycle.material': 'Material en route',
  'lifecycle.installing': 'Installation started',
  'lifecycle.done': 'Completed',
  'lifecycle.blocked': 'Blocked',
  'lifecycle.closed': 'Cancelled / closed',
  'home.title': 'A new day, a new opportunity!',
  'home.subtitle': 'More shafts, more families with a safer future.',
  'home.earningsToday': "Today's earnings",
  'home.statAppointments': "Today's appointments",
  'home.statNearby': "Today's leads (nearby)",
  'home.statWeek': "This week's earnings",
  'home.searchPlaceholder': 'Search here (area, society, address)',
  'home.filter': 'Filter',
  'home.nearbyTitle': 'Nearby opportunities',
  'home.seeAll': 'See all',
  'home.captureLead': 'Capture lead',
  'home.viewDetails': 'View details',
  'home.showRoute': 'Show route',
  'home.myLocation': 'My location',
  'home.safetyTitle': 'Safe riding, safe future.',
  'home.safetyBody': 'Wear a helmet · Follow the rules · Your life and others are precious.',
  'leads.title': 'My leads',
  'leads.subtitle': 'Every lead you find is a step toward a bigger opportunity.',
  'leads.newCapture': 'Capture new lead',
  'leads.statTotal': 'Total',
  'leads.statNew': 'New',
  'leads.statFollowUp': 'Follow-up',
  'leads.statWon': 'Won',
  'leads.searchPlaceholder': 'Search leads (building, area, name)',
  'leads.sortNewest': 'Newest first',
  'leads.call': 'Call',
  'leads.viewStatus': 'View status',
  'leads.viewProgress': 'View progress',
  'leads.earnPotential': 'Potential earning',
  'leads.earned': 'Earned',
  'leads.tip': 'Tip: follow up on time to earn more.',
  'leads.tipBody': 'Replying early increases the value of your lead.',
  'leads.empty': 'No leads yet',
  'leads.emptyBody': 'Photograph a nearby construction site and submit your first lead.',
  'capture.title': 'Capture a new lead',
  'capture.subtitle': "Take a photo, we'll fill in the rest automatically.",
  'capture.perLead': 'Per valid lead',
  'capture.perLeadHint': 'Clear photo = full earning',
  'capture.step1': 'Take photo',
  'capture.step2': 'Check (automatic)',
  'capture.step3': 'Confirm details',
  'capture.step4': 'Submit',
  'capture.locationOn': 'Location is on',
  'capture.accuracy': 'Accuracy: 8 metres',
  'capture.flashOff': 'Flash off',
  'capture.frameTitle': 'Bring the building into frame',
  'capture.frameBody': 'The whole building must be clearly visible',
  'capture.galleryOff': 'Gallery unavailable',
  'capture.galleryHint': 'Camera only',
  'capture.switchCamera': 'Switch camera',
  'capture.switchHint': 'Front / rear',
  'capture.shutter': 'Take photo',
  'capture.tipsTitle': 'Tips for a good photo',
  'capture.tip1': 'The whole building must be visible',
  'capture.tip2': 'Let the surroundings (road, board) show',
  'capture.tip3': 'Shoot in enough light',
  'photos.title': 'Upload site photos',
  'photos.subtitle': 'Upload at least 5 photos showing the current state of the site.',
  'photos.qualityTitle': 'How to take good photos?',
  'photos.q1': 'Clear and well lit',
  'photos.q2': 'Showing the full construction',
  'photos.q3': 'From different angles',
  'photos.q4': 'Caption each photo correctly',
  'photos.front': 'Front side',
  'photos.left': 'Left side',
  'photos.rear': 'Rear side',
  'photos.inside': 'Interior',
  'photos.roof': 'Roof area',
  'photos.addMore': 'Add more photos',
  'photos.addMoreHint': '(max 10 photos)',
  'photos.notesLabel': 'Additional notes (optional)',
  'photos.notesPlaceholder': 'Write any extra information about this site...',
  'photos.back': 'Back',
  'photos.next': 'Continue',
  'payout.title': 'Site visit complete!',
  'payout.subtitle': 'All required information has been verified.',
  'payout.sectionTitle': 'Payment details',
  'payout.earnLabel': 'Your earning for this lead',
  'payout.gross': 'Gross amount',
  'payout.tds': 'TDS (5%)',
  'payout.net': 'Amount credited to your account',
  'payout.methodTitle': 'Payment method',
  'payout.upi': 'UPI (recommended)',
  'payout.upiHint': 'Credited straight to your UPI.',
  'payout.linked': 'Linked',
  'payout.change': 'Change',
  'payout.bank': 'Bank account',
  'payout.bankHint': 'Credited to your registered bank account.',
  'payout.wallet': 'Wallet (AIEC wallet)',
  'payout.walletHint': 'Credited to your AIEC wallet.',
  'payout.slaNote': 'Payment will be processed within 24 hours.',
  'payout.slaHelp': 'Contact our support team if you hit any problem.',
  'payout.submit': 'Submit',
  'success.title': 'Lead submitted successfully!',
  'success.subtitle': 'Your information has been recorded securely.',
  'success.praiseTitle': 'Good work!',
  'success.praiseBody': "You've taken a step forward in AIEC's safe-homes mission.",
  'success.detailTitle': 'Lead details',
  'success.refLabel': 'Lead number',
  'success.submittedAt': 'Submitted on',
  'success.amount': 'Payment amount',
  'success.method': 'Payment method',
  'success.state': 'Status',
  'success.stateValue': 'Successful',
  'success.nextLabel': 'Next step',
  'success.nextValue': 'Verification by the AIEC team',
  'success.teamTitle': 'Our team will now check this information.',
  'success.teamBody': "You'll be notified in the app once the check is done.",
  'success.moreTitle': 'Submit more leads',
  'success.moreBody': 'More leads = more earnings',
  'success.goHome': 'Go to home screen',
  'success.addNew': 'Add new lead',
  'detail.back': 'Back',
  'detail.share': 'Share',
  'detail.photosCount': 'View photos',
  'detail.distanceAway': 'metres away',
  'detail.leadDate': 'Lead date',
  'detail.buildingType': 'Building type',
  'detail.residential': 'Residential',
  'detail.floors': 'Floors',
  'detail.liftNeed': 'Lift requirement',
  'detail.passenger': '1 (passenger)',
  'detail.journeyTitle': 'Status and next stages',
  'detail.journeyAll': 'See full journey',
  'detail.aiTitle': 'AI suggestion',
  'detail.aiBody': 'This lead looks strong. There are 3 similar projects nearby. Follow up within 2 days.',
  'detail.followUp': 'Follow up',
  'detail.contactTitle': 'Customer contact',
  'detail.siteRep': 'Site representative',
  'detail.callAction': 'Call',
  'detail.messageAction': 'Message',
  'detail.moreAction': 'More',
  'detail.importantTitle': 'Important information',
  'detail.importantBody': 'New project, discussed with the architect. Likely 8-10 person lift, budget discussion pending.',
  'detail.mapTitle': 'Location on map',
  'detail.showDirection': 'Show directions',
  'detail.earnFromLead': 'Potential earning from this lead',
  'detail.nextAction': 'Take next action',
  'status.reason': 'Reason',
  'status.custody': 'Currently with',
  'status.clock': 'Time',
  'status.consequence': 'What happens next',
  'custody.rider': 'With you',
  'custody.aiec': 'With the AIEC team',
  'custody.customer': 'With the customer',
  'custody.vendor': 'With the vendor',
  'custody.system': 'With the system',
  'gate.locked': 'Locked',
  'gate.why': 'Why it is locked',
  'gate.who': 'Who can unlock it',
  'gate.need': 'What is required',
  'gate.next': 'What happens next',
  'gate.evidenceProgress': '{done} of {total} done',
  'offline.title': 'Offline — your work is safe',
  'offline.body': 'This will be sent automatically when the network returns. Your data is kept even if you close the app.',
  'offline.queued': '{count} queued',
  'offline.syncing': 'Sending...',
  'offline.storedLocally': 'Saved on your phone',
  'common.rupee': '₹',
  'common.metre': 'm',
  'common.km': 'km',
  'common.away': 'away',
  'common.required': 'Required',
  'common.optional': 'Optional',
  'common.of': '/',
};

export const en: Record<StringKey, string> = { ...enCore, ...enRecords };

export const DICTIONARIES: Record<Lang, Record<StringKey, string>> = {
  mr: mr as unknown as Record<StringKey, string>,
  en,
};
