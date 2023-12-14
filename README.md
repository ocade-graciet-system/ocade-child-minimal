# Ocade Child Minimal

![Readme](./readme.png)

Thème Wordpress enfant by Ocade Système.

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

themes/
└── montgolfiere-sensation/
    └── registerBlocksStyles/
        ├── registerBlocksStyles.js
        └── registerBlocksStyle.php


php


### Intégration dans `function.php`
Inclure le fichier `registerBlocksStyles` dans le fichier `functions.php` du thème enfant.

### Étapes de Personnalisation

#### 1. Ajouter le Hook pour Personnaliser le Block Editor
```php
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

2. Ajouter la Logique de Customisation dans le Fichier JavaScript

js

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
