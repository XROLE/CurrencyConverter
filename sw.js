const staticAssets = [
    './',
    '/index.html',
    './css/style.css',
    './js/index.js',
    './js/unvisetedArea.js'
]
//install service worker, create cache and cache all the static files in there
self.addEventListener('install', async event =>{
    const cache = await caches.open('currency_converter_static');
        cache.addAll(staticAssets);
        self.skipWaiting(
            console.log('sw installed succesfuly')
        );
    }); 
    
    //Delete old version of cache and activate new one
    self.addEventListener('activate', event => {
        console.log('service worker activated successfully');
      });

 // Intercepting fetch request   
self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);
    console.log(caches.keys());
    if(url.origin === location.origin){
        event.respondWith(cacheFirst(req))
    }else{
        let cacheWhitelist = ['currency_converter_dynamic'];      
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map(function(key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                return caches.delete(key);
                }
            }));
        })      
        event.respondWith(networkFirst(req));
    }
});     
//un visiter area
// async function unvisetedArea(){
//     alert('Check your networking connection and try again')
// }

async function cacheFirst(req) {
    const cashedResponse = await caches.match(req);
    return cashedResponse || fetch(req)
}
async function networkFirst(req){
        const cache = await caches.open('currency_converter_dynamic');
    try{
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    }catch(error){
        const cachedResponse = await cache.match(req);
        return cachedResponse || alert('check your network connection and try again');
    }
}
