import './css/test1.css';
import './css/test2.scss';
import './css/test3.less';
// import '@babel/polyfill';
// let logo = require('./images/img.jpg');
// let img = new Image();
// console.log(logo)
// img.src = logo.default
// document.body.appendChild(img);
let fun = () => {
	console.log(1234)
}
fun();

var promise = new Promise((resolve,reject)=>{
	console.log('promise');
	resolve('1234');
})
promise.then((res)=>{
	console.log(res)
})