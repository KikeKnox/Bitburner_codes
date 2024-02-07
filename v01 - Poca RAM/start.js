/** @param {NS} ns */
export async function main(ns) {
    let homeRAM = ns.getServer("home").maxRam;
    let totalScriptRAM = ns.getScriptRam("hacknet.js") + ns.getScriptRam("general.js");
    ns.atExit(job(ns, totalScriptRAM <= homeRAM));
}
export async function job(ns, bool){
    ns.run("general.js");
    ns.run("hacknet.js");
}