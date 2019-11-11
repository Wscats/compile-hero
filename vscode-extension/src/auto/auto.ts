import { get } from 'https';
let i: number = 0;
while (i < 2000) {
    i++;
    ((i) => {
        get('https://wscats.gallery.vsassets.io/_apis/public/gallery/publisher/Wscats/extension/qf/6.7.1/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage?redirect=true&install=true', {
            headers: {
                // ":method": "GET",
                // ":authority": "wscats.gallery.vsassets.io",
                // ":scheme": "https",
                // ":path": "/_apis/public/gallery/publisher/Wscats/extension/qf/6.7.1/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage?redirect=true&install=true",
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-CN",
                "cookie": "EnableExternalSearchForVSCode=true",
                "user-agent": "VSCode 1.39.2",
                "x-market-client-id": "VSCode 1.39.2",
                "x-market-user-id": "f2500034-c981-4f54-bcdb-45bbf63994b3",
            }
        }, (res: Object) => {
            console.log(i)
            // console.log(res)
        }).on('error', (e) => {
            console.error(`出现错误: ${e.message}`);
        });
    })(i);
}