// 表单处理脚本 - 使用Cloudflare Worker API

// 配置Cloudflare Worker API地址
const CONTACT_API_URL = 'https://message-wall-api.106996.xyz/api/contact';

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取联系表单元素
    const contactForm = document.getElementById('contact-form');
    
    // 如果找到表单，添加提交事件监听器
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // 阻止表单默认提交行为
            event.preventDefault();
            
            // 获取表单数据
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // 简单的表单验证
            if (!name || !email || !message) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 验证邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('请输入有效的邮箱地址');
                return;
            }
            
            // 准备要发送的数据
            const contactData = {
                name: name,
                email: email,
                message: message
            };
            
            // 显示发送中状态
            const submitBtn = contactForm.querySelector('input[type="submit"]');
            const originalBtnValue = submitBtn.value;
            submitBtn.value = '发送中...';
            submitBtn.disabled = true;
            
            // 发送数据到Cloudflare Worker API
            fetch(CONTACT_API_URL, {
                method: 'POST',
                body: JSON.stringify(contactData),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                // 重置表单
                contactForm.reset();
                
                // 显示成功消息
                alert('留言已成功发送！谢谢您的反馈。');
                
                // 恢复按钮状态
                submitBtn.value = originalBtnValue;
                submitBtn.disabled = false;
            })
            .catch(error => {
                console.error('提交表单时出错:', error);
                alert('发送留言时出现错误，请稍后再试。');
                
                // 恢复按钮状态
                submitBtn.value = originalBtnValue;
                submitBtn.disabled = false;
            });
        });
    }
});