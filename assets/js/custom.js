// 一言API调用
fetch('https://v1.hitokoto.cn')
	.then(response => response.json())
	.then(data => {
		const hitokotoElement = document.getElementById('hitokoto');
		hitokotoElement.innerHTML = data.hitokoto;
		if (data.from_who) {
			hitokotoElement.innerHTML += `<br><span style="font-size: 0.8em;">——${data.from_who}${data.from ? '「' + data.from + '」' : ''}</span>`;
		} else if (data.from) {
			hitokotoElement.innerHTML += `<br><span style="font-size: 0.8em;">——「${data.from}」</span>`;
		}
	})
	.catch(console.error);

// IP信息API调用
fetch('https://myip.ipip.net/')
	.then(response => response.text())
	.then(data => {
		const ipInfoElement = document.getElementById('ip-info');
		ipInfoElement.textContent = data;
	})
	.catch(error => {
		console.error('获取IP信息失败:', error);
		const ipInfoElement = document.getElementById('ip-info');
		ipInfoElement.textContent = '无法获取IP信息';
	});