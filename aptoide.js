/* aptoide.com */
(function(){
    'use strict';
    if(!/\.aptoide.com$/.test(location.hostname)){
        return;
    }
    const info = JSON.parse(document.querySelector('script[id="__NEXT_DATA__"]').text);
    const curApp = info.props.pageProps.app;
    if(curApp){
        const req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if(req.readyState === 4 && req.status === 200){
                if(req.response){
                    addButtons(JSON.parse(req.response));
                }
            }
        };
        req.open('GET', 'https://ws2.aptoide.com/api/7/app/getMeta/package_name=' + curApp.package);
        req.send();
    }

    function addButtons(res){
        const container = document.createElement('div');
        container.setAttribute('id', 'direct-download-buttons');
        container.setAttribute('style',
            'position: fixed;' +
            ' bottom: 10px;' +
            ' right: 10px;' +
            ' z-index: 100;'
        );
        const getButtonHtml = text => {
            const style =
                'padding: 15px;' +
                ' margin: 5px;' +
                ' border-radius: 10px;' +
                ' font-size: smaller;' +
                ' color: white;' +
                ' background: limegreen;'
            ;
            return `<div style="${style}">${text} </div>`;
        };
        const apkButton = document.createElement('a');
        apkButton.setAttribute('class', 'apk-button');
        apkButton.setAttribute('href', res.data.file.path);
        apkButton.innerHTML = getButtonHtml('Download APK');
        container.appendChild(apkButton);
        if(res.data.obb){
            const obbButton = document.createElement('a');
            obbButton.setAttribute('class', 'obb-button');
            obbButton.setAttribute('href', res.data.obb.main.path);
            obbButton.innerHTML = getButtonHtml('Download OBB');
            container.appendChild(obbButton);
        }
        document.body.appendChild(container);
    }
})();