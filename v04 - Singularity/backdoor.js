/** @param {NS} ns */
export async function main(ns) {
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
				if (serTemp[r].substr(0, 7) == "Server_") {
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

	ns.tprint("Se han encontrado " + totalServers + " servidores de los cuales " + notBcDr + " aun tienen que instalar backdoor");
	ns.tprint("Objetivo a backdoorear: " + servis[objetive[0]][objetive[1]]);
	ns.tprint("Nivel requerido: " + lvlObjetive);

	//Bucle de ejecucion continua
	while (!allBcDr) {
		//Se comprueba que el nivel alcance para hacer un backdoor
		if (ns.getHackingLevel() >= lvlObjetive) {
			path = [];
			allBcDr = true;
			//Camino del dolor
			path[0] = servis[objetive[0]][objetive[1]];
			ns.tprint("Objetivo a backdoorear: " + path[0]);
			ns.tprint("Nivel requerido: " + lvlObjetive);
			for (var i = 1; i < objetive[0]; i++) {
				serTemp = ns.scan(path[i - 1]);
				for (var n = 0; n < serTemp.length; n++) {
					if (servis[objetive[0] - i].indexOf(serTemp[n]) != -1) {
						path.push(serTemp[n]);
					}
				}
			}
			i--;
			while (i >= 0) {
				ns.singularity.connect(path[i]);
				i--;
			}
			await ns.singularity.installBackdoor();
			isBcDr[objetive[0]][objetive[1]] = ns.getServer(servis[objetive[0]][objetive[1]]).backdoorInstalled;
			if (isBcDr[objetive[0]][objetive[1]]) {
				notBcDr--;
				ns.tprint("Objetivo backdooreado. Quedan " + notBcDr);
			} else {
				ns.tprint("NO SE HA PODIDO BACKDOREAR. REVISAR CODIGO");
				ns.singularity.connect("home");
				ns.exit();
			}

			//Buscar el nuevo objetivo
			lvlObjetive = 800000000000000;
			for (var row = 1; row < servis.length; row++) {
				for (var col = 0; col < servis[row].length; col++) {
					if (!isBcDr[row][col]) {
						//Si queda algun sin backdoor, se repite el algoritmo
						allBcDr = false;
						if (hcklvl[row][col] <= lvlObjetive) {
							//Ademas se convierte en objetivo el que menos nivel tenga
							objetive = [row, col];
							lvlObjetive = hcklvl[row][col];
						}
					}
				}
			}
			ns.singularity.connect("home");
		}

		//Comprobacion de invitaciones
		var invitations = ns.singularity.checkFactionInvitations;
		if (invitations.length > 0) {
			for (var z = 0; z < invitations.length; z++) {
				ns.singularity.joinFaction(invitations[z]);
			}
		}

		//Espera antes de volver a empezar
		await ns.sleep(100);
	}
}