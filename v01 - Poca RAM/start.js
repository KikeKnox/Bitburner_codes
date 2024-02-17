/** @param {NS} ns */
export async function main(ns) {
  let homeRAM = ns.getServer("home").maxRam;
  let allFiles = ns.ls("home");
  let jsFiles = [];

  for (let file of allFiles) {
    if (file.endsWith(".js") && file.startsWith("NIN")) {
      jsFiles.push(file);
    }
  }
  jsFiles.sort();
  ns.atExit(job(ns, homeRAM, jsFiles));
}
export async function job(ns, homeRAM, jsFiles) {
  for (let file of jsFiles) {
    if (ns.getScriptRam(file) > homeRAM) {
      break;
    } else {
      ns.run(file);
      homeRAM -= ns.getScriptRam(file)
    }
  }
}