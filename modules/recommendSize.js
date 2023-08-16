function recommendSize(userData, brandSizes, desiredFit = 'Regular') {
    // Coefficients pour ajuster l'importance des mesures
    const coefficients = {
        "europe": 1,
        "tourDePoitrine": desiredFit === 'Slim' ? 1.5 : desiredFit === 'Ample' ? 1 : 1.5,
        "tourDeTaille": desiredFit === 'Slim' ? 2 : desiredFit === 'Ample' ? 0 : 1,
        "tourDeHanches": desiredFit === 'Slim' ? 2 : desiredFit === 'Ample' ? 0 : 1,
        "tourDeBassin":1,
        "longueurJambe":1,
        "longueur":1.5,
        "pointure":1,
    }
    //on initialise bestFit en tableau au cas où il y ait deux tailles équivalentes
    let bestFit = [];
    let smallestDifference = Infinity;

    // Parcourir chaque taille disponible de la marque
    for (let size in brandSizes) {
        let totalDifference = 0;

        // Parcourir chaque mesure pour la taille actuelle
        for (let measure in brandSizes[size]) {
            // Vérifier la mensuration existe dans le user ET dans la marques
            if (userData[measure] !== undefined && brandSizes[size][measure] !== undefined) {
                // Calculez la différence pondérée par le coeff entre la taille de l'utilisateur & celle du tour de boucle
                const difference = Math.abs(userData[measure] - brandSizes[size][measure]) * (coefficients[measure]);
                totalDifference += difference;
            }
        }

        // Si cette taille est plus proche des mensurations de l'utilisateur que la meilleure taille précédente, on met bestFit
        if (totalDifference < smallestDifference) {
            smallestDifference = totalDifference;
            bestFit=[size];
        } else if (totalDifference === smallestDifference) { // Si la taille est aussi proche que la meilleure taille précédente, on l'ajoute au tableau bestFit
            bestFit.push(size);
        }
    }

    return bestFit;
}

module.exports = { recommendSize };