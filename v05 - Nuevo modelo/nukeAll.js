import {mtx2Port,port2Mtx} from "coreFun.js"

/** @param {NS} ns */
export async function main(ns) {
    //Archivo para nukear los servidores

    //Variables
    let servis = port2Mtx(ns,1);
    let hckLvl = port2Mtx(ns,3)
    let isNuked = port2Mtx(ns,4);
    let nmbPort = port2Mtx(ns,5);
    let prog = 0;
    let allNuked = false;

    //Programa
    while(!allNuked){
        //Seccion de analisis de programas

        
    }
}