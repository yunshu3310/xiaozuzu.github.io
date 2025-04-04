// Cloudflare Worker脚本 - 留言墙API

// 定义KV命名空间绑定名称（部署时需要在Cloudflare Dashboard中创建并绑定）
// KV_MESSAGES 是KV命名空间的绑定名称

// 定义环境变量（需要在Cloudflare Dashboard中配置）
// NOTIFICATION_API_URL - 通知平台的API URL（如飞书机器人的Webhook地址）

/**
 * 发送通知到配置的通知平台
 * 需要在Cloudflare Workers环境变量中配置：
 * - NOTIFICATION_API_URL: 通知平台的API URL（如飞书机器人的Webhook地址）
 */
async function sendNotification(type, data) {
  // 检查是否配置了通知API
  const notificationApiUrl = NOTIFICATION_API_URL || null;
  
  if (!notificationApiUrl) {
    console.log('通知功能未配置，跳过发送通知');
    return;
  }
  
  try {
    // 构建通知内容
    let title, content;
    
    if (type === 'message') {
      title = '新留言通知';
      content = `收到来自 ${data.name} (${data.email}) 的新留言：\n${data.content}`;
    } else if (type === 'contact') {
      title = '新联系表单提交';
      content = `收到来自 ${data.name} (${data.email}) 的联系表单：\n${data.message}`;
    } else if (type === 'friendlink') {
      title = '新友链申请通知';
      content = `收到来自 ${data.name} 的友链申请：\n网站名称：${data.name}\n网站地址：${data.url}\n头像链接：${data.avatar || '未提供'}\n邮箱地址：${data.email}\n网站描述：${data.description}`;
    } else {
      return; // 未知类型，不发送通知
    }
    
    // 构建飞书机器人通知请求体
    const notificationData = {
      msg_type: "text",
      content: {
        text: `${title}\n\n${content}`
      }
    };
    
    // 发送通知请求
    const response = await fetch(notificationApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificationData)
    });
    
    if (!response.ok) {
      throw new Error(`通知发送失败: ${response.status}`);
    }
    
    console.log('通知发送成功');
  } catch (error) {
    console.error('发送通知时出错:', error);
    // 通知发送失败不影响主流程
  }
}

/**
 * 处理请求的主函数
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 设置CORS头，允许前端页面访问
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // 在生产环境中应该设置为特定域名
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // 处理预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  // 根据路径和方法处理不同的API请求
  if (path === '/api/messages') {
    // 获取所有留言
    if (request.method === 'GET') {
      try {
        // 从KV存储中获取留言数据
        const messagesJson = await KV_MESSAGES.get('wall-messages');
        const messages = messagesJson ? JSON.parse(messagesJson) : [];
        
        return new Response(JSON.stringify(messages), {
          headers: corsHeaders
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: '获取留言失败' }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    
    // 添加新留言
    if (request.method === 'POST') {
      try {
        // 解析请求体
        const data = await request.json();
        
        // 验证必填字段
        if (!data.name || !data.email || !data.content) {
          return new Response(JSON.stringify({ error: '缺少必填字段' }), {
            status: 400,
            headers: corsHeaders
          });
        }
        
        // 从KV存储中获取现有留言
        const messagesJson = await KV_MESSAGES.get('wall-messages');
        const messages = messagesJson ? JSON.parse(messagesJson) : [];
        
        // 创建新留言对象
        const newMessage = {
          id: Date.now(),
          name: data.name,
          email: data.email,
          content: data.content,
          timestamp: Date.now()
        };
        
        // 添加到留言数组
        messages.push(newMessage);
        
        // 保存回KV存储
        await KV_MESSAGES.put('wall-messages', JSON.stringify(messages));
        
        // 发送新留言通知
        await sendNotification('message', newMessage);
        
        return new Response(JSON.stringify(newMessage), {
          headers: corsHeaders
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: '添加留言失败' }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
  }
  
  // 处理联系表单提交
  if (path === '/api/contact') {
    if (request.method === 'POST') {
      try {
        // 解析请求体
        const data = await request.json();
        
        // 验证必填字段
        if (!data.name || !data.email || !data.message) {
          return new Response(JSON.stringify({ error: '缺少必填字段' }), {
            status: 400,
            headers: corsHeaders
          });
        }
        
        // 从KV存储中获取现有联系表单提交
        const contactsJson = await KV_MESSAGES.get('contact-submissions');
        const contacts = contactsJson ? JSON.parse(contactsJson) : [];
        
        // 创建新联系表单提交对象
        const newContact = {
          id: Date.now(),
          name: data.name,
          email: data.email,
          message: data.message,
          timestamp: Date.now()
        };
        
        // 添加到联系表单提交数组
        contacts.push(newContact);
        
        // 保存回KV存储
        await KV_MESSAGES.put('contact-submissions', JSON.stringify(contacts));
        
        // 发送新联系表单通知
        await sendNotification('contact', newContact);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: corsHeaders
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: '提交联系表单失败' }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
  }
  
  // 处理友情链接申请
  if (path === '/api/friendlinks') {
    // 获取所有友链申请
    if (request.method === 'GET') {
      try {
        // 从KV存储中获取友链数据
        const friendlinksJson = await KV_MESSAGES.get('friend-links');
        const friendlinks = friendlinksJson ? JSON.parse(friendlinksJson) : [];
        
        return new Response(JSON.stringify(friendlinks), {
          headers: corsHeaders
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: '获取友链失败' }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    
    // 添加新友链申请
    if (request.method === 'POST') {
      try {
        // 解析请求体
        const data = await request.json();
        
        // 验证必填字段
        if (!data.name || !data.url || !data.email || !data.description) {
          return new Response(JSON.stringify({ error: '缺少必填字段' }), {
            status: 400,
            headers: corsHeaders
          });
        }
        
        // 从KV存储中获取现有友链申请
        const friendlinksJson = await KV_MESSAGES.get('friend-links');
        const friendlinks = friendlinksJson ? JSON.parse(friendlinksJson) : [];
        
        // 创建新友链申请对象
        const newFriendlink = {
          id: Date.now(),
          name: data.name,
          url: data.url,
          avatar: data.avatar || '',
          email: data.email,
          description: data.description,
          approved: false,  // 默认为未审核状态
          timestamp: Date.now()
        };
        
        // 添加到友链申请数组
        friendlinks.push(newFriendlink);
        
        // 保存回KV存储
        await KV_MESSAGES.put('friend-links', JSON.stringify(friendlinks));
        
        // 发送新友链申请通知
        await sendNotification('friendlink', newFriendlink);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: corsHeaders
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: '提交友链申请失败' }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
  }
  
  // 如果没有匹配的路径，返回404
  return new Response(JSON.stringify({ error: '未找到请求的资源' }), {
    status: 404,
    headers: corsHeaders
  });
}

// 注册事件监听器
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});