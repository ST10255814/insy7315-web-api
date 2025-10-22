# Branch Protection Setup for GitHub

This document explains how to set up branch protection rules for the main branch to require the security pipeline to pass before merging.

## Setup Instructions:

1. **Go to your GitHub repository**
2. **Navigate to Settings > Branches**
3. **Click "Add rule" for the main branch**
4. **Configure the following settings:**

### Branch Protection Rule Configuration:

```
Branch name pattern: main

☑️ Require a pull request before merging
  ☑️ Require approvals: 1
  ☑️ Dismiss stale PR approvals when new commits are pushed
  ☑️ Require review from code owners (optional)

☑️ Require status checks to pass before merging
  ☑️ Require branches to be up to date before merging
  
  Required status checks (add these):
  - Security & Dependency Scan
  - Code Quality & Security Linting  
  - Backend Unit Tests
  - Frontend Build Test
  - Backend Build Test

☑️ Require conversation resolution before merging
☑️ Include administrators (recommended)
```

## Pipeline Features:

### 🔒 Security Checks:
- ✅ Secret detection in code
- ✅ Dependency vulnerability scanning (npm audit)
- ✅ ESLint security rules
- ✅ Console statement detection
- ✅ Hardcoded URL detection

### 🧪 Testing:
- ✅ Backend unit tests (48 tests)
- ✅ Test result artifacts uploaded
- ✅ Coverage reporting

### 🏗️ Build Verification:
- ✅ Frontend build test
- ✅ Backend startup test
- ✅ Build artifacts uploaded

### 🚀 Integration:
- ✅ Runs on pushes to main and pipeline branches
- ✅ Runs on pull requests to main
- ✅ Works with Render auto-deployment
- ✅ GitHub notifications

## Testing the Pipeline:

1. **Create and switch to pipeline branch:**
   ```bash
   git checkout -b pipeline
   git push -u origin pipeline
   ```

2. **Make a small change and push:**
   ```bash
   # Make a small change to trigger the pipeline
   echo "# Pipeline test" >> README.md
   git add README.md
   git commit -m "test: trigger security pipeline"
   git push
   ```

3. **Check the Actions tab in GitHub to see the pipeline running**

4. **Once it passes on pipeline branch, merge to main:**
   ```bash
   git checkout main
   git merge pipeline
   git push
   ```

## Pipeline Stages:

1. **Security Scan** - Runs secret detection and dependency audits
2. **Code Quality** - ESLint security analysis  
3. **Backend Tests** - Unit tests with Jest
4. **Frontend Build** - Verifies frontend can build
5. **Backend Build** - Verifies backend can start
6. **Success/Failure** - Final status notification

The pipeline will automatically run when you push to the pipeline branch for testing!