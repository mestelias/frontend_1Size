const calculerMoyenne = (tableau) => {
    
    const array = tableau.map(e => e.mensurations)
    // Initialisation de l'objet contenant la somme de chaque propriété
    const somme = {};
    // Initialisation du compteur du nombre de propriété similaire à objet
    const compteur = {};
  
    array.forEach(obj => {
      // Création d'un tableau de propriété sur lequel boucler
      Object.keys(obj).forEach(key => {
        // on incrémente la valeur des clées (si la clée n'existait pas on initialise à 0)
        somme[key] = (somme[key] || 0) + obj[key];
        // on compte le nombre de fois où la clée apparaît dans les objets
        compteur[key] = (compteur[key] || 0) + 1;
      });
    });

    const moyenne = {};
  
    Object.keys(somme).forEach(key => {
      // on moyenne par rapport au nombre de fois où les clées apparaissent
      moyenne[key] = somme[key] / compteur[key];
    });
  
    return moyenne;
}

module.exports = { calculerMoyenne };