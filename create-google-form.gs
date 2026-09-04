let sectionStarted = false;

function createAgriGuardUATForm() {
  sectionStarted = false;
  const form = FormApp.create('AgriGuard IoT: Solar-Powered Smart Scarecrow System - User Acceptance Testing Survey');
  form.setDescription('This survey evaluates the AgriGuard IoT system and its Android application. Please answer each item based on your actual experience.');
  form.setConfirmationMessage('Thank you. Your AgriGuard IoT UAT response was successfully submitted.');
  form.setCollectEmail(false);

  addSection(form, 'Consent Statement');
  form.addSectionHeaderItem().setTitle('Participation in this survey is voluntary. The information you provide will be used for the academic evaluation of the AgriGuard IoT: Solar-Powered Smart Scarecrow System. You may choose not to answer any question or withdraw at any time. Your responses will be kept confidential and used only for research purposes.');
  form.addCheckboxItem().setTitle('I agree to participate in this survey.').setChoiceValues(['I agree to participate in this survey.']).setRequired(true);

  addSection(form, 'Part I. Respondent Profile');
  form.addTextItem().setTitle('Age').setRequired(true);
  addMultipleChoice(form, 'Sex', ['Male', 'Female', 'Prefer not to say']);
  addMultipleChoice(form, 'Occupation', ['Rice Farmer', 'Farm Owner', 'Agricultural Worker', 'Other']);
  addMultipleChoice(form, 'Highest Education', ['No Formal Education', 'Elementary', 'High School', 'Vocational/Technical', 'College']);
  addMultipleChoice(form, 'Years of Farming', ['Less than 5 years', '5–10 years', '11–20 years', '21 years and above']);
  addMultipleChoice(form, 'Smartphone Usage', ['Daily', 'Weekly', 'Occasionally', 'Rarely']);

  addSection(form, 'Instructions');
  form.addSectionHeaderItem().setTitle('5 – Strongly Agree\n4 – Agree\n3 – Neutral\n2 – Disagree\n1 – Strongly Disagree\nN/A – Not Applicable / Feature Not Used');

  addRatingSection(form, 'A. Functional Suitability', [
    'A1. The camera can detect birds as expected.',
    'A2. The system can identify the birds correctly.',
    'A3. The scarecrow responds when a bird is detected.',
    'A4. The sound used to scare birds works properly.',
    'A5. The app shows the bird detection information I need.',
    'A6. The system saves the bird type, date, and time of each detection.',
    'A7. I can see the saved bird detection records in the app.',
    'A8. The system helps me check bird activity in the farm.',
    'A9. The system is useful for helping protect rice crops from birds.'
  ]);
  addRatingSection(form, 'B. Performance Efficiency', [
    'B1. The system detects birds quickly.',
    'B2. The app opens and responds quickly.',
    'B3. The system works smoothly during use.',
    'B4. The Raspberry Pi and camera work together with minimal delay.',
    'B5. The system can still work when there is no internet.',
    'B6. The system uses power efficiently.'
  ]);
  addRatingSection(form, 'C. Usability', [
    'C1. The AgriGuard IoT system is easy to learn.',
    'C2. The app is easy to navigate and use.',
    'C3. The app is clear and easy to understand.',
    'C4. The buttons and icons are easy to understand.',
    'C5. I can easily find the features I need.',
    'C6. The information shown in the app is easy to understand.',
    'C7. I can use the system without special technical skills.'
  ]);
  addRatingSection(form, 'D. Reliability', [
    'D1. The system works properly during use.',
    'D2. The system rarely stops, freezes, or closes by itself.',
    'D3. The bird detection feature works properly during use.',
    'D4. Saved bird records are still available when I need them.',
    'D5. The app shows my saved records correctly when I open it again.',
    'D6. The system still works properly without internet.'
  ]);
  addRatingSection(form, 'E. Security', [
    'E1. The system keeps bird records on the local network.',
    'E2. The system works without internet.',
    'E3. The app does not publicly share bird records.',
    'E4. Bird records are stored only in the system.',
    'E5. The app allows users to manually delete incorrect detection records, such as false detections of people.'
  ]);
  addRatingSection(form, 'F. Portability', [
    'F1. The app works properly on my phone.',
    'F2. The app is easy to install.',
    'F3. I can use the app without help from someone else.',
    'F4. The app works properly on different Android phones.',
    'F5. The system can be used properly in the farm.'
  ]);
  addRatingSection(form, 'Part III. Overall Assessment', [
    'O1. Overall, I am satisfied with AgriGuard IoT.',
    'O2. I would recommend AgriGuard IoT to other rice farmers.',
    'O3. AgriGuard IoT can help reduce damage caused by birds.',
    'O4. AgriGuard IoT can help save time when checking for birds.',
    'O5. AgriGuard IoT is useful compared with checking for birds by hand.'
  ]);

  addSection(form, 'Part IV. Open-Ended Questions');
  form.addParagraphTextItem().setTitle('1. What feature did you like most? Why?');
  form.addParagraphTextItem().setTitle('2. Did you have any problems while using the system?');
  form.addParagraphTextItem().setTitle('3. What can we improve in the system?');

  const sheet = SpreadsheetApp.create('AgriGuard IoT UAT Responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  PropertiesService.getScriptProperties().setProperty('RESPONSE_SHEET_ID', sheet.getId());
  Logger.log('Edit form: ' + form.getEditUrl());
  Logger.log('Respondent form: ' + form.getPublishedUrl());
  Logger.log('Response sheet: ' + sheet.getUrl());
}

function doGet(e) {
  const sheetId = PropertiesService.getScriptProperties().getProperty('RESPONSE_SHEET_ID');
  const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
  const totalRespondents = Math.max(sheet.getLastRow() - 1, 0);
  const payload = JSON.stringify({ totalRespondents: totalRespondents });
  const callback = e && e.parameter && e.parameter.callback;

  if (callback && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + payload + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService.createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}

function configureExistingResponseSheet() {
  const sheetId = 'PASTE_RESPONSE_SHEET_ID_HERE';
  PropertiesService.getScriptProperties().setProperty('RESPONSE_SHEET_ID', sheetId);
}

function addSection(form, title) {
  if (sectionStarted) {
    form.addPageBreakItem().setTitle(title);
  } else {
    form.addSectionHeaderItem().setTitle(title);
    sectionStarted = true;
  }
}

function addMultipleChoice(form, title, choices) {
  form.addMultipleChoiceItem().setTitle(title).setChoiceValues(choices).setRequired(true);
}

function addRatingSection(form, title, rows) {
  addSection(form, title);
  form.addGridItem().setTitle(title + ' - Please select one response for each statement.')
    .setRows(rows)
    .setColumns(['1', '2', '3', '4', '5', 'N/A'])
    .setRequired(true);
}
