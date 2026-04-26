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
    }
]

def get_all_static():
    return static_templates
