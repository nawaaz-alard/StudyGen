Write-Host "Starting StudyGen Local Development Environment"
Write-Host "1. Installing API Dependencies..."
cd api
npm install
npm run build

Write-Host "2. Starting Backend API (in background)..."
Start-Process -FilePath "func" -ArgumentList "start" -NoNewWindow

Write-Host "3. Installing Frontend Dependencies..."
cd ../frontend
npm install

Write-Host "4. Starting Frontend..."
npm run dev
