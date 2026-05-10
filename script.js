/* ===================================
   TABLEAU DE GESTION DES ÉTUDIANTS
   Fichier : script.js
   Description : Logique principale du site
   =================================== */

// ===================================
// DONNÉES DES ÉTUDIANTS
// ===================================

// Liste des filières disponibles
const filieres = ["Informatique", "Génie Civil", "Électronique", "Marketing", "Finance"];

// Données d'exemple (chargées si localStorage est vide)
const etudiantsExemple = [
  { id: 1, nom: "Alami", prenom: "Youssef", filiere: "Informatique", note: 17.5 },
  { id: 2, nom: "Benali", prenom: "Fatima", filiere: "Marketing", note: 14.0 },
  { id: 3, nom: "Chaoui", prenom: "Karim", filiere: "Informatique", note: 12.5 },
  { id: 4, nom: "Dahbi", prenom: "Sara", filiere: "Finance", note: 16.0 },
  { id: 5, nom: "El Fassi", prenom: "Ahmed", filiere: "Génie Civil", note: 11.0 },
  { id: 6, nom: "Filali", prenom: "Nadia", filiere: "Électronique", note: 15.5 },
  { id: 7, nom: "Guessous", prenom: "Omar", filiere: "Finance", note: 9.5 },
];

// ===================================
// FONCTIONS DE GESTION DU STOCKAGE
// ===================================

/**
 * Charger la liste des étudiants depuis localStorage
 * Si vide, on charge les données d'exemple
 */
function chargerEtudiants() {
  const donnees = localStorage.getItem("etudiants");

  // Si des données existent, on les retourne
  if (donnees) {
    return JSON.parse(donnees);
  }

  // Sinon, on sauvegarde les exemples et on les retourne
  sauvegarderEtudiants(etudiantsExemple);
  return etudiantsExemple;
}

/**
 * Sauvegarder la liste dans localStorage
 */
function sauvegarderEtudiants(liste) {
  localStorage.setItem("etudiants", JSON.stringify(liste));
}

// ===================================
// FONCTIONS UTILITAIRES
// ===================================

/**
 * Calculer la moyenne générale de tous les étudiants
 */
function calculerMoyenne(liste) {
  if (liste.length === 0) return 0;

  // Additionner toutes les notes
  let somme = 0;
  for (let i = 0; i < liste.length; i++) {
    somme += liste[i].note;
  }

  // Diviser par le nombre d'étudiants
  return (somme / liste.length).toFixed(2);
}

/**
 * Trouver l'étudiant avec la meilleure note
 */
function trouverMeilleurEtudiant(liste) {
  if (liste.length === 0) return null;

  // On commence par supposer que le premier est le meilleur
  let meilleur = liste[0];

  for (let i = 1; i < liste.length; i++) {
    if (liste[i].note > meilleur.note) {
      meilleur = liste[i];
    }
  }

  return meilleur;
}

/**
 * Compter les étudiants par filière
 * Retourne un objet { "Informatique": 3, "Finance": 2, ... }
 */
function compterParFiliere(liste) {
  const comptage = {};

  for (let i = 0; i < liste.length; i++) {
    const filiere = liste[i].filiere;

    // Si la filière n'est pas encore dans l'objet, on l'initialise à 0
    if (!comptage[filiere]) {
      comptage[filiere] = 0;
    }

    // On incrémente le compteur
    comptage[filiere]++;
  }

  return comptage;
}

/**
 * Générer un ID unique pour un nouvel étudiant
 */
function genererNouvelId(liste) {
  if (liste.length === 0) return 1;

  // Trouver le plus grand ID existant et ajouter 1
  let maxId = liste[0].id;
  for (let i = 1; i < liste.length; i++) {
    if (liste[i].id > maxId) {
      maxId = liste[i].id;
    }
  }

  return maxId + 1;
}

/**
 * Déterminer la classe CSS selon la note
 */
function classeNote(note) {
  if (note >= 14) return "note-bonne";
  if (note >= 10) return "note-moyenne";
  return "note-faible";
}

/**
 * Afficher une notification temporaire
 */
function afficherNotification(message, estErreur = false) {
  // Chercher ou créer l'élément de notification
  let notif = document.querySelector(".notification");

  if (!notif) {
    notif = document.createElement("div");
    notif.classList.add("notification");
    document.body.appendChild(notif);
  }

  // Définir le message et la couleur
  notif.textContent = message;
  notif.classList.toggle("erreur", estErreur);

  // Afficher la notification
  notif.classList.add("visible");

  // La masquer après 3 secondes
  setTimeout(() => {
    notif.classList.remove("visible");
  }, 3000);
}

/**
 * Marquer le lien actif dans la navbar selon la page actuelle
 */
function marquerLienActif() {
  const pageCourante = window.location.pathname.split("/").pop();
  const liens = document.querySelectorAll(".navbar-liens a");

  liens.forEach((lien) => {
    const nomPage = lien.getAttribute("href");
    if (nomPage === pageCourante || (pageCourante === "" && nomPage === "index.html")) {
      lien.classList.add("actif");
    }
  });
}

