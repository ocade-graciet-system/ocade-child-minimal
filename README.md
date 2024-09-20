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
          top: var(--burger-btn-et-close-btn-top);
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
                align-items: stretch;
                column-gap: 0;

                li {
                  &:hover {
                    &:not(.logo) {
                      text-decoration: underline var(--background-color-current-menu-item) !important;
                      text-underline-offset: 5px;
                    }
                  }

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
                /** 1er li (ligne principale) */
                > li {
                  position: unset;
                  padding-left: 2rem;
                  padding-right: 2rem;
                  border-radius: 4px;

                  a {
                    padding-top: 0.5rem;
                    padding-bottom: 0.5rem;
                  }

                  &:not(.logo).has-child {
                    &:hover {
                      > a {
                        position: relative;

                        &::before {
                          content: "";
                          width: 2rem;
                          height: 2rem;
                          background-color: var(--background-color-current-menu-item);
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
                    min-height: 400px;

                    @media (min-width: 1280px) {
                      left: calc((100vw - 1280px) / 2);
                    }

                    .viewer-image {
                      position: absolute;
                      right: 3rem;
                      top: 50%;
                      transform: translateY(-50%);
                      display: flex;
                      align-items: center;
                    }

                    /** 2e li (première colonne) **/
                    > li {
                      width: calc((100% - 32px) / 4);

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

                      /** Tout les ul li a span à partir de la deuxième colonne (3e ul) **/
                      ul {
                        li {
                          a {
                            width: 200px;

                            span {
                            }
                          }
                        }
                      }

                      /** 3e ul (deuxième colonne) **/
                      > ul {
                        /** 3e li (deuxième colonne) **/
                        > li {
                          /** 4e ul (troisième colonne) **/
                          > ul {
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
}
```

Lancer npm run start pour compiler tout ça et voir le résultat dans le navigateur.
