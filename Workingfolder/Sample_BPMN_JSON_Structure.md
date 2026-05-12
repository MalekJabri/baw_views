# Sample.bpmn - JSON Structure Representation

This document provides a JSON-formatted structure of the BPMN file for programmatic access and integration.

## Complete JSON Structure

```json
{
  "metadata": {
    "fileName": "Sample.bpmn",
    "processName": "Sample",
    "processType": "Private",
    "executable": false,
    "exporter": "IBM WebSphere BPM Blueworks Live",
    "exporterVersion": "2.0",
    "targetNamespace": "http://www.ibm.com/WebSphere/bpm/BlueworksLive/aec9475c8-1befcddc24",
    "bpmnVersion": "2.0",
    "xmlVersion": "1.0",
    "encoding": "UTF-8",
    "standalone": true
  },
  
  "identifiers": {
    "definitionId": "bpmn-29c812b2-b14f-42ff-8a59-163be48dcaa6",
    "processId": "bpmn-c25a80c2-46d7-4d50-adbd-73b4f20948d1",
    "diagramId": "bpmn-4f4f7385-8b81-45d2-979a-6aae4a0afdd6",
    "laneSetId": "bpmn-43a8eb7b-3c36-4695-b623-d42f2a170871",
    "milestonesContainerId": "bpmn-9bc7999e-2577-4d0d-9940-479c595ef755"
  },
  
  "imports": [
    {
      "namespace": "http://www.ibm.com/WebSphere/bpm/BlueworksLive/Glossaries",
      "location": "../Glossaries.bpmn",
      "importType": "http://www.omg.org/spec/BPMN/20100524/MODEL"
    },
    {
      "namespace": "http://www.ibm.com/WebSphere/bpm/BlueworksLive/Resources",
      "location": "../Resources.bpmn",
      "importType": "http://www.omg.org/spec/BPMN/20100524/MODEL"
    },
    {
      "namespace": "IBM_SWG_IndustrySolutions2",
      "location": "../InputOutput.xsd",
      "importType": "http://www.w3.org/2001/XMLSchema"
    }
  ],
  
  "milestones": [
    {
      "id": "bpmn-70a0bc2b-5586-4ff2-8017-b48ca203cc73",
      "name": "onboard",
      "flowNodeRefs": [
        "bpmn-181d77d4-8206-4b0e-a2a5-2b1a9083e6c5",
        "bpmn-364398b2-6e28-45fc-b4d4-980d5fa180a3"
      ],
      "activities": ["Start", "Retrieve all the documentation"]
    },
    {
      "id": "bpmn-d0fa529c-1bc9-4005-b190-b1758a7866fb",
      "name": "Review",
      "flowNodeRefs": [
        "bpmn-cdb2d503-61cf-4637-bdb7-55ed35e888f6"
      ],
      "activities": ["Review"]
    },
    {
      "id": "bpmn-33765456-1730-4810-922f-f27b61bbee46",
      "name": "Decision",
      "flowNodeRefs": [
        "bpmn-c131ff96-c18e-459b-972b-537481852914",
        "bpmn-1e980e3e-8384-4cf2-8f48-67c494b31584"
      ],
      "activities": ["Decision", "End"]
    }
  ],
  
  "lanes": [
    {
      "id": "bpmn-3be711e1-26de-43b2-9738-e748e72598cc",
      "name": "Claim Manager",
      "flowNodeRefs": [
        "bpmn-c131ff96-c18e-459b-972b-537481852914",
        "bpmn-1e980e3e-8384-4cf2-8f48-67c494b31584"
      ],
      "resourceRef": "res:bpmn-3be711e1-26de-43b2-9738-e748e72598cc",
      "activities": ["Decision", "End"]
    },
    {
      "id": "bpmn-fe2efc32-c181-49c8-9c10-9c6d5229a851",
      "name": "Claims Analyst",
      "flowNodeRefs": [
        "bpmn-cdb2d503-61cf-4637-bdb7-55ed35e888f6"
      ],
      "resourceRef": "res:bpmn-fe2efc32-c181-49c8-9c10-9c6d5229a851",
      "activities": ["Review"]
    }
  ],
  
  "flowNodes": [
    {
      "id": "bpmn-181d77d4-8206-4b0e-a2a5-2b1a9083e6c5",
      "type": "startEvent",
      "name": "Start",
      "milestone": "onboard",
      "lane": null,
      "performer": null,
      "position": {
        "x": 68,
        "y": 256,
        "width": 24,
        "height": 24
      }
    },
    {
      "id": "bpmn-364398b2-6e28-45fc-b4d4-980d5fa180a3",
      "type": "serviceTask",
      "name": "Retrieve all the documentation",
      "milestone": "onboard",
      "lane": null,
      "performer": null,
      "position": {
        "x": 120,
        "y": 240,
        "width": 96,
        "height": 56
      }
    },
    {
      "id": "bpmn-cdb2d503-61cf-4637-bdb7-55ed35e888f6",
      "type": "userTask",
      "name": "Review",
      "milestone": "Review",
      "lane": "Claims Analyst",
      "performer": {
        "name": "Claims Analyst",
        "resourceRef": "res:bpmn-fe2efc32-c181-49c8-9c10-9c6d5229a851"
      },
      "position": {
        "x": 248,
        "y": 152,
        "width": 96,
        "height": 56
      }
    },
    {
      "id": "bpmn-c131ff96-c18e-459b-972b-537481852914",
      "type": "userTask",
      "name": "Decision",
      "milestone": "Decision",
      "lane": "Claim Manager",
      "performer": {
        "name": "Claim Manager",
        "resourceRef": "res:bpmn-3be711e1-26de-43b2-9738-e748e72598cc"
      },
      "position": {
        "x": 376,
        "y": 64,
        "width": 96,
        "height": 56
      }
    },
    {
      "id": "bpmn-1e980e3e-8384-4cf2-8f48-67c494b31584",
      "type": "endEvent",
      "name": "End",
      "milestone": "Decision",
      "lane": "Claim Manager",
      "performer": null,
      "position": {
        "x": 508,
        "y": 80,
        "width": 24,
        "height": 24
      }
    }
  ],
  
  "sequenceFlows": [
    {
      "id": "bpmn-b282a450-3ec7-4707-b621-b67f4dd6b925",
      "sourceRef": "bpmn-181d77d4-8206-4b0e-a2a5-2b1a9083e6c5",
      "targetRef": "bpmn-364398b2-6e28-45fc-b4d4-980d5fa180a3",
      "sourceName": "Start",
      "targetName": "Retrieve all the documentation",
      "waypoints": [
        {"x": 88, "y": 264},
        {"x": 120, "y": 264}
      ]
    },
    {
      "id": "bpmn-76644764-7942-49df-927e-4217dae5879b",
      "sourceRef": "bpmn-364398b2-6e28-45fc-b4d4-980d5fa180a3",
      "targetRef": "bpmn-cdb2d503-61cf-4637-bdb7-55ed35e888f6",
      "sourceName": "Retrieve all the documentation",
      "targetName": "Review",
      "waypoints": [
        {"x": 216, "y": 264},
        {"x": 296, "y": 264},
        {"x": 296, "y": 208}
      ]
    },
    {
      "id": "bpmn-9f9a56b0-7d9a-4633-8a11-6273787c12ff",
      "sourceRef": "bpmn-cdb2d503-61cf-4637-bdb7-55ed35e888f6",
      "targetRef": "bpmn-c131ff96-c18e-459b-972b-537481852914",
      "sourceName": "Review",
      "targetName": "Decision",
      "waypoints": [
        {"x": 344, "y": 176},
        {"x": 424, "y": 176},
        {"x": 424, "y": 120}
      ]
    },
    {
      "id": "bpmn-22f5614e-ee4e-4d4f-a9e1-f93ebf93838b",
      "sourceRef": "bpmn-c131ff96-c18e-459b-972b-537481852914",
      "targetRef": "bpmn-1e980e3e-8384-4cf2-8f48-67c494b31584",
      "sourceName": "Decision",
      "targetName": "End",
      "waypoints": [
        {"x": 472, "y": 88},
        {"x": 504, "y": 88}
      ]
    }
  ],
  
  "diagram": {
    "id": "bpmn-4f4f7385-8b81-45d2-979a-6aae4a0afdd6",
    "canvas": {
      "width": 544,
      "height": 312
    },
    "milestoneRegions": [
      {
        "milestone": "onboard",
        "bounds": {"x": 0, "y": 0, "width": 184, "height": 264}
      },
      {
        "milestone": "Review",
        "bounds": {"x": 184, "y": 0, "width": 128, "height": 264}
      },
      {
        "milestone": "Decision",
        "bounds": {"x": 312, "y": 0, "width": 184, "height": 264}
      }
    ],
    "laneRegions": [
      {
        "lane": "Claim Manager",
        "bounds": {"x": 48, "y": 48, "width": 496, "height": 88}
      },
      {
        "lane": "Claims Analyst",
        "bounds": {"x": 48, "y": 136, "width": 496, "height": 88}
      },
      {
        "lane": "Unnamed",
        "bounds": {"x": 48, "y": 224, "width": 496, "height": 88}
      }
    ],
    "labelStyle": {
      "id": "bpmn-4f9a7936-a7b3-44d6-9a8c-43d1b2df3e33",
      "font": {
        "name": "HelveticaNeue-Light",
        "size": 10.0
      }
    }
  },
  
  "processFlow": {
    "executionPath": [
      {
        "step": 1,
        "nodeId": "bpmn-181d77d4-8206-4b0e-a2a5-2b1a9083e6c5",
        "type": "startEvent",
        "name": "Start",
        "performer": "System"
      },
      {
        "step": 2,
        "nodeId": "bpmn-364398b2-6e28-45fc-b4d4-980d5fa180a3",
        "type": "serviceTask",
        "name": "Retrieve all the documentation",
        "performer": "System",
        "automated": true
      },
      {
        "step": 3,
        "nodeId": "bpmn-cdb2d503-61cf-4637-bdb7-55ed35e888f6",
        "type": "userTask",
        "name": "Review",
        "performer": "Claims Analyst",
        "automated": false
      },
      {
        "step": 4,
        "nodeId": "bpmn-c131ff96-c18e-459b-972b-537481852914",
        "type": "userTask",
        "name": "Decision",
        "performer": "Claim Manager",
        "automated": false
      },
      {
        "step": 5,
        "nodeId": "bpmn-1e980e3e-8384-4cf2-8f48-67c494b31584",
        "type": "endEvent",
        "name": "End",
        "performer": "System"
      }
    ],
    "handoffs": [
      {
        "from": "System",
        "to": "Claims Analyst",
        "afterStep": 2,
        "activity": "Retrieve all the documentation → Review"
      },
      {
        "from": "Claims Analyst",
        "to": "Claim Manager",
        "afterStep": 3,
        "activity": "Review → Decision"
      }
    ]
  },
  
  "statistics": {
    "totalElements": 121,
    "flowNodes": {
      "total": 5,
      "startEvents": 1,
      "endEvents": 1,
      "serviceTasks": 1,
      "userTasks": 2,
      "gateways": 0
    },
    "sequenceFlows": 4,
    "lanes": 2,
    "milestones": 3,
    "imports": 3,
    "automationLevel": {
      "automated": 1,
      "manual": 2,
      "percentage": 33.33
    },
    "complexity": {
      "level": "Low",
      "pattern": "Linear Sequential",
      "branches": 0,
      "parallelPaths": 0,
      "decisionPoints": 0
    }
  },
  
  "namespaces": {
    "default": "http://www.omg.org/spec/BPMN/20100524/MODEL",
    "ns2": "http://www.ibm.com/bpm/Extensions",
    "ns3": "http://www.ibm.com/xmlns/prod/bpm/bpmn/ext/process",
    "ns4": "http://www.omg.org/spec/DD/20100524/DI",
    "ns5": "http://www.omg.org/spec/DD/20100524/DC",
    "ns6": "http://www.omg.org/spec/BPMN/20100524/DI",
    "tns": "http://www.ibm.com/WebSphere/bpm/BlueworksLive/aec9475c8-1befcddc24",
    "io": "IBM_SWG_IndustrySolutions2",
    "res": "http://www.ibm.com/WebSphere/bpm/BlueworksLive/Resources",
    "bwl0": "http://www.ibm.com/WebSphere/bpm/BlueworksLive/Glossaries"
  }
}
```

