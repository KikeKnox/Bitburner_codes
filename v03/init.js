/** @param {NS} ns */
export async function main(ns) {
	//Llamadas que tienen que correr si o si
	ns.run("hacknet.js");
	ns.run("servermasmas.js");
	
	//VARIABLES
	var servis = ["home", "foodnstuff"];
	var isNuked = [true, false];
	var isFaction = [false, false];
	var numPorts = [5, 0];
	var numPrograms = 0;
	var numPrograms_ant = -1;
	var flg = false;
	var allNuked = false;
	var brutExist = false;
	var ftpExist = false;
	var relaExist = false;
	var httpExist = false;
	var sqlExist = false;
	var plyCores = ns.getServer("home").cpuCores;
	var homeHacks = (ns.getServer("home").maxRam - 30) / (plyCores * ns.getScriptRam("kike.js", "home")); //Dejo 30 de RAM libre para otros programas
	var serTemp;
	var i = 0;
	var n;
	var cod = await ns.read("kike.js");

	//Creacion de arrays inicial
	while (!flg) {
		//Escaneo desde el server
		serTemp = ns.scan(servis[i]);

		//Recorrer el array obtenido entero
		for (n = 0; n < serTemp.length; n++) {
			if (servis.indexOf(serTemp[n]) == -1) {
				//Si el nombre del servidor no esta guardado en el array, se anade
				servis.push(serTemp[n]);
				isNuked.push(ns.hasRootAccess(serTemp[n]));
				numPorts.push(ns.getServerNumPortsRequired(serTemp[n]));
				if (ns.getServerSecurityLevel(serTemp[n]) == 0 && ns.getServerMoneyAvailable(serTemp[n]) == 0) {
					isFaction.push(true);
				} else {
					isFaction.push(false);
				}
			}
		}
		//Determinar si se sigue con el siguiente o se acaba
		if (i < servis.length - 1) {
			i++;
		} else {
			flg = true;
		}
	}

	ns.tprint("Servidores encontrados: " + servis.length);

	//Calculo del peso de los scripts y si va a dar con todos los cores
	while (homeHacks < servis.length && plyCores > 1) {
		//Si el numero de programas es menor a lo que nos puede dar la ram se reducen los cores
		plyCores--;
		homeHacks = (ns.getServer("home").maxRam - 30) / (plyCores * ns.getScriptRam("kike.js", "home"));
	}

	//BUCLE DE EJECUCION CONTINUA
	while (!allNuked) {
		//setup del bucle
		allNuked = true;
		numPrograms = 0;

		//Seccion de nukeo
		//Primero se comprueba si hay algun programa nuevo
		if (ns.fileExists("BruteSSH.exe", "home")) {
			numPrograms++;
			brutExist = true;
		}
		if (ns.fileExists("FTPCrack.exe", "home")) {
			numPrograms++;
			ftpExist = true;
		}
		if (ns.fileExists("relaySMTP.exe", "home")) {
			numPrograms++;
			relaExist = true;
		}
		if (ns.fileExists("HTTPWorm.exe", "home")) {
			numPrograms++;
			httpExist = true;
		}
		if (ns.fileExists("SQLInject.exe", "home")) {
			numPrograms++;
			sqlExist = true;
		}

		//En caso de que se tenga mas programas que antes se pasa un bucle de nukeo
		if (numPrograms != numPrograms_ant) {
			ns.tprint("Detectados nuevos archivos. Iniciando nukeo");
			for (n = 1; n < isNuked.length; n++) {
				if (numPrograms >= numPorts[n] && !isNuked[n]) {
					ns.tprint("Servidor a nukear: " + servis[n]);
					if (brutExist) {
						ns.brutessh(servis[n]);
					}
					if (ftpExist) {
						ns.ftpcrack(servis[n]);
					}
					if (relaExist) {
						ns.relaysmtp(servis[n]);
					}
					if (httpExist) {
						ns.httpworm(servis[n]);
					}
					if (sqlExist) {
						ns.sqlinject(servis[n]);
					}
					ns.nuke(servis[n]);
					isNuked[n] = true;

					//Inicio de los scripts de hackeo
					if (!isFaction[n]) {
						//Ejecucion en local
						var path = "/codes/" + servis[n] + ".js"
						if (!ns.fileExists(path)) {
							//Si no existe el archivo
							await ns.write(path, cod, "w");
						}
						ns.exec(path, "home", plyCores, servis[n]);

						//Ejecucion en el server hackeado
						await ns.scp("whilhack.js", servis[n]);
						ns.exec("whilhack.js", servis[n], "1", servis[n]);

						//Ejecucion en los servers comprados
						/* NOTA: Como los cabrones van a ser comprados por su cuenta
						es mas facil meter esta parte en su propio codigo*/
					}
				}
			}
			ns.tprint("Servidores nukeados y con script copiado y corriendo");
		}

		//Actualizar los anteriores para la siguiente pasada
		numPrograms_ant = numPrograms;

		//Final del bucle: comprobar si se acaba el programa
		for (n = 0; n < isNuked.length; n++) {
			if (!isNuked[n]) {
				//Si ademas no esta nukeado se sigue con la parte de nukeos
				allNuked = false;
			}

		}
		await ns.sleep(10);
	}
}