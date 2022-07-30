/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0];
    var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 2;
    var reqHackLvl = ns.getServerRequiredHackingLevel(target);
    while(true) {
        if(ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
        }
        if(ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target);
        }
        if(ns.getHackingLevel() >= reqHackLvl){
            await ns.hack(target);
        }
        await ns.sleep(1);  //Sleep de emergencias
    }
}