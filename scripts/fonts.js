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
  /** Demande de téléchargement automatique des fonts */
  const WantDownloadFonts = (await question("🖋  Voulez-vous télécharger les fonts ? (y/N)")).toLowerCase() === "y";
  if (WantDownloadFonts) {
    /** Demander la listes des Google Fonts à télécharger */
    const fonts = await question("📜  Liste des fonts à télécharger (séparé par une virgule) : ");
    const arrayFonts = fonts.split(",");
    const arrayFontsToDownload = arrayFonts.map((font) => {
      return {
        name: font.trim(),
        weights: [300, 400, 500, 600, 700, 800, 900],
        style: ["normal", "italic"],
      };
    });
    await downloadFonts(arrayFontsToDownload);
    /** Informer que les fonts on été téléchargées */
    console.log("📦  Les fonts ont été téléchargées");
  }
  /** Fin du script */
  process.exit(0);
})();