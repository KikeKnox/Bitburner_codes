/** @param {NS} ns */
export async function main(ns) {
	var trg = ns.args[0];

	while(true){
		if(ns.getHackingLevel() < ns.getServerRequiredHackingLevel(trg) || !ns.hasRootAccess(trg)){
			await ns.sleep(1);
		}else{
			await ns.hack(trg);
		}
	}
}