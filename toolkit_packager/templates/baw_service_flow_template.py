"""
BAW Service Flow Template Generator
Generates BAW-compliant service flow XML based on reverse-engineered format
"""

import time
import uuid
import json
from typing import List, Dict, Any


def generate_guid() -> str:
    """Generate a BAW-style GUID."""
    return f"guid:{uuid.uuid4()}"


def generate_process_id() -> str:
    """Generate a process ID with type prefix 1."""
    return f"1.{uuid.uuid4()}"


def generate_item_id() -> str:
    """Generate an item ID with type prefix 2025."""
    return f"2025.{uuid.uuid4()}"


def generate_component_id() -> str:
    """Generate a component ID with type prefix 3008."""
    return f"3008.{uuid.uuid4()}"


def generate_version_id() -> str:
    """Generate a version ID."""
    return str(uuid.uuid4())


def generate_timestamp() -> int:
    """Generate a timestamp in milliseconds."""
    return int(time.time() * 1000)


def create_bpmn_json_data(process_id: str, process_name: str, start_event_id: str, 
                          end_event_id: str, sequence_flow_id: str, lane_set_id: str,
                          lane_id: str, partition_ref: str) -> str:
    """Create the jsonData field with BPMN structure."""
    data = {
        "rootElement": [{
            "flowElement": [
                {
                    "parallelMultiple": False,
                    "outgoing": [sequence_flow_id],
                    "isInterrupting": False,
                    "extensionElements": {
                        "nodeVisualInfo": [{
                            "color": "#F8F8F8",
                            "width": 24,
                            "x": 25,
                            "y": 80,
                            "declaredType": "TNodeVisualInfo",
                            "height": 24
                        }]
                    },
                    "name": "Start",
                    "declaredType": "startEvent",
                    "id": start_event_id
                },
                {
                    "incoming": [sequence_flow_id],
                    "extensionElements": {
                        "nodeVisualInfo": [{
                            "color": "#F8F8F8",
                            "width": 24,
                            "x": 650,
                            "y": 80,
                            "declaredType": "TNodeVisualInfo",
                            "height": 24
                        }],
                        "endStateId": [f"guid:{end_event_id}"],
                        "saveExecutionContext": [True]
                    },
                    "name": "End",
                    "declaredType": "endEvent",
                    "id": end_event_id
                },
                {
                    "targetRef": end_event_id,
                    "extensionElements": {
                        "linkVisualInfo": [{
                            "sourcePortLocation": "rightCenter",
                            "showCoachControlLabel": False,
                            "labelPosition": 0.0,
                            "targetPortLocation": "leftCenter",
                            "declaredType": "TLinkVisualInfo",
                            "saveExecutionContext": False,
                            "showLabel": False
                        }]
                    },
                    "name": "To end",
                    "declaredType": "sequenceFlow",
                    "id": sequence_flow_id,
                    "sourceRef": start_event_id
                }
            ],
            "laneSet": [{
                "id": lane_set_id,
                "lane": [{
                    "flowNodeRef": [start_event_id, end_event_id],
                    "extensionElements": {
                        "nodeVisualInfo": [{
                            "color": "#F8F8F8",
                            "width": 3000,
                            "x": 0,
                            "y": 0,
                            "declaredType": "TNodeVisualInfo",
                            "height": 500
                        }]
                    },
                    "name": "System",
                    "partitionElementRef": partition_ref,
                    "declaredType": "lane",
                    "id": lane_id,
                    "otherAttributes": {
                        "{http://www.ibm.com/xmlns/prod/bpm/bpmn/ext/process/wle}isSystemLane": "true"
                    }
                }]
            }],
            "isClosed": False,
            "extensionElements": {
                "isSecured": [True],
                "isAjaxExposed": [False],
                "isTransactionalFlow": [False],
                "sboSyncEnabled": [True],
                "isInvokedAsynchronously": [False]
            },
            "documentation": [{"textFormat": "text/plain"}],
            "name": process_name,
            "declaredType": "process",
            "id": process_id,
            "processType": "None",
            "otherAttributes": {
                "{http://www.ibm.com/xmlns/prod/bpm/bpmn/ext/process}executionMode": "microflow"
            },
            "ioSpecification": {
                "inputSet": [{}],
                "outputSet": [{}]
            }
        }],
        "targetNamespace": "",
        "typeLanguage": "http://www.w3.org/2001/XMLSchema",
        "expressionLanguage": "http://www.ibm.com/xmlns/prod/bpm/expression-lang/javascript",
        "id": str(uuid.uuid4())
    }
    return json.dumps(data, separators=(',', ':'))


