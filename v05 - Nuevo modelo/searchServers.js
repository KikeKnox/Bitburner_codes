/** @param {NS} ns */
export async function main(ns) {
    //Archivo para escanear y sacar los servidores
	let servis = [["home"]];
	let isBcDr = [[true]];
	let hckLvl = [[0]];
	let cont = [0, 0];
	let serTemp;
	let totalServers = 1;


	//Creacion de arrays inicial
	//Analisis de servidores en matricial
	for (cont[0] = 0; cont[0] < servis.length; cont[0]++) {
		//Se crea la linea siguiente vacia para rellenar
		servis[cont[0] + 1] = [];
		isBcDr[cont[0] + 1] = [];
		hckLvl[cont[0] + 1] = [];
		isNuked[cont[0] + 1] = [];
		nmbPort[cont[0] + 1] = [];
		//Recorrer las columnas
		for (cont[1] = 0; cont[1] < servis[cont[0]].length; cont[1]++) {
			//Escanear cada servidor
			serTemp = ns.scan(servis[cont[0]][cont[1]]);
			isBcDr[cont[0]][cont[1]] = ns.getServer(servis[cont[0]][cont[1]]).backdoorInstalled;
			hckLvl[cont[0]][cont[1]] = ns.getServerRequiredHackingLevel(servis[cont[0]][cont[1]]);
			isNuked[cont[0]][cont[1]] = ns.getServer(servis[cont[0]][cont[1]]).hasAdminRights;
			nmbPort[cont[0]][cont[1]] = ns.getServer(servis[cont[0]][cont[1]]).numOpenPortsRequired;

			//Si no tiene backdoor se anade a la lista
			if (!isBcDr[cont[0]][cont[1]]) notBcDr++;

			//Analizar lo escaneado para ver si se puede agregar
			let r = 0;
			while (r < serTemp.length) {
				if (serTemp[r].substr(0, 7) == "Server_" || serTemp[r] == "darkweb") {
					serTemp.splice(r, 1);
				} else {
					for (let z = 0; z <= cont[0] + 1; z++) {
						if (servis[z].indexOf(serTemp[r]) != -1) {
							serTemp.splice(r, 1);
						}
					}
					r++;
				}
			}
			if (serTemp.length > 0) {
				for (let z = 0; z < serTemp.length; z++) {
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
