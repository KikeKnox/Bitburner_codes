import {mtx2Port,port2Mtx,nmbOfCoincidences,nxtMin} from "coreFun.js"

/** @param {NS} ns */
export async function main(ns) {
    //Archivo para nukear los servidores

    //Variables
    let servis = port2Mtx(ns,1);
    let hckLvl = port2Mtx(ns,3);
    let isNuked = port2Mtx(ns,4);
    let nmbPort = port2Mtx(ns,5);
    let prog = 0;
    let allNuked = false;

    //Programa
    while(!allNuked){
        //Seccion de analisis de programas

        let programs = [ns.fileExists("BruteSSH.exe", "home"),
        ns.fileExists("FTPCrack.exe", "home"),
        ns.fileExists("relaySMTP.exe", "home"),
        ns.fileExists("HTTPWorm.exe", "home"),
        ns.fileExists("SQLInject.exe", "home")];

        let idx = nmbOfCoincidences(programs,true,false);
        prog = idx.lenght;

        //Creo que aqui pondre directamente un sistema de creacion o
        //compra de los programas que falten

        //Aqui ira el analisis de las matrices con los datos que se tienen
        //decidiendo que se nukea y que no

        //Aqui ira la actualizacion del puerto

        //Aqui ira la desesperacion y la ira
    }
}