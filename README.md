Code below is to fix some problem that occured while authenticating client.

```
Edit LocalWebCache.js persist function adding the condition:

if (indexHtml.match(/manifest-([\d\\.]+)\.json/) != null)

async persist(indexHtml) {
  // extract version from index (e.g. manifest-2.2206.9.json -> 2.2206.9)
  if (indexHtml.match(/manifest-([\d\\.]+)\.json/) != null) {
    const version = indexHtml.match(/manifest-([\d\\.]+)\.json/)[1];
    if (!version) return;
    
    const filePath = path.join(this.path, `${version}.html`);
    fs.mkdirSync(this.path, { recursive: true });
    fs.writeFileSync(filePath, indexHtml);
  }
}

Changing my webVersionCache inside the client definition:

    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: [ '--no-sandbox', '--disable-gpu', ],
        },
        webVersionCache: { type: 'remote', remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html', }
    });


```

