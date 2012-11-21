var NotHubStream = require('./')
  , Service = NotHubStream.Service
  , SocketIOListener = NotHubStream.SocketIOListener
  , Crawler = NotHubStream.Crawler
  , streamConfig = require('./config/stream')
  , sioPort = streamConfig['socket.io'].port
  , service = new Service()
  , ioListener = new SocketIOListener(sioPort)
  , crawler = new Crawler({
    query: {
      access_token: process.env['GITHUB_ACCESS_TOKEN']
    }
  })

service.on('error', function(err, detail) {
  console.log('\033[31mService error\033[39m: ', err);
});

ioListener.listen(service);

crawler.on('receive', function(err, data) {
  if (!err) service.send(data);
});

crawler.on('error', function(err, data) {
  console.log('\033[31mCrawler error\033[39m: ', err, data);
});

crawler.crawl(1000);