## Usage Examples

### Accessing Flow Nodes
```javascript
// Get all user tasks
const userTasks = data.flowNodes.filter(node => node.type === "userTask");

// Get tasks by performer
const analystTasks = data.flowNodes.filter(
  node => node.performer?.name === "Claims Analyst"
);
```

### Traversing Process Flow
```javascript
// Get execution sequence
const executionPath = data.processFlow.executionPath;

// Find next activity
function getNextActivity(currentNodeId) {
  const flow = data.sequenceFlows.find(f => f.sourceRef === currentNodeId);
  return data.flowNodes.find(n => n.id === flow.targetRef);
}
```

### Analyzing Milestones
```javascript
// Get activities by milestone
function getActivitiesByMilestone(milestoneName) {
  const milestone = data.milestones.find(m => m.name === milestoneName);
  return milestone.flowNodeRefs.map(ref => 
    data.flowNodes.find(n => n.id === ref)
  );
}
```

### Role-Based Queries
```javascript
// Get all tasks for a specific role
function getTasksByRole(roleName) {
  return data.flowNodes.filter(
    node => node.performer?.name === roleName
  );
}

// Get workload distribution
const workload = data.lanes.map(lane => ({
  role: lane.name,
  taskCount: lane.flowNodeRefs.length
}));
```

## Integration Patterns

### REST API Response Format
```json
{
  "status": "success",
  "data": {
    "processId": "bpmn-c25a80c2-46d7-4d50-adbd-73b4f20948d1",
    "processName": "Sample",
    "currentState": "active",
    "structure": "... (full structure as above)"
  }
}
```

### GraphQL Schema
```graphql
type Process {
  id: ID!
  name: String!
  type: String!
  flowNodes: [FlowNode!]!
  sequenceFlows: [SequenceFlow!]!
  lanes: [Lane!]!
  milestones: [Milestone!]!
}

type FlowNode {
  id: ID!
  type: String!
  name: String!
  performer: Performer
  position: Position!
}
```
