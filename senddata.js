function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Increased lock wait time to 30 seconds

    // Récupérer les données JSON du corps de la requête
    var requestBody = JSON.parse(e.postData.contents);

    // Récupérer les paramètres du formulaire
    var timestamp = new Date().toLocaleString('fr-FR');
    var prenom = requestBody.prenom || '';
    var nom = requestBody.nom || '';
    var email = requestBody.email || '';
    var telephone = requestBody.telephone || '';
    var adresse = requestBody.adresse || '';
    var methodePaiement = requestBody.methodePaiement || '';

    // Accéder à la feuille
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Commandes Livre SSIAP3'); // adapte ce nom si nécessaire

    if (!sheet) {
      throw new Error("Sheet 'Commandes Livre SSIAP3' not found!");
    }

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
    return ContentService.createTextOutput(JSON.stringify({ result: "success", row: newRow }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (for testing)


  } catch (error) {
    Logger.log('Erreur dans doPost: ' + error);
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (for testing)


  } finally {
    lock.releaseLock();
  }
}
