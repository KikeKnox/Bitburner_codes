/** @param {NS} ns */
export async function main(ns) {
	let scripts = ["hacked.js"];
  
	let servisString = new Set(["home"]);
	let servis = [ns.getServer("home")];
	let servisOwned = [];
	let countServisOwned = 0;
	let maxServs = ns.getPurchasedServerLimit();
	let ram = 0;
	let ramMax = 1048576;
	let ramNeeded = 0;
	let n = 0;
	let nom;
	
  
	//Creacion de arrays inicial
	let i = 0;
	while (i < servisString.size) {
	  let serTemp = ns.scan(Array.from(servisString)[i]);
	  serTemp.forEach(server => servisString.add(server));
	  i++;
	}
	Array.from(servisString).slice(1).forEach(server => {
	  if (!ns.getServer(server).purchasedByPlayer && ns.getServer(server).moneyMax > 0) {
		servis.push(ns.getServer(server));
	  } else if(ns.getServer(server).purchasedByPlayer){
		servisOwned.push(ns.getServer(server));
	  }
	});
	countServisOwned = servisOwned.length;
  ns.tprint(`Servidores poseidos ya comprados: ${countServisOwned}`);
  ns.tprint(`Servidores con money: ${servis.length}`);
  
	for(let script of scripts){
	  ramNeeded += servis.length * ns.getScriptRam(script);
	}
	ns.tprint(`RAM necesaria: ${ramNeeded}`);
	while(2**n < ramNeeded)n++;
	ram = 2**n;
  ns.tprint(`RAM a comprar: ${ram} con coste ${ns.getPurchasedServerCost(ram)}`);
  
	//Compra de servidores y anadir sus codigos
	while (countServisOwned < maxServs) {
	  if (ns.getPlayer().money >= ns.getPurchasedServerCost(ram)) {
		//Primero se pone el nombre bonito
		if (countServisOwned < 10) {
		  nom = "Server_00" + countServisOwned;
		} else if (countServisOwned < 100) {
		  nom = "Server_0" + countServisOwned;
		} else {
		  nom = "Server_" + countServisOwned;
		}
  
		//Se compra el server y se le pasan los archivos (Si no existen se crean)
		ns.purchaseServer(nom, ram);
		countServisOwned++;
		for(let server of servis){
      if(server.hostname=="home")continue;
		  for(let script of scripts){
			ns.scp(script, nom);
			ns.exec(script, nom, 1, server.hostname);
		  }
		}
	  } else {
		await ns.sleep(1);
	  }
	}
  
	//Augment RAM if we have the max
	//Just for later
  
  }