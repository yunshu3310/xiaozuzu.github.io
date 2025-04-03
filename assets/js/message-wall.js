// 留言墙功能实现 - 使用Cloudflare Worker API

// 配置Cloudflare Worker API地址
const API_URL = 'https://message-wall-api.106996.xyz/api/messages';

document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const messageForm = document.getElementById('message-form');
    const messageList = document.getElementById('message-list');
    const messageNameInput = document.getElementById('message-name');
    const messageEmailInput = document.getElementById('message-email');
    const messageContentInput = document.getElementById('message-content');
    
    // 从Cloudflare Worker API加载留言数据
    async function loadMessages() {
        try {
            // 显示加载中状态
            const loadingNotice = document.createElement('div');
            loadingNotice.className = 'message-loading-notice';
            loadingNotice.textContent = '正在加载留言...';
            messageList.innerHTML = '';
            messageList.appendChild(loadingNotice);
            
            // 从API获取留言数据
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error('获取留言失败');
            }
            
            const messages = await response.json();
            renderMessages(messages);
        } catch (error) {
            console.error('加载留言出错:', error);
            messageList.innerHTML = '';
            const errorNotice = document.createElement('div');
            errorNotice.className = 'message-error-notice';
            errorNotice.textContent = '加载留言失败，请稍后再试';
            messageList.appendChild(errorNotice);
        }
    }
    
    // 渲染留言列表
    function renderMessages(messages) {
        // 清空留言列表
        messageList.innerHTML = '';
        
        if (messages.length === 0) {
            // 如果没有留言，显示提示信息
            const emptyNotice = document.createElement('div');
            emptyNotice.className = 'message-empty-notice';
            emptyNotice.textContent = '暂无留言，快来留下第一条吧！';
            messageList.appendChild(emptyNotice);
            return;
        }
        
        // 按时间倒序排列留言
        const sortedMessages = [...messages].sort((a, b) => b.timestamp - a.timestamp);
        
        // 遍历留言数据并创建留言元素
        sortedMessages.forEach(message => {
            const messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            
            // 创建留言头部（作者和日期）
            const messageHeader = document.createElement('div');
            messageHeader.className = 'message-header';
            
            const messageAuthor = document.createElement('div');
            messageAuthor.className = 'message-author';
            messageAuthor.textContent = message.name;
            
            const messageDate = document.createElement('div');
            messageDate.className = 'message-date';
            messageDate.textContent = formatDate(message.timestamp);
            
            messageHeader.appendChild(messageAuthor);
            messageHeader.appendChild(messageDate);
            
            // 创建留言内容
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.textContent = message.content;
            
            // 将头部和内容添加到留言项
            messageItem.appendChild(messageHeader);
            messageItem.appendChild(messageContent);
            
            // 将留言项添加到留言列表
            messageList.appendChild(messageItem);
        });
    }
    
    // 格式化日期
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    
    // 添加新留言
    async function addMessage(name, email, content) {
        try {
            // 创建新留言对象
            const newMessage = {
                name: name,
                email: email,
                content: content
            };
            
            // 发送到API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMessage)
            });
            
            if (!response.ok) {
                throw new Error('发布留言失败');
            }
            
            // 重新加载留言列表
            await loadMessages();
            return true;
        } catch (error) {
            console.error('添加留言出错:', error);
            return false;
        }
    }
    
    // 监听表单提交事件
    if (messageForm) {
        messageForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // 获取表单数据
            const name = messageNameInput.value.trim();
            const email = messageEmailInput.value.trim();
            const content = messageContentInput.value.trim();
            
            // 简单的表单验证
            if (!name || !email || !content) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 验证邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('请输入有效的邮箱地址');
                return;
            }
            
            // 禁用提交按钮，防止重复提交
            const submitButton = messageForm.querySelector('input[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.value = '提交中...';
            }
            
            // 添加留言
            const success = await addMessage(name, email, content);
            
            // 恢复提交按钮
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.value = '提交';
            }
            
            if (success) {
                // 重置表单
                messageForm.reset();
                
                // 显示成功消息
                alert('留言发布成功！');
            } else {
                // 显示错误消息
                alert('留言发布失败，请稍后再试！');
            }
        });
    }
    
    // 初始加载留言
    loadMessages();
});