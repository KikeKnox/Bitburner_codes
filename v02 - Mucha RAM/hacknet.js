/** @param {NS} ns */
export async function main(ns) {
	// Codigo para aumentar la produccion de la hacknet
	var costServ;
	var numServ;
	var n;
	var cheaperNode = -1;
	var min;
	var dineros;
	while(true){
		dineros = ns.getServerMoneyAvailable('home');
		cheaperNode = -1;
		numServ = ns.hacknet.numNodes();
		costServ = ns.hacknet.getPurchaseNodeCost();
		min = costServ;
		for(n=0;n<numServ;n++){
			if(ns.hacknet.getLevelUpgradeCost(n) < min){
				min = ns.hacknet.getLevelUpgradeCost(n);
				cheaperNode = n;
			}
			if(ns.hacknet.getRamUpgradeCost(n) < min){
				min = ns.hacknet.getRamUpgradeCost(n);
				cheaperNode = n;
			}
			if(ns.hacknet.getCoreUpgradeCost(n) < min){
				min = ns.hacknet.getCoreUpgradeCost(n);
				cheaperNode = n;
			}
		}
		if(dineros > min){
			if(cheaperNode == -1){
				ns.hacknet.purchaseNode();
			} else {
				if(min == ns.hacknet.getLevelUpgradeCost(cheaperNode)){
					ns.hacknet.upgradeLevel(cheaperNode);
				} else if(min == ns.hacknet.getRamUpgradeCost(cheaperNode)){
					ns.hacknet.upgradeRam(cheaperNode);
				} else if(min == ns.hacknet.getCoreUpgradeCost(cheaperNode)){
					ns.hacknet.upgradeCore(cheaperNode);
				}
			}
		}

		await ns.sleep(250);
	}
}