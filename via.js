/*Text To Link*/
if (typeof TextLink === 'undefined') {
	var TextLink = null;
	let position = document.querySelector('html');
	let newTag = document.createElement('script');
	newTag.src = 'https://git.oschina.net/coldfire/GM/raw/master/linkMix.user.js';
	position.appendChild(newTag);
}

/*Pure Mobile Baidu*/
if (typeof PureBaidu === 'undefined') {
	var PureBaidu = null;
	let position = document.querySelector('html');
	let newTag = document.createElement('script');
	newTag.src = 'https://erbzur.github.io/js_refer/Pure%20Mobile%20Baidu.js';
	position.appendChild(newTag);
}

/*DevTools*/
if (typeof DevTool === 'undefined') {
	var DevTool = null;
	if (/dev=true/.test(window.location.href)) {
		let position = document.querySelector('html');
		let newTag = [];
		/*vConsole*/
		newTag[0] = document.createElement('script');
		newTag[0].src = 'https://erbzur.github.io/js_refer/vconsole.min.js';
		position.appendChild(newTag[0]);
		newTag[0].onload = function () {
			var vConsole = new VConsole();
		};
		/*Eruda*/
		newTag[1] = document.createElement('script');
		newTag[1].src = 'https://erbzur.github.io/js_refer/eruda.min.js';
		position.appendChild(newTag[1]);
		newTag[1].onload = function () {
			eruda.init();
		};
	}
}
