# Script to download a sample image for the blog post
$imageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
$outputPath = "images/blog/programming-tips.jpg"

# Create directory if it doesn't exist
$directory = [System.IO.Path]::GetDirectoryName($outputPath)
if (-not (Test-Path -Path $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
}

# Download the image
Write-Host "Downloading image to $outputPath..."
Invoke-WebRequest -Uri $imageUrl -OutFile $outputPath

Write-Host "Image downloaded successfully!"
