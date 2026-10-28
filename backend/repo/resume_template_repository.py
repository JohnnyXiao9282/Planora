# Repository for ResumeTemplate model
# Static template for initial development/demo
static_templates = [
    {
        "template_id": "template_001",
        "name": "General_SDE_Resume",
        "description": "A general software engineer resume template with generic company and project names.",
        "price": 20,
        "summary": "Full-Stack Software Engineer with 2+ years of experience building scalable web and mobile systems. Passionate about performance optimization, distributed systems, and agile development. Seeking opportunities in innovative tech environments.",
        "education": [
            {"school": "University1", "degree": "M.S. Computer Science", "gpa": "3.94", "years": "2024–2026"},
            {"school": "University2", "degree": "B.S. Mathematics", "gpa": "3.80", "years": "2018–2022"}
        ],
        "experience": [
            {
                "company": "Company1",
                "title": "Software Engineer Intern",
                "location": "City1, Country1",
                "dates": "10/2025–04/2026",
                "bullets": [
                    "Led development of a cross-platform app using TypeScript and React Native.",
                    "Integrated AI-based scheduling and real-time analytics.",
                    "Designed and scaled RESTful APIs, supporting 100k+ users.",
                    "Built personalized features using search and cloud services.",
                    "Implemented automated CI/CD pipelines, reducing deployment time by 40%.",
                    "Ensured code quality with 95%+ test coverage and code reviews."
                ]
            }
        ],
        "projects": [
            {"name": "Project1", "description": "Engineered a modular data visualization platform for real-time analytics."},
            {"name": "Project2", "description": "Developed RESTful microservices for a delivery platform."},
            {"name": "Project3", "description": "Built a Q&A app with voice interaction using web technologies."}
        ],
        "skills": [
            "Python", "C++", "Java", "JavaScript/TypeScript", "Go", "SQL", "Bash",
            "Web frameworks", "SQL/NoSQL", "Cloud services", "REST APIs"
        ]
    },
    {
        "template_id": "template_002",
        "name": "Sales_Account_Executive_Resume",
        "description": "A results-driven B2B sales resume template focused on quota attainment, pipeline growth, and client relationships.",
        "price": 15,
        "summary": "Account Executive with 4+ years of B2B SaaS sales experience, consistently exceeding quota by 20%+. Skilled in full-cycle sales, consultative selling, and building long-term client partnerships. Seeking to drive revenue growth in a fast-paced sales organization.",
        "education": [
            {"school": "University1", "degree": "B.A. Business Administration", "gpa": "3.60", "years": "2016–2020"}
        ],
        "experience": [
            {
                "company": "Company1",
                "title": "Account Executive",
                "location": "City1, Country1",
                "dates": "03/2022–Present",
                "bullets": [
                    "Closed $1.8M in new annual recurring revenue, achieving 124% of annual quota.",
                    "Managed a pipeline of 60+ mid-market accounts from prospecting through contract signature.",
                    "Shortened average sales cycle from 75 to 52 days by introducing structured discovery calls.",
                    "Partnered with customer success to drive 30% expansion revenue within existing accounts."
                ]
            },
            {
                "company": "Company2",
                "title": "Sales Development Representative",
                "location": "City2, Country1",
                "dates": "07/2020–02/2022",
                "bullets": [
                    "Booked 25+ qualified meetings per month through cold calling, email, and LinkedIn outreach.",
                    "Ranked #1 of 12 SDRs for pipeline generated over four consecutive quarters.",
                    "Built prospecting playbooks adopted by the entire SDR team."
                ]
            }
        ],
        "projects": [
            {"name": "Territory Expansion Plan", "description": "Designed a go-to-market plan for a new regional territory, generating $400K pipeline in the first quarter."},
            {"name": "Sales Enablement Toolkit", "description": "Created objection-handling guides and demo scripts that improved team win rate by 12%."}
        ],
        "skills": [
            "Salesforce CRM", "HubSpot", "Pipeline Management", "Consultative Selling", "Negotiation",
            "Cold Outreach", "Forecasting", "MEDDIC", "Client Relationship Management"
        ]
    },
    {
        "template_id": "template_003",
        "name": "Digital_Marketing_Resume",
        "description": "A marketing resume template highlighting campaigns, growth metrics, content, and analytics.",
        "price": 15,
        "summary": "Digital Marketing Specialist with 3+ years of experience running data-driven campaigns across paid, social, email, and SEO channels. Proven track record of growing traffic and lowering acquisition costs. Passionate about brand storytelling and experimentation.",
        "education": [
            {"school": "University1", "degree": "B.S. Marketing", "gpa": "3.70", "years": "2017–2021"}
        ],
        "experience": [
            {
                "company": "Company1",
                "title": "Digital Marketing Specialist",
                "location": "City1, Country1",
                "dates": "06/2022–Present",
                "bullets": [
                    "Managed a $500K annual paid media budget across Google Ads and Meta, reducing cost per acquisition by 28%.",
                    "Grew organic search traffic by 85% year-over-year through SEO content strategy and technical fixes.",
                    "Launched lifecycle email campaigns that increased customer retention by 15%.",
                    "Ran 40+ A/B tests on landing pages, lifting conversion rate from 2.1% to 3.4%."
                ]
            },
            {
                "company": "Company2",
                "title": "Marketing Coordinator",
                "location": "City2, Country1",
                "dates": "08/2021–05/2022",
                "bullets": [
                    "Coordinated social media calendar across four platforms, growing followers by 40%.",
                    "Produced weekly performance reports in Google Analytics for leadership.",
                    "Supported three product launches with press, events, and influencer partnerships."
                ]
            }
        ],
        "projects": [
            {"name": "Brand Refresh Campaign", "description": "Led a cross-channel rebrand campaign that increased brand awareness survey scores by 22%."},
            {"name": "Influencer Program", "description": "Built an influencer partnership program generating 1.2M impressions on a $20K budget."}
        ],
        "skills": [
            "Google Ads", "Meta Ads", "SEO/SEM", "Google Analytics", "HubSpot", "Email Marketing",
            "A/B Testing", "Content Strategy", "Canva", "Copywriting"
        ]
    },
    {
        "template_id": "template_004",
        "name": "Data_Analyst_Resume",
        "description": "A data analyst resume template emphasizing SQL, dashboards, statistical analysis, and business insights.",
        "price": 18,
        "summary": "Data Analyst with 2+ years of experience turning complex datasets into actionable business insights. Skilled in SQL, Python, and BI tools, with a focus on clear data storytelling for non-technical stakeholders.",
        "education": [
            {"school": "University1", "degree": "B.S. Statistics", "gpa": "3.75", "years": "2018–2022"}
        ],
        "experience": [
            {
                "company": "Company1",
                "title": "Data Analyst",
                "location": "City1, Country1",
                "dates": "07/2022–Present",
                "bullets": [
                    "Built 15+ Tableau dashboards tracking revenue, churn, and operations KPIs used by 200+ employees.",
                    "Automated weekly reporting with SQL and Python, saving the team 10 hours per week.",
                    "Identified churn drivers through cohort analysis, informing a retention program that cut churn by 9%.",
                    "Designed and analyzed A/B tests for pricing changes, supporting a 6% revenue lift."
                ]
            }
        ],
        "projects": [
            {"name": "Customer Segmentation", "description": "Applied k-means clustering to 500K customer records to define five actionable marketing segments."},
            {"name": "Sales Forecasting Model", "description": "Developed a time-series forecast in Python that improved monthly sales forecast accuracy by 18%."}
        ],
        "skills": [
            "SQL", "Python (pandas, NumPy)", "Tableau", "Power BI", "Excel", "Statistics",
            "A/B Testing", "Data Visualization", "ETL", "Stakeholder Communication"
        ]
    },
    {
        "template_id": "template_005",
        "name": "Product_Manager_Resume",
        "description": "A product manager resume template focused on roadmap ownership, cross-functional leadership, and measurable product outcomes.",
        "price": 20,
        "summary": "Product Manager with 4+ years of experience shipping consumer and B2B products. Skilled at translating customer insights into roadmaps, aligning engineering and design teams, and driving measurable growth.",
        "education": [
            {"school": "University1", "degree": "MBA", "gpa": "3.80", "years": "2019–2021"},
            {"school": "University2", "degree": "B.S. Information Systems", "gpa": "3.65", "years": "2013–2017"}
        ],
        "experience": [
            {
                "company": "Company1",
                "title": "Product Manager",
                "location": "City1, Country1",
                "dates": "08/2021–Present",
                "bullets": [
                    "Owned the roadmap for an onboarding product used by 2M+ users, increasing activation by 18%.",
                    "Led a cross-functional team of 8 engineers and 2 designers through quarterly planning and delivery.",
                    "Conducted 50+ customer interviews to define requirements for a new self-serve billing feature.",
                    "Defined product KPIs and launched experiments that raised 30-day retention by 11%."
                ]
            },
            {
                "company": "Company2",
                "title": "Business Analyst",
                "location": "City2, Country1",
                "dates": "06/2017–07/2019",
                "bullets": [
                    "Gathered requirements and wrote user stories for internal workflow tools.",
                    "Analyzed product usage data to prioritize the feature backlog."
                ]
            }
        ],
        "projects": [
            {"name": "Mobile App Launch", "description": "Took a companion mobile app from concept to launch, reaching 100K downloads in 3 months."},
            {"name": "Pricing Page Redesign", "description": "Partnered with design and marketing to redesign pricing, increasing paid conversions by 14%."}
        ],
        "skills": [
            "Product Roadmapping", "User Research", "Agile/Scrum", "Jira", "SQL", "A/B Testing",
            "PRD Writing", "Figma", "Stakeholder Management", "Go-to-Market Strategy"
        ]
    },
    {
        "template_id": "template_006",
        "name": "Finance_Analyst_Resume",
        "description": "A financial analyst resume template showcasing modeling, budgeting, forecasting, and reporting skills.",
        "price": 18,
        "summary": "Financial Analyst with 3+ years of experience in FP&A, financial modeling, and variance analysis. Detail-oriented and skilled at delivering insights that support strategic decisions and cost control.",
        "education": [
            {"school": "University1", "degree": "B.S. Finance", "gpa": "3.70", "years": "2016–2020"}
        ],
        "experience": [
            {
                "company": "Company1",
                "title": "Financial Analyst, FP&A",
                "location": "City1, Country1",
                "dates": "07/2020–Present",
                "bullets": [
                    "Built a three-statement financial model used to plan a $40M annual operating budget.",
                    "Led monthly variance analysis, identifying $1.2M in cost savings across departments.",
                    "Improved quarterly forecast accuracy from 88% to 96% by redesigning driver-based models.",
                    "Prepared board-level financial presentations for the CFO and executive team."
                ]
            }
        ],
        "projects": [
            {"name": "Acquisition Valuation", "description": "Performed DCF and comparable-company analysis to evaluate a $15M acquisition target."},
            {"name": "Reporting Automation", "description": "Automated month-end reporting in Excel and Power Query, cutting close time by 2 days."}
        ],
        "skills": [
            "Financial Modeling", "Excel (advanced)", "Budgeting & Forecasting", "Variance Analysis",
            "DCF Valuation", "Power BI", "SQL", "NetSuite", "GAAP"
        ]
    }
]

def get_all_static():
    return static_templates
