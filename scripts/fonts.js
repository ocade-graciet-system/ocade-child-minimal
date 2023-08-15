/** Execution d'une commande dans un shell */
const { execSync } = require("child_process");
/** Travailler avec des fichier/dossiers */
const fs = require("fs");
const readline = require("readline");
const downloadFonts = require("./downloadFonts");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/** Poser une question à l'utilisateur */
const question = (text, fallback = "") => {
  return new Promise((resolve) => {
    text = "◼ " + text;
    text = fallback.length ? text + " (" + fallback + ")" : text;
    text += "\n    ▸ ";
    rl.question(text, (answer) => {
      setTimeout(() => {
        if (answer.length) {
          resolve(answer);
        } else {
          resolve(fallback);
        }
      }, 300);
    });
  });
};


/** Créer un dossier */
const createFolder = async (path, ecrase = false) => {
  if (!fs.existsSync(path) || (fs.existsSync(path) && ecrase)) {
    fs.mkdirSync(path, { recursive: true });
  } else {
    console.log("Le dossier existe déjà");
    /** Demander si on veut supprimer le dossier existant */
    const deleteFolder = (await question("🗑 Supprimer le dossier existant ? (y/N)")).toLowerCase() === "y";
    if (deleteFolder) {
      execSync(`rm -rf ${path}`);
      await createFolder(path, ecrase);
    } else process.exit(0);
  }
};

(async () => {

/****************************************************** */
/************ Début Fonts Manuelle ******************** */
/****************************************************** */
/** Gestion du fichier fonts.css pour les fonts non Google Fonts.
 * Placer les fichiers de fonts préalablement téléchargé dans le dossier "./fonts" (créer le dossier si inexistant).
 * Le nom des fichiers ne doivent pas commencer par xxx_ (xxx_ est réservé pour les fonts Google Fonts), et ne seront pas prise en compte.
 * Le nom des fichiers devrait respecter la syntaxe suivante: nom-de-la-font.extension
 * Ex: palatino.ttf
 * Ex: fonseca-bold.otf
 * ...
 */
  let fileFontCss = '@charset "utf-8";\n\n';
  const formats = {
    "eot": "embedded-opentype",
    "woff2": "woff2",
    "woff": "woff",
    "ttf": "truetype",
    "svg": "svg",
    "otf": "opentype",
    "ttc": "truetype"
  }

  const fontFamilies = {};

  // Existe-il un dossier nommé "fonts" ?
  if (!fs.existsSync('./fonts')) {
    // Non, on le crée
    fs.mkdirSync('./fonts')
  } else {
    // Oui, pour chaque fichier dans ce dossier
    fs.readdirSync('./fonts').forEach((file) => {
      // Ignorer les fichiers qui commencent par trois chiffres suivis d'un underscore
      if (/^\d{3}_/.test(file)) return; // Ignore ce fichier et passe à l'itération suivante car Google Font
      // Si exist le fichier fonts.css on stock sont contenu dans la variable fileFontCss
      if (file === 'fonts.css') {
        fileFontCss = '';  
        fileFontCss += fs.readFileSync('./fonts/fonts.css', 'utf8');
      }
      const extension = file.split('.')[1];
      const familyName = file.split('.')[0];

      // Si l'extension est incluse dans la liste des extensions de font supportées
      if (formats[extension]) {
        // On ajoute à l'objet fontFamilies le code CSS 
        // @font-face pour chaque famille de font
        if (!fontFamilies[familyName]) fontFamilies[familyName] = [];
        fontFamilies[familyName].push(`url("./${file}") format("${formats[extension]}")`);
      }
    });

    const existingFontFaces = new Set(fileFontCss.match(/@font-face\s*{[^}]*}/g) || []);

    // Parcourir l'objet fontFamilies et générer le CSS
    for (const familyName in fontFamilies) {
      const fontFaceDeclaration = `@font-face {
      font-family: "${familyName}";
      src: ${Array.from(fontFamilies[familyName]).join(',\n       ')};
    }`;

      if (!existingFontFaces.has(fontFaceDeclaration)) fileFontCss += fontFaceDeclaration + '\n';
    }

    // Ecrire le fichier fonts.css
    fs.writeFileSync('./fonts/fonts.css', fileFontCss);
  }
  /****************************************************** */
  /************** Fin Fonts Manuelle ******************** */
  /****************************************************** */



  /****************************************************** */
  /******************** Fonts Google ******************** */
  /****************************************************** */
  /** Demande de téléchargement automatique des fonts */
  const WantDownloadFonts = (await question("🖋  Voulez-vous télécharger des Google Fonts ? (y/N)")).toLowerCase() === "y";
  if (WantDownloadFonts) {
    /** Demander la listes des Google Fonts à télécharger */
    const fonts = await question("📜  Liste des noms des Google Fonts à télécharger (séparé par une virgule. Ex: Roboto, Open Sans, ...) : ");
    const arrayFonts = fonts.split(",");
    const arrayFontsToDownload = arrayFonts.map((font) => {
      return {
        name: font.trim(),
        weights: [300, 400, 500, 600, 700, 800, 900],
        style: ["normal", "italic"],
      };
    });
    /** Récupérer le contenu du fichier ./fonts/font.css si existe */
    fileFontCss = '@charset "utf-8";\n\n';
    if (fs.existsSync("./fonts/fonts.css")) fileFontCss = fs.readFileSync("./fonts/fonts.css", "utf8");
    await downloadFonts(arrayFontsToDownload, fileFontCss);
    /** Informer que les fonts on été téléchargées */
    console.log("📦  Les fonts ont été téléchargées");
  }
  /** Fin du script */
  process.exit(0);
})();