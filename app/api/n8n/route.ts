import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const webhookUrl = req.headers.get("X-Webhook-URL");
  
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Missing X-Webhook-URL header" },
      { status: 400 }
    );
  }

  // 验证 URL 格式
  try {
    const url = new URL(webhookUrl);
    // 检查是否是 localhost，如果是则提示错误
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return NextResponse.json(
        { error: "Cannot use localhost URL from server. Please use a public URL or deploy n8n on a public server." },
        { status: 400 }
      );
    }
  } catch (urlError) {
    return NextResponse.json(
      { error: "Invalid webhook URL format", detail: String(urlError) },
      { status: 400 }
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let upstream: Response;
    
    // 设置超时和重试
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时
    
    try {
      if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        // 重要：不要设置 Content-Type，让 fetch 自动处理 boundary
        upstream = await fetch(webhookUrl, {
          method: "POST",
          body: formData,
          signal: controller.signal,
          // 不设置 headers，让 FormData 自动设置正确的 Content-Type with boundary
        });
      } else {
        const body = await req.json();
        upstream = await fetch(webhookUrl, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "User-Agent": "n8n-saas-proxy/1.0",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
      }
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === "AbortError") {
        throw new Error("Request timeout: n8n webhook did not respond within 60 seconds");
      }
      throw fetchError;
    }

    const upstreamContentType = upstream.headers.get("content-type") || "";
    const contentDisposition = upstream.headers.get("content-disposition");

    // 如果 n8n 返回错误状态码，优先尝试解析错误信息
    if (!upstream.ok) {
      console.error(`n8n returned error status: ${upstream.status}`);
      console.error(`Content-Type: ${upstreamContentType}`);
      
      // 尝试解析 JSON 错误
      if (upstreamContentType.includes("application/json")) {
        try {
          const errJson = await upstream.json();
          console.error("=== n8n 错误响应详情 ===");
          console.error("状态码:", upstream.status);
          console.error("Content-Type:", upstreamContentType);
          console.error("完整错误 JSON:", JSON.stringify(errJson, null, 2));
          console.error("错误对象的所有键:", Object.keys(errJson));
          
          // 针对 404 错误（webhook 未注册）提供更详细的提示
          if (upstream.status === 404) {
            const hint = errJson.hint || "请确保：1) 在 n8n 中点击 'Execute workflow' 或 'Listen for test event' 按钮激活工作流，2) 使用正确的 webhook URL（测试模式需要先激活），3) 检查 webhook 路径是否正确";
            return NextResponse.json(
              {
                code: 404,
                message: errJson.message || errJson.error || "The requested webhook is not registered.",
                hint: hint,
                details: errJson
              },
              { status: 404 }
            );
          }
          
          // 提取更详细的错误信息 - 尝试多种可能的字段
          const errorMessage = 
            errJson.message || 
            errJson.error || 
            errJson.name || 
            errJson.description ||
            errJson.reason ||
            "Workflow execution failed";
          
          const errorDetails = {
            ...errJson,
            // 尝试提取各种可能的错误信息字段
            nodeError: errJson.node || errJson.nodeName || errJson.nodeType || errJson.failedNode || null,
            errorType: errJson.type || errJson.errorType || errJson.code || null,
            stack: errJson.stack || errJson.trace || null,
            cause: errJson.cause || errJson.causedBy || null,
            // 保留所有原始字段
            allFields: errJson
          };
          
          console.error("提取的错误信息:", {
            message: errorMessage,
            nodeError: errorDetails.nodeError,
            errorType: errorDetails.errorType,
            hasStack: !!errorDetails.stack,
            hasCause: !!errorDetails.cause
          });
          
          return NextResponse.json(
            {
              error: "Workflow execution failed",
              message: errorMessage,
              details: errorDetails,
              fullError: errJson, // 保留完整错误对象
              status: upstream.status,
              hint: "请检查 n8n 工作流的执行历史，查看具体是哪个节点失败了。在 n8n 中打开工作流，点击 'Executions' 标签页查看详细错误信息。"
            },
            { status: upstream.status }
          );
        } catch (e) {
          console.error("Failed to parse JSON error:", e);
        }
      }
      
      // 如果不是 JSON，尝试读取文本错误
      try {
        const errorText = await upstream.text();
        console.error("=== n8n 错误响应（文本格式）===");
        console.error("状态码:", upstream.status);
        console.error("Content-Type:", upstreamContentType);
        console.error("错误文本:", errorText);
        console.error("文本长度:", errorText.length);
        
        // 针对 404 错误提供更详细的提示
        if (upstream.status === 404) {
          return NextResponse.json(
            { 
              code: 404,
              message: "The requested webhook is not registered.",
              hint: "请确保：1) 在 n8n 中点击 'Execute workflow' 或 'Listen for test event' 按钮激活工作流，2) 使用正确的 webhook URL（测试模式需要先激活），3) 检查 webhook 路径是否正确",
              detail: errorText || "Unknown error from n8n"
            },
            { status: 404 }
          );
        }
        
        return NextResponse.json(
          { 
            error: "Workflow execution failed", 
            message: errorText || "Unknown error from n8n",
            status: upstream.status 
          },
          { status: upstream.status }
        );
      } catch (e) {
        console.error("Failed to read error text:", e);
        
        // 针对 404 错误提供更详细的提示
        if (upstream.status === 404) {
          return NextResponse.json(
            { 
              code: 404,
              message: "The requested webhook is not registered.",
              hint: "请确保：1) 在 n8n 中点击 'Execute workflow' 或 'Listen for test event' 按钮激活工作流，2) 使用正确的 webhook URL（测试模式需要先激活），3) 检查 webhook 路径是否正确"
            },
            { status: 404 }
          );
        }
        
        return NextResponse.json(
          { 
            error: "Workflow execution failed", 
            message: `HTTP ${upstream.status} error from n8n`,
            status: upstream.status 
          },
          { status: upstream.status }
        );
      }
    }

    // 成功响应：处理二进制文件
    if (upstreamContentType && !upstreamContentType.includes("application/json")) {
      const buffer = Buffer.from(await upstream.arrayBuffer());
      const headers: Record<string, string> = { "content-type": upstreamContentType };
      if (contentDisposition) {
        headers["content-disposition"] = contentDisposition;
      }
      return new NextResponse(buffer, {
        status: upstream.status,
        headers,
      });
    }

    // 成功响应：处理 JSON
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (error: any) {
    console.error("API Error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Webhook URL attempted:", webhookUrl);
    const errorMessage = error.message || String(error);
    return NextResponse.json(
      { 
        error: "Failed to reach n8n webhook", 
        detail: errorMessage,
        hint: "Please check: 1) n8n webhook URL is correct and publicly accessible, 2) n8n service is running, 3) network connectivity",
        webhook_url: webhookUrl
      },
      { status: 500 }
    );
  }
}
