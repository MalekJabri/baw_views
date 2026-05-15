"""
Test script for generate_bpmn - Generates BPMN XML from JSON config
"""

import sys
from pathlib import Path
from generate_bpmn import ConfigLoader

def test_simple_claim_submission():
    """Test generating BPMN from SimpleClaimSubmission config"""
    
    print("=" * 60)
    print("Testing BPMN Config Loader")
    print("=" * 60)
    
    # Path to test config
    config_path = "../business-processes/configs/Insurance/SimpleClaimSubmission.bpmn-config.json"
    output_path = "output/SimpleClaimSubmission.bpmn"
    
    try:
        # Create loader
        loader = ConfigLoader()
        
        # Load config
        print(f"\n📄 Loading config from: {config_path}")
        config = loader.load_config(config_path)
        print(f"✅ Config loaded successfully")
        print(f"   Process: {config['process']['name']}")
        print(f"   ID: {config['process']['id']}")
        
        # Validate config
        print(f"\n🔍 Validating configuration...")
        errors = loader.validate_config()
        if errors:
            print(f"❌ Validation failed with {len(errors)} errors:")
            for error in errors:
                print(f"   - {error}")
            return False
        print(f"✅ Configuration is valid")
        
        # Generate BPMN XML
        print(f"\n⚙️  Generating BPMN XML...")
        xml_content = loader.generate_from_config()
        print(f"✅ BPMN XML generated ({len(xml_content)} characters)")
        
        # Save to file
        print(f"\n💾 Saving to: {output_path}")
        loader.save_bpmn(output_path)
        print(f"✅ BPMN file saved successfully")
        
        # Show summary
        summary = loader.generator.get_summary()
        print(f"\n📊 Process Summary:")
        print(f"   Process Name: {summary['process_name']}")
        print(f"   Process ID: {summary['process_id']}")
        print(f"   Total Flow Nodes: {summary['total_flow_nodes']}")
        print(f"   Node Types:")
        for node_type, count in summary['node_types'].items():
            print(f"      - {node_type}: {count}")
        print(f"   Sequence Flows: {summary['sequence_flows']}")
        print(f"   Lanes: {summary['lanes']}")
        print(f"   Milestones: {summary['milestones']}")
        
        print(f"\n✅ Test completed successfully!")
        print(f"\n📁 Output file: {Path(output_path).absolute()}")
        
        return True
        
    except FileNotFoundError as e:
        print(f"\n❌ Error: Config file not found")
        print(f"   {e}")
        return False
    except ValueError as e:
        print(f"\n❌ Error: Invalid configuration")
        print(f"   {e}")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error:")
        print(f"   {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = test_simple_claim_submission()
    sys.exit(0 if success else 1)

# Made with Bob
