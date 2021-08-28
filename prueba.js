// 
const data= 'dasdasd ${img:estoespruebaimg} sadsda'

const regex = /\${img:(.*)}/g;

let m =regex.exec(data);

console.log(`regex ${m}`);