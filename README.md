# UBO Insight

from reportlab.platypus import SimpleDocTemplate, Paragraph

from reportlab.lib.styles import getSampleStyleSheet

from reportlab.lib.enums import TA_CENTER

styles=getSampleStyleSheet()

title=styles["Heading1"]; title.alignment=TA_CENTER

h1=styles["Heading2"]

body=styles["BodyText"]

doc=SimpleDocTemplate("/mnt/data/Lovable_AI_UBO_Calculator_Full_Build_Prompt.pdf")

story=[Paragraph("Lovable AI - UBO Calculator Complete Build Prompt",title)]

sections=[

("1. Project Objective",

"Build a web application called <b>UBO Calculator</b>. The application must allow users to create unlimited companies and individuals, define ownership percentages, automatically validate ownership totals, calculate direct and indirect ownership, detect circular ownership, and identify Ultimate Beneficial Owners (UBOs)."),

("2. Core Principle",

"The user should NEVER perform calculations manually. Users only enter companies, individuals, and ownership percentages. The application performs all ownership calculations automatically."),

("3. Step 1 - Create Companies",

"Allow users to create unlimited companies with fields: Company Name, Registration Number (optional), Country, Description."),

("4. Step 2 - Create Individuals",

"Allow users to create unlimited individuals with Name, Country, Remarks."),

("5. Step 3 - Ownership Builder",

"""For every company, provide an editable table.

Columns:

Shareholder Name | Type (Individual/Company) | Ownership % | Voting % | Control %.

Users can add unlimited rows.

Live validation:

- Total must equal exactly 100%.

- If total is less than 100%, show Remaining % and disable Save.

- If total exceeds 100%, show an error and disable Save."""),

("6. Example Scenario",

"""Company A:

A Person 20%

B Person 30%

C Person 10%

Company D 40%

(Total 100%)

Click Company D:

A Person 60%

B Person 40%

(Total 100%)

Automatic calculations:

A Person = Direct 20% + (40% × 60%) = 44%

B Person = Direct 30% + (40% × 40%) = 46%

C Person = Direct 10% = 10%

Mark all as UBO when threshold is 10%."""),

("7. Unlimited Company Levels",

"The application must support unlimited nesting: Company A → Company B → Company C → Company D → Individual. The same calculation logic applies at every level."),

("8. Multiple Ownership Paths",

"If an individual is reached through multiple independent ownership paths, calculate each path separately and add the effective ownership values together before comparing against the UBO threshold."),

("9. Calculation Algorithm",

"""Represent ownership as a graph.

Use Depth-First Search (DFS):

1. Select root company.

2. Find every path to each individual.

3. Multiply ownership percentages along each path.

4. Effective Ownership = (P1×P2×...×Pn)/100^(n-1).

5. Sum all paths for the same individual.

6. Add direct ownership.

7. Compare with configurable threshold (default 10%).

8. Display calculation details."""),

("10. Circular Ownership",

"Detect cycles (e.g., A→B→C→A). Stop the calculation and display 'Circular Ownership Detected'."),

("11. Ownership Tree",

"Automatically generate an interactive ownership tree. Clicking any company opens its ownership table for editing. Support expand/collapse, zoom, pan, and search."),

("12. UBO Results",

"Display a table with Person, Direct Ownership, Indirect Ownership, Total Effective Ownership, Formula, Ownership Path, and UBO Status."),

("13. Reports",

"Export PDF, Excel, and CSV containing the ownership tree, calculation formulas, and UBO results."),

("14. UI Requirements",

"Create a clean enterprise interface with white background, blue accents, responsive layout, simple tables, rounded cards, and clear navigation. No login/authentication."),

("15. Recommended Stack",

"Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Flow, TanStack Table. Backend: Node.js, Express. Database: PostgreSQL with Prisma ORM.")

]

for t,c in sections:

    story.append(Paragraph(t,h1))

    story.append(Paragraph(c,body))

doc.build(story)

print("/mnt/data/Lovable_AI_UBO_Calculator_Full_Build_Prompt.pdf")





from reportlab.platypus import SimpleDocTemplate, Paragraph

from reportlab.lib.styles import getSampleStyleSheet

from reportlab.lib.enums import TA_CENTER

styles=getSampleStyleSheet()

t=styles["Heading1"]; t.alignment=TA_CENTER

h=styles["Heading2"]; b=styles["BodyText"]

doc=SimpleDocTemplate("/mnt/data/Lovable_AI_UBO_Calculator_Full_Build_Prompt.pdf")

story=[Paragraph("Lovable AI - UBO Calculator Full Build Prompt",t)]

items=[

("Project Objective","Build a UBO Calculator web application. Users create companies, individuals and ownership relationships. The system automatically calculates direct, indirect and total effective ownership."),

("Workflow","1.Create Company. 2.Create Individuals. 3.Add shareholders for each company. 4.Validate ownership total equals 100%. 5.Open nested companies and repeat. 6.Click Calculate UBO. 7.Show results and reports."),

("Ownership Builder","Editable table: Shareholder | Type | Ownership % | Voting % | Control %. Allow unlimited rows. Disable Save unless total ownership is exactly 100%."),

("Example","Company A: A=20%, B=30%, C=10%, Company D=40%. Company D: A=60%, B=40%. Results: A=20+24=44%, B=30+16=46%, C=10%."),

("Unlimited Levels","Support unlimited nested companies. Same algorithm applies to every level."),

("Algorithm","Store ownership as a graph. Use DFS to find every path from root company to each individual. Multiply ownership along each path. Effective=(P1*P2*...*Pn)/100^(n-1). Sum all paths and direct ownership. Compare with configurable threshold (default 10%)."),

("Circular Ownership","Detect A→B→C→A and stop calculation."),

("Results","Display Person, Direct %, Indirect %, Total %, Formula, Path, UBO Status."),

("Reports","Export PDF, Excel and CSV."),

("UI","Enterprise style. White background, blue accent, responsive, React Flow ownership tree, clean tables, no login."),

("Tech Stack","React + TypeScript + Vite + Tailwind + shadcn/ui + React Flow. Node.js + Express. PostgreSQL + Prisma.")

]

