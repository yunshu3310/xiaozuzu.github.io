// URL输入框和头像预览处理脚本

document.addEventListener('DOMContentLoaded', function() {
    // 获取URL输入元素
    const urlInput = document.getElementById('friend-url');
    const avatarInput = document.getElementById('friend-avatar');
    
    // 为URL输入框添加验证功能
    if (urlInput) {
        // 创建URL提示元素
        const urlHint = document.createElement('div');
        urlHint.className = 'url-input-hint';
        urlHint.textContent = '请输入有效的网站地址 (例如: https://example.com)';
        urlInput.parentNode.appendChild(urlHint);
        
        // 添加输入事件监听
        urlInput.addEventListener('input', function() {
            const value = this.value.trim();
            
            // 显示提示信息
            urlHint.classList.add('show');
            
            if (value) {
                try {
                    // 尝试创建URL对象验证格式
                    new URL(value);
                    // 验证成功
                    urlHint.textContent = '✓ URL格式正确';
                    urlHint.classList.add('valid');
                    urlHint.classList.remove('invalid');
                    this.setCustomValidity('');
                } catch (e) {
                    // 验证失败
                    urlHint.textContent = '× 请输入有效的网站地址 (例如: https://example.com)';
                    urlHint.classList.add('invalid');
                    urlHint.classList.remove('valid');
                    this.setCustomValidity('请输入有效的URL');
                }
            } else {
                // 输入为空
                urlHint.textContent = '请输入有效的网站地址 (例如: https://example.com)';
                urlHint.classList.remove('valid', 'invalid');
                this.setCustomValidity('');
            }
        });
        
        // 失去焦点时隐藏提示（如果URL有效）
        urlInput.addEventListener('blur', function() {
            if (this.validity.valid) {
                urlHint.classList.remove('show');
            }
        });
        
        // 获得焦点时显示提示
        urlInput.addEventListener('focus', function() {
            urlHint.classList.add('show');
        });
    }
    
    // 为头像链接添加预览功能
    if (avatarInput) {
        // 创建头像预览容器
        const previewContainer = document.createElement('div');
        previewContainer.className = 'avatar-preview-container';
        const previewImg = document.createElement('img');
        previewImg.alt = '头像预览';
        previewContainer.appendChild(previewImg);
        
        // 创建加载指示器
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'avatar-preview-loading';
        previewContainer.appendChild(loadingIndicator);
        
        // 添加到DOM
        avatarInput.parentNode.appendChild(previewContainer);
        
        // 创建URL提示元素
        const avatarHint = document.createElement('div');
        avatarHint.className = 'url-input-hint';
        avatarHint.textContent = '请输入有效的图片链接 (可选)';
        avatarInput.parentNode.appendChild(avatarHint);
        
        // 添加输入事件监听
        avatarInput.addEventListener('input', function() {
            const value = this.value.trim();
            
            // 显示提示信息
            avatarHint.classList.add('show');
            
            if (value) {
                try {
                    // 尝试创建URL对象验证格式
                    new URL(value);
                    // 验证成功，尝试加载图片
                    previewContainer.classList.add('show');
                    loadingIndicator.style.display = 'flex';
                    
                    // 测试图片是否可加载
                    previewImg.onload = function() {
                        loadingIndicator.style.display = 'none';
                        avatarHint.textContent = '✓ 图片加载成功';
                        avatarHint.classList.add('valid');
                        avatarHint.classList.remove('invalid');
                        avatarInput.setCustomValidity('');
                    };
                    
                    previewImg.onerror = function() {
                        loadingIndicator.style.display = 'none';
                        avatarHint.textContent = '× 无法加载图片，请检查链接';
                        avatarHint.classList.add('invalid');
                        avatarHint.classList.remove('valid');
                        avatarInput.setCustomValidity('无法加载图片');
                    };
                    
                    previewImg.src = value;
                } catch (e) {
                    // URL格式无效
                    previewContainer.classList.remove('show');
                    avatarHint.textContent = '× 请输入有效的图片链接';
                    avatarHint.classList.add('invalid');
                    avatarHint.classList.remove('valid');
                    avatarInput.setCustomValidity('请输入有效的URL');
                }
            } else {
                // 输入为空（这是可选的）
                previewContainer.classList.remove('show');
                avatarHint.textContent = '请输入有效的图片链接 (可选)';
                avatarHint.classList.remove('valid', 'invalid');
                avatarInput.setCustomValidity('');
            }
        });
        
        // 失去焦点时隐藏提示（如果URL有效或为空）
        avatarInput.addEventListener('blur', function() {
            if (this.validity.valid) {
                avatarHint.classList.remove('show');
            }
        });
        
        // 获得焦点时显示提示
        avatarInput.addEventListener('focus', function() {
            avatarHint.classList.add('show');
        });
    }
});