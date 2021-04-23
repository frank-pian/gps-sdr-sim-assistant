const fs = window.nodeRequire("fs")
const iconv = window.nodeRequire('iconv-lite')
const path = window.nodeRequire('path')
const exec = window.nodeRequire('child_process').exec

// 任何你期望执行的cmd命令，ls都可以
let cmdStr = 'gps_sdr_sim.exe'
// 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
let cmdPath = path.join(process.cwd(),'/resources/console/win')
let binPath = path.join(process.cwd(),'/resources/console/win/gpssim.bin')
if (process.env.NODE_ENV === 'development') {
  cmdPath = path.join(process.cwd(),'/console/win')
  binPath = path.join(
    process.cwd(),'/console/win/gpssim.bin')
  console.log(cmdPath)
}
console.log(cmdPath)


// 子进程名称
let workerProcess
let workerProcessSymbol = false
 
function runExec(lat, lng, height) {
    if (workerProcessSymbol === true) {
        console.log("Repeat build")
        return
    }
    workerProcessSymbol = true
  // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
  cmdStr = cmdStr + " -e brdc.21n -l " + lat + "," + lng + "," + height + " -b 8"
  console.log(cmdStr)
  select("graph").style.display = "block"
  workerProcess = exec(cmdStr, {cwd: cmdPath, encoding: 'buffer'})
  // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})
 
  // 打印正常的后台可执行程序输出
  workerProcess.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });
 
  // 打印错误的后台可执行程序输出
  workerProcess.stderr.on('data', function (data) {
    console.log('stderr: ' + iconv.decode(data, 'cp936'));
    let num = parseFloat(iconv.decode(data, 'cp936').match(/([^run =]+)$/)[0]);
    processUpdate(num / 300 * 100);
  });
 
  // 退出之后的输出
  workerProcess.on('close', function (code) {
    console.log('out code：' + code);
    if(code == 0) {
        select("bar").innerHTML = "完成"
        fs.rename(binPath, "./gpssim.bin", function(err){
            if(err){
                throw err;
            }
        })
    }
    workerProcessSymbol = false;
  })
}