# Localization Files

This directory contains localization files for various projects.

## Structure

Each project has its own subdirectory containing `.properties` files for different languages:
- `*.properties` - Default/English localization
- `*_fr.properties` - French localization
- `*_nl.properties` - Dutch localization

## Projects

### EtnicProject
Contains localization files for the Vacation ETNIC application:
- `VacationETNIC.properties` - English
- `VacationETNIC_fr.properties` - French
- `VacationETNIC_nl.properties` - Dutch

## Packaging Script

### zip_localisations.sh

A shell script that automatically creates zip archives of all localization files per project.

**Usage:**
```bash
cd Loclisation
./zip_localisations.sh
```

**Features:**
- Automatically detects all project directories
- Creates timestamped zip files for each project
- Includes all `.properties` files in the archive
- Provides summary of created archives

**Output:**
The script creates zip files with the naming convention:
```
{ProjectName}_localisations_{YYYYMMDD_HHMMSS}.zip
```

Example: `EtnicProject_localisations_20260120_155400.zip`

**Requirements:**
- Unix-like environment (Linux, macOS, Git Bash on Windows)
- `zip` command available in PATH

## Adding New Projects

To add localization files for a new project:

1. Create a new directory under `Loclisation/`
2. Add your `.properties` files with appropriate language suffixes
3. Run `./zip_localisations.sh` to package all projects

The script will automatically detect and package the new project.