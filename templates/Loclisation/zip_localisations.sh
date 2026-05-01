#!/bin/bash

# Script to zip all localization files per project
# This script creates a zip file for each project directory containing all .properties files

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the Localisation directory
cd "$SCRIPT_DIR"

echo "Starting localization packaging..."
echo "=================================="

# Loop through each subdirectory (project)
for project_dir in */; do
    # Remove trailing slash
    project_name="${project_dir%/}"
    
    # Skip if it's not a directory
    if [ ! -d "$project_name" ]; then
        continue
    fi
    
    # Check if there are any .properties files in the directory
    properties_count=$(find "$project_name" -maxdepth 1 -name "*.properties" | wc -l)
    
    if [ "$properties_count" -gt 0 ]; then
        # Create zip file name with timestamp
        timestamp=$(date +"%Y%m%d_%H%M%S")
        zip_file="${project_name}_localisations_${timestamp}.zip"
        
        echo ""
        echo "Processing project: $project_name"
        echo "Found $properties_count properties file(s)"
        
        # Create zip file containing all .properties files from the project
        cd "$project_name"
        zip -r "../$zip_file" *.properties
        cd ..
        
        echo "Created: $zip_file"
    else
        echo ""
        echo "Skipping $project_name (no .properties files found)"
    fi
done

echo ""
echo "=================================="
echo "Localization packaging complete!"
echo ""
echo "Generated zip files:"
ls -lh *_localisations_*.zip 2>/dev/null || echo "No zip files created"

# Made with Bob
