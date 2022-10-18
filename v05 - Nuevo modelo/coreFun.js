/** @param {NS} ns */

//Archivo de funciones generales

export function mtx2Port(mtx, puerto){
	//Funcion exportadora de matrices al puerto que se desea
	//Se construye un string gigante con todos los elementos

	//Variables
	let cont = [0, 0];
	let sal = "";

	//Programa
	ns.clearPort(puerto);	//Primero se limpia el puerto
	for(cont[0] = 0;cont<mtx.length;cont[0]++){
		for(cont[1]=0;cont<mtx[cont[0]].length;cont[1]++){
			sal = sal + mtx[cont[0]][cont[1]] + ";";	//Para cada columna se separa con ;
		}
		sal = sal + "@;";	//Caracter para indicar un cambio de linea
	}

	ns.writePort(puerto, sal);	//Se escriben los datos

	return 0;
}

export function port2Mtx(puerto){
	//Funcio de lectura de puerto a matriz
	//Se deshace el string creado en la funcion mtx2Port

	//Variables
	let mtx = [[]];
	let ent = ns.readPort(puerto);

	//Programa
	ent

	return mtx;
	
}

export function allCoincidences(texto, subcad){
    //Funcion para encontrar todas las posiciones de subcadena dentro de texto
    
    //Variables
    let pos = [];
    let init;
    let fin;
    let n;

    //Programa
    init = texto.indexOf(subcad);
    if(init == -1){
        //En caso de que no encuentre cadena retornamos el -1
        return -1;
    }
    fin = texto.lastIndexOf(subcad);
    if(fin == init){
        //Si son iguales fin e inicio es que solo hay uno
        return init;
    }
    n = init;
    while(n<=fin){
        pos.push(texto.indexOf(subcad,n));
        n++;
    }
    return pos;

}