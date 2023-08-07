function recommendSize(userData, brandSizes, desiredFit = 'normale') {
    // Coefficients pour ajuster l'importance des mesures
    const coefficients = {
        "europe": 1,
        "tourDePoitrine": desiredFit === 'slim' ? 12 : 1.5,
        "tourDeTaille": 1,
        "tourDeHanches":1
    };
    //on initialise bestFit en tableau au cas où il y ait deux tailles équivalentes
    let bestFit = [];
    let smallestDifference = Infinity;

    // Parcourir chaque taille disponible de la marque
    for (let size in brandSizes) {
        let totalDifference = 0;

        // Parcourir chaque mesure pour la taille actuelle
        for (let measure in brandSizes[size]) {
            if (userData[measure] !== undefined && brandSizes[size][measure] !== undefined) {
                // Calculez la différence pondérée par le coeff entre la taille de l'utilisateur & celle du tour de boucle
                const difference = Math.abs(userData[measure] - brandSizes[size][measure]) * (coefficients[measure] || 1);
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