/** @param {NS} ns */
export async function main(ns) {
  //VARIABLES
  let servisString = new Set(["home"]);
  let servis = [ns.getServer("home")];
  let crs = crsLocal = 1;
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
  let cod = ns.read("hacked.js");

  //Creacion de arrays inicial
  let i = 0;
  while (i < servisString.size) {
      let serTemp = ns.scan(Array.from(servisString)[i]);
      serTemp.forEach(server => servisString.add(server));
      i++;
  }

  ns.tprint("Servidores encontrados: " + servisString.size);

  Array.from(servisString).slice(1).forEach(server => servis.push(ns.getServer(server)));

  // Check for new programs once before the loop
  for (let program in programs) {
      if (ns.fileExists(program, "home")) {
          numPrograms++;
          programs[program].exists = true;
      }
  }

  //BUCLE DE EJECUCION CONTINUA
  while (!allNuked) {
      //En caso de que se tenga mas programas que antes se pasa un bucle de nukeo
      if (numPrograms != numPrograms_ant) {
          ns.tprint("Detectados nuevos archivos. Iniciando nukeo");
          for (let n = 1; n < servis.length; n++) {
              if (numPrograms >= servis[n].numOpenPortsRequired && !servis[n].hasAdminRights) {
                  ns.tprint("Servidor a nukear: " + servis[n].hostname);
                  for (let program in programs) {
                      if (programs[program].exists) {
                          programs[program].method(servis[n].hostname);
                      }
                  }
                  ns.nuke(servis[n].hostname);
                  if (servis[n].moneyMax > 0) {
                      if (servis[n].maxRam > 0) {
                          ns.scp("hacked.js", servis[n]);
                          crs = Math.floor((servis[n].maxRam - servis[n].ramUsed) / ns.getScriptRam("hacked.js", servis[n].hostname));
                          ns.exec("hacked.js", servis[n], crs, servis[n]);
                      }
                      let name = "/codes/" + servis[n] + ".js"
                      if (!ns.fileExists(name)) {
                          ns.write(name, cod, "w");
                      }
                      let costRAMAllServs = Math.floor(servis[0].maxRam / (ns.getScriptRam("hacked.js") * (servis.length - 1)));
                      crsLocal = (costRAMAllServs < servis[0].cpuCores) ? costRAMAllServs : servis[0].cpuCores;
                      ns.exec(name, "home", 1, [servis[n], crsLocal]);
                  }
              }
          }
      }

      //Actualizar los anteriores para la siguiente pasada
      numPrograms_ant = numPrograms;

      //Final del bucle: comprobar si se acaba el programa
      allNuked = servis.every(server => server.hasAdminRights);

      await ns.sleep(10);
  }
}