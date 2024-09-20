(() => {
  try {
    const searchBrother = (elStart, elSearchName) => {
      let sibling = elStart.nextElementSibling;

      // Parcours les frères jusqu'à trouver l'élément avec le tag recherché
      while (sibling) {
        if (sibling.tagName.toUpperCase() === elSearchName.toUpperCase()) return sibling;
        sibling = sibling.nextElementSibling; // Passe au frère suivant
      }
      return null;
    };

    // Taille écran de 0 à 599px
    if (window.matchMedia("(max-width: 599px)").matches) {
      /** Construction des boutons de retour en arrière (style.left = 100vw) et Voir tout (lien vers la catégorie) dans chaque .mega-menu #modal-1 .wp-block-navigation__responsive-close .wp-block-navigation__responsive-dialog #modal-1-content > ul > li ul > li ul  */
      // Sélectionner les sous-menus du 3e et 4e niveau
      const uls3eEt4eNiveau = document.querySelectorAll(".mega-menu #modal-1 .wp-block-navigation__responsive-close .wp-block-navigation__responsive-dialog #modal-1-content > ul > li ul");

      if (uls3eEt4eNiveau) {
        uls3eEt4eNiveau.forEach((ul) => {
          let previousSibling = ul.previousElementSibling;

          // Boucle pour trouver le frère précédent qui est un lien <a>
          while (previousSibling && previousSibling.tagName !== "A") previousSibling = previousSibling.previousElementSibling;

          // Si un lien <a> a été trouvé
          if (previousSibling && previousSibling.tagName === "A") {
            // Créer une div wrapper pour encapsuler le bouton "Retour" et le lien "Voir tout"
            const actionsWrapper = document.createElement("div");
            actionsWrapper.classList.add("button-actions-sous-menu-mobile"); // Ajouter la classe pour styliser le wrapper

            // Créer un élément "Voir tout" avec un lien vers la catégorie principale
            const voirToutLink = document.createElement("a");
            voirToutLink.href = previousSibling.href; // Lien vers la catégorie principale
            voirToutLink.textContent = "Voir";
            voirToutLink.classList.add("voir-tout"); // Ajouter une classe pour styliser le lien

            // Créer un bouton "Retour en arrière"
            const retourBtn = document.createElement("button");
            retourBtn.textContent = previousSibling.textContent; // Texte du lien précédent
            retourBtn.classList.add("btn-retour"); // Ajouter une classe pour styliser le bouton
            retourBtn.addEventListener("click", () => {
              // Action pour revenir en arrière (peut-être cacher ce sous-menu et afficher le parent)
              ul.style.left = "100vw"; // Animation pour "revenir en arrière"
            });

            // Ajouter le bouton et le lien dans le wrapper
            actionsWrapper.appendChild(retourBtn);
            actionsWrapper.appendChild(voirToutLink);

            // Insérer le wrapper au début du sous-menu
            ul.insertBefore(actionsWrapper, ul.firstChild);
          }
        });
      }

      /**************** Click sur la croix de fermeture **************************/
      const closeBtn = document.querySelector(".mega-menu .wp-block-navigation__responsive-container-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          console.log("closeBtn");
          e.preventDefault();
          // Selection les .mega-menu > ul > li ul et change la valeur left à -100vw
          const uls3eEt4eNiveau = document.querySelectorAll(".mega-menu #modal-1 .wp-block-navigation__responsive-close .wp-block-navigation__responsive-dialog #modal-1-content > ul > li ul");
          if (uls3eEt4eNiveau) uls3eEt4eNiveau.forEach((ul) => (ul.style.left = "100vw"));
        });
      }

      /**************** Click sur un item de menu avec has-child **************************/
      const aHasChildren = document.querySelectorAll(".mega-menu li.has-child > a");
      if (aHasChildren.length) {
        // Pour chaque li.has-child si existe alors on dectecte le click. Lors du click, on ajoute au ul situé directement à l'intérieur de li.has-child la classe active
        aHasChildren.forEach((a) => {
          a.addEventListener("click", (e) => {
            e.preventDefault();
            const ul = searchBrother(e.target, "UL"); // récupération du frère UL de l'élément li.has-child cliqué
            ul.style.left = "0";
          });
        });
      }
      /********************************************************************************** */
    }
    // Taille écran de 600px à plus
    else {
      const defautImage =
        "data:image/png;base64,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";
      const megaMenuUl1erColonne = document.querySelector(".mega-menu #modal-1 .wp-block-navigation__responsive-close .wp-block-navigation__responsive-dialog #modal-1-content > ul > li > ul");
      // Dans ce ul, on ajouter a la fin une div avec la classe wiever-image et dedans un balise img avec une height de 300px et une width 300px la SRC est celle d'une image non trouvé
      if (megaMenuUl1erColonne) {
        const divWrapper = document.createElement("div");
        divWrapper.classList.add("viewer-image");
        const img = document.createElement("img");
        img.src = defautImage;
        img.width = "300";
        img.height = "300";
        divWrapper.appendChild(img);
        megaMenuUl1erColonne.appendChild(divWrapper);

        const preloadedImages = {};
        const liList = megaMenuUl1erColonne.querySelectorAll("li");
        // Parcourir tous les li pour précharger les images dès que la page est prête
        liList.forEach((li) => {
          const urlImage = li.querySelector("a").getAttribute("rel");
          if (urlImage) {
            const img = new Image();
            // Précharger l'image et la stocker dans l'objet preloadedImages
            img.src = urlImage;
            preloadedImages[urlImage] = img;
          }
        });

        liList.forEach((li) => {
          li.addEventListener("mouseover", (event) => {
            const urlImage = event.target.getAttribute("rel");
            // Vérifier si l'image est préchargée
            if (preloadedImages[urlImage]) img.src = preloadedImages[urlImage].src; // Charger l'image préchargée immédiatement
          });
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
})();
