const cluster = require('cluster')
const usage = require('usage')
const os = require('os')

const CPU_COUNT = process.env.CPU_COUNT
const CHECK_INTERVAL = process.env.CHECK_INTERVAL

const cpuCount = CPU_COUNT || os.cpus().length
const checkInterval = CHECK_INTERVAL || 5000

const manager = function (bytes, runFunc, cleanFunc) {

  if (cluster.isMaster) {
    for (let i = 0; i < cpuCount; i++) {
      cluster.fork()
    }
    //注意点B
    cluster.on('disconnect', function (worker) {
      console.log('' + worker.id + ' disconnect, restart now')
      worker.isSuicide = true
      cluster.fork()
    })
    cluster.on('exit', function (worker) {
      if (worker.isSuicide) {
        console.info('process exit by kill')
      } else {
        console.info('process exit by accident')
        cluster.fork()
      }
      console.info('process exit')
    })
  } else {

    runFunc && runFunc()

    let checkTimer = setInterval(function () {

      usage.lookup(process.pid, function (err, result) {

        if (result === null || result === undefined) {
          console.log('memory check fail')
          return
        }
        if (parseInt(result.memory) > bytes) {
          console.log('memory exceed, start to kill')

          //注意点A
          let killtimer = setTimeout(function () {
            console.info('process down!')
            process.exit(1)
          }, 5000)
          killtimer.unref()

          cleanFunc && cleanFunc()

          try {
            if (['disconnected', 'dead'].indexOf(cluster.workder.state) < 0) {
              cluster.worker.disconnect()
            }
          } catch (err) {}


          clearInterval(checkTimer)
        }
      })

    }, checkInterval)
  }

}

const fs = require('fs')

fs.watchFile('./server.js', (e, f) => {
  console.log(e.mtime, f.mtime)
})
