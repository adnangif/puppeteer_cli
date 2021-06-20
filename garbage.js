const delay = ( ms, callbackFunc = ()=> {}) => {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(32)),0,0,ms)
    callbackFunc()
}


console.log('Before delay')
delay(5000,()=>{
    console.log('delayed output')
})
delay(1000)
console.log('after delay')



