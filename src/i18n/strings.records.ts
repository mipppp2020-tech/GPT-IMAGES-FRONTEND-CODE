/**
 * AIEC i18n — the record / compliance flow (screens S-R-08 … S-R-16).
 *
 * Same contract as the core strings: [REF] means transcribed verbatim from a
 * canonical reference image and therefore load-bearing geometry, not copy to
 * be reworded when a layout gets tight.
 */
export const mrRecords = {
  /* ------------------------------------------------ records list (S-R-08) */
  'records.title': 'माझी नोंदी',                                    // [REF]
  'records.subtitle': 'तुमच्या सर्व लीड्स आणि कामांची यादी',          // [REF]
  'records.filter': 'फिलटर',                                        // [REF]
  'records.tabAll': 'सर्व',                                         // [REF]
  'records.tabActive': 'सक्रिय',                                    // [REF]
  'records.tabDone': 'पुर्ण',                                       // [REF]
  'records.tabCancelled': 'रद्द',                                   // [REF]
  'records.viewDetails': 'तपशील पहा',                               // [REF]
  'records.totalTitle': 'एकूण {count} नोंदी',                        // [REF]
  'records.totalBody': 'तुमच्या सर्व लीड्सची सद्यस्थिती येथे पाहू शकता.', // [REF]
  'records.addNew': 'नवीन लीड जोडा',                                // [REF]
  'records.stDone': 'पुर्ण',                                        // [REF]
  'records.stActive': 'सक्रिय',                                     // [REF]
  'records.stReview': 'तपासणी',                                     // [REF]
  'records.stCancelled': 'रद्द',                                    // [REF]

  /* ----------------------------------------------- record detail (S-R-09) */
  'recdetail.share': 'शेअर करा',                                    // [REF]
  'recdetail.residential': 'रहिवासी इमारत',                          // [REF]
  'recdetail.mainPhoto': 'मुख्य फोटो',                               // [REF]
  'recdetail.tabInfo': 'सविस्तर माहिती',                             // [REF]
  'recdetail.tabProgress': 'प्रगती',                                 // [REF]
  'recdetail.tabPhotos': 'फोटो',                                     // [REF]
  'recdetail.tabDocs': 'दस्तऐवज',                                   // [REF]
  'recdetail.tabNotes': 'नोंदी',                                     // [REF]
  'recdetail.buildingName': 'इमारतीचे नाव',                          // [REF]
  'recdetail.approvedFloors': 'मंजूर मजले',                          // [REF]
  'recdetail.address': 'पत्ता',                                      // [REF]
  'recdetail.ownerName': 'मालकाचे नाव',                              // [REF]
  'recdetail.type': 'प्रकार',                                        // [REF]
  'recdetail.recordNo': 'नोंद क्रमांक',                              // [REF]
  'recdetail.recordDate': 'नोंद तारीख',                              // [REF]
  'recdetail.feePaid': 'भरलेले शुल्क',                               // [REF]
  'recdetail.successChip': 'यशस्वी',                                 // [REF]
  'recdetail.inspectedTitle': 'ही साईट तपासणी पुर्ण झाली आहे.',       // [REF]
  'recdetail.inspectedBody': 'सर्व आवश्यक माहिती यशस्वीरीत्या सबमिट करण्यात आली आहे.', // [REF]
  'recdetail.nextSteps': 'पुढील पायऱ्या',                            // [REF]
  'recdetail.step1': 'तपासणी पुर्ण',                                 // [REF]
  'recdetail.step2': 'अंतिम पुनरावलोकन',                             // [REF]
  'recdetail.step2Body': 'AIEC टीमकडून पडताळणी सुरू आहे.',           // [REF]
  'recdetail.step2Chip': 'प्रक्रियेत',                               // [REF]
  'recdetail.step3': 'प्रमाणपत्र',                                   // [REF]
  'recdetail.step3Body': 'पडताळणी झाल्यावर प्रमाणपत्र उपलब्ध होईल.',  // [REF]
  'recdetail.editRecord': 'नोंद संपादित करा',                        // [REF]
  'recdetail.downloadCert': 'प्रमाणपत्र डाउनलोड करा',                // [REF]

  /* ------------------------------------------ construction progress (S-R-10) */
  'progress.title': 'बांधकाम प्रगती',                                // [REF]
  'progress.subtitle': 'प्रत्येक टप्प्याची स्थिती आणि छायाचित्रे',     // [REF]
  'progress.allStages': 'सर्व टप्पे',                                // [REF]
  'progress.s1': '1. नकाशा व परवानग्या',                             // [REF]
  'progress.s2': '2. पाया काम',                                      // [REF]
  'progress.s3': '3. भुयारी मजला (तळमजला)',                          // [REF]
  'progress.s4': '4. संरचना काम (G + 4)',                            // [REF]
  'progress.s5': '5. अंतर्गत कामे',                                   // [REF]
  'progress.s6': '6. अंतिम तपासणी व हॅंडओव्हर',                       // [REF]
  'progress.doneOn': 'पूर्ण – {date}',                               // [REF]
  'progress.startedExpected': 'सुरु – अपेक्षित पूर्णता: {date}',      // [REF]
  'progress.expected': 'अपेक्षित – {date}',                          // [REF]
  'progress.chipDone': 'पूर्ण',                                      // [REF]
  'progress.chipRunning': 'सुरु आहे',                                // [REF]
  // [REF-OVERRIDDEN] The reference reads 'प्रलंबित' (pending). Design System
  // §7.2 bans that word product-wide and the UX Architecture is explicit:
  // "There is no screen in AIEC where 'Pending' is an acceptable string."
  // A source requirement outranks a reference image, so this says when.
  'progress.chipPending': 'सुरू व्हायचे',
  'progress.currentState': 'सध्याची स्थिती',                          // [REF]
  'progress.currentBody': 'तिसऱ्या मजल्याचे स्लॅब काम सुरु आहे.',      // [REF]
  'progress.percentDone': '{pct}% पूर्ण',                            // [REF]
  'progress.recentPhotos': 'अलीकडील छायाचित्रे ({date})',            // [REF]
  'progress.allPhotos': 'सर्व फोटो पहा',                             // [REF]
  'progress.capFront': 'समोरील बाजू',                                // [REF]
  'progress.capInside': 'आतील भाग',                                  // [REF]
  'progress.capSlab': 'तिसऱ्या मजल्याचा स्लॅब',                       // [REF]
  'progress.infoTitle': 'प्रगतीची माहिती नियमितपणे अपडेट केली जाईल.', // [REF]
  'progress.infoBody': 'तुम्हाला महत्त्वपूर्ण बदलांबद्दल सूचना मिळतील.', // [REF]
  'progress.addNote': 'नोंद जोडा',                                   // [REF]
  'progress.uploadPhoto': 'फोटो अपलोड करा',                          // [REF]

  /* ------------------------------------------------ documents (S-R-11) */
  'docs.title': 'दस्तऐवज अपलोड करा',                                // [REF]
  'docs.instruction': 'कृपया खालील सर्व आवश्यक दस्तऐवज स्पष्ट आणि वाचनीय स्वरूपात अपलोड करा.', // [REF]
  'docs.d1': '1. बांधकाम परवानगी',                                   // [REF]
  'docs.d1s': 'सहानगरपालिकेची मंजुरी प्रत',                          // [REF]
  'docs.d2': '2. जमिनीचा 7/12 उतारा',                                // [REF]
  'docs.d2s': 'जमिनीची मालकी व क्षेत्रफळ',                           // [REF]
  'docs.d3': '3. मंजूर नकाशा',                                       // [REF]
  'docs.d3s': 'महापालिकेने मंजूर केलेला नकाशा',                       // [REF]
  'docs.d4': '4. संरचना स्थिरता प्रमाणपत्र',                          // [REF]
  'docs.d4s': 'मान्यताप्राप्त अभियंता यांचे प्रमाणपत्र',              // [REF]
  'docs.d5': '5. कामगार सुरक्षा योजना',                              // [REF]
  'docs.d5s': 'सुरक्षा उपायांची कार्ययोजना',                          // [REF]
  'docs.d6': '6. विमा पॉलिसी',                                       // [REF]
  'docs.d6s': 'कामगार विमा व तृतीय पक्ष विमा',                       // [REF]
  'docs.uploaded': 'अपलोड केले',                                     // [REF]
  'docs.uploading': 'अपलोड होत आहे... ({pct}%)',                     // [REF]
  'docs.notUploaded': 'अद्याप अपलोड केलेले नाही',                    // [REF]
  'docs.view': 'पहा',                                                // [REF]
  'docs.viewWhenDone': 'पाठवल्यावर दिसेल',
  'docs.replace': 'बदल करा',                                         // [REF]
  'docs.cancelUpload': 'रद करा',                                     // [REF]
  'docs.choose': 'फाईल निवडा',                                       // [REF]
  'docs.formatTitle': 'दस्तऐवज फक्त PDF, JPG किंवा PNG स्वरूपात अपलोड करा.', // [REF]
  'docs.formatBody': 'प्रत्येक फाईलचा आकार जास्तीत जास्त 5 MB असावा.', // [REF]
  'docs.next': 'पुढे',                                               // [REF]

  /* --------------------------------------------------- fee pay (S-R-12) */
  'fee.title': 'पेमेंट करा',                                         // [REF]
  'fee.subtitle': 'तुमचे स्वप्नातील घर आता अजून जवळ',                // [REF]
  'fee.flatNo': 'फ्लॅट क्रमांक: {no}',                               // [REF]
  'fee.stepDocs': 'दस्तऐवज',                                        // [REF]
  'fee.stepDetails': 'तपशील',                                        // [REF]
  'fee.stepPayment': 'पेमेंट',                                       // [REF]
  'fee.stepConfirm': 'पुष्टी',                                       // [REF]
  'fee.stDone': 'पुर्ण',                                             // [REF]
  'fee.stRunning': 'चालू आहे',                                       // [REF]
  'fee.stPending': 'बाकी आहे',                                       // [REF]
  'fee.breakdownTitle': 'देय रक्कम तपशील',                           // [REF]
  'fee.registration': 'फ्लॅट किंमत (नोंदणी शुल्क)',                   // [REF]
  'fee.processing': 'प्रक्रिया शुल्क',                               // [REF]
  'fee.gst': 'कर (GST)',                                             // [REF]
  'fee.total': 'एकूण देय रक्कम',                                     // [REF]
  'fee.secureNote': 'ही रक्कम सुरक्षित पेमेंट गेटवेद्वारे आकारली जाईल.', // [REF]
  'fee.methodTitle': 'पेमेंट पद्धत निवडा',                           // [REF]
  'fee.upi': 'UPI (शिफारसीय)',                                       // [REF]
  'fee.upiHint': 'Google Pay, PhonePe, Paytm इ. द्वारे',             // [REF]
  'fee.card': 'डेबिट / क्रेडिट कार्ड',                               // [REF]
  'fee.cardHint': 'Visa, MasterCard, Rupay इ.',                      // [REF]
  'fee.netbanking': 'नेट बँकिंग',                                    // [REF]
  'fee.netbankingHint': 'सर्व प्रमुख बँका',                          // [REF]
  'fee.encryptTitle': 'तुमची सर्व पेमेंट माहिती एन्क्रिप्टेड आणि सुरक्षित आहे.', // [REF]
  'fee.encryptBody': 'AIEC कडून कोणतीही कार्ड माहिती साठवली जात नाही.', // [REF]
  'fee.pay': '{amount} पेमेंट करा',                                  // [REF]

  /* --------------------------------------------- payment success (S-R-13) */
  'paid.title': 'पेमेंट यशस्वी!',                                    // [REF]
  'paid.sub1': 'तुमचा पेमेंट यशस्वीरित्या पूर्ण झाला आहे.',           // [REF]
  'paid.sub2': 'महानगरपालिकेची पावती तुमच्या नोंदीत जतन केली आहे.',   // [REF]
  'paid.amount': 'देय रक्कम',                                        // [REF]
  'paid.method': 'पेमेंट पद्धत',                                     // [REF]
  'paid.txn': 'व्यवहार क्रमांक',                                     // [REF]
  'paid.datetime': 'पेमेंट दिनांक व वेळ',                            // [REF]
  'paid.state': 'स्थिती',                                            // [REF]
  'paid.stateValue': 'यशस्वी',                                       // [REF]
  'paid.viewReceipt': 'पावती पहा',                                   // [REF]
  'paid.downloadReceipt': 'पावती डाउनलोड करा',                       // [REF]
  'paid.nextTitle': 'पुढील प्रक्रिया',                               // [REF]
  'paid.nextBody': 'तुमचे पेमेंट निश्चित झाले आहे. आता साइटची पुढील तपासणी पूर्ण करण्यासाठी तयार रहा.', // [REF]
  'paid.backToRecords': 'माझ्या नोंदींमध्ये परत जा',                  // [REF]

  /* --------------------------------------------- notifications (S-R-14) */
  'notif.title': 'सूचना',                                            // [REF]
  'notif.subtitle': 'तुमच्या नोंदी, अर्ज आणि अपडेट्स',                // [REF]
  'notif.tabAll': 'सर्व',                                            // [REF]
  'notif.tabUnread': 'वाचनाच्या',                                    // [REF]
  'notif.tabImportant': 'महत्त्वाच्या',                              // [REF]
  'notif.tabSystem': 'प्रणाली अपडेट',                                // [REF]
  'notif.n1': 'पेमेंट यशस्वी',                                       // [REF]
  'notif.n1b': 'साई रेसिडेन्सी (G + 4) साठी ₹ 38 चे पेमेंट यशस्वीरित्या पूर्ण झाले आहे.', // [REF]
  'notif.n1a': 'पावती पहा',                                          // [REF]
  'notif.n2': 'दस्तऐवज प्राप्त',                                     // [REF]
  'notif.n2b': 'तुम्ही अपलोड केलेले बांधकाम परवानगीचे दस्तऐवज यशस्वीरित्या प्राप्त झाले आहेत. पडताळणी सुरू आहे.', // [REF]
  'notif.n3': 'पडताळणी सुरू',                                        // [REF]
  'notif.n3b': 'तुमच्या जमिनीचा 7/12 उतारा पडताळणीसाठी पाठवण्यात आला आहे. कृपया प्रतीक्षा करा.', // [REF]
  'notif.n4': 'प्रोफाइल अपडेट',                                      // [REF]
  'notif.n4b': 'तुमची प्रोफाइल माहिती यशस्वीरित्या अद्ययावत करण्यात आली आहे.', // [REF]
  'notif.n5': 'महत्त्वाची सूचना',                                    // [REF]
  'notif.n5b': 'उंच इमारतींच्या सुरक्षेबाबत नबीन मार्गदर्शक सूचना जारी करण्यात आल्या आहेत. कृपया वाचा.', // [REF]
  'notif.n5a': 'सूचना पहा',                                          // [REF]
  'notif.footerTitle': 'सर्व अपडेट्स तुमच्या हातात!',                // [REF]
  'notif.footerBody': 'महत्त्वाच्या सूचना, मंजुरी स्थिती आणि पेमेंट अपडेट्स वेळेवर मिळवा.', // [REF]
  'notif.settings': 'सूचना सेटिंग्ज',                                // [REF]

  /* --------------------------------------------------- profile (S-R-15) */
  'profile.title': 'माझे प्रोफाइल',                                  // [REF]
  'profile.subtitle': 'माझी माहिती, प्राधान्ये आणि सुरक्षा',          // [REF]
  'profile.verified': 'सत्यापित वापरकर्ता',                          // [REF]
  'profile.edit': 'प्रोफाइल संपादित करा',                            // [REF]
  'profile.personal': 'वैयक्तिक माहिती',                             // [REF]
  'profile.fullName': 'पूर्ण नाव',                                   // [REF]
  'profile.fullNameV': 'संदीप अनिल पाटील',                           // [REF]
  'profile.mobile': 'मोबाईल क्रमांक',                                // [REF]
  'profile.mobileV': '+91 98765 43210',                              // [REF]
  'profile.email': 'ईमेल आयडी',                                      // [REF]
  'profile.emailV': 'sandeep.patil@gmail.com',                       // [REF]
  'profile.address': 'पत्ता',                                        // [REF]
  'profile.addressV': 'बाणेर, पुणे - 411045, महाराष्ट्र, भारत',       // [REF]
  'profile.verifiedChip': 'सत्यापित',                                // [REF]
  'profile.prefs': 'माझी प्राधान्ये',                                // [REF]
  'profile.notifPrefs': 'सूचना प्राधान्ये',                          // [REF]
  'profile.notifPrefsSub': 'एसएमएस, ईमेल आणि ॲप सूचना',              // [REF]
  'profile.language': 'भाषा',                                        // [REF]
  'profile.languageSub': 'मराठी (डिफॉल्ट)',                          // [REF]
  'profile.theme': 'ॲप थीम',                                         // [REF]
  'profile.themeSub': 'शिस्टम डिफॉल्ट',                              // [REF]
  'profile.security': 'सुरक्षा',                                     // [REF]
  'profile.password': 'पासवर्ड बदला',                                // [REF]
  'profile.passwordSub': 'तुमच्या खात्याची सुरक्षा वाढवा',            // [REF]
  'profile.twofa': 'दुहेरी प्रमाणीकरण (2FA)',                        // [REF]
  'profile.twofaSub': 'अधिक सुरक्षिततेसाठी सक्षम करा',                // [REF]
  'profile.twofaChip': 'अक्षम आहे',                                  // [REF]
  'profile.other': 'इतर',                                            // [REF]
  'profile.terms': 'अटी व शर्ती',                                    // [REF]
  'profile.helpSupport': 'मदत व समर्थन',                             // [REF]
  'profile.logout': 'लॉगआउट',                                        // [REF]

  /* -------------------------------------------------- feedback (S-R-16) */
  'fb.title': 'अभिप्राय द्या',                                       // [REF]
  'fb.subtitle': 'तुमचा अनुभव आमच्यासाठी महत्वाचा आहे',              // [REF]
  'fb.introTitle': 'AIEC अधिक चांगले करण्यासाठी',                    // [REF]
  'fb.introBody': 'तुमचा अभिप्राय आम्हाला मदत करतो. कृपया काही क्षण द्या.', // [REF]
  'fb.q1': 'या वेळचा तुमचा एकूण अनुभव कसा होता?',                    // [REF]
  'fb.required': 'आवश्यक',                                           // [REF]
  'fb.r1': 'खूप खराब',                                               // [REF]
  'fb.r2': 'खराब',                                                   // [REF]
  'fb.r3': 'ठीक आहे',                                                // [REF]
  'fb.r4': 'चांगला',                                                 // [REF]
  'fb.r5': 'उत्कृष्ट',                                               // [REF]
  'fb.q2': 'तुम्हाला कोणत्या गोष्टी विशेष आवडल्या?',                  // [REF]
  'fb.q2sub': 'लागू ते सर्व निवडा',                                  // [REF]
  'fb.o1': 'वापरण्यास सोपे',                                         // [REF]
  'fb.o2': 'वेळ बचत',                                                // [REF]
  'fb.o3': 'स्पष्ट माहिती',                                          // [REF]
  'fb.o4': 'झटपट पेमेंट',                                            // [REF]
  'fb.o5': 'उत्तम समर्थन',                                           // [REF]
  'fb.o6': 'इतर',                                                    // [REF]
  'fb.q3': 'अधिक काही सांगायचे आहे का?',                             // [REF]
  'fb.placeholder': 'तुमचे सूचना, मत किंवा अनुभव लिहा...',            // [REF]
  'fb.thanksTitle': 'धन्यवाद!',                                      // [REF]
  'fb.thanksBody': 'तुमच्या अभिप्रायामुळे AIEC सर्वांसाठी अधिक चांगले होत आहे.', // [REF]
  'fb.submit': 'अभिप्राय सबमिट करा',                                 // [REF]
} as const;

