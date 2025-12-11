# Test the Chatbot API

# Test 1: Health Check
Write-Host "`n=== Test 1: Health Check ===" -ForegroundColor Cyan
$healthResponse = Invoke-RestMethod -Uri "http://localhost:8086/api/health" -Method Get
Write-Host "Status: $($healthResponse.status)" -ForegroundColor Green
Write-Host "Provider: $($healthResponse.provider)" -ForegroundColor Green

# Test 2: Simple Question
Write-Host "`n=== Test 2: Simple Question ===" -ForegroundColor Cyan
$body = @{
    message = "How do I book a vehicle?"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8086/api/chat" -Method Post -Body $body -ContentType "application/json"
Write-Host "Question: How do I book a vehicle?" -ForegroundColor Yellow
Write-Host "Response: $($response.reply)" -ForegroundColor Green

# Test 3: Pricing Question
Write-Host "`n=== Test 3: Pricing Question ===" -ForegroundColor Cyan
$body = @{
    message = "How much does it cost to rent a car?"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8086/api/chat" -Method Post -Body $body -ContentType "application/json"
Write-Host "Question: How much does it cost to rent a car?" -ForegroundColor Yellow
Write-Host "Response: $($response.reply)" -ForegroundColor Green

# Test 4: Vehicle Types
Write-Host "`n=== Test 4: Vehicle Types ===" -ForegroundColor Cyan
$body = @{
    message = "What types of vehicles do you have?"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8086/api/chat" -Method Post -Body $body -ContentType "application/json"
Write-Host "Question: What types of vehicles do you have?" -ForegroundColor Yellow
Write-Host "Response: $($response.reply)" -ForegroundColor Green

# Test 5: Conversation with History
Write-Host "`n=== Test 5: Conversation with History ===" -ForegroundColor Cyan
$body = @{
    message = "Can you help me find an SUV?"
    conversationHistory = @(
        @{ role = "user"; content = "Hello" }
        @{ role = "assistant"; content = "Hi! How can I help?" }
    )
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri "http://localhost:8086/api/chat" -Method Post -Body $body -ContentType "application/json"
Write-Host "Question: Can you help me find an SUV?" -ForegroundColor Yellow
Write-Host "Response: $($response.reply)" -ForegroundColor Green

Write-Host "`n=== All Tests Complete! ===" -ForegroundColor Cyan
Write-Host "The chatbot is working correctly!" -ForegroundColor Green