def generate_baw_service_flow(name: str, description: str = "") -> str:
    """
    Generate a complete BAW-compliant service flow XML.
    
    Args:
        name: Service flow name
        description: Service flow description
        
    Returns:
        Complete XML string in BAW format
    """
    # Generate all required IDs
    process_id = generate_process_id()
    process_guid = generate_guid()
    version_id = generate_version_id()
    timestamp = generate_timestamp()
    
    end_item_id = generate_item_id()
    end_guid = generate_guid()
    end_version_id = generate_version_id()
    component_id = generate_component_id()
    component_guid = generate_guid()
    component_version_id = generate_version_id()
    
    # BPMN IDs
    start_event_id = str(uuid.uuid4())
    end_event_id = str(uuid.uuid4())
    sequence_flow_id = str(uuid.uuid4())
    lane_set_id = str(uuid.uuid4())
    lane_id = str(uuid.uuid4())
    partition_ref = f"24.{uuid.uuid4()}"
    bpmn_def_id = str(uuid.uuid4())
    
    # Generate JSON data
    json_data = create_bpmn_json_data(
        process_id, name, start_event_id, end_event_id,
        sequence_flow_id, lane_set_id, lane_id, partition_ref
    )
    
    # Build XML
    xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<teamworks>
    <process id="{process_id}" name="{name}">
        <lastModified>{timestamp}</lastModified>
        <lastModifiedBy>cpmanager</lastModifiedBy>
        <tenantId isNull="true" />
        <processId>{process_id}</processId>
        <image isNull="true" />
        <tabGroup isNull="true" />
        <startingProcessItemId>{end_item_id}</startingProcessItemId>
        <isRootProcess>false</isRootProcess>
        <processType>10</processType>
        <isErrorHandlerEnabled>false</isErrorHandlerEnabled>
        <errorHandlerItemId isNull="true" />
        <isLoggingVariables>false</isLoggingVariables>
        <isTransactional>false</isTransactional>
        <processTimingLevel isNull="true" />
        <participantRef isNull="true" />
        <exposedType>0</exposedType>
        <isTrackingEnabled>true</isTrackingEnabled>
        <xmlData isNull="true" />
        <cachingType>false</cachingType>
        <itemLabel isNull="true" />
        <cacheLength>0</cacheLength>
        <mobileReady>false</mobileReady>
        <sboSyncEnabled>true</sboSyncEnabled>
        <externalId isNull="true" />
        <isSecured>true</isSecured>
        <isAjaxExposed>false</isAjaxExposed>
        <isInvokedAsynchronously>false</isInvokedAsynchronously>
        <isTransactionalFlow>false</isTransactionalFlow>
        <description isNull="true" />
        <guid>{process_guid}</guid>
        <versionId>{version_id}</versionId>
        <dependencySummary><dependencySummary id="bpdid:{process_guid.replace('guid:', '')}" /></dependencySummary>
        <jsonData>{json_data}</jsonData>
        <businessDataAliases isNull="true" />
        <field1 isNull="true" />
        <field2 isNull="true" />
        <field3>0</field3>
        <field4 isNull="true" />
        <field5>false</field5>
        <clobField1 isNull="true" />
        <blobField1 isNull="true" />
        <item>
            <lastModified isNull="true" />
            <lastModifiedBy isNull="true" />
            <tenantId isNull="true" />
            <processItemId>{end_item_id}</processItemId>
            <processId>{process_id}</processId>
            <name>End</name>
            <tWComponentName>ExitPoint</tWComponentName>
            <tWComponentId>{component_id}</tWComponentId>
            <isLogEnabled>false</isLogEnabled>
            <isTraceEnabled>false</isTraceEnabled>
            <traceCategory isNull="true" />
            <traceLevel isNull="true" />
            <traceMessage isNull="true" />
            <traceSymbolTable isNull="true" />
            <isExecutionContextTraced>false</isExecutionContextTraced>
            <saveExecutionContext>true</saveExecutionContext>
            <documentation isNull="true" />
            <isErrorHandlerEnabled>false</isErrorHandlerEnabled>
            <errorHandlerItemId isNull="true" />
            <guid>{end_guid}</guid>
            <versionId>{end_version_id}</versionId>
            <externalServiceRef isNull="true" />
            <externalServiceOp isNull="true" />
            <nodeColor isNull="true" />
            <layoutData x="650" y="80">
                <errorLink>
                    <controlPoints />
                    <showEndState>false</showEndState>
                    <showName>false</showName>
                </errorLink>
            </layoutData>
            <TWComponent>
                <lastModified isNull="true" />
                <lastModifiedBy isNull="true" />
                <tenantId isNull="true" />
                <exitPointId>{component_id}</exitPointId>
                <haltProcess>false</haltProcess>
                <guid>{component_guid}</guid>
                <versionId>{component_version_id}</versionId>
            </TWComponent>
        </item>
        <startingProcessItemId>{end_item_id}</startingProcessItemId>
        <errorHandlerItemId isNull="true" />
        <layoutData noConversion="true">
            <errorLink>
                <controlPoints />
                <showEndState>false</showEndState>
                <showName>false</showName>
            </errorLink>
        </layoutData>
        <startPoint>
            <layoutData x="25" y="80">
                <errorLink>
                    <controlPoints />
                    <showEndState>false</showEndState>
                    <showName>false</showName>
                </errorLink>
            </layoutData>
        </startPoint>
        <startLink>
            <fromPort locationId="rightCenter" portType="1" />
            <toPort locationId="leftCenter" portType="2" />
            <layoutData>
                <controlPoints />
                <showEndState>false</showEndState>
                <showName>false</showName>
            </layoutData>
        </startLink>
        <bpmn2Model>
            <ns16:definitions xmlns:ns16="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:ns2="http://www.ibm.com/xmlns/prod/bpm/bpmn/ext/team" xmlns:ns3="http://www.ibm.com/xmlns/prod/bpm/bpmn/ext/process" xmlns:ns4="http://www.ibm.com/xmlns/prod/bpm/bpmn/ext/process/wle" xmlns:ns5="http://www.ibm.com/xmlns/prod/bpm/bpmn/ext/process/case" xmlns:ns6="http://www.ibm.com/bpm/Extensions" xmlns:ns7="http://www.ibm.com/xmlns/prod/bpm/uca" xmlns:ns8="http://www.ibm.com/xmlns/prod/bpm/bpmn/ext/trackinggroup" xmlns:ns9="http://www.ibm.com/xmlns/bpmnx/20100524/v1/BusinessVocabulary" xmlns:ns10="http://www.omg.org/spec/DD/20100524/DI" xmlns:ns11="http://www.omg.org/spec/DD/20100524/DC" xmlns:ns12="http://www.omg.org/spec/BPMN/20100524/BPMNDI" xmlns:ns13="http://www.ibm.com/xmlns/prod/bpm/graph" xmlns:ns14="http://www.ibm.com/xmlns/prod/bpm/bpmn/ext/process/auth" xmlns:ns15="http://www.ibm.com/xmlns/prod/bpm/bpmn/ext/extservice" xmlns:ns17="http://www.ibm.com/bpm/processappsettings" xmlns:ns18="http://www.ibm.com/xmlns/links" xmlns:ns19="http://www.ibm.com/bpm/CoachDesignerNG" xmlns:ns20="http://www.ibm.com/xmlns/tagging" xmlns:ns21="http://www.ibm.com/bpm/uitheme" xmlns:ns22="http://www.ibm.com/bpm/coachview" id="{bpmn_def_id}" targetNamespace="" expressionLanguage="http://www.ibm.com/xmlns/prod/bpm/expression-lang/javascript" typeLanguage="http://www.w3.org/2001/XMLSchema">
                <ns16:process name="{name}" id="{process_id}" ns3:executionMode="microflow">
                    <ns16:documentation />
                    <ns16:extensionElements>
                        <ns3:isSecured>true</ns3:isSecured>
                        <ns3:sboSyncEnabled>true</ns3:sboSyncEnabled>
                        <ns3:isAjaxExposed>false</ns3:isAjaxExposed>
                        <ns3:isInvokedAsynchronously>false</ns3:isInvokedAsynchronously>
                        <ns3:isTransactionalFlow>false</ns3:isTransactionalFlow>
                    </ns16:extensionElements>
                    <ns16:ioSpecification>
                        <ns16:inputSet />
                        <ns16:outputSet />
                    </ns16:ioSpecification>
                    <ns16:laneSet id="{lane_set_id}">
                        <ns16:lane name="System" partitionElementRef="{partition_ref}" id="{lane_id}" ns4:isSystemLane="true">
                            <ns16:extensionElements>
                                <ns13:nodeVisualInfo x="0" y="0" width="3000" height="500" color="#F8F8F8" />
                            </ns16:extensionElements>
                            <ns16:flowNodeRef>{start_event_id}</ns16:flowNodeRef>
                            <ns16:flowNodeRef>{end_event_id}</ns16:flowNodeRef>
                        </ns16:lane>
                    </ns16:laneSet>
                    <ns16:startEvent isInterrupting="false" parallelMultiple="false" name="Start" id="{start_event_id}">
                        <ns16:extensionElements>
                            <ns13:nodeVisualInfo x="25" y="80" width="24" height="24" color="#F8F8F8" />
                        </ns16:extensionElements>
                        <ns16:outgoing>{sequence_flow_id}</ns16:outgoing>
                    </ns16:startEvent>
                    <ns16:endEvent name="End" id="{end_event_id}">
                        <ns16:extensionElements>
                            <ns13:nodeVisualInfo x="650" y="80" width="24" height="24" color="#F8F8F8" />
                            <ns3:endStateId>{end_guid}</ns3:endStateId>
                            <ns4:saveExecutionContext>true</ns4:saveExecutionContext>
                        </ns16:extensionElements>
                        <ns16:incoming>{sequence_flow_id}</ns16:incoming>
                    </ns16:endEvent>
                    <ns16:sequenceFlow sourceRef="{start_event_id}" targetRef="{end_event_id}" name="To end" id="{sequence_flow_id}">
                        <ns16:extensionElements>
                            <ns13:linkVisualInfo>
                                <ns13:sourcePortLocation>rightCenter</ns13:sourcePortLocation>
                                <ns13:targetPortLocation>leftCenter</ns13:targetPortLocation>
                                <ns13:showLabel>false</ns13:showLabel>
                                <ns13:showCoachControlLabel>false</ns13:showCoachControlLabel>
                                <ns13:labelPosition>0.0</ns13:labelPosition>
                                <ns13:saveExecutionContext>false</ns13:saveExecutionContext>
                            </ns13:linkVisualInfo>
                        </ns16:extensionElements>
                    </ns16:sequenceFlow>
                </ns16:process>
            </ns16:definitions>
        </bpmn2Model>
    </process>
</teamworks>
'''
    
    return xml


if __name__ == "__main__":
    # Test generation
    xml = generate_baw_service_flow("Test Service Flow", "Test description")
    print(xml)

# Made with Bob
