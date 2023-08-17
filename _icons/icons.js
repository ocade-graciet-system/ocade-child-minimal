const path = require("path");
const { writeFileSync } = require("fs");
const { readdir } = require("fs/promises");
  /*
   * ICON GENERATOR
   *
   * icon stylesheet is automatically generated based on content of ./icons folder
   */
const autoIcons = async (noAutoIcons) => {
  //~ get default style
  let css = `/* automatically generated. do not edit */
@import './config.scss';

.icon {
  @include icon-base();
`;
  //~ get icon list
  const fileList = (
    await readdir(path.resolve("./_icons/"))
  ).filter(
    (e) => !["scss", "gitkeep", "json"].includes(e.split(".")[1])
  );
  //~ create separate css rules
  fileList.forEach((icon) => {
    let suffix =
    icon.split(".")[1] === "svg" ? "" : ', "' + icon.split(".")[1] + '"';
    let cssRule = `
  
  &.${icon.split(".")[0]}, &.${icon.split(".")[0]}::after {
    @include icon("${icon.split(".")[0]}"${suffix});
  }`;
    css += cssRule;
  });
  css += `
}`;
  //~ write file
  writeFileSync(path.resolve("./styles/scss/icons.scss"), css);
};

if (require.main === module) {
  autoIcons();
}
module.exports = autoIcons;