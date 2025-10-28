#!/usr/bin/env bash

# Test script for local coverage merging
# This simulates what the CI workflow does

set -e

echo "🧪 Testing coverage merge locally..."

# Clean previous runs
rm -rf merged-coverage .nyc_output coverage-merged

# Run tests
echo "📊 Running tests with coverage..."
pnpm test

# Create merged coverage directory
mkdir -p merged-coverage

# Find and copy all coverage files
echo "🔍 Finding coverage files..."
count=0
find . -name 'coverage-final.json' -path '*/coverage/*' | while read file; do
  dir=$(dirname $(dirname "$file"))
  package_name=$(basename "$dir")
  cp "$file" "merged-coverage/${package_name}-coverage-final.json"
  count=$((count + 1))
  echo "  ✓ $package_name"
done

# Check if we have coverage files
if [ ! "$(ls -A merged-coverage 2>/dev/null)" ]; then
  echo "❌ No coverage files found!"
  exit 1
fi

echo ""
echo "📦 Found coverage files:"
ls -1 merged-coverage/ | sed 's/^/  - /'

# Merge coverage files
echo ""
echo "🔀 Merging coverage files..."
npx nyc merge merged-coverage .nyc_output/coverage-final.json

# Generate reports
echo "📝 Generating coverage reports..."
npx nyc report --reporter=json-summary --reporter=text --report-dir=coverage-merged

# Display results
echo ""
echo "✨ Coverage Summary:"
cat coverage-merged/coverage-summary.json | node -e "
  const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
  const total = data.total;

  console.log('');
  console.log('  Lines:      ' + total.lines.pct.toFixed(2) + '%');
  console.log('  Statements: ' + total.statements.pct.toFixed(2) + '%');
  console.log('  Functions:  ' + total.functions.pct.toFixed(2) + '%');
  console.log('  Branches:   ' + total.branches.pct.toFixed(2) + '%');
  console.log('');
"

echo "✅ Coverage merge test complete!"
echo ""
echo "📄 Detailed report available at: coverage-merged/coverage-summary.json"