for a,c in items:

    story.append(Paragraph(a,h)); story.append(Paragraph(c,b))

doc.build(story)

print("ok")

-----------------
Project Name:

UBO Calculator – Ultimate Beneficial Ownership Calculator

Objective

Build a modern web application that automatically calculates Ultimate Beneficial Ownership (UBO) from direct and indirect ownership relationships.

The application should allow users to create companies and individuals, define ownership percentages, validate that ownership totals exactly 100% for every company, calculate effective ownership across unlimited ownership levels, and determine UBOs automatically.

----------------------------------------------------

Example Scenario

Company A Ownership

A - Related Person ........ 20%

B - Related Person ........ 30%

C - Related Person ........ 10%

D - Company ............... 40%

Total = 100%

When the user clicks on Company D, they should be able to define its ownership.

Company D Ownership

A - Related Person ........ 60%

B - Related Person ........ 40%

Total = 100%

----------------------------------------------------

The application must automatically calculate effective ownership.

Calculations

Direct Ownership

A Person

20%

Direct

B Person

30%

Direct

C Person

10%

Direct

Indirect Ownership

Company A

↓

Company D

40%

↓

A Person

60%

Effective Ownership

40%

×

60%

=

24%

Company A

↓

Company D

40%

↓

B Person

40%

Effective Ownership

40%

×

40%

=

16%

----------------------------------------------------

Final Result

A Person

Direct

20%

Indirect

24%

Total Effective Ownership

44%

UBO

YES

--------------------------------

B Person

Direct

30%

Indirect

16%

Total Effective Ownership

46%

UBO

YES

--------------------------------

C Person

Direct

10%

Indirect

0%

Total Effective Ownership

10%

UBO

YES

(Default Threshold = 10%)

----------------------------------------------------

Business Rules

Rule 1

Every company must have ownership totaling exactly 100%.

Do not allow saving if

Total >100%

or

Total <100%

----------------------------------------------------

Rule 2

Users should only enter percentages.

The application must perform all calculations automatically.

----------------------------------------------------

Rule 3

Support unlimited company levels.

Example

Company A

↓

Company D

↓

Company X

↓

Company Y

↓

Person

----------------------------------------------------

Rule 4

Calculate every ownership path separately.

Multiply percentages along the path.

Example

40%

×

60%

=

24%

----------------------------------------------------

Rule 5

If one individual appears through multiple ownership paths,

add all effective ownership values.

Example

Direct

20%

Indirect

24%

Total

44%

----------------------------------------------------

Rule 6

UBO Threshold

Default

10%

If

Effective Ownership >=10%

Display

UBO

Else

Not UBO

Threshold should be configurable.

----------------------------------------------------

Rule 7

Detect Circular Ownership

Example

Company A

↓

Company B

↓

Company C

↓

Company A

Display

"Circular Ownership Detected"

Do not calculate.

----------------------------------------------------

Frontend Pages

Dashboard

Companies

Individuals

Ownership Builder

Ownership Tree

UBO Calculator

Reports

Settings

----------------------------------------------------

Ownership Builder

The interface should work like Excel.

User selects Company.

Click

Add Shareholder

Columns

Shareholder Name

Type

Ownership %

Voting %

Control %

Action

Show

Current Total

Remaining %

Validation

Example

Current Total

100%

✔ Valid

Remaining

0%

If Total

110%

Show

❌ Total ownership cannot exceed 100%

If Total

80%

Show

Remaining

20%

Disable Save button.

----------------------------------------------------

Ownership Tree

Automatically generate a tree.

Example

Company A

├── A Person (20%)

├── B Person (30%)

├── C Person (10%)

└── Company D (40%)

        ├── A Person (60%)

        └── B Person (40%)

----------------------------------------------------

Result Screen

Display

Person

Direct Ownership

Indirect Ownership

Effective Ownership

Calculation Formula

Ownership Path

UBO Status

Example

Person

A Person

Direct

20%

Indirect

24%

Formula

40 × 60 /100

Total

44%

Status

UBO

--------------------------------

Person

B Person

Direct

30%

Indirect

16%

Formula

40 × 40 /100

Total

46%

Status

UBO

--------------------------------

Person

C Person

Direct

10%

Indirect

0%

Total

10%

Status

UBO

----------------------------------------------------

Calculation Algorithm

Step 1

Create ownership graph.

Step 2

Find every path from the selected root company.

Step 3

Multiply ownership percentages along each path.

Step 4

Calculate indirect ownership.

Step 5

Add direct ownership.

Step 6

Combine all paths reaching the same individual.

Step 7

Compare with UBO threshold.

Step 8

Display detailed calculations.

----------------------------------------------------

Technology

Frontend

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

React Flow

TanStack Table

React Hook Form

Backend

Node.js

Express

Database

PostgreSQL

Prisma ORM

----------------------------------------------------

UI Design

Create a clean enterprise-style application.

White background

Blue primary color

Professional cards

Responsive tables

Interactive ownership tree

Minimal design

Fast calculations

The user should never calculate percentages manually. The application should automatically validate ownership totals, compute direct and indirect ownership, merge ownership from multiple paths, identify UBOs, and display every calculation step in an easy-to-understand table.

in need  ubo calculator ,to calculate how any ubo 's

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://uboflow-calculator.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0f6149e9-f74d-4e09-bde2-7a9a48a77787).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
