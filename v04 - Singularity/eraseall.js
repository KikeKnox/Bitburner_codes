/** @param {NS} ns */
export async function main(ns) {
	var arch = ns.ls("home",".js");
	var whiteList = ["hacknet","init","pruebas","kike","eraseall"];
	var erase = true;
	var erased = 0;

	for(var i=0;i<arch.length;i++){
		erase = true;
		for(var j=0;j<whiteList.length;j++){
			if(arch[i]==whiteList[j] + ".js"){
				erase = false;
			}
		}
		if(erase){
			ns.rm(arch[i],"home");
			erased++;
		}
	}
	ns.tprint("Archivos borrados: " + erased);	
}