/** @param {NS} ns */
export async function main(ns) {
  //VARIABLES
  let servisString = new Set(["home"]);
  let servis = [ns.getServer("home")];
  let numPrograms = 0;
  let numPrograms_ant = -1;
  let allNuked = false;
  let programs = {
    "BruteSSH.exe": { exists: false, method: ns.brutessh },
    "FTPCrack.exe": { exists: false, method: ns.ftpcrack },
    "relaySMTP.exe": { exists: false, method: ns.relaysmtp },
    "HTTPWorm.exe": { exists: false, method: ns.httpworm },
    "SQLInject.exe": { exists: false, method: ns.sqlinject }
  };

  //Creacion de arrays inicial
  let i = 0;
  while (i < servisString.size) {
    let serTemp = ns.scan(Array.from(servisString)[i]);
    serTemp.forEach(server => servisString.add(server));
    i++;
  }

  ns.tprint("Servidores encontrados: " + servisString.size);

  Array.from(servisString).slice(1).forEach(server => servis.push(ns.getServer(server)));
  allNuked = servis.every(server => server.hasAdminRights);

  //BUCLE DE EJECUCION CONTINUA
  while (!allNuked) {
    numPrograms = 0;
    for (let program in programs) {
      if (ns.fileExists(program, "home")) {
        numPrograms++;
        programs[program].exists = true;  // programs es una especie de diccionario, entonces program es solo la clave y por eso hay que utilizar el arreglo entero
      }
    }
    //En caso de que se tenga mas programas que antes se pasa un bucle de nukeo
    if (numPrograms != numPrograms_ant) {
      for (let n = 1; n < servis.length; n++) {
        if (numPrograms >= servis[n].numOpenPortsRequired && !servis[n].hasAdminRights) {
          ns.tprint("Servidor a nukear: " + servis[n].hostname);
          for (let program in programs) {
            if (programs[program].exists) {
              programs[program].method(servis[n].hostname);
            }
          }
          ns.nuke(servis[n].hostname);
        }
      }
      checkHackPrograms(ns, servis);
    }

    //Actualizar los anteriores para la siguiente pasada
    numPrograms_ant = numPrograms;

    //Final del bucle: comprobar si se acaba el programa
    allNuked = servis.every(server => server.hasAdminRights);

    await ns.sleep(10);
  }
  //Some times I kill the scripts and is needed to run again
  checkHackPrograms(ns, servis);
}

export async function checkHackPrograms(ns, servers) {
  let prename = "codes/";
  let crs = 1;
  let crsLocal = 1;
  let hackScript = "hacked.js";
  let cod = ns.read(hackScript);
  let localProcess = ns.ps("home");

  for (let server of servers) {
    if (server.moneyMax > 0) {
      if (server.maxRam > 0) {
        if (!ns.fileExists(hackScript, server.hostname)) ns.scp(hackScript, server.hostname);
        crs = Math.floor((server.maxRam - server.ramUsed) / ns.getScriptRam(hackScript, server.hostname));
        for (let n = 0; n < crs; n++) {
          ns.exec(hackScript, server.hostname, 1, server.hostname);
        }
      }
      let name = prename + server.hostname + ".js"
      if (localProcess.some(p => p.filename == name)) continue;
      if (!ns.fileExists(name)) ns.write(name, cod, "w");
      let costRAMAllServs = Math.floor(servers[0].maxRam / (ns.getScriptRam(hackScript) * (servers.length - 1)));
      crsLocal = (costRAMAllServs < servers[0].cpuCores) ? costRAMAllServs : servers[0].cpuCores;
      ns.exec(name, "home", crsLocal, server.hostname, crsLocal);
    }
  }
}