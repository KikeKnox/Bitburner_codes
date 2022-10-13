/** @param {NS} ns */
export async function main(ns) {
    //Archivo para escanear y sacar los servidores
	var servis = [["home"]];
	var isBcDr = [[true]];
	var hcklvl = [[0]];
	var cont = [0, 0];
	var serTemp;
	var lvlObjetive = 800000000000000;
	var objetive = [0, 0];
	var notBcDr = 0;
	var totalServers = 1;
	var allBcDr = false;
	var path = [];

	//log
	ns.tail("backdoor.js");

	//Creacion de arrays inicial
	//Analisis de servidores en matricial
	for (cont[0] = 0; cont[0] < servis.length; cont[0]++) {
		//Se crea la linea siguiente vacia para rellenar
		servis[cont[0] + 1] = [];
		isBcDr[cont[0] + 1] = [];
		hcklvl[cont[0] + 1] = [];
		//Recorrer las columnas
		for (cont[1] = 0; cont[1] < servis[cont[0]].length; cont[1]++) {
			//Escanear cada servidor
			serTemp = ns.scan(servis[cont[0]][cont[1]]);
			isBcDr[cont[0]][cont[1]] = ns.getServer(servis[cont[0]][cont[1]]).backdoorInstalled;
			hcklvl[cont[0]][cont[1]] = ns.getServerRequiredHackingLevel(servis[cont[0]][cont[1]]);

			//Si no tiene backdoor se anade a la lista
			if (!isBcDr[cont[0]][cont[1]]) {
				notBcDr++;
				//Si ademas es inferior al nivel objetivo de ataque guardado actualmente, se actualiza el objetivo
				if (hcklvl[cont[0]][cont[1]] < lvlObjetive) {
					lvlObjetive = hcklvl[cont[0]][cont[1]];
					objetive[0] = cont[0];
					objetive[1] = cont[1];
				}
			}

			//Analizar lo escaneado para ver si se puede agregar
			var r = 0;
			while (r < serTemp.length) {
				if (serTemp[r].substr(0, 7) == "Server_" || serTemp[r] == "darkweb") {
					serTemp.splice(r, 1);
				} else {
					for (var z = 0; z <= cont[0] + 1; z++) {
						if (servis[z].indexOf(serTemp[r]) != -1) {
							serTemp.splice(r, 1);
						}
					}
					r++;
				}
			}
			if (serTemp.length > 0) {
				for (var z = 0; z < serTemp.length; z++) {
					servis[cont[0] + 1].push(serTemp[z]);
					totalServers++;
				}
				if (servis[cont[0] + 1][0].length == 0) {
					servis[cont[0] + 1].slice(0, 1);
				}

			}

		}
		//Si la linea se mantiene vacia al recorerlo todo, es porque ya se tienen todos los servidores
		if (servis[cont[0] + 1].length == 0) {
			servis.splice(servis.length - 1, 1);
		}
	}

}