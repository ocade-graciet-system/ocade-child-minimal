# Ocade Child Minimal

![Readme](./readme.png)

Thème Wordpress enfant by Ocade Système.

## Ajouter une font manuellement
1. Dans le thème enfant, à la racine, ajouter un fichier `font.css`.
2. Voici un exemple de contenu de ce fichier:
```css
@charset "utf-8";

@font-face {
  font-family: 'Open Sans Cond';
  src: url(./fonts/open-sans-cond-light.ttf) format('truetype');
}
```
4. Dans le fichier `functions.php` ajouter ce bout de code:
```php
// Charge rle fichier font.css dans le front du site. Il se trouve dans le thème enfant à la racine
function theme_enqueue_styles() {
  // Enqueue parent styles
  wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');

  // Enqueue child theme styles including the font.css
  wp_enqueue_style('child-style', get_stylesheet_directory_uri() . '/font.css', array('parent-style'));
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\theme_enqueue_styles');
```
5. dans le dossier `fonts` ajouter les fichiers des fonts (ici au format ttf). Pour information, la structure du css peut etre vu dans le projet initiatik si besoin.

## Design Cassé dans le BO ?
* Pour ne pas tout redévelopper dans le BO, on a chargé le styles.min.css et main-editor.min.css. Le problème est que les fichiers style.scss (normalement dev pour le front) n'avait pas de classe wrapper pour l'éditeur. On a donc wrapper tout les imports du loader scss avec la class `.editor-styles-wrapper`, exemple:
```scss
.editor-styles-wrapper { 
  @import "./config.scss";
  @import "./external_links.scss";
  @import "./goToTop.scss";
  @import "./layout.scss";
  @import "./mixins.scss";
  @import "./normalize.scss";
  @import "./typographie.scss";
}
```
## Fichier package.json optimisé
* Ce ficheir package.json du thème enfant est optimisé pour le develppement. 
* On notera que les `URLS` des commandes `production et developpement` doivent être correctement mises à jour.
```json
{
  "scripts": {
    "production": "echo '' > styles/scss/load.scss && echo '$domaine: \"restaurants.ocade.eu\";' > styles/scss/load.scss && npm run scss-to-css && npm run build",
    "developpement": "echo '' > styles/scss/load.scss && echo '$domaine: \"restaurants.docker.localhost\";' > styles/scss/load.scss",
    "icons": "node scripts/icons.js",
    "fonts": "node scripts/fonts.js",
    "build": "find styles/css/ -type f -name '*.css' ! -name '*.min.css' -exec sh -c 'cleancss -o \"${1%.css}.min.css\" \"$1\"' _ {} \\;",
    "scss-to-css": "sass styles/scss/:styles/css/ --load-path=styles/scss/load.scss",
    "watch:scss": "sass --watch styles/scss/:styles/css/ --load-path=styles/scss/load.scss",
    "watch:minify": "chokidar 'styles/css/**/*.css' '!styles/css/**/*.min.css' -c 'npm run build'",
    "lint:scss": "npm run lint:scss-fix && npx stylelint 'styles/scss/*.scss'",
    "lint:scss-fix": "npx stylelint 'styles/scss/*.scss' --fix",
    "init": "npm install && npm run icons && npm run fonts && git add . && git commit . -m '🚀 Initialisaton du projet' && git push origin master --force",
    "start": "rm -rf styles/css/* && echo '/** Automatique CSS */' > styles/css/main.css && npm run developpement && npm-run-all --parallel watch:* build"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint:scss"
    }
  },
  "devDependencies": {
    "chokidar-cli": "^3.0.0",
    "clean-css-cli": "^5.6.2",
    "husky": "^8.0.3",
    "npm-run-all": "^4.1.5",
    "postcss-cli": "^10.1.0",
    "postcss-prefixwrap": "^1.39.1",
    "postcss-scss": "^4.0.6",
    "sass": "^1.59.2",
    "stylelint": "^15.6.2",
    "stylelint-config-standard": "^33.0.0"
  }
}
```

## Réactiver les commentaires ?
Commenter dans le fichier `functions.php`
```php
/** Suppression des commentaires dans WordPress */
// require_once( get_stylesheet_directory() . '/includes/functions/RemoveComments.php' );
```

# Customisation d'un Block WordPress dans un Thème Enfant 🚀

## Introduction
🎯 **Objectif :** Créer une structure dans le thème enfant permettant de modifier la logique d'un bloc WordPress, offrant ainsi plus de flexibilité aux intégrateurs.

## Développement
### Architecture Requise
Structure des dossiers et fichiers dans le thème enfant :

```sh
themes/
  └── montgolfiere-sensation/
       └── registerBlocksStyles/
            ├── registerBlocksStyles.js
            └── registerBlocksStyle.php
```

### Intégration dans `function.php`
Inclure le fichier `registerBlocksStyles` dans le fichier `functions.php` du thème enfant.

### Étapes de Personnalisation

