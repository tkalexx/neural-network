const _ = require('lodash');

const sizeLetter = 5;
const boxSize = 10;
let W = Array.from({length: boxSize**2}, (_, i) => Math.random());

 //сдвиг вправо
function shiftRight(massiv){
    const copyMassiv = _.cloneDeep(massiv);
    for ( let i = 0; i < copyMassiv.length; i++){
        copyMassiv[i].unshift(copyMassiv[i].pop());
    }
    return copyMassiv;
}

//сдвиг вниз
function shiftDown(massiv){
    const copyMassiv = _.cloneDeep(massiv);
    copyMassiv.unshift(copyMassiv.pop());
    return copyMassiv;
}

//сдвиг буквы
function shiftLetter (letter){
    const arrayLetter = [letter];
    let arrayP = _.cloneDeep(letter);
    for( let i = 0; i < 6; i++) {
        let arrayP2 = _.cloneDeep(arrayP);
        for( let j = 0; j < 5; j++) {
            arrayP2 = shiftRight(arrayP2);
            arrayLetter.push(_.cloneDeep(arrayP2));
        }
        if ( i === 5) continue;
        arrayP = shiftDown(arrayP);
        arrayLetter.push(_.cloneDeep(arrayP));
    }
    return arrayLetter;
}

//печать всех положений буквы
function printMatrix(matrix){
    for(const row of matrix){

        printLetter(row);
    }
}

//печать одного положения буквы
function printLetter(matrix){
    console.log("______________");
    for(const row of matrix){
        console.log(row.join( " ") );
    }
    console.log("______________");
}

//разность между двумя элементами в одном положении букв
function subLetter(letterX,letterY){
    const z = [];
        for(let i = 0; i < boxSize; i++){
            z[i] = [];
            for(let j = 0; j < boxSize; j++){
                z[i][j] = letterX[i][j] - letterY[i][j];
            }
        }
    return z;
}

//Разница между всеми положениями букв - 36^2
function globalSub(x,y){
    const z = [];
    for(let i = 0; i < x.length; i++){
        for(let j = 0; j < y.length; j++){
            z.push(subLetter(x[i],y[j]));
        }
    }
    return z;
}

//норма для одного квадрата z
function getNormLetter(z){
    let zClone = _.cloneDeep(z);
    let normaRez = 0;
    zClone = zClone.flat();
    for (let i = 0; i < zClone.length; i++){
        normaRez += zClone[i]**2;
    }
    return Math.sqrt(normaRez);
}

//находим индекс вектора с минимальной нормой
function minIndexV (rezNorm){
    let minIndex = 0;
    for ( let i = 0; i < rezNorm.length; i++){
        if( rezNorm[minIndex] > rezNorm [i]) {
            minIndex = i;
        }
    }
    return minIndex;
}

const letterL = [
    [1,1,1,1,1,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];

const letterD = [
    [1,0,1,0,1,0,0,0,0,0],
    [0,1,1,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,0,0],
    [0,1,1,1,0,0,0,0,0,0],
    [1,0,1,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];


const xi = shiftLetter(letterL);
const yi = shiftLetter(letterD);

//находим разницу
let z = globalSub (xi, yi);
let rezNorm = [];


//считаем все нормы
for (let i = 0; i < z.length; i++){
    rezNorm[i] = getNormLetter(z[i]);
}

//находим lmb

//скалярное произведение векторов
function sklPr(z, W){
    let skl = 0;
    for (let i = 0; i < z.length; i ++){
        skl+= z[i] * W[i];
    }
    return skl;
}

function sub(x1, x2){
    let subVector = [];
    for (let i = 0; i < x1.length; i ++){
        subVector[i] =  x1[i] - x2[i];
    }
    return subVector;
}

function lmb(z,W){
    const zClone = z.flat();
    const result = sklPr(sub(W,zClone),W) / sklPr(sub(W,zClone),sub(W,zClone));
    return result;
}

//Находим все lmb
function allLmb(z,W){
    let allLmb = [];
    for ( let i = 0; i < z.length; i++){
        allLmb[i] = lmb(z[i],W);
    }
    return allLmb;
}

//максимальная lmb
function maxLmb(allLmb, minIndex){
    let maxLmb = 0;
    let maxLmbIndex = 0;
    for ( let i = 0; i < allLmb.length; i++){
        if( allLmb[maxLmbIndex] < allLmb [i] && i!== minIndex) {
            maxLmbIndex = i;
            maxLmb = allLmb[maxLmbIndex];
        }
    }
    return [maxLmb, maxLmbIndex];
}

const eps = 0.001;

//умножение числа lmbMax на вектор
function mult (lmb, vector){
    let resVector = [];
    for (let i = 0; i < vector.length; i++){
        resVector[i] = lmb * vector[i];
    }
    return resVector;
}

//функция сложения векторов
function plusVectors(vector1,vector2){
    let resVector = [];
    for( let i = 0; i < vector1.length; i++){
        resVector[i] = vector1[i] + vector2[i];
    }
    return resVector;
}

let n = 0;

//Проверка итераций
let mass = [1];
while ( mass[0] > eps && n < 10000){
    let zMin = z[minIndexV(rezNorm)];
    let q = allLmb(z,W);
    mass = maxLmb(q,zMin);
    W = plusVectors(W, mult(mass[0],sub(z[mass[1]].flat(), W)));
    n++;
}

let a = 5000000;
for (let i = 0; i < xi.length; i ++){
    let aTmp = sklPr(xi[i].flat(),W);
    if ( aTmp < a){
        a = aTmp;
    }
}

let b = -100000;
for (let i = 0; i < yi.length; i ++){
    let bTmp = sklPr(yi[i].flat(),W);
    if ( bTmp > b){
        b = bTmp;
    }
}

let globalRes = (a + b)/2;

//test
const letterSimvol = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,1,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];
let res = sklPr(W, letterSimvol.flat());
let res2 = globalRes;
if(sklPr(W, letterSimvol.flat()) > globalRes){
    console.log("Это Г или похоже на Г");

}
else{
    console.log("Это Ж или похоже на Ж");
}

console.log(res);
console.log(res2);



