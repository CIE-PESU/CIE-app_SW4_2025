graph TB

subgraph AUTH["Authentication & Role Routing"]
  A1[User Login] --> A2{Authenticate}
  A2 -->|Invalid| A3[Login Failed]
  A2 -->|Valid| A4{Check Role}
  A4 -->|Admin| A5[Admin Dashboard]
  A4 -->|Faculty| A6{Check Sub-Roles}
  A4 -->|Student| A7[Student Dashboard]
  A6 -->|Coordinator| A8[Coordinator Dashboard]
  A6 -->|Platform Manager| A9[Platform Manager Dashboard]
  A6 -->|Developer| A10[Developer Dashboard]
  A6 -->|Regular Faculty| A11[Faculty Dashboard]
end

subgraph ADMIN["Admin Operations"]
  AD1[Manage Users]
  AD2[Create/Manage Domains]
  AD3[Assign Coordinators]
  AD4[Manage Courses]
  AD5[Manage Locations]
  AD6[Assign Platform Manager]
  AD7[Assign Developer]
  AD8[View System Analytics]
end

subgraph DOMAIN["Domain & Coordinator Setup"]
  D1[Admin Creates Domain] --> D2[Domain Created]
  D2 --> D3[Assign Faculty as Coordinator]
  D3 --> D4[Coordinator Assigned]
  D4 --> D5{Domain Type?}
  D5 -->|Lab| D6[Lab Domain]
  D5 -->|Library| D7[Library Domain]
  D5 -->|Projects| D8[Projects Domain]
end

A5 --> AD1
AD2 --> D1
AD3 --> D3


graph TB

subgraph LAB["Lab Inventory"]
  L1[Add Component] --> L2{Has Images?}
  L2 -->|Yes| L3[Upload Images]
  L2 -->|No| L4[Manual Entry]
  L3 --> L5[Send to Gemini]
  L5 --> L6[Auto-fill Specs]
  L6 --> L7[Review]
  L4 --> L7
  L7 --> L8[Save Component]
end

subgraph LIB["Library Inventory"]
  LB1[Add Book] --> LB2{Has Images?}
  LB2 -->|Yes| LB3[Upload Images]
  LB2 -->|No| LB4[Manual Entry]
  LB3 --> LB5[Gemini Analyze]
  LB5 --> LB6[Auto-fill Details]
  LB6 --> LB7[Review]
  LB4 --> LB7
  LB7 --> LB8[Save Book]
end

subgraph AIIMG["AI Image Analysis"]
  AI1[Upload Image] --> AI2[Send to Gemini]
  AI2 --> AI3[Extract Details]
  AI3 --> AI4[Auto-Fill Form]
end

L3 --> AI1
LB3 --> AI1
AI4 --> L7
AI4 --> LB7


graph TB

subgraph COMPREQ["Component Request"]
  CR1[Browse Components] --> CR2[Select]
  CR2 --> CR3{Available?}
  CR3 -->|Yes| CR4[Create Request]
  CR3 -->|No| CR5[Not Available]
  CR4 --> CR6[PENDING]
  CR6 --> CR7[Coordinator Review]
  CR7 -->|Approve| CR8[APPROVED]
  CR7 -->|Reject| CR9[REJECTED]
  CR8 --> CR10[Collect]
  CR10 --> CR11[COLLECTED]
  CR11 --> CR12{Return?}
  CR12 -->|On Time| CR13[RETURNED]
  CR12 -->|Late| CR14[OVERDUE]
  CR14 --> CR13
end

subgraph LIBREQ["Library Request"]
  LR1[Browse Books] --> LR2[Select]
  LR2 --> LR3{Available?}
  LR3 -->|Yes| LR4[Create Request]
  LR3 -->|No| LR5[Not Available]
  LR4 --> LR6[PENDING]
  LR6 --> LR7[Coordinator Review]
  LR7 -->|Approve| LR8[APPROVED]
  LR7 -->|Reject| LR9[REJECTED]
  LR8 --> LR10[Collect]
  LR10 --> LR11[COLLECTED]
  LR11 --> LR12{Return?}
  LR12 -->|On Time| LR13[RETURNED]
  LR12 -->|Late| LR14[OVERDUE]
  LR14 --> LR13
end


graph TB

subgraph PROJECT["Project Lifecycle"]
  PR1[Faculty Creates Project] --> PR2[PENDING]
  PR2 --> PR3[Coordinator Review]
  PR3 -->|Approve| PR4[APPROVED]
  PR3 -->|Reject| PR5[REJECTED]
  PR4 --> PR6[Enrollment OPEN]
  PR6 --> PR7[Enrollment CLOSED]
  PR7 --> PR8[ONGOING]
  PR8 --> PR9[COMPLETED]
end

subgraph APPLY["Student Applications"]
  AP1[Student Applies] --> AP2[PENDING]
  AP2 --> AP3[Faculty Reviews]
  AP3 -->|Manual| AP4[Manual Selection]
  AP3 -->|AI| AP5[AI Shortlist]
  AP5 --> AP6[Python + Mistral]
  AP6 --> AP4
  AP4 --> AP7{Decision}
  AP7 -->|Accept| AP8[APPROVED]
  AP7 -->|Reject| AP9[REJECTED]
end

PR6 --> AP1
AP8 --> PR8


graph TB

subgraph OPP["Opportunities"]
  OP1[Create Opportunity] --> OP2[OPEN]
  OP2 --> OP3[Student Applies]
  OP3 --> OP4[Faculty Reviews]
  OP4 -->|Accept| OP5[ACCEPTED]
  OP4 -->|Reject| OP6[REJECTED]
  OP5 --> OP7[CLOSED]
end

subgraph LOC["Location Booking"]
  LC1[Browse Locations] --> LC2[Select Slot]
  LC2 --> LC3{Free?}
  LC3 -->|Yes| LC4[Book]
  LC3 -->|No| LC5[Try Another]
end

subgraph COURSE["Courses"]
  CS1[Create Course] --> CS2[Active]
  CS2 --> CS3[Student Enrolls]
  CS3 --> CS4[Attendance + Grades]
  CS4 --> CS5[Completed]
end

subgraph FEEDBACK["Feedback System"]
  FB1[Submit Feedback] --> FB2[PENDING]
  FB2 --> FB3[PM Review]
  FB3 -->|Approve| FB4[Assign Developer]
  FB4 --> FB5[Fix Done]
  FB5 --> FB6[COMPLETED]
end

subgraph NOTIFY["Notifications"]
  N1[Event] --> N2[Notify Users]
end

subgraph ANALYTICS["Analytics"]
  A1[Generate Reports] --> A2[Download]
end

OP5 --> N1
FB6 --> N1
CS5 --> N1
A1 --> A2