export type RecordStringKey = keyof typeof mrRecords;

export const enRecords: Record<RecordStringKey, string> = {
  'records.title': 'My records',
  'records.subtitle': 'A list of all your leads and jobs',
  'records.filter': 'Filter',
  'records.tabAll': 'All',
  'records.tabActive': 'Active',
  'records.tabDone': 'Complete',
  'records.tabCancelled': 'Cancelled',
  'records.viewDetails': 'View details',
  'records.totalTitle': '{count} records in total',
  'records.totalBody': 'You can see the current state of all your leads here.',
  'records.addNew': 'Add new lead',
  'records.stDone': 'Complete',
  'records.stActive': 'Active',
  'records.stReview': 'With the inspector',
  'records.stCancelled': 'Cancelled',
  'recdetail.share': 'Share',
  'recdetail.residential': 'Residential building',
  'recdetail.mainPhoto': 'Main photo',
  'recdetail.tabInfo': 'Details',
  'recdetail.tabProgress': 'Progress',
  'recdetail.tabPhotos': 'Photos',
  'recdetail.tabDocs': 'Documents',
  'recdetail.tabNotes': 'Notes',
  'recdetail.buildingName': 'Building name',
  'recdetail.approvedFloors': 'Approved floors',
  'recdetail.address': 'Address',
  'recdetail.ownerName': "Owner's name",
  'recdetail.type': 'Type',
  'recdetail.recordNo': 'Record number',
  'recdetail.recordDate': 'Record date',
  'recdetail.feePaid': 'Fee paid',
  'recdetail.successChip': 'Successful',
  'recdetail.inspectedTitle': 'This site inspection is complete.',
  'recdetail.inspectedBody': 'All required information has been submitted successfully.',
  'recdetail.nextSteps': 'Next steps',
  'recdetail.step1': 'Inspection complete',
  'recdetail.step2': 'Final review',
  'recdetail.step2Body': 'Verification by the AIEC team is under way.',
  'recdetail.step2Chip': 'Under way',
  'recdetail.step3': 'Certificate',
  'recdetail.step3Body': 'The certificate becomes available once verification finishes.',
  'recdetail.editRecord': 'Edit record',
  'recdetail.downloadCert': 'Download certificate',
  'progress.title': 'Construction progress',
  'progress.subtitle': 'Status and photographs for each stage',
  'progress.allStages': 'All stages',
  'progress.s1': '1. Drawings and permissions',
  'progress.s2': '2. Foundation work',
  'progress.s3': '3. Basement (ground floor)',
  'progress.s4': '4. Structural work (G + 4)',
  'progress.s5': '5. Interior works',
  'progress.s6': '6. Final inspection and handover',
  'progress.doneOn': 'Complete – {date}',
  'progress.startedExpected': 'Started – expected completion: {date}',
  'progress.expected': 'Expected – {date}',
  'progress.chipDone': 'Complete',
  'progress.chipRunning': 'Under way',
  'progress.chipPending': 'Not started',
  'progress.currentState': 'Current state',
  'progress.currentBody': 'Slab work on the third floor is under way.',
  'progress.percentDone': '{pct}% complete',
  'progress.recentPhotos': 'Recent photographs ({date})',
  'progress.allPhotos': 'See all photos',
  'progress.capFront': 'Front side',
  'progress.capInside': 'Interior',
  'progress.capSlab': 'Third-floor slab',
  'progress.infoTitle': 'Progress information is updated regularly.',
  'progress.infoBody': "You'll be notified about significant changes.",
  'progress.addNote': 'Add note',
  'progress.uploadPhoto': 'Upload photo',
  'docs.title': 'Upload documents',
  'docs.instruction': 'Please upload all the required documents below, clear and legible.',
  'docs.d1': '1. Construction permission',
  'docs.d1s': 'Municipal approval copy',
  'docs.d2': '2. Land 7/12 extract',
  'docs.d2s': 'Land ownership and area',
  'docs.d3': '3. Approved plan',
  'docs.d3s': 'Plan approved by the corporation',
  'docs.d4': '4. Structural stability certificate',
  'docs.d4s': "Certificate from an accredited engineer",
  'docs.d5': '5. Worker safety plan',
  'docs.d5s': 'Action plan for safety measures',
  'docs.d6': '6. Insurance policy',
  'docs.d6s': 'Worker and third-party insurance',
  'docs.uploaded': 'Uploaded',
  'docs.uploading': 'Uploading... ({pct}%)',
  'docs.notUploaded': 'Not uploaded yet',
  'docs.view': 'View',
  'docs.viewWhenDone': 'Visible once it lands',
  'docs.replace': 'Replace',
  'docs.cancelUpload': 'Cancel',
  'docs.choose': 'Choose file',
  'docs.formatTitle': 'Upload documents as PDF, JPG or PNG only.',
  'docs.formatBody': 'Each file must be at most 5 MB.',
  'docs.next': 'Continue',
  'fee.title': 'Make payment',
  'fee.subtitle': 'Your dream home is now a step closer',
  'fee.flatNo': 'Flat number: {no}',
  'fee.stepDocs': 'Documents',
  'fee.stepDetails': 'Details',
  'fee.stepPayment': 'Payment',
  'fee.stepConfirm': 'Confirmation',
  'fee.stDone': 'Complete',
  'fee.stRunning': 'Under way',
  'fee.stPending': 'Remaining',
  'fee.breakdownTitle': 'Amount payable',
  'fee.registration': 'Flat price (registration fee)',
  'fee.processing': 'Processing fee',
  'fee.gst': 'Tax (GST)',
  'fee.total': 'Total payable',
  'fee.secureNote': 'This amount will be charged through a secure payment gateway.',
  'fee.methodTitle': 'Choose a payment method',
  'fee.upi': 'UPI (recommended)',
  'fee.upiHint': 'Via Google Pay, PhonePe, Paytm etc.',
  'fee.card': 'Debit / credit card',
  'fee.cardHint': 'Visa, MasterCard, Rupay etc.',
  'fee.netbanking': 'Net banking',
  'fee.netbankingHint': 'All major banks',
  'fee.encryptTitle': 'All your payment information is encrypted and secure.',
  'fee.encryptBody': 'AIEC does not store any card information.',
  'fee.pay': 'Pay {amount}',
  'paid.title': 'Payment successful!',
  'paid.sub1': 'Your payment completed successfully.',
  'paid.sub2': 'The municipal receipt has been saved to your record.',
  'paid.amount': 'Amount payable',
  'paid.method': 'Payment method',
  'paid.txn': 'Transaction number',
  'paid.datetime': 'Payment date and time',
  'paid.state': 'Status',
  'paid.stateValue': 'Successful',
  'paid.viewReceipt': 'View receipt',
  'paid.downloadReceipt': 'Download receipt',
  'paid.nextTitle': 'What happens next',
  'paid.nextBody': 'Your payment is confirmed. Now be ready to complete the next site inspection.',
  'paid.backToRecords': 'Back to my records',
  'notif.title': 'Notifications',
  'notif.subtitle': 'Your records, applications and updates',
  'notif.tabAll': 'All',
  'notif.tabUnread': 'Unread',
  'notif.tabImportant': 'Important',
  'notif.tabSystem': 'System updates',
  'notif.n1': 'Payment successful',
  'notif.n1b': 'The ₹ 38 payment for Sai Residency (G + 4) completed successfully.',
  'notif.n1a': 'View receipt',
  'notif.n2': 'Documents received',
  'notif.n2b': 'The construction permission documents you uploaded were received successfully. Verification is under way.',
  'notif.n3': 'Verification started',
  'notif.n3b': 'Your land 7/12 extract has been sent for verification. Please wait.',
  'notif.n4': 'Profile updated',
  'notif.n4b': 'Your profile information was updated successfully.',
  'notif.n5': 'Important notice',
  'notif.n5b': 'New guidelines have been issued on the safety of tall buildings. Please read them.',
  'notif.n5a': 'View notice',
  'notif.footerTitle': 'Every update in your hands!',
  'notif.footerBody': 'Get important notices, approval status and payment updates on time.',
  'notif.settings': 'Notification settings',
  'profile.title': 'My profile',
  'profile.subtitle': 'My information, preferences and security',
  'profile.verified': 'Verified user',
  'profile.edit': 'Edit profile',
  'profile.personal': 'Personal information',
  'profile.fullName': 'Full name',
  'profile.fullNameV': 'Sandeep Anil Patil',
  'profile.mobile': 'Mobile number',
  'profile.mobileV': '+91 98765 43210',
  'profile.email': 'Email address',
  'profile.emailV': 'sandeep.patil@gmail.com',
  'profile.address': 'Address',
  'profile.addressV': 'Baner, Pune - 411045, Maharashtra, India',
  'profile.verifiedChip': 'Verified',
  'profile.prefs': 'My preferences',
  'profile.notifPrefs': 'Notification preferences',
  'profile.notifPrefsSub': 'SMS, email and app notifications',
  'profile.language': 'Language',
  'profile.languageSub': 'Marathi (default)',
  'profile.theme': 'App theme',
  'profile.themeSub': 'System default',
  'profile.security': 'Security',
  'profile.password': 'Change password',
  'profile.passwordSub': 'Strengthen your account security',
  'profile.twofa': 'Two-factor authentication (2FA)',
  'profile.twofaSub': 'Enable it for extra security',
  'profile.twofaChip': 'Disabled',
  'profile.other': 'Other',
  'profile.terms': 'Terms and conditions',
  'profile.helpSupport': 'Help and support',
  'profile.logout': 'Log out',
  'fb.title': 'Give feedback',
  'fb.subtitle': 'Your experience matters to us',
  'fb.introTitle': 'To make AIEC better',
  'fb.introBody': 'Your feedback helps us. Please spare a moment.',
  'fb.q1': 'How was your overall experience this time?',
  'fb.required': 'Required',
  'fb.r1': 'Very poor',
  'fb.r2': 'Poor',
  'fb.r3': 'Okay',
  'fb.r4': 'Good',
  'fb.r5': 'Excellent',
  'fb.q2': 'What did you particularly like?',
  'fb.q2sub': 'Select all that apply',
  'fb.o1': 'Easy to use',
  'fb.o2': 'Saves time',
  'fb.o3': 'Clear information',
  'fb.o4': 'Fast payment',
  'fb.o5': 'Great support',
  'fb.o6': 'Other',
  'fb.q3': 'Anything else you want to tell us?',
  'fb.placeholder': 'Write your suggestion, opinion or experience...',
  'fb.thanksTitle': 'Thank you!',
  'fb.thanksBody': 'Your feedback makes AIEC better for everyone.',
  'fb.submit': 'Submit feedback',
};
