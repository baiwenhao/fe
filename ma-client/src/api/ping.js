 /**
  * Creates a Ping instance.
  * @returns {Ping}
  * @constructor
  */

 const Ping = function(opt) {
     this.opt = opt || {}
     this.favicon = this.opt.favicon || '/favicon.ico'
     this.timeout = this.opt.timeout || 5000
     this.logError = this.opt.logError || false
 }

 /**
  * Pings source and triggers a callback when completed.
  * @param {string} source Source of the website or server, including protocol and port.
  * @param {Function} callback Callback function to trigger when completed. Returns error and ping value.
  * @returns {Promise|undefined} A promise that both resolves and rejects to the ping value. Or undefined if the browser does not support Promise.
  */
 Ping.prototype.ping = function(source, callback) {
     let promise = null
     let resolve = null
     let reject = null

     if (typeof Promise !== 'undefined') {
         promise = new Promise(function(_resolve, _reject) {
             resolve = _resolve
             reject = _reject
         })
     }

     const self = this
     self.wasSuccess = false
     self.img = new Image()
     self.img.onload = onload
     self.img.onerror = onerror

     let timer = null
     const start = new Date()

     function onload(e) {
         self.wasSuccess = true
         console.log('onload')
         pingCheck.call(self, e)
     }

     function onerror(e) {
         self.wasSuccess = false
         console.log('加载失败一个')
         pingCheck.call(self, e)
     }

     if (self.timeout) {
         timer = setTimeout(function() {
             console.log('超时了')
             pingCheck.call(self, undefined)
         }, self.timeout)
     }


     /**
      * Times ping and triggers callback.
      */
     function pingCheck() {
         if (timer) { clearTimeout(timer) }
         const pong = new Date() - start

         if (!callback) {
             if (promise) {
                 return this.wasSuccess ? resolve(pong) : reject(pong)
             } else {
                 throw new Error('Promise is not supported by your browser. Use callback instead.')
             }
         } else if (typeof callback === 'function') {
            console.log('callback 存在')
             // When operating in timeout mode, the timeout callback doesn't pass [event] as e.
             // Notice [this] instead of [self], since .call() was used with context
             if (!this.wasSuccess) {
                 if (self.logError) { console.error('error loading resource') }
                 // if (promise) { reject(pong) }
                 return callback('error', pong)
             }
             if (promise) { resolve(pong) }
             return callback(null, pong)
         } else {
             throw new Error('Callback is not a function.')
         }
     }

     self.img.src = source + self.favicon + '?' + (+new Date()) // Trigger image load with cache buster
     return promise
 }

 if (typeof exports !== 'undefined') {
     if (typeof module !== 'undefined' && module.exports) {
         module.exports = Ping
     }
 } else {
     window.Ping = Ping
 }

