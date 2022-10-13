/** @param {NS} ns */
export async function main(ns) {
    //Archivo para funcion de compra de cores

    //VARIABLES
    let desiredCores = ns.args[0];
    let actualCores = ns.getServer("home").cpuCores;
    let wasBought = false;

    //PROGRAMA
    while(actualCores < desiredCores){
        //Creacion de un programa con singularidades (es un if con operador ternario)
        wasBought = ns.getServerMoneyAvailable("home") >= ns.singularity.getUpgradeHomeCoresCost() ? ns.singularity.upgradeHomeCores() : false;

        //Evaluacion de si se ha comprado o no
        if(wasBought) actualRam = ns.getServer("home").cpuCores;

        await ns.sleep(100);
    }
    ns.alert("Se han aumentado los nucleos a " + actualCores);
}