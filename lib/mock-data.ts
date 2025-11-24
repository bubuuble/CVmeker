import { CVData } from '@/types/types';

export const modernProfessionalData: CVData = {
    personalInfo: {
        name: 'JOHN DEVELOPER',
        phone: '+1 555-0123',
        email: 'john.developer@example.com',
        address: 'San Francisco, California, USA',
        portfolio: 'johndeveloper.dev',
        photoUrl: '', // Left empty as the new design has no image/logo
    },
    summary: "I am a dedicated software engineer with a passion for full-stack development and modern web technologies. I have hands-on experience with various projects and internships at leading tech companies. I am committed to continuous learning and delivering high-quality solutions.",
    education: [
        { institution: 'CENTRAL HIGH SCHOOL', degree: 'General Education', dateRange: '2016 - 2018' },
        { institution: 'STATE UNIVERSITY', degree: 'Bachelor in Computer Science', dateRange: '2018 - 2022', gpa: 'CGPA 3.7' },
        { institution: 'TECH INSTITUTE', degree: 'Advanced Web Development Certification', dateRange: '2022 - 2023', gpa: 'GPA 3.9' },
    ],
    workExperience: [
        { role: 'Junior Developer', company: 'Internship - Tech Startup Inc.', dateRange: 'Jun 2020 - Aug 2020', responsibilities: ['Developed frontend components using React', 'Collaborated with design team on UI improvements'] },
        { role: 'Full Stack Developer', company: 'Internship - Digital Solutions Ltd.', dateRange: 'Jan 2021 - Apr 2021', responsibilities: ['Built REST APIs using Node.js', 'Implemented database schemas with PostgreSQL'] },
        { role: 'Software Engineer', company: 'Internship - Cloud Services Corp.', dateRange: 'May 2022 - Aug 2022', responsibilities: ['Developed microservices architecture', 'Optimized application performance'] },
    ],
    organizationalExperience: [
        { role: 'Member of Tech Community', company: 'Computer Science Student Association', dateRange: 'Jan 2019 - Dec 2020', responsibilities: ['Organized coding workshops', 'Mentored junior students'] },
        { role: 'President', company: 'Computer Science Student Association', dateRange: 'Jan 2021 - Dec 2022', responsibilities: ['Led organizational initiatives', 'Managed annual tech conference', 'Built partnerships with industry sponsors'] },
    ],
    achievements: [
        { role: 'INNOVATION GRANT RECIPIENT', company: 'NATIONAL SCIENCE FOUNDATION', dateRange: '', responsibilities: ['Led technical development', 'Received funding for innovative web application project'] },
    ],
    projects: [
        { name: 'E-Commerce Platform', date: 'June 2021', details: ['Built full-stack application using React and Node.js', 'Implemented payment gateway integration'] },
        { name: 'Mobile Game', date: 'Aug - Dec 2022', details: ['Lead developer on team', 'Created 2D game using Unity engine'] },
        { name: 'SaaS Dashboard', date: 'Jan - May 2023', details: ['Senior developer on project', 'Built dashboard using Next.js and TypeScript', 'Developed mobile app prototype with Flutter and Dart'] },
    ],
    skills: ['Figma', 'Adobe XD', 'VS Code', 'Git', 'Docker', 'HTML & CSS', 'JavaScript', 'TypeScript', 'Python', 'Dart', 'Next.js', 'Flutter', 'React', 'Node.js', 'Teamwork', 'Leadership', 'Problem Solving', 'Communication'],
    languages: ['English', 'Spanish', 'French'],
};

export const classicATSData: CVData = {
    personalInfo: {
        name: 'JANE SMITH',
        phone: '+1 555-0456',
        email: 'jane.smith@example.com',
        address: 'New York, NY, USA',
        portfolio: 'linkedin.com/in/janesmith',
        photoUrl: '', // Left empty
    },
    summary: '', // This template has no summary section
    education: [
        { institution: 'TECH UNIVERSITY', degree: 'Bachelor of Science in Business Administration', dateRange: 'Aug 2017 - Oct 2021', gpa: '3.69/4.00 - Cum Laude, Dean\'s List' },
        { institution: 'FINANCE CERTIFICATION INSTITUTE', degree: 'Certification - Financial Analyst', dateRange: 'Nov 2021', gpa: 'Certified Professional' },
    ],
    workExperience: [
        { role: 'Finance Company', company: 'Professional Development Program (Management Trainee)', dateRange: 'Mar 2022 - Present', responsibilities: ['Learned all units in finance operations (Marketing, Operation, Collection, and Support Function).'] },
        { role: 'E-Commerce Platform Inc.', company: 'Business Analyst Intern', dateRange: 'May 2021 - Nov 2021', responsibilities: ['Helped 30+ vendors optimize their product listings.', 'Managed 12,000+ product entries in Electronics and Home Goods categories.', 'Coordinated with VP and Business Relations to approve new product launches.'] },
        { role: 'Teaching Assistant', company: 'Tech University', dateRange: 'Aug - Dec 2020', responsibilities: ['Assisted in teaching business courses:', 'Business Analytics Course in Fall Semester 2020.', 'Financial Management Course in Fall Semester 2020.'] },
        { role: 'Construction Management Firm', company: 'Engineering Intern', dateRange: 'Jul - Aug 2020', responsibilities: ['Evaluated technical designs for commercial building projects.', 'Assisted with project cost estimation and budgeting.'] },
    ],
    projects: [
        { name: 'University Graduation Committee', date: 'President, Sep - Oct 2019', details: ['Led committee to organize graduation events including ceremony, parade, and reception.', 'Managed team performance, timelines, and coordination meetings.'] },
        { name: 'Student Organization Social Event', date: 'Head of Logistics, Oct 2018', details: ['Successfully organized social gathering for new members.', 'Managed procurement and logistics for the event.'] },
    ],
    achievements: [
        { role: 'Outstanding Student Award', company: 'Aug 2021', dateRange: '', responsibilities: ['2nd highest GPA in graduating class of 2021.'] },
        { role: 'Dean\'s List Recognition', company: 'Feb 2020', dateRange: '', responsibilities: ['3rd highest GPA in Fall Semester 2019/2020.'] },
        { role: 'Dean\'s List Recognition', company: 'Feb 2019', dateRange: '', responsibilities: ['Top 5 students with highest GPA in Fall Semester 2018/2019.'] },
        { role: 'National Mathematics Competition', company: '2016', dateRange: '', responsibilities: ['1st Place Winner in Regional District (Gold Medal).'] },
    ],
    // Merged "Volunteer Experience" into this section
    organizationalExperience: [
        { role: 'Community Service Project', company: 'Volunteer', dateRange: 'Dec 2020', responsibilities: ['Participated in water infrastructure improvement project for rural community.'] },
    ],
    // Merged Languages & Skills into one array for this template's display logic
    skills: [
        'Microsoft Excel (Advanced - Excel for Business Specialization)',
        'Microsoft Office Suite, PowerPoint, Teams, AutoCAD, Adobe Creative Suite (Photoshop, Premiere Pro)',
        'Accounting Fundamentals, Financial Markets Analysis, Financial Modeling, Quantitative Analysis, Portfolio Management',
    ],
    languages: [
        'English (Native)',
        'Spanish (Professional Working Proficiency)',
    ],
};

