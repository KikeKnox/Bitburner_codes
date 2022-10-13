/** @param {NS} ns */
export async function main(ns) {
    //Archivo para funcion de compra de RAM

    //VARIABLES
    let desiredRam = ns.args[0];
    let actualRam = ns.getServerMaxRam("home");
    let wasBought = false;

    //PROGRAMA
    while(actualRam < desiredRam){
        //Creacion de un programa con singularidades (es un if con operador ternario)
        wasBought = ns.getServerMoneyAvailable("home") >= ns.singularity.getUpgradeHomeRamCost() ? ns.singularity.upgradeHomeRam() : false;

        //Evaluacion de si se ha comprado o no
        if(wasBought) actualRam = ns.getServerMaxRam("home");

        await ns.sleep(100);
    }
    ns.alert("Se ha aumentado la RAM a " + actualRam);
}