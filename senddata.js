function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(3000); // Empêche les écritures concurrentes

    // Récupérer les paramètres du formulaire
    var timestamp = new Date().toLocaleString('fr-FR');
    var prenom = e.parameter.prenom || '';
    var nom = e.parameter.nom || '';
    var email = e.parameter.email || '';
    var telephone = e.parameter.telephone || '';
    var adresse = e.parameter.adresse || '';
    var methodePaiement = e.parameter.methodePaiement || '';

    // Accéder à la feuille
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FormResponses'); // adapte ce nom si nécessaire

    // Créer une nouvelle ligne en respectant l'ordre des colonnes
    var newRow = [
      timestamp,
      prenom,
      nom,
      email,
      telephone,
      adresse,
      methodePaiement
    ];

    // Ajouter la ligne à la feuille
    sheet.appendRow(newRow);

    // Retourner une réponse JSON
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: newRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Erreur dans doPost: ' + error);
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}
