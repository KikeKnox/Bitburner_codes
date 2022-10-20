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
			sal += mtx[cont[0]][cont[1]] + ";";	//Para cada columna se separa con ;
		}
        if(cont[0] < mtx.length - 1){
            sal += "@;";	//Caracter para indicar un cambio de linea
        }
	}

	ns.writePort(puerto, sal);	//Se escriben los datos

	return 0;
}

export function port2Mtx(puerto){
	//Funcio de lectura de puerto a matriz
	//Se deshace el string creado en la funcion mtx2Port

	//Variables
	let mtx = [];
	let ent = ns.readPort(puerto);
    let cont;
    let pos;
    let temp;

	//Programa
	pos = allCoincidences(ent,"@;");
    if(pos==-1){
        //En caso de -1 es que no encuentra el tag separador de filas, ergo no es una matriz
        return -1;
    }
    mtx[0] = [];
    for(cont[0] = 0;cont[0]<pos.length;cont[0]++){
        temp = left(ent,pos[cont[0]]);
        mtx[cont[0] + 1] = [];
    }

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

export function left(str,pos){
    //Funcion para sacar el izquierdo de una cadena a partir de una posicion
    let sal = "";

    for(let cont = 0;cont<pos;cont++){
        sal += str[cont];
    }
    
    return sal;
}

export function right(str,pos){
    //Funcion para sacar el derecho de una cadena a partir de una posicion
    let sal = "";

    for(let cont = pos;cont<str.length;cont++){
        sal += str[cont];
    }
    
    return sal;
}