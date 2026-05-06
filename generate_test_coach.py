#!/usr/bin/env python3
"""
Generate test coach CLI tool.

Simple command-line interface to generate test coaches for BAW widgets.
"""

import argparse
import sys
from pathlib import Path

from toolkit_packager.generators import generate_service_flow
from toolkit_packager.utils.logger import get_logger

logger = get_logger(__name__)


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='Generate BAW test coach for widgets',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Generate coach for single widget
  python generate_test_coach.py --name "ProgressBar Test" --widgets widgets/ProgressBar
  
  # Generate coach for multiple widgets
  python generate_test_coach.py --name "Multi Widget Test" \\
    --widgets widgets/ProgressBar widgets/Stepper widgets/Breadcrumb
  
  # Specify output location
  python generate_test_coach.py --name "My Test" \\
    --widgets widgets/ProgressBar \\
    --output output/test_coaches/my_test.xml
        """
    )
    
    parser.add_argument(
        '--name',
        required=True,
        help='Name of the test coach/service flow'
    )
    
    parser.add_argument(
        '--widgets',
        nargs='+',
        required=True,
        help='Paths to widget directories'
    )
    
    parser.add_argument(
        '--output',
        type=Path,
        help='Output file path (default: output/test_coaches/<name>.xml)'
    )
    
    parser.add_argument(
        '--verbose',
        '-v',
        action='store_true',
        help='Enable verbose logging'
    )
    
    args = parser.parse_args()
    
    # Configure logging
    if args.verbose:
        import logging
        logging.getLogger('toolkit_packager').setLevel(logging.DEBUG)
    
    # Convert widget paths to Path objects
    widget_paths = [Path(w) for w in args.widgets]
    
    # Validate widget paths
    for widget_path in widget_paths:
        if not widget_path.exists():
            logger.error(f"Widget directory not found: {widget_path}")
            sys.exit(1)
        
        config_file = widget_path / "widget" / "config.json"
        if not config_file.exists():
            logger.error(f"Widget config.json not found: {config_file}")
            sys.exit(1)
    
    # Determine output path
    if args.output:
        output_path = args.output
    else:
        # Default: output/test_coaches/<name>.xml
        safe_name = args.name.replace(' ', '_').lower()
        output_path = Path('output') / 'test_coaches' / f'{safe_name}.xml'
    
    try:
        logger.info(f"Generating test coach: {args.name}")
        logger.info(f"Widgets: {[str(p) for p in widget_paths]}")
        logger.info(f"Output: {output_path}")
        
        # Generate service flow
        result_path = generate_service_flow(
            name=args.name,
            widget_paths=widget_paths,
            output_path=output_path
        )
        
        print(f"\n✅ Success! Test coach generated:")
        print(f"   {result_path}")
        
        return 0
        
    except Exception as e:
        logger.error(f"Failed to generate test coach: {e}", exc_info=True)
        print(f"\n❌ Error: {e}")
        return 1


if __name__ == '__main__':
    sys.exit(main())

# Made with Bob
