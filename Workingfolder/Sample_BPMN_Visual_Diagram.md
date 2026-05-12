# Sample.bpmn - Visual Representations

## 1. Process Flow Diagram (Mermaid)

```mermaid
graph LR
    Start([Start]) --> Retrieve[Retrieve all the documentation]
    Retrieve --> Review[Review]
    Review --> Decision[Decision]
    Decision --> End([End])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style Retrieve fill:#87CEEB
    style Review fill:#FFD700
    style Decision fill:#FFD700
```

## 2. Swimlane Diagram with Roles

```mermaid
graph TB
    subgraph System
        Start([Start])
        Retrieve[Retrieve all the documentation]
    end
    
    subgraph Claims_Analyst[Claims Analyst]
        Review[Review]
    end
    
    subgraph Claim_Manager[Claim Manager]
        Decision[Decision]
        End([End])
    end
    
    Start --> Retrieve
    Retrieve --> Review
    Review --> Decision
    Decision --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style Retrieve fill:#87CEEB
    style Review fill:#FFD700
    style Decision fill:#FFD700
```

## 3. Milestone-Based View

```mermaid
graph LR
    subgraph Onboard[Milestone: onboard]
        Start([Start])
        Retrieve[Retrieve all the documentation]
    end
    
    subgraph ReviewMS[Milestone: Review]
        Review[Review]
    end
    
    subgraph DecisionMS[Milestone: Decision]
        Decision[Decision]
        End([End])
    end
    
    Start --> Retrieve
    Retrieve --> Review
    Review --> Decision
    Decision --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style Retrieve fill:#87CEEB
    style Review fill:#FFD700
    style Decision fill:#FFD700
```

## 4. Detailed Activity Diagram

```mermaid
stateDiagram-v2
    [*] --> Start
    Start --> RetrieveDocumentation: Process Initiated
    
    state RetrieveDocumentation {
        [*] --> Fetching: Service Task
        Fetching --> [*]: Documents Retrieved
    }
    
    RetrieveDocumentation --> Review: Documents Ready
    
    state Review {
        [*] --> Analyzing: Claims Analyst
        Analyzing --> [*]: Review Complete
    }
    
    Review --> Decision: Review Submitted
    
    state Decision {
        [*] --> Evaluating: Claim Manager
        Evaluating --> [*]: Decision Made
    }
    
    Decision --> End
    End --> [*]
```

## 5. BPMN Element Hierarchy

```mermaid
graph TD
    Root[Sample Process]
    
    Root --> Events[Events]
    Root --> Activities[Activities]
    Root --> Flows[Sequence Flows]
    Root --> Org[Organization]
    Root --> Mile[Milestones]
    
    Events --> StartE[Start Event]
    Events --> EndE[End Event]
    
    Activities --> Service[Service Task:<br/>Retrieve documentation]
    Activities --> User1[User Task:<br/>Review]
    Activities --> User2[User Task:<br/>Decision]
    
    Flows --> F1[Start → Retrieve]
    Flows --> F2[Retrieve → Review]
    Flows --> F3[Review → Decision]
    Flows --> F4[Decision → End]
    
    Org --> Lane1[Claim Manager]
    Org --> Lane2[Claims Analyst]
    
    Mile --> M1[onboard]
    Mile --> M2[Review]
    Mile --> M3[Decision]
    
    Lane1 --> User2
    Lane1 --> EndE
    Lane2 --> User1
    
    M1 --> StartE
    M1 --> Service
    M2 --> User1
    M3 --> User2
    M3 --> EndE
    
    style Root fill:#E6E6FA
    style Events fill:#90EE90
    style Activities fill:#87CEEB
    style Flows fill:#FFE4B5
    style Org fill:#FFD700
    style Mile fill:#FFA07A
```

## 6. Data Flow Perspective

```mermaid
graph LR
    Input[Process Input] --> Start([Start])
    Start --> Retrieve[Retrieve all<br/>the documentation]
    Retrieve --> Docs[Documentation<br/>Package]
    Docs --> Review[Review]
    Review --> Analysis[Review<br/>Analysis]
    Analysis --> Decision[Decision]
    Decision --> Outcome[Decision<br/>Outcome]
    Outcome --> End([End])
    End --> Output[Process Output]
    
    style Input fill:#E0E0E0
    style Output fill:#E0E0E0
    style Docs fill:#B0E0E6
    style Analysis fill:#B0E0E6
    style Outcome fill:#B0E0E6
```

## 7. Timeline View

```mermaid
gantt
    title Sample Process Timeline
    dateFormat X
    axisFormat %s
    
    section System
    Start Event           :milestone, 0, 0
    Retrieve documentation :active, 0, 1
    
    section Claims Analyst
    Review               :active, 1, 2
    
    section Claim Manager
    Decision             :active, 2, 3
    End Event            :milestone, 3, 3
```

## 8. Responsibility Matrix (RACI)

| Activity | Claim Manager | Claims Analyst | System |
|----------|---------------|----------------|--------|
| **Start** | I | I | R |
| **Retrieve documentation** | I | I | R |
| **Review** | I | R/A | C |
| **Decision** | R/A | I | C |
| **End** | A | I | R |

**Legend:**
- R = Responsible (does the work)
- A = Accountable (final approval)
- C = Consulted (provides input)
- I = Informed (kept updated)

## 9. Process Complexity Metrics

```mermaid
pie title Process Element Distribution
    "Events" : 2
    "Service Tasks" : 1
    "User Tasks" : 2
    "Sequence Flows" : 4
```

## 10. Integration Points

```mermaid
graph TB
    BPMN[Sample.bpmn]
    
    BPMN --> Glossary[Glossaries.bpmn<br/>Business Terms]
    BPMN --> Resources[Resources.bpmn<br/>Roles & Users]
    BPMN --> Schema[InputOutput.xsd<br/>Data Structures]
    
    Glossary -.-> Terms[Term Definitions]
    Resources -.-> Roles[Role Assignments]
    Schema -.-> Data[Data Models]
    
    style BPMN fill:#4169E1,color:#FFF
    style Glossary fill:#32CD32
    style Resources fill:#FFD700
    style Schema fill:#FF6347
```

## 11. Process Metrics Summary

| Metric | Value |
|--------|-------|
| **Total Activities** | 3 |
| **Automated Tasks** | 1 (33%) |
| **Manual Tasks** | 2 (67%) |
| **Decision Points** | 0 |
| **Parallel Paths** | 0 |
| **Process Complexity** | Low (Linear) |
| **Roles Involved** | 2 |
| **Milestones** | 3 |
| **Average Path Length** | 5 steps |

## 12. Quick Reference Card

### Process Summary
- **Name**: Sample
- **Type**: Claims Processing
- **Pattern**: Sequential Linear Flow
- **Automation Level**: Low (1/3 automated)

### Key Participants
1. **System** - Initiates and retrieves documentation
2. **Claims Analyst** - Reviews documentation
3. **Claim Manager** - Makes final decision

### Critical Path
```
Start → Retrieve (automated) → Review (manual) → Decision (manual) → End
```

### Estimated Duration
- Retrieve documentation: Automated (seconds/minutes)
- Review: Manual (hours/days)
- Decision: Manual (hours/days)

### Success Criteria
- All documentation retrieved successfully
- Review completed by Claims Analyst
- Decision made by Claim Manager
- Process reaches End event