// ===================================
// PAGE D'ACCUEIL (index.html)
// ===================================

/**
 * Initialiser la page d'accueil
 */
function initialiserAccueil() {
  const liste = chargerEtudiants();

  // Afficher le nombre total d'étudiants
  const elemTotal = document.getElementById("total-etudiants");
  if (elemTotal) {
    elemTotal.textContent = liste.length;
  }

  // Afficher la moyenne générale
  const elemMoyenne = document.getElementById("moyenne-generale");
  if (elemMoyenne) {
    elemMoyenne.textContent = calculerMoyenne(liste) + "/20";
  }

  // Afficher le nombre de filières
  const elemFilieres = document.getElementById("nombre-filieres");
  if (elemFilieres) {
    const parFiliere = compterParFiliere(liste);
    elemFilieres.textContent = Object.keys(parFiliere).length;
  }
}

// ===================================
// PAGE ÉTUDIANTS (etudiants.html)
// ===================================

// Variable globale pour la liste des étudiants (utilisée dans cette page)
let listeEtudiants = [];

/**
 * Initialiser la page des étudiants
 */
function initialiserEtudiants() {
  // Charger les données
  listeEtudiants = chargerEtudiants();

  // Remplir les options de filière dans le formulaire
  remplirOptionsFiliere("champ-filiere");
  remplirOptionsFiliere("filtre-filiere", true);

  // Afficher le tableau
  afficherTableau(listeEtudiants);

  // Écouter le formulaire d'ajout
  const formulaire = document.getElementById("formulaire-ajout");
  if (formulaire) {
    formulaire.addEventListener("submit", ajouterEtudiant);
  }

  // Écouter la barre de recherche
  const champRecherche = document.getElementById("barre-recherche");
  if (champRecherche) {
    champRecherche.addEventListener("input", filtrerEtudiants);
  }

  // Écouter le filtre par filière
  const champFiltre = document.getElementById("filtre-filiere");
  if (champFiltre) {
    champFiltre.addEventListener("change", filtrerEtudiants);
  }
}

/**
 * Remplir les options d'un menu déroulant avec les filières
 */
function remplirOptionsFiliere(idElement, avecToutesOptions = false) {
  const select = document.getElementById(idElement);
  if (!select) return;

  // Vider les options existantes
  select.innerHTML = "";

  // Ajouter l'option "Toutes" si demandé
  if (avecToutesOptions) {
    const optionTout = document.createElement("option");
    optionTout.value = "";
    optionTout.textContent = "Toutes les filières";
    select.appendChild(optionTout);
  }

  // Ajouter chaque filière
  filieres.forEach((filiere) => {
    const option = document.createElement("option");
    option.value = filiere;
    option.textContent = filiere;
    select.appendChild(option);
  });
}

/**
 * Afficher la liste des étudiants dans le tableau
 */
function afficherTableau(liste) {
  const corpsTableau = document.getElementById("corps-tableau");
  if (!corpsTableau) return;

  // Vider le tableau actuel
  corpsTableau.innerHTML = "";

  // Si aucun étudiant, afficher un message
  if (liste.length === 0) {
    corpsTableau.innerHTML = `
      <tr>
        <td colspan="5" class="message-vide">
          😕 Aucun étudiant trouvé.
        </td>
      </tr>
    `;
    return;
  }

  // Créer une ligne pour chaque étudiant
  liste.forEach((etudiant) => {
    const ligne = document.createElement("tr");

    // Déterminer la classe de la note
    const classe = classeNote(etudiant.note);

    // Remplir le contenu de la ligne
    ligne.innerHTML = `
      <td>${etudiant.prenom} ${etudiant.nom}</td>
      <td>${etudiant.filiere}</td>
      <td>
        <span class="badge-note ${classe}">
          ${etudiant.note}/20
        </span>
      </td>
      <td>
        <button 
          class="bouton bouton-danger" 
          onclick="supprimerEtudiant(${etudiant.id})">
          🗑 Supprimer
        </button>
      </td>
    `;

    corpsTableau.appendChild(ligne);
  });
}

/**
 * Ajouter un nouvel étudiant depuis le formulaire
 */
