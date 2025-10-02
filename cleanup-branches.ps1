# Cleanup script to run after changing default branch to 'main' on GitHub
# Run this script after you've changed the default branch on GitHub web interface

Write-Host "🔧 Cleaning up repository branches..." -ForegroundColor Green

# Delete the remote master branch (after it's no longer default)
Write-Host "1. Deleting remote master branch..." -ForegroundColor Yellow
git push origin --delete master

# Update remote references
Write-Host "2. Updating remote references..." -ForegroundColor Yellow
git fetch --prune

# Show current branch status
Write-Host "3. Current branch status:" -ForegroundColor Yellow
git branch -a

# Show remote info
Write-Host "4. Remote repository info:" -ForegroundColor Yellow
git remote show origin

Write-Host "✅ Branch cleanup complete! 'main' is now the default branch." -ForegroundColor Green
Write-Host "🎉 Your repository is clean and follows modern Git standards!" -ForegroundColor Cyan