#### 1. Ajouter le Hook pour Personnaliser le Block Editor
```php
// Fichier registerBlocksStyles.php
add_action('enqueue_block_editor_assets', function () {
    $theme = wp_get_theme();
    $child_theme_path = $theme->get_stylesheet_directory();
    $script_path = $child_theme_path . '/registerBlocksStyles/registerBlocksStyles.js';

    if (file_exists($script_path)) {
        wp_enqueue_script(
            'registerBlocksStyles',
            get_stylesheet_directory_uri() . '/registerBlocksStyles/registerBlocksStyles.js',
            array('wp-blocks', 'wp-dom'),
            filemtime(get_stylesheet_directory(__FILE__) . '/registerBlocksStyles/registerBlocksStyles.js'),
            false
        );
    } else {
        error_log("Dans le fichier " . __FILE__ . " un des fichiers du thème enfant n'est pas trouvé pour enregistrer les styles de blocks");
    }
});
```

#### 2. Ajouter la Logique de Customisation dans le Fichier JavaScript
 
```js
// Fichier registerBlocksStyles.js
(function () {
    const { registerBlockStyle } = typeof wp.blocks !== "undefined" ? wp.blocks : {};
    wp.domReady(() => {
        if (registerBlockStyle) {
            registerBlockStyle("core/group", [
                { label: "Nuages 1", name: "nuages-1" },
            ]);
        }
    });
})();

```

#### 3. Correction du problème de doublon de css dans le front
```js 
npm install cssnano
```
* Ajuster le package.json en ajoutant les lignes "postcss" et "production"
```
{
  "scripts": {
    "production": "echo '' > styles/scss/load.scss && echo '$domaine: \"SOUSDOMAINE.ocade-systeme.fr\";' > styles/scss/load.scss && npm run scss-to-css && npm run postcss && npm run build",
    "developpement": "echo '' > styles/scss/load.scss && echo '$domaine: \"SOUSDOMAINE.docker.localhost\";' > styles/scss/load.scss",
    "icons": "node scripts/icons.js",
    "fonts": "node scripts/fonts.js",
    "build": "find styles/css/ -type f -name '*.css' ! -name '*.min.css' -exec sh -c 'cleancss -o \"${1%.css}.min.css\" \"$1\"' _ {} \\;",
    "scss-to-css": "sass styles/scss/:styles/css/ --load-path=styles/scss/load.scss",
    "watch:scss": "sass --watch styles/scss/:styles/css/ --load-path=styles/scss/load.scss",
    "watch:minify": "chokidar 'styles/css/**/*.css' '!styles/css/**/*.min.css' -c 'npm run build'",
    "lint:scss": "npm run lint:scss-fix && npx stylelint 'styles/scss/*.scss'",
    "lint:scss-fix": "npx stylelint 'styles/scss/*.scss' --fix",
    "init": "npm install && npm run icons && npm run fonts && git add . && git commit . -m '🚀 Initialisaton du projet' && git push origin master --force",
    "start": "rm -rf styles/css/* && echo '/** Automatique CSS */' > styles/css/main.css && npm run developpement && npm-run-all --parallel watch:* build",
    "push": "rm -rf styles/css/* && git pull origin master &&  git add . && git commit . -m '🚀 Mise à jour du projet' && git push -u origin master",
    "init-clone": "npm install && npm run icons && npm run build",
    "postcss": "postcss styles/css/*.css --use cssnano --dir styles/css/"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint:scss"
    }
  },
  "devDependencies": {
    "chokidar-cli": "^3.0.0",
    "clean-css-cli": "^5.6.2",
    "husky": "^8.0.3",
    "npm-run-all": "^4.1.5",
    "postcss-cli": "^10.1.0",
    "postcss-prefixwrap": "^1.39.1",
    "postcss-scss": "^4.0.6",
    "sass": "^1.59.2",
    "stylelint": "^15.6.2",
    "stylelint-config-standard": "^33.0.0"
  }
}
```

# Ajout du Méga Menu

Fichier functions.php
```php

function enqueue_child_theme_scripts()
{
  wp_enqueue_script(
    'mega-menu-script', // Handle unique du script
    get_stylesheet_directory_uri() . '/scripts/mega-menu.js', // Chemin vers le script
    array('jquery'), // Dépendances, si tu utilises jQuery par exemple
    null, // Version du script (null pour la version actuelle)
    true // Charger dans le footer (true) ou dans le head (false)
  );
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_child_theme_scripts');
```

Fichier main-editor.scss et main.scss
```scss
@import "./templates/mega-menu.scss"; 
```

