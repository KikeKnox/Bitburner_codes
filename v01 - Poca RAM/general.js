/** @param {NS} ns */
export async function main(ns) {
	//VARIABLES
	var servis = ["home"];
	var isHacked = [true];
	var isNuked = [true];
	var numPorts = [5];
	var reqHackLvl = [0];
	var numPrograms = 0;
	var numPrograms_ant = -1;
	var flg = false;
	var allIsHacked = false;
	var allNuked = false;
	var brutExist = false;
	var ftpExist = false;
	var relaExist = false;
	var httpExist = false;
	var sqlExist = false;
	var plyHack = 0;
	var serTemp;
	var i = 0;
	var n;
	var cod = await ns.read("hacked.js");
  
	//Creacion de arrays inicial
	while (!flg) {
	  //Escaneo desde el server
	  serTemp = ns.scan(servis[i]);
  
	  //Recorrer el array obtenido entero
	  for (n = 0; n < serTemp.length; n++) {
		if (servis.indexOf(serTemp[n]) == -1) {
		  //Si el nombre del servidor no esta guardado en el array, se anade
		  servis.push(serTemp[n]);
		  isHacked.push(false);
		  isNuked.push(ns.hasRootAccess(serTemp[n]));
		  numPorts.push(ns.getServerNumPortsRequired(serTemp[n]));
		  reqHackLvl.push(ns.getServerRequiredHackingLevel(serTemp[n]));
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
  
	//BUCLE DE EJECUCION CONTINUA
	while (!allIsHacked) {
	  //setup del bucle
	  allIsHacked = true;
	  numPrograms = 0;
	  plyHack = ns.getHackingLevel();
  
	  //Seccion de nukeo
	  if (!allNuked) {
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
			  if (ns.getServerMaxMoney(servis[n]) > 0) {
				if (ns.getServerSecurityLevel(servis[n]) > 0 && ns.getServerMaxRam(servis[n]) > 0) {
				  //Por ahora los que no tienen ram no los voy a hackear. Mas adelante lo hare en local
				  await ns.scp("hacked.js", servis[n]);
				  ns.exec("hacked.js", servis[n], "1", servis[n]);
				}
				else if (ns.getServerMaxRam(servis[n]) == 0) {
				  if (!ns.fileExists(servis[n] + ".js")) {
					//Si tiene RAM 0 y no existe el archivo
					await ns.write(servis[n] + ".js", cod, "w");
				  }
				  ns.exec(servis[n] + ".js", "home", 1, servis[n]);
				}
			  }
			}
		  }
		}
	  }
  
	  //Seccion de hack
	  for (n = 0; n < isHacked.length; n++) {
		if (!isHacked[n] && plyHack >= reqHackLvl[n] && isNuked[n]) {
		  ;
		  if (ns.getServerMaxMoney(servis[n]) == 0) {
			//Los servidores de facciones no tienen dinero
			isHacked[n] = true;
		  } else if (ns.getServerMaxRam(servis[n]) > 0) {
			//Por ahora los que no tienen ram no los voy a hackear. Mas adelante lo hare en local
			await ns.scp("hacked.js", servis[n]);
			ns.exec("hacked.js", servis[n], "1", servis[n]);
		  }
		}
	  }
	  //Actualizar los anteriores para la siguiente pasada
	  numPrograms_ant = numPrograms;
  
	  //Final del bucle: comprobar si se acaba el programa
	  for (n = 0; n < isHacked.length; n++) {
		if (!isHacked[n]) {
		  //Si hay alguno no hackeado, no se acaba el programa
		  allIsHacked = false;
		  if (!isNuked[n]) {
			//Si ademas no esta nukeado se sigue con la parte de nukeos
			allNuked = false;
		  }
		}
	  }
	  await ns.sleep(10);
	}
  }