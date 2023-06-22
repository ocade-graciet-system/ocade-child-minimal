const { execSync } = require("child_process");
const fs = require("fs");

const fontsPath = "./fonts";
const userAgents = ["Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36",];

const CSStoJSON = (css) => {
  let json = [];
  css
    .replace(/^\s*/gm, "")
    .replace(/;$/gm, "")
    .replace(/}\n?$/g, "")
    .split(/(}?\n?)?(\/\* \w*-?\w* \*\/\n)?(@font-face {\n)/g)
    .filter(str => {
      return ((typeof str !== "undefined")
      && (str.trim().length > 0)
      && (str.match(/(}\n|\/\* \w*-?\w* \*\/\n|@font-face {\n)/g) === null))
    })
    .map(str => {
      return str
        .split("\n")
        .filter(str => str.length && str !== "}");
    })
    .forEach(fontface => {
      let properties = {};
      fontface.forEach(e => {
        const key = e.slice(0, e.indexOf(":")).trim();
        const value = e.slice(e.indexOf(":")+1).trim();
        properties[key] = key === "src" ? [value] : value;
      });
      json.push(properties);
    });
  return json;
}

// Vérifier si le dossier existe déjà, si oui on supprime le dossier
const createFolder = (path, rm=false) => {
  if (rm && fs.existsSync(path)) fs.rm(path, { recursive: true });
  try { return fs.mkdirSync(path); }
  catch (e) {}
}

const write = (dest, data) => {
  try {
    fs.writeFileSync(dest, data, { 
      encoding: "utf8"
    });
  } catch(e) {
    console.error("failed writing to file", dest);
    console.errro(e);
  }
}

/**
 * @description Télécharger la font Google 
 * @params **url**: url à curl
 * @params **dest**: dossier de destination
 * @return boolean
 * @tags download
 */
const getFont = async (url, dest) => {
  try {
    execSync(`curl -s "${url}" --output "${dest}" -A ""`);
    return true;
  } catch (e) {
    console.error("failed download", e);
    return false;
  }
};

const fontHasStyles = (font) => {
  return (font.styles
  && font.styles.length
  && (!(font.styles.includes("regular") && font.styles.length === 1)))
}

const getUrlParam = (font) => {
  let url = "family="+font.name.trim().replace(/\s/g, "+")+":";
  let weight = [];
  if (fontHasStyles(font)) {
    url += font.styles.filter(e => e !== "regular").join(",")+",";
    indexModificator = font.styles.includes("regular") ? 0 : 1;
    font.styles.forEach((style, index) => {
      if (font.variable) {
        weight.push((index+indexModificator)+","+font.weights.join(".."));
      } else {
        weight.push(font.weights.map(w => {
          return (index+indexModificator)+","+w;
        }));
      }
    });
    weight = weight.flat().join(";");
  } else {
    weight.push(...font.weights);
    weight = weight.join(font.variable ? ".." : ";");
  }
  url += "wght@";
  url += weight;
  return url;
}

const findFont = (fonts) => {
  return ((fonts[0]["font-family"] === fonts[1]["font-family"])
    && (fonts[0]["font-weight"] === fonts[1]["font-weight"])
    && (fonts[0]["unicode-range"] === fonts[1]["unicode-range"])
    && (fonts[0]["font-style"] === fonts[1]["font-style"]));
}

const mergeSources = (jsons) => {
  jsons[0].forEach(fontface => {
    try {
      jsons[1].find(f => findFont([f, fontface])).src.push(...fontface.src);
    } catch {
      jsons[1].push(fontface);
    }
  });
  return jsons[1];
}

const downloadFonts = async (fonts) => {
  createFolder(fontsPath);
  const url = "https://fonts.googleapis.com/css2?"+fonts.map(e => getUrlParam(e)).join("&")+"&display=swap";
  console.log("  GFonts API URL:\n"+url);
  let fontCss = '@charset "utf-8";\n\n';
  let fontsJson = [];
  for (const userAgent of userAgents) {
    const rep = await fetch(url, { headers: { "User-Agent": userAgent } });
    if (!rep.ok) {
      console.error(`🆘 couldn't fetch google fonts api`, rep);
      return;
    }
    let result = await rep.text();
    result = CSStoJSON(result);
    mergeSources([result, fontsJson]);
  }

  const JsonForCSS = JSON.parse(JSON.stringify(fontsJson));
  for (const fontfaceIndex in fontsJson) {
    let fontface = fontsJson[fontfaceIndex];
    for (const srcIndex in fontface.src) {
      const src = fontface.src[srcIndex];
      const url = [...src.matchAll(/^url\((.*?)[#)]/g)][0][1];
      let filename = url.includes("?")
        ? url.split(/[=&]/g)[1]+".svg"
        : url.split("/").reverse()[0];
      filename = fontface["font-weight"]+"_"+filename;
      if (!fs.existsSync(fontsPath+"/"+filename)) {
        if (await getFont(url, fontsPath+"/"+filename, "")) {
          console.info(`✅ ${url}`)
        } else {
          console.error(`❌ ${url}`);
        }
      } else {
        console.log("⏭️ "+filename+" skipped");
      }
      let newSrc = src.replace(url, "./"+filename);
      JsonForCSS[fontfaceIndex].src[srcIndex] = newSrc;
      fontface.src[srcIndex] = newSrc;
    }
    JsonForCSS[fontfaceIndex].src = JsonForCSS[fontfaceIndex].src.join(",\n       ");
    fontCss += "@font-face {\n  "
    fontCss += Object.entries(JsonForCSS[fontfaceIndex])
      .map(([key, value]) => key+": "+value)
      .join(";\n  ")+";\n}\n\n";
    fontface.src = fontface.src.map(e => {
      e = e.replace("url(", "");
      e = e.replace(/\)(.*)$/, "");
      return e;
    });
  }
  /** Ecriture du contenu CSS avec les nouveaux liens dans le fichier font.css */
  write("./fonts/fonts.css", fontCss);
};

if (require.main === module) {
  (async () => {
    await autoHebergementFonts([
      {
        name: "Open Sans",
        weights: [300,400,500,600, 700],
        variable: false,
        styles: ["regular"]
      }
    ]); 
  })();
}
module.exports = downloadFonts;