export const joshuaPhuaData: CVData = {
    personalInfo: {
        name: 'ALEX MARTINEZ',
        phone: '+1 555-0789',
        email: 'alex.martinez@example.com',
        address: '',
        portfolio: 'linkedin.com/in/alexmartinez',
        photoUrl: '',
    },
    summary: 'Results-driven professional with expertise in project management and strategic planning. Proven track record of leading cross-functional teams and delivering innovative solutions.',
    education: [
        {
            institution: 'METROPOLITAN UNIVERSITY',
            degree: 'Bachelor of Business Administration, 3.85/4.00',
            dateRange: 'Sep 2018 - May 2022',
            gpa: 'Magna Cum Laude',
        },
        {
            institution: 'BUSINESS LEADERSHIP INSTITUTE',
            degree: 'Professional Certificate in Project Management',
            dateRange: 'Jan 2023 - Jun 2023',
            gpa: '',
        },
    ],
    workExperience: [
        { 
            role: 'Project Coordinator', 
            company: 'Tech Solutions Inc.', 
            dateRange: 'Jun 2022 - Present', 
            responsibilities: [
                'Managed 5+ cross-functional projects with budgets exceeding $500K',
                'Coordinated with stakeholders to ensure timely project delivery',
                'Implemented agile methodologies resulting in 30% efficiency improvement',
                'Led team of 8 members across different departments'
            ] 
        },
        { 
            role: 'Business Analyst Intern', 
            company: 'Global Consulting Group', 
            dateRange: 'Jun 2021 - Aug 2021', 
            responsibilities: [
                'Conducted market research and competitive analysis for Fortune 500 clients',
                'Developed data-driven recommendations that increased client revenue by 15%',
                'Created comprehensive reports and presentations for executive stakeholders'
            ] 
        },
        { 
            role: 'Operations Assistant', 
            company: 'Retail Innovations Co.', 
            dateRange: 'Jan 2021 - May 2021', 
            responsibilities: [
                'Streamlined inventory management processes reducing waste by 20%',
                'Assisted in implementing new POS system across 10 retail locations',
                'Trained 25+ staff members on operational procedures'
            ] 
        },
    ],
    organizationalExperience: [
        { 
            role: 'Vice President', 
            company: 'Business Students Association', 
            dateRange: 'Sep 2020 - May 2022', 
            responsibilities: [
                'Organized networking events with 200+ attendees and industry professionals',
                'Managed annual budget of $50,000 and increased membership by 40%',
                'Coordinated career development workshops and mentorship programs'
            ] 
        },
        { 
            role: 'Volunteer Coordinator', 
            company: 'Community Outreach Program', 
            dateRange: 'Jan 2019 - Dec 2020', 
            responsibilities: [
                'Recruited and managed 50+ volunteers for community service initiatives',
                'Organized fundraising events raising $15,000 for local charities'
            ] 
        }
    ],
    achievements: [
        { 
            role: 'Dean\'s List Award', 
            company: 'Metropolitan University', 
            dateRange: '2019-2022', 
            responsibilities: [
                'Maintained GPA above 3.5 for all 8 semesters',
                'Recognized for academic excellence in Business Administration'
            ] 
        },
        { 
            role: 'Innovation Challenge Winner', 
            company: 'National Business Competition', 
            dateRange: 'Mar 2021', 
            responsibilities: [
                '1st Place among 50+ teams for sustainable business proposal',
                'Awarded $10,000 grant to develop eco-friendly product line'
            ] 
        },
        { 
            role: 'Outstanding Leadership Award', 
            company: 'Business Students Association', 
            dateRange: 'May 2022', 
            responsibilities: [
                'Recognized for exceptional contribution to student organization growth',
                'Led initiatives that doubled active member participation'
            ] 
        }
    ],
    projects: [],
    skills: [],
    languages: [],
};