function ajouterEtudiant(evenement) {
  // Empêcher le rechargement de la page
  evenement.preventDefault();

  // Récupérer les valeurs du formulaire
  const prenom = document.getElementById("champ-prenom").value.trim();
  const nom = document.getElementById("champ-nom").value.trim();
  const filiere = document.getElementById("champ-filiere").value;
  const noteTexte = document.getElementById("champ-note").value;
  const note = parseFloat(noteTexte);

  // --- Validation simple ---
  let valide = true;

  if (prenom === "") {
    document.getElementById("erreur-prenom").classList.add("visible");
    valide = false;
  } else {
    document.getElementById("erreur-prenom").classList.remove("visible");
  }

  if (nom === "") {
    document.getElementById("erreur-nom").classList.add("visible");
    valide = false;
  } else {
    document.getElementById("erreur-nom").classList.remove("visible");
  }

  if (isNaN(note) || note < 0 || note > 20) {
    document.getElementById("erreur-note").classList.add("visible");
    valide = false;
  } else {
    document.getElementById("erreur-note").classList.remove("visible");
  }

  // Si la validation échoue, on arrête
  if (!valide) return;

  // Créer l'objet du nouvel étudiant
  const nouvelEtudiant = {
    id: genererNouvelId(listeEtudiants),
    nom: nom,
    prenom: prenom,
    filiere: filiere,
    note: note,
  };

  // Ajouter à la liste
  listeEtudiants.push(nouvelEtudiant);

  // Sauvegarder dans localStorage
  sauvegarderEtudiants(listeEtudiants);

  // Rafraîchir le tableau
  afficherTableau(listeEtudiants);

  // Réinitialiser le formulaire
  evenement.target.reset();

  // Afficher une notification de succès
  afficherNotification("✅ Étudiant ajouté avec succès !");
}
// Supprimer un étudiant par son ID
function supprimerEtudiant(id) {
  // Demander confirmation
  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?");
  if (!confirmation) return;

  // Filtrer la liste pour retirer l'étudiant
  listeEtudiants = listeEtudiants.filter((etudiant) => etudiant.id !== id);

  // Sauvegarder la nouvelle liste
  sauvegarderEtudiants(listeEtudiants);

  // Rafraîchir le tableau
  afficherTableau(listeEtudiants);

  // Notification
  afficherNotification("🗑 Étudiant supprimé.");
}

// Filtrer les étudiants selon la recherche et la filière
function filtrerEtudiants() {
  const recherche = document.getElementById("barre-recherche").value.toLowerCase();
  const filiereChoisie = document.getElementById("filtre-filiere").value;

  // Filtrer la liste selon les critères
  const listeFiltree = listeEtudiants.filter((etudiant) => {
    // Vérifier si le nom ou prénom correspond à la recherche
    const nomComplet = (etudiant.prenom + " " + etudiant.nom).toLowerCase();
    const correspondRecherche = nomComplet.includes(recherche);

    // Vérifier si la filière correspond
    const correspondFiliere = filiereChoisie === "" || etudiant.filiere === filiereChoisie;

    return correspondRecherche && correspondFiliere;
  });

  // Afficher la liste filtrée
  afficherTableau(listeFiltree);
}

// PAGE STATISTIQUES (statistiques.html)
// Initialiser la page des statistiques
function initialiserStatistiques() {
  const liste = chargerEtudiants();

  // Moyenne générale
  const elemMoyenne = document.getElementById("stat-moyenne");
  if (elemMoyenne) {
    elemMoyenne.textContent = calculerMoyenne(liste) + "/20";
  }

  // Nombre total
  const elemTotal = document.getElementById("stat-total");
  if (elemTotal) {
    elemTotal.textContent = liste.length + " étudiants";
  }

  // Meilleur étudiant
  const meilleur = trouverMeilleurEtudiant(liste);
  if (meilleur) {
    const elemNom = document.getElementById("stat-meilleur-nom");
    const elemNote = document.getElementById("stat-meilleur-note");
    if (elemNom) elemNom.textContent = meilleur.prenom + " " + meilleur.nom;
    if (elemNote) elemNote.textContent = meilleur.note + "/20";
  }

  // Afficher les barres par filière
  afficherBarresFiliere(liste);
}
//Afficher les barres de progression par filière
function afficherBarresFiliere(liste) {
  const conteneur = document.getElementById("barres-filieres");
  if (!conteneur) return;

  const comptage = compterParFiliere(liste);
  const total = liste.length;

  conteneur.innerHTML = "";

  // Créer une barre pour chaque filière
  for (const filiere in comptage) {
    const nombre = comptage[filiere];
    const pourcentage = total > 0 ? Math.round((nombre / total) * 100) : 0;

    // Créer les éléments HTML de la barre
    const divBarre = document.createElement("div");
    divBarre.classList.add("barre-progression-conteneur");

    divBarre.innerHTML = `
      <div class="barre-label">
        <span>${filiere}</span>
        <span>${nombre} étudiant(s) — ${pourcentage}%</span>
      </div>
      <div class="barre-fond">
        <div class="barre-remplie" style="width: 0%;" data-largeur="${pourcentage}%"></div>
      </div>
    `;

    conteneur.appendChild(divBarre);
  }

  // Animer les barres après un court délai
  setTimeout(() => {
    const barres = document.querySelectorAll(".barre-remplie");
    barres.forEach((barre) => {
      barre.style.width = barre.getAttribute("data-largeur");
    });
  }, 200);
}
// DÉMARRAGE DU SCRIPT
// Quand la page est chargée, on exécute les bonnes fonctions
document.addEventListener("DOMContentLoaded", function () {
  // Marquer le lien actif dans la navbar
  marquerLienActif();

  // Détecter sur quelle page on est
  const pageCourante = window.location.pathname.split("/").pop();

  if (pageCourante === "index.html" || pageCourante === "") {
    initialiserAccueil();
  } else if (pageCourante === "etudiants.html") {
    initialiserEtudiants();
  } else if (pageCourante === "statistiques.html") {
    initialiserStatistiques();
  }
  // La page à propos n'a pas besoin de JavaScript spécifique
});