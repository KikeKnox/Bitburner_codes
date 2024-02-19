/** @param {NS} ns */
export async function main(ns) {
    let target = ns.args[0];
    let cores = ns.args[1] || 1;
    let opts = {
      threads: cores,
    }
    let moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    let securityThresh = ns.getServerMinSecurityLevel(target) + 2;
    let securityLevel = ns.getServerRequiredHackingLevel(target);
    while (true) {
      if (securityLevel > ns.getHackingLevel() || !ns.hasRootAccess(target)) {
        await ns.sleep(1000);
        continue;
      }
      if (ns.getServerSecurityLevel(target) > securityThresh) {
        await ns.weaken(target, opts);
      }
      if (ns.getServerMoneyAvailable(target) < moneyThresh) {
        await ns.grow(target, opts);
      }
      await ns.hack(target, opts);
    }
  }