Fichier `scripts/mega-menu.js`:
```js
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

      // Sélection des éléments UL et LI de premier niveau
      const megaMenuUl1erColonnes = document.querySelectorAll(".mega-menu #modal-1 .wp-block-navigation__responsive-dialog #modal-1-content > ul > li > ul");
      const megaMenuLi1erNiveau = document.querySelectorAll(".mega-menu #modal-1 .wp-block-navigation__responsive-dialog #modal-1-content > ul > li.has-child");

      // Fonction pour changer l'image en fonction de l'élément survolé
      const changeImageOnHover = (element, imgElement, preloadedImages, defaultImage) => {
        const urlImage = element.querySelector("a")?.getAttribute("rel") || element.getAttribute("rel");
        if (preloadedImages[urlImage]) imgElement.src = preloadedImages[urlImage].src;
        else imgElement.src = defaultImage;
      };

      // Gestion des événements de hover et mouseleave pour les LI de premier niveau
      megaMenuLi1erNiveau.forEach((li) => {
        li.addEventListener("mouseover", (event) => {
          const nextUl = event.target.nextElementSibling?.nextElementSibling;
          if (nextUl) {
            const urlImage = event.target.getAttribute("rel");
            const img = nextUl.querySelector(".viewer-image img");
            if (img && urlImage) {
              img.src = urlImage;
            }
          }
        });
      });

      // Gestion de la création du wrapper d'images et des événements sur chaque colonne UL
      megaMenuUl1erColonnes.forEach((ulColonne) => {
        const divWrapper = document.createElement("div");
        divWrapper.classList.add("viewer-image");
        const img = document.createElement("img");
        img.src = defautImage; // Variable définie ailleurs
        img.width = 450;
        divWrapper.appendChild(img);
        ulColonne.appendChild(divWrapper);

        // Préchargement des images
        const preloadedImages = {};
        const liList = ulColonne.querySelectorAll("li");
        liList.forEach((li) => {
          const urlImage = li.querySelector("a")?.getAttribute("rel");
          if (urlImage) {
            const imgPreload = new Image();
            imgPreload.src = urlImage;
            preloadedImages[urlImage] = imgPreload;
          }
        });

        // Gestion des événements hover pour changer d'image au survol
        ulColonne.parentElement.querySelectorAll(":scope > li").forEach((li) => {
          li.addEventListener("mouseenter", (event) => changeImageOnHover(event.target, img, preloadedImages, defautImage));
          li.addEventListener("mouseleave", () => (img.src = defautImage));
        });

        // Gestion des événements hover pour les sous-éléments
        liList.forEach((li) => {
          li.addEventListener("mouseenter", (event) => changeImageOnHover(event.target, img, preloadedImages, defautImage));
          li.addEventListener("mouseleave", () => (img.src = defautImage));
        });
      });

      // Gestion des événements mouseleave pour restaurer l'image par défaut
      megaMenuUl1erColonnes.forEach((ulColonne) => {
        ulColonne.addEventListener("mouseleave", () => {
          const img = ulColonne.querySelector(".viewer-image img");
          if (img) img.src = defautImage;
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
})();
```

Fichier `styles/scss/templates/mega-menu.scss`:
```scss
:root {
  --font-menu-color: #fefefe; // Couleur de fond du menu
  --burger-btn-et-close-btn-top: 0.5rem; // Position du bouton burger
  --burger-btn-et-close-btn-left: 0.5rem; // Position du bouton burger
  --burger-btn-et-close-btn-width: 3rem; // Largeur du bouton burger
  --burger-btn-et-close-btn-height: 3rem; // Hauteur du bouton burger
  --background-color-current-menu-item: #2f312f; // Couleur de fond du menu courant
  --color-current-menu-item: #ffffff; // Couleur du texte du menu courant
}

@media (max-width: 599px) {
  html header nav.wp-block-navigation #modal-1 .wp-block-navigation__responsive-close .wp-block-navigation__responsive-dialog #modal-1-content > ul > li ul li a {
    color: black !important;
  }

  html header nav.wp-block-navigation #modal-1 .wp-block-navigation__responsive-close .wp-block-navigation__responsive-dialog #modal-1-content > ul > li ul li.current-menu-item a {
    color: white !important;
  }

  html body #header-principale {
    nav.mega-menu {
      row-gap: 0;

      /* Bouton Burger */
      button.wp-block-navigation__responsive-container-open,
      button.wp-block-navigation__responsive-container-close {
        position: fixed;
        left: var(--burger-btn-et-close-btn-left);
        top: var(--burger-btn-et-close-btn-top);
        z-index: 9999;
        width: var(--burger-btn-et-close-btn-width);
        height: var(--burger-btn-et-close-btn-height);
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(100px);
        display: block !important;

        svg {
          display: none;
        }

        &::before {
          content: "";
          position: relative;
          display: block;
          height: 2rem;
          width: 2rem;
          left: var(--burger-btn-et-close-btn-left);
          top: 0;
          left: 7px;
          background-color: rgb(255, 255, 255);
          mask-position: center;
          mask-size: 100%;
          mask-repeat: no-repeat;
          mask-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmlld0JveD0iMCAwIDM4IDMyLjUiCiAgIHg9IjBweCIKICAgeT0iMHB4IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc0IgogICBzb2RpcG9kaTpkb2NuYW1lPSJidXJnZXIuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjMuMSAoOWI5YmRjMTQ4MCwgMjAyMy0xMS0yNSwgY3VzdG9tKSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzNCIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9Im5hbWVkdmlldzQiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjMDAwMDAwIgogICAgIGJvcmRlcm9wYWNpdHk9IjAuMjUiCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICAgIGlua3NjYXBlOmRlc2tjb2xvcj0iI2QxZDFkMSIKICAgICBpbmtzY2FwZTp6b29tPSIyMy4yMTA1MjYiCiAgICAgaW5rc2NhcGU6Y3g9IjE5IgogICAgIGlua3NjYXBlOmN5PSIxNi4yNDI2MyIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTA3OSIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMzIiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmc0IiAvPgogIDx0aXRsZQogICAgIGlkPSJ0aXRsZTEiPjQ4X3B4IC0gUmVndWxhciAtIDcwIEJhc2ljIEljb25zPC90aXRsZT4KICA8ZwogICAgIGlkPSJnMyIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDMuMjUpIj4KICAgIDxwYXRoCiAgICAgICBkPSJNIDM2LDQgSCAyIEEgMiwyIDAgMCAxIDIsMCBoIDM0IGEgMiwyIDAgMCAxIDAsNCB6IgogICAgICAgaWQ9InBhdGgxIiAvPgogICAgPHBhdGgKICAgICAgIGQ9Ik0gMzYsMTUgSCAyIGEgMiwyIDAgMCAxIDAsLTQgaCAzNCBhIDIsMiAwIDAgMSAwLDQgeiIKICAgICAgIGlkPSJwYXRoMiIgLz4KICAgIDxwYXRoCiAgICAgICBkPSJNIDM2LDI2IEggMiBhIDIsMiAwIDAgMSAwLC00IGggMzQgYSAyLDIgMCAwIDEgMCw0IHoiCiAgICAgICBpZD0icGF0aDMiIC8+CiAgPC9nPgo8L3N2Zz4K");
        }
      }

      /* Bouton Close */
      button.wp-block-navigation__responsive-container-close {
        background-color: transparent;
        &::before {
          mask-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmVyc2lvbj0iMS4xIgogICB4PSIwcHgiCiAgIHk9IjBweCIKICAgdmlld0JveD0iMCAwIDM3NCAzNzQiCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgIGlkPSJzdmc0IgogICBzb2RpcG9kaTpkb2NuYW1lPSJjbG9zZS5zdmciCiAgIHdpZHRoPSIzNzQiCiAgIGhlaWdodD0iMzc0IgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjMuMSAoOWI5YmRjMTQ4MCwgMjAyMy0xMS0yNSwgY3VzdG9tKSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcwogICAgIGlkPSJkZWZzNCIgLz48c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9Im5hbWVkdmlldzQiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjMDAwMDAwIgogICAgIGJvcmRlcm9wYWNpdHk9IjAuMjUiCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICAgIGlua3NjYXBlOmRlc2tjb2xvcj0iI2QxZDFkMSIKICAgICBpbmtzY2FwZTp6b29tPSIxLjMwMzEyNSIKICAgICBpbmtzY2FwZTpjeD0iMjU2LjMwNjk1IgogICAgIGlua3NjYXBlOmN5PSIyNTguNjA5MTEiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwNzkiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjMyIgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnNCIgLz48ZwogICAgIGlkPSJnMyIKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNjkuMDA1LC02OC45OTUpIj48ZwogICAgICAgaWQ9ImcxIj48cGF0aAogICAgICAgICBkPSJtIDEwOC43NSw0MjguMjUgYyAtNi40LDAgLTEyLjgsLTIuNDQgLTE3LjY4LC03LjMyIC05Ljc2LC05Ljc2IC05Ljc2LC0yNS41OSAwLC0zNS4zNiBMIDM4NS41OCw5MS4wNyBjIDkuNzYsLTkuNzYgMjUuNTksLTkuNzYgMzUuMzYsMCA5Ljc2LDkuNzYgOS43NiwyNS41OSAwLDM1LjM2IGwgLTI5NC41MiwyOTQuNSBjIC00Ljg4LDQuODggLTExLjI3LDcuMzIgLTE3LjY3LDcuMzIgeiIKICAgICAgICAgaWQ9InBhdGgxIiAvPjwvZz48ZwogICAgICAgaWQ9ImcyIj48cGF0aAogICAgICAgICBkPSJtIDQwMy4yNSw0MjguMjUgYyAtNi40LDAgLTEyLjgsLTIuNDQgLTE3LjY4LC03LjMyIEwgOTEuMDcsMTI2LjQyIGMgLTkuNzYsLTkuNzYgLTkuNzYsLTI1LjU5IDAsLTM1LjM2IDkuNzYsLTkuNzYgMjUuNTksLTkuNzYgMzUuMzYsMCBsIDI5NC41MSwyOTQuNTEgYyA5Ljc2LDkuNzYgOS43NiwyNS41OSAwLDM1LjM2IC00Ljg5LDQuODggLTExLjI5LDcuMzIgLTE3LjY5LDcuMzIgeiIKICAgICAgICAgaWQ9InBhdGgyIiAvPjwvZz48L2c+PC9zdmc+Cg==");
          top: 0;
          left: 2px;
          background-color: rgb(39, 39, 39);
        }
      }

      #modal-1 {
        /** Menu Fermé **/
        .wp-block-navigation__responsive-close {
          #modal-1-content.wp-block-navigation__responsive-container-content {
          }
        }

        /** Menu Ouvert **/
        &.is-menu-open {
          /** Menu Fermé **/

          #modal-1-content.wp-block-navigation__responsive-container-content {
            position: relative;
            padding-top: 5rem;
            background-color: var(--font-menu-color);

            /** Ul li a span de façon global **/
            ul {
              position: fixed;
              top: calc(5rem + 2px);
              align-items: flex-start;
              width: 100%;
              min-height: calc(100vh - 5rem);
              padding: 0;
              background-color: var(--font-menu-color) !important;
              transition: left 0.2s ease-in-out;

              li {
                width: 100%;

                &.has-child {
                  position: relative;

                  &::before {
                    content: "";
                    position: absolute;
                    right: 0.5rem;
                    top: 50%;
                    pointer-events: none;
                    transform: translateY(-50%);
                    width: 1rem;
                    height: 1rem;
                    background-color: black;
                    mask-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmlld0JveD0iMCAwIDUxIDUxIgogICB2ZXJzaW9uPSIxLjEiCiAgIHg9IjBweCIKICAgeT0iMHB4IgogICBpZD0ic3ZnMyIKICAgc29kaXBvZGk6ZG9jbmFtZT0iY2hldnJvbi5zdmciCiAgIHdpZHRoPSI1MSIKICAgaGVpZ2h0PSI1MSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4zLjEgKDliOWJkYzE0ODAsIDIwMjMtMTEtMjUsIGN1c3RvbSkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMzIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3MyIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOnpvb209IjYuNjcyIgogICAgIGlua3NjYXBlOmN4PSI1MC4wNTk5NTIiCiAgICAgaW5rc2NhcGU6Y3k9IjYyLjUiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwNzkiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjMyIgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iZzEiIC8+CiAgPHRpdGxlCiAgICAgaWQ9InRpdGxlMSI+RXh0cmEgRXh0cmEgQm9sZCBDaGV2cm9uIERvd248L3RpdGxlPgogIDxkZXNjCiAgICAgaWQ9ImRlc2MxIj5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICA8ZwogICAgIHN0cm9rZT0ibm9uZSIKICAgICBzdHJva2Utd2lkdGg9IjEiCiAgICAgZmlsbD0ibm9uZSIKICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgaWQ9ImcyIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNS43OTQzOTQsLTE1LjAzNDA3MSkiPgogICAgPGcKICAgICAgIGZpbGw9IiMwMDAwMDAiCiAgICAgICBpZD0iZzEiPgogICAgICA8cGF0aAogICAgICAgICBkPSJtIDI5LjcwNjM4Miw1OC4xMjkzOTUgYyAtMS4zMjI0MTMsMS40MDk4NTggLTEuMjUxNTI1LDMuNjI0ODAzIDAuMTU4MzMzLDQuOTQ3MjE1IDEuNDA5ODU4LDEuMzIyNDEzIDMuNjI0ODAyLDEuMjUxNTI1IDQuOTQ3MjE1LC0wLjE1ODMzMyBMIDU0LjE2MTkzMiw0Mi4yODg3NDggYyAxLjMyMjQxMywtMS40MDk4NTggMS4yNTE1MjUsLTMuNjI0ODAyIC0wLjE1ODMzNCwtNC45NDcyMTUgTCAzMy4zNzQwNzEsMTcuOTkxNTMxIGMgLTEuNDA5ODU5LC0xLjMyMjQxMyAtMy42MjQ4MDMsLTEuMjUxNTI0IC00Ljk0NzIxNiwwLjE1ODMzNCAtMS4zMjI0MTMsMS40MDk4NTggLTEuMjUxNTI0LDMuNjI0ODAyIDAuMTU4MzM0LDQuOTQ3MjE1IGwgMTguMDg2NjI4LDE2Ljk2NDgyMyB6IgogICAgICAgICBpZD0icGF0aDEiIC8+CiAgICA8L2c+CiAgPC9nPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTMiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6dGl0bGU+RXh0cmEgRXh0cmEgQm9sZCBDaGV2cm9uIERvd248L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg==");
                    mask-size: 100%;
                    mask-repeat: no-repeat;
                    mask-position: center;
                  }

                  a {
                    padding-right: 2rem;

                    + button {
                      display: block;
                      position: absolute;
                      top: 50%;
                      transform: translateY(-50%);
                      right: 5px;
                    }
                  }
                }

                &.current-menu-item:not(.logo) {
                  background-color: var(--background-color-current-menu-item) !important;

                  &::before {
                    background-color: var(--color-current-menu-item);
                  }

                  > a,
                  > a > span {
                    color: var(--color-current-menu-item);
                    background-color: var(--background-color-current-menu-item);
                  }

                  a + button {
                    display: block;

                    path {
                      color: white !important;
                    }
                  }
                }

                &:hover {
                  > a span {
                    border-bottom: none !important;
                  }
                }

                a,
                span {
                  display: flex;
                  flex-wrap: wrap;
                  width: 100%;
                  padding: 1rem 0.5rem;
                }

                a {
                  span {
                    padding: 0;

                    &.wp-block-navigation-item__description {
                      font-weight: 400; 
                      font-style: normal;
                      text-transform: none;
                      font-size: 0.8rem;
                    }
                  }
                }
              }

              div.button-actions-sous-menu-mobile {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding-top: 0.3rem;
                padding-bottom: 0.3rem;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
                border-bottom: 1px solid #e9e9e9;

                button.btn-retour {
                  position: relative;
                  background: transparent;
                  font-weight: 700;
                  font-size: 1rem;
                  padding: 0.75rem 1rem 0.75rem 2rem;

                  &::before {
                    content: "";
                    position: absolute;
                    left: 0.25rem;
                    top: 50%;
                    width: 1rem;
                    height: 1rem;
                    transform: translateY(-50%) rotate(180deg);
                    mask-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmlld0JveD0iMCAwIDUxIDUxIgogICB2ZXJzaW9uPSIxLjEiCiAgIHg9IjBweCIKICAgeT0iMHB4IgogICBpZD0ic3ZnMyIKICAgc29kaXBvZGk6ZG9jbmFtZT0iY2hldnJvbi5zdmciCiAgIHdpZHRoPSI1MSIKICAgaGVpZ2h0PSI1MSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4zLjEgKDliOWJkYzE0ODAsIDIwMjMtMTEtMjUsIGN1c3RvbSkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMzIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3MyIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOnpvb209IjYuNjcyIgogICAgIGlua3NjYXBlOmN4PSI1MC4wNTk5NTIiCiAgICAgaW5rc2NhcGU6Y3k9IjYyLjUiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwNzkiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjMyIgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iZzEiIC8+CiAgPHRpdGxlCiAgICAgaWQ9InRpdGxlMSI+RXh0cmEgRXh0cmEgQm9sZCBDaGV2cm9uIERvd248L3RpdGxlPgogIDxkZXNjCiAgICAgaWQ9ImRlc2MxIj5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICA8ZwogICAgIHN0cm9rZT0ibm9uZSIKICAgICBzdHJva2Utd2lkdGg9IjEiCiAgICAgZmlsbD0ibm9uZSIKICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgaWQ9ImcyIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNS43OTQzOTQsLTE1LjAzNDA3MSkiPgogICAgPGcKICAgICAgIGZpbGw9IiMwMDAwMDAiCiAgICAgICBpZD0iZzEiPgogICAgICA8cGF0aAogICAgICAgICBkPSJtIDI5LjcwNjM4Miw1OC4xMjkzOTUgYyAtMS4zMjI0MTMsMS40MDk4NTggLTEuMjUxNTI1LDMuNjI0ODAzIDAuMTU4MzMzLDQuOTQ3MjE1IDEuNDA5ODU4LDEuMzIyNDEzIDMuNjI0ODAyLDEuMjUxNTI1IDQuOTQ3MjE1LC0wLjE1ODMzMyBMIDU0LjE2MTkzMiw0Mi4yODg3NDggYyAxLjMyMjQxMywtMS40MDk4NTggMS4yNTE1MjUsLTMuNjI0ODAyIC0wLjE1ODMzNCwtNC45NDcyMTUgTCAzMy4zNzQwNzEsMTcuOTkxNTMxIGMgLTEuNDA5ODU5LC0xLjMyMjQxMyAtMy42MjQ4MDMsLTEuMjUxNTI0IC00Ljk0NzIxNiwwLjE1ODMzNCAtMS4zMjI0MTMsMS40MDk4NTggLTEuMjUxNTI0LDMuNjI0ODAyIDAuMTU4MzM0LDQuOTQ3MjE1IGwgMTguMDg2NjI4LDE2Ljk2NDgyMyB6IgogICAgICAgICBpZD0icGF0aDEiIC8+CiAgICA8L2c+CiAgPC9nPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTMiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6dGl0bGU+RXh0cmEgRXh0cmEgQm9sZCBDaGV2cm9uIERvd248L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg==");
                    mask-size: 100%;
                    mask-repeat: no-repeat;
                    mask-position: center;
                    background-color: black;
                  }
                }

                a.voir-tout {
                  position: relative;
                  width: 55px;
                  padding: 0.25rem;
                  padding-right: 1.5rem;
                  text-transform: capitalize;
                  font-weight: 700;
                  font-size: 1rem;
                  text-underline-offset: 5px;

                  &::before {
                    content: "";
                    position: absolute;
                    right: 0;
                    top: 50%;
                    width: 1rem;
                    height: 1rem;
                    transform: translateY(-50%);
                    mask-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmlld0JveD0iMCAwIDUxIDUxIgogICB2ZXJzaW9uPSIxLjEiCiAgIHg9IjBweCIKICAgeT0iMHB4IgogICBpZD0ic3ZnMyIKICAgc29kaXBvZGk6ZG9jbmFtZT0iY2hldnJvbi5zdmciCiAgIHdpZHRoPSI1MSIKICAgaGVpZ2h0PSI1MSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4zLjEgKDliOWJkYzE0ODAsIDIwMjMtMTEtMjUsIGN1c3RvbSkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMzIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3MyIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOnpvb209IjYuNjcyIgogICAgIGlua3NjYXBlOmN4PSI1MC4wNTk5NTIiCiAgICAgaW5rc2NhcGU6Y3k9IjYyLjUiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwNzkiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjMyIgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iZzEiIC8+CiAgPHRpdGxlCiAgICAgaWQ9InRpdGxlMSI+RXh0cmEgRXh0cmEgQm9sZCBDaGV2cm9uIERvd248L3RpdGxlPgogIDxkZXNjCiAgICAgaWQ9ImRlc2MxIj5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICA8ZwogICAgIHN0cm9rZT0ibm9uZSIKICAgICBzdHJva2Utd2lkdGg9IjEiCiAgICAgZmlsbD0ibm9uZSIKICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgaWQ9ImcyIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNS43OTQzOTQsLTE1LjAzNDA3MSkiPgogICAgPGcKICAgICAgIGZpbGw9IiMwMDAwMDAiCiAgICAgICBpZD0iZzEiPgogICAgICA8cGF0aAogICAgICAgICBkPSJtIDI5LjcwNjM4Miw1OC4xMjkzOTUgYyAtMS4zMjI0MTMsMS40MDk4NTggLTEuMjUxNTI1LDMuNjI0ODAzIDAuMTU4MzMzLDQuOTQ3MjE1IDEuNDA5ODU4LDEuMzIyNDEzIDMuNjI0ODAyLDEuMjUxNTI1IDQuOTQ3MjE1LC0wLjE1ODMzMyBMIDU0LjE2MTkzMiw0Mi4yODg3NDggYyAxLjMyMjQxMywtMS40MDk4NTggMS4yNTE1MjUsLTMuNjI0ODAyIC0wLjE1ODMzNCwtNC45NDcyMTUgTCAzMy4zNzQwNzEsMTcuOTkxNTMxIGMgLTEuNDA5ODU5LC0xLjMyMjQxMyAtMy42MjQ4MDMsLTEuMjUxNTI0IC00Ljk0NzIxNiwwLjE1ODMzNCAtMS4zMjI0MTMsMS40MDk4NTggLTEuMjUxNTI0LDMuNjI0ODAyIDAuMTU4MzM0LDQuOTQ3MjE1IGwgMTguMDg2NjI4LDE2Ljk2NDgyMyB6IgogICAgICAgICBpZD0icGF0aDEiIC8+CiAgICA8L2c+CiAgPC9nPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTMiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6dGl0bGU+RXh0cmEgRXh0cmEgQm9sZCBDaGV2cm9uIERvd248L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg==");
                    mask-size: 100%;
                    mask-repeat: no-repeat;
                    mask-position: center;
                    background-color: black;
                  }
                }
              }

              .logo {
                position: fixed;
                top: var(--burger-btn-et-close-btn-top);
                left: 50%;
                transform: translateX(-50%);

                a,
                span {
                  padding: 0;
                }

                img {
                  height: var(--burger-btn-et-close-btn-height);
                  margin: auto;
                }
              }
            }

            /** 1er ul (ligne principale) **/
            > ul {
              /** 1er li (ligne principale) */
              > li {
                a {
                  justify-content: flex-start;
                }
                /** 2e ul (première colonne) **/
                > ul {
                  left: 100vw;
                  /** 2e li (première colonne) **/
                  > li {
                    /** 3e ul (deuxième colonne) **/
                    > ul {
                      left: 100vw;
                      /** 3e li (deuxième colonne) **/
                      > li {
                        /** 4e ul (troisième colonne) **/
                        > ul {
                          left: 100vw;
                          /** 4e li (troisième colonne) **/
                          > li {
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media (min-width: 600px) {
  html body #header-principale {
    nav.mega-menu {
      #modal-1 {
        .wp-block-navigation__responsive-close {
          .wp-block-navigation__responsive-dialog {
            #modal-1-content {
              /** Ul li a span de façon global **/
              ul {
                align-items: flex-start;
                column-gap: 0;
                padding-bottom: 0;

                li {
                  a {
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    height: 100%;
                    font-weight: 500;

                    span {
                      font-weight: inherit;

                      &.wp-block-navigation-item__description {
                        font-weight: 300;
                        font-size: 0.8rem;
                      }
                    }
                  }

                  &.logo {
                    a {
                      span.wp-block-navigation-item__label {
                        display: flex;
                      }
                    }
                  }
                }
              }

              /** 1er ul (ligne principale) **/
              > ul {
                column-gap: 0.5rem;
                align-items: flex-end;

                /** 1er li (ligne principale) */
                > li {
                  position: unset;
                  padding-left: 0.5rem;
                  padding-right: 0.5rem;
                  margin-left: 0;
                  margin-bottom: 0;
                  border-radius: 4px;

                  &:not(:first-child) {
                    padding-right: 1rem !important;
                  }

                  &:not(:first-child):not(:hover) {
                    position: relative !important;
                  }

                  // Before hover
                  &:not(:first-child):not(:last-child):not(:hover)::before {
                    content: "";
                    display: block !important;
                    width: 2px !important;
                    height: 40px !important;
                    background-color: #d2d2d2 !important;
                    position: absolute !important;
                    left: calc(100% + 3px) !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                  }

                  /** Logo */
                  &:first-child {
                    background-color: transparent;

                    img {
                      width: 250px;
                    }
                  }

                  a {
                    padding-top: 0.5rem;
                    padding-bottom: 0.5rem;
                    padding: 1rem !important;
                    text-decoration: none;

                    &:hover {
                      + button {
                        path {
                          color: white;
                        }
                      }
                    }
                  }

                  &:not(.logo).has-child {
                    &:hover {
                      > a {
                        position: relative;

                        &::before {
                          content: "";
                          width: 2rem;
                          height: 2rem;
                          background-color: var(--wp--preset--color--secondary-700);
                          position: absolute;
                          left: 50%;
                          bottom: -2rem;
                          transform-origin: center;
                          transform: rotate(45deg) translateX(-25%);
                        }
                      }
                    }
                  }

                  /** Tout les ul li a span à partir de la premiere colonne (2e ul) **/
                  ul {
                    background-color: var(--background-color-current-menu-item);
                    transition: none !important;
                    box-shadow: none;
                    row-gap: 0;

                    &:hover {
                      > li > ul {
                        border-left: 2px solid rgba(255, 255, 255, 0.5) !important;
                        margin-left: 0.2rem !important;
                      }
                    }

                    li {
                      &.current-menu-item {
                        > a {
                          text-decoration: underline var(--color-current-menu-item);
                        }

                        &:hover {
                          > a {
                            text-decoration: underline var(--background-current-menu-item);
                          }
                        }
                      }

                      &:hover {
                        background-color: var(--color-current-menu-item);

                        > a,
                        > a > span {
                          color: var(--background-color-current-menu-item);
                          text-decoration: underline var(--color-current-menu-item);
                        }

                        path {
                          color: black !important;
                        }
                      }

                      a {
                        padding: 0.75rem 1rem;
                        span {
                        }
                      }
                    }
                  }

                  /** 2e ul (première colonne) **/
                  > ul {
                    width: calc(100% - 32px);
                    max-width: 1280px;
                    left: 16px;
                    padding: 3rem;
                    min-height: 700px !important;

                    .viewer-image {
                      display: none;
                    }

                    @media (min-width: 1280px) {
                      left: calc((100vw - 1280px) / 2);

                      .viewer-image {
                        position: absolute;
                        right: 3rem;
                        top: 50%;
                        transform: translateY(-50%);
                        display: flex;
                        align-items: center;
                      }
                    }

                    /** 2e li (première colonne) **/
                    > li {
                      > ul {
                        padding-left: 0.5rem;
                        padding-top: 0;
                        width: 100%;

                        /** Tout les ul li a span à partir de la deuxième colonne (3e ul) **/
                        li {
                          width: calc(100% + 0.5rem);
                        }
                      }

                      a {
                        align-items: flex-start;

                        &,
                        & > span,
                        & + button {
                          color: var(--color-current-menu-item);
                        }

                        & + button {
                          width: 1.3rem;
                          height: 1.3rem;
                          background-color: var(--color-current-menu-item);
                          border-radius: 100%;
                          color: var(--background-color-current-menu-item);

                          svg {
                            width: 0.9rem;
                            height: 0.9rem;
                            position: relative;
                            left: 1px;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

```

Lancer npm run start pour compiler tout ça et voir le résultat dans le navigateur.

# Mise en place Méga Menu
1. Ajouter les différents code ci-dessus.
2. Créer un menu wordpress classique.
3. Ajouter la classe CSS `mega-menu` sur le bloc core/navigation.
4. Pour avoir un logo dans le menu il faut utiliser le champs `titre de navigation` et mettre une image <img src="chemin-de-image" />. Ajouter la classe `logo` sur ce block.``
5. ATTENTION: le menu doit etre géré uniquement depuis le bloc core/navigation dans la section HEADER sinon il faudra le réimporter a chaque fois.
6. Comment doit-je remplir les liens du header ?
  * `Texte`: C'est le texte affiché sur le lien.
  * `Lien`: Lien vers la page de destination
  * `Description`: description affiché uniquement si le lien n'a pas d'enfant (bloc wordpress fonctionne ainsi).
  * `Attribut rel`: image qui sera affiché au survol du lien dans le méga menu desktop.
    
