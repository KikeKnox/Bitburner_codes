/** @param {NS} ns */
export async function main(ns) {
	var servis = ["home", "foodnstuff"];
	var isFaction = [false, false];
	var serTemp;
	var maxServs = ns.getPurchasedServerLimit();
	var ram = 256;
	var servCost = ns.getPurchasedServerCost(ram);
	var servOwned = ns.getPurchasedServers().length;
	var i = 0;
	var n = 0;
	var nom;
	var cod = [ns.read("whilhack.js"), ns.read("whilgrow.js")];
	var flg = false;

	//Creacion de arrays inicial
	while (!flg) {
		//Escaneo desde el server
		serTemp = ns.scan(servis[i]);

		//Recorrer el array obtenido entero
		for (n = 0; n < serTemp.length; n++) {
			if (servis.indexOf(serTemp[n]) == -1) {
				//Si el nombre del servidor no esta guardado en el array, se anade
				servis.push(serTemp[n]);
				if (ns.getServerSecurityLevel == 0 && ns.getServerMoneyAvailable == 0) {
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

	//Compra de servidores y anadir sus codigos
	while(servOwned < maxServs){
		if(ns.getServerMoneyAvailable("home") >= servCost){
			//Primero se pone el nombre bonito
			if(servOwned<10){
				nom = "Server_00"+servOwned;
			}else if(servOwned<100){
				nom = "Server_0"+servOwned;
			}else{
				nom = "Server_"+servOwned; 
			}

			//Se compra el server y se le pasan los archivos (Si no existen se crean)
			ns.purchaseServer(nom,ram);
			servOwned++;
			for(n=1;n<servis.length;n++){
				if(!isFaction[n]){
					if(!ns.fileExists("/servcodes/"+servis[n]+"_hack.js","home")){
						await ns.write("/servcodes/"+servis[n]+"_hack.js",cod[0],"w");
					}
					if(!ns.fileExists("/servcodes/"+servis[n]+"_grow.js","home")){
						await ns.write("/servcodes/"+servis[n]+"_grow.js",cod[1],"w");
					}
					await ns.scp(["/servcodes/"+servis[n]+"_hack.js", "/servcodes/"+servis[n]+"_grow.js"],nom);
					ns.exec("/servcodes/"+servis[n]+"_hack.js",nom,1,servis[n]);
					ns.exec("/servcodes/"+servis[n]+"_grow.js",nom,1,servis[n]);
				}
			}
		}
		else{
			await ns.sleep(1);
		}
	}
}