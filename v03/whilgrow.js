/** @param {NS} ns */
export async function main(ns) {
	var trg = ns.args[0];

	while(true){
		if(ns.hasRootAccess(trg)){
			await ns.grow(trg);
		}
		else{
			await ns.sleep(1);
		}
	}
}