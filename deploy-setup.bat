@echo off
chcp 65001 >nul
echo ========================================
echo   Next.js 项目部署准备脚本
echo ========================================
echo.

echo [1/4] 检查 Git 是否已安装...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到 Git，请先安装 Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✅ Git 已安装
echo.

echo [2/4] 初始化 Git 仓库...
if exist .git (
    echo ✅ Git 仓库已存在
) else (
    git init
    echo ✅ Git 仓库初始化完成
)
echo.

echo [3/4] 检查是否有未提交的更改...
git add .
git status --short
echo.

echo [4/4] 准备提交...
echo.
echo ========================================
echo   下一步操作：
echo ========================================
echo.
echo 1. 提交代码到本地仓库：
echo    git commit -m "Initial commit"
echo.
echo 2. 在 GitHub 上创建新仓库：
echo    - 访问 https://github.com/new
echo    - 输入仓库名称
echo    - 不要勾选 "Initialize with README"
echo    - 点击 "Create repository"
echo.
echo 3. 连接并推送到 GitHub：
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. 在 Vercel 上部署：
echo    - 访问 https://vercel.com
echo    - 使用 GitHub 登录
echo    - 导入你的 GitHub 仓库
echo    - 配置环境变量（NEXT_PUBLIC_SUPABASE_URL 等）
echo    - 点击部署
echo.
echo 详细说明请查看 DEPLOYMENT.md 文件
echo.
pause

