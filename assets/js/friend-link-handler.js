// 友情链接表单处理脚本 - 使用Cloudflare Worker API

// 配置Cloudflare Worker API地址
const FRIENDLINK_API_URL = 'https://example.com/api/friendlinks'; // 需要替换为实际的API地址

// 检查API地址是否已配置
function isApiConfigured() {
    return FRIENDLINK_API_URL !== 'https://example.com/api/friendlinks';
}

// 创建友链卡片元素的函数
function createFriendLinkCard(friendLink) {
    // 创建卡片容器
    const card = document.createElement('div');
    card.className = 'friend-link-card';
    
    // 创建链接包装器
    const linkWrapper = document.createElement('a');
    linkWrapper.href = friendLink.url || '#'; // 使用提供的URL或默认为#
    linkWrapper.target = '_blank'; // 在新标签页中打开链接
    linkWrapper.rel = 'noopener noreferrer'; // 安全属性
    linkWrapper.className = 'friend-link-wrapper';
    
    // 创建头像容器
    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'friend-link-avatar';
    
    // 如果有头像链接，创建img元素，否则使用图标
    if (friendLink.avatar && friendLink.avatar.trim() !== '') {
        const avatarImg = document.createElement('img');
        avatarImg.src = friendLink.avatar;
        avatarImg.alt = friendLink.name;
        
        // 添加图片加载失败的处理
        const fallbackIcon = document.createElement('div');
        fallbackIcon.className = 'img-error';
        const iconElement = document.createElement('span');
        iconElement.className = 'icon solid fa-image';
        fallbackIcon.appendChild(iconElement);
        
        // 图片加载失败时显示图标
        avatarImg.onerror = function() {
            this.style.display = 'none';
            fallbackIcon.style.display = 'flex';
        };
        
        avatarContainer.appendChild(avatarImg);
        avatarContainer.appendChild(fallbackIcon);
    } else {
        const iconElement = document.createElement('span');
        iconElement.className = 'icon solid fa-link';
        avatarContainer.appendChild(iconElement);
    }
    
    // 创建名称元素
    const nameElement = document.createElement('div');
    nameElement.className = 'friend-link-name';
    nameElement.textContent = friendLink.name;
    
    // 创建描述元素
    const descElement = document.createElement('div');
    descElement.className = 'friend-link-desc';
    descElement.textContent = friendLink.description;
    
    // 将所有元素添加到链接包装器中
    linkWrapper.appendChild(avatarContainer);
    linkWrapper.appendChild(nameElement);
    linkWrapper.appendChild(descElement);
    
    // 将链接包装器添加到卡片中
    card.appendChild(linkWrapper);
    
    return card;
}

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取友情链接表单元素
    const friendLinkForm = document.getElementById('friend-link-form');
    
    // 如果找到表单，添加提交事件监听器
    if (friendLinkForm) {
        friendLinkForm.addEventListener('submit', function(event) {
            // 阻止表单默认提交行为
            event.preventDefault();
            
            // 获取表单数据
            const name = document.getElementById('friend-name').value.trim();
            const url = document.getElementById('friend-url').value.trim();
            const avatar = document.getElementById('friend-avatar').value.trim();
            const email = document.getElementById('friend-email').value.trim();
            const description = document.getElementById('friend-description').value.trim();
            
            // 简单的表单验证
            if (!name || !url || !email || !description) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 验证邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('请输入有效的邮箱地址');
                return;
            }
            
            // 验证URL格式
            try {
                new URL(url);
            } catch (e) {
                alert('请输入有效的网站地址');
                return;
            }
            
            // 准备要发送的数据
            const friendLinkData = {
                name: name,
                url: url,
                avatar: avatar || '', // 如果没有提供头像链接，使用空字符串
                email: email,
                description: description
            };
            
            // 显示发送中状态
            const submitBtn = friendLinkForm.querySelector('input[type="submit"]');
            const originalBtnValue = submitBtn.value;
            submitBtn.value = '提交中...';
            submitBtn.disabled = true;
            
            // 检查API是否已配置
            if (!isApiConfigured()) {
                alert('请先配置Cloudflare Worker API地址，查看README.md了解如何配置');
                submitBtn.value = originalBtnValue;
                submitBtn.disabled = false;
                return;
            }
            
            // 发送数据到Cloudflare Worker API
            fetch(FRIENDLINK_API_URL, {
                method: 'POST',
                body: JSON.stringify(friendLinkData),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                // 重置表单
                friendLinkForm.reset();
                
                // 显示成功消息
                alert('友链申请已成功提交！我们会尽快审核并添加您的网站。');
                
                // 恢复按钮状态
                submitBtn.value = originalBtnValue;
                submitBtn.disabled = false;
            })
            .catch(error => {
                console.error('提交友链申请时出错:', error);
                alert('提交友链申请时出现错误，请稍后再试。');
                
                // 恢复按钮状态
                submitBtn.value = originalBtnValue;
                submitBtn.disabled = false;
            });
        });
    }
});