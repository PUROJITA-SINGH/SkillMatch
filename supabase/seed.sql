-- Seed data for SkillMatch application
-- This file contains initial data to populate the database for development and testing

-- Insert initial skills catalog
INSERT INTO public.skills (name, category, description, popularity_score, demand_score, avg_salary_impact, related_skills, learning_resources) VALUES
-- Programming Languages
('JavaScript', 'Programming', 'Popular programming language for web development', 95, 90, 15000, ARRAY['TypeScript', 'React', 'Node.js'], '[{"type": "course", "title": "JavaScript Fundamentals", "url": "https://example.com", "provider": "Coursera"}]'),
('Python', 'Programming', 'Versatile programming language for web, data science, and AI', 90, 95, 20000, ARRAY['Django', 'Flask', 'Pandas', 'NumPy'], '[{"type": "course", "title": "Python for Everybody", "url": "https://example.com", "provider": "Coursera"}]'),
('TypeScript', 'Programming', 'Typed superset of JavaScript', 85, 88, 18000, ARRAY['JavaScript', 'React', 'Angular'], '[{"type": "documentation", "title": "TypeScript Handbook", "url": "https://www.typescriptlang.org/docs/"}]'),
('Java', 'Programming', 'Enterprise-grade programming language', 80, 85, 22000, ARRAY['Spring', 'Hibernate', 'Maven'], '[{"type": "course", "title": "Java Programming", "url": "https://example.com", "provider": "Oracle"}]'),
('C#', 'Programming', 'Microsoft programming language for .NET development', 75, 80, 20000, ARRAY['.NET', 'ASP.NET', 'Entity Framework'], '[{"type": "course", "title": "C# Fundamentals", "url": "https://example.com", "provider": "Microsoft Learn"}]'),
('Go', 'Programming', 'Google programming language for system programming', 70, 85, 25000, ARRAY['Docker', 'Kubernetes', 'Microservices'], '[{"type": "course", "title": "Go Programming", "url": "https://example.com", "provider": "Google"}]'),
('Rust', 'Programming', 'Systems programming language focused on safety', 65, 90, 30000, ARRAY['WebAssembly', 'System Programming'], '[{"type": "book", "title": "The Rust Programming Language", "url": "https://doc.rust-lang.org/book/"}]'),

-- Frontend Frameworks
('React', 'Framework', 'Popular JavaScript library for building user interfaces', 92, 88, 16000, ARRAY['JavaScript', 'TypeScript', 'Redux', 'Next.js'], '[{"type": "course", "title": "React Complete Guide", "url": "https://example.com", "provider": "Udemy"}]'),
('Angular', 'Framework', 'TypeScript-based web application framework', 78, 75, 15000, ARRAY['TypeScript', 'RxJS', 'NgRx'], '[{"type": "course", "title": "Angular Fundamentals", "url": "https://example.com", "provider": "Angular University"}]'),
('Vue.js', 'Framework', 'Progressive JavaScript framework', 75, 70, 14000, ARRAY['JavaScript', 'Vuex', 'Nuxt.js'], '[{"type": "course", "title": "Vue.js Complete Guide", "url": "https://example.com", "provider": "Vue Mastery"}]'),
('Next.js', 'Framework', 'React framework for production', 80, 85, 18000, ARRAY['React', 'JavaScript', 'TypeScript'], '[{"type": "documentation", "title": "Next.js Documentation", "url": "https://nextjs.org/docs"}]'),

-- Backend Frameworks
('Node.js', 'Framework', 'JavaScript runtime for server-side development', 88, 85, 17000, ARRAY['JavaScript', 'Express.js', 'MongoDB'], '[{"type": "course", "title": "Node.js Complete Guide", "url": "https://example.com", "provider": "Udemy"}]'),
('Express.js', 'Framework', 'Fast, unopinionated web framework for Node.js', 85, 80, 15000, ARRAY['Node.js', 'JavaScript', 'MongoDB'], '[{"type": "documentation", "title": "Express.js Guide", "url": "https://expressjs.com/"}]'),
('Django', 'Framework', 'High-level Python web framework', 78, 75, 18000, ARRAY['Python', 'PostgreSQL', 'Redis'], '[{"type": "course", "title": "Django for Beginners", "url": "https://example.com", "provider": "Django Girls"}]'),
('Flask', 'Framework', 'Lightweight Python web framework', 70, 68, 16000, ARRAY['Python', 'SQLAlchemy', 'Jinja2'], '[{"type": "course", "title": "Flask Mega-Tutorial", "url": "https://example.com", "provider": "Miguel Grinberg"}]'),
('Spring Boot', 'Framework', 'Java framework for building microservices', 75, 80, 20000, ARRAY['Java', 'Spring', 'Hibernate'], '[{"type": "course", "title": "Spring Boot Fundamentals", "url": "https://example.com", "provider": "Spring"}]'),

-- Databases
('PostgreSQL', 'Database', 'Advanced open-source relational database', 82, 85, 18000, ARRAY['SQL', 'Database Design', 'Performance Tuning'], '[{"type": "course", "title": "PostgreSQL Administration", "url": "https://example.com", "provider": "PostgreSQL Tutorial"}]'),
('MongoDB', 'Database', 'Popular NoSQL document database', 80, 78, 16000, ARRAY['NoSQL', 'Mongoose', 'Aggregation'], '[{"type": "course", "title": "MongoDB University", "url": "https://university.mongodb.com/"}]'),
('MySQL', 'Database', 'Popular open-source relational database', 85, 75, 15000, ARRAY['SQL', 'Database Design', 'Replication'], '[{"type": "course", "title": "MySQL Fundamentals", "url": "https://example.com", "provider": "Oracle"}]'),
('Redis', 'Database', 'In-memory data structure store', 75, 80, 17000, ARRAY['Caching', 'Session Management', 'Pub/Sub'], '[{"type": "course", "title": "Redis University", "url": "https://university.redis.com/"}]'),

-- Cloud & DevOps
('AWS', 'Cloud', 'Amazon Web Services cloud platform', 88, 92, 25000, ARRAY['EC2', 'S3', 'Lambda', 'RDS'], '[{"type": "certification", "title": "AWS Certified Solutions Architect", "url": "https://aws.amazon.com/certification/"}]'),
('Docker', 'DevOps', 'Containerization platform', 85, 88, 20000, ARRAY['Kubernetes', 'Container Orchestration'], '[{"type": "course", "title": "Docker Mastery", "url": "https://example.com", "provider": "Docker"}]'),
('Kubernetes', 'DevOps', 'Container orchestration platform', 80, 90, 28000, ARRAY['Docker', 'Microservices', 'Cloud Native'], '[{"type": "certification", "title": "Certified Kubernetes Administrator", "url": "https://www.cncf.io/certification/cka/"}]'),
('Terraform', 'DevOps', 'Infrastructure as Code tool', 75, 85, 22000, ARRAY['AWS', 'Infrastructure as Code', 'Cloud'], '[{"type": "course", "title": "Terraform Associate", "url": "https://example.com", "provider": "HashiCorp"}]'),

-- Data Science & AI
('Machine Learning', 'Data Science', 'Algorithms that learn from data', 85, 95, 35000, ARRAY['Python', 'TensorFlow', 'Scikit-learn'], '[{"type": "course", "title": "Machine Learning Course", "url": "https://example.com", "provider": "Coursera"}]'),
('TensorFlow', 'Data Science', 'Open-source machine learning framework', 78, 88, 30000, ARRAY['Python', 'Machine Learning', 'Deep Learning'], '[{"type": "course", "title": "TensorFlow Developer Certificate", "url": "https://www.tensorflow.org/certificate"}]'),
('Pandas', 'Data Science', 'Python data manipulation library', 80, 85, 20000, ARRAY['Python', 'NumPy', 'Data Analysis'], '[{"type": "course", "title": "Pandas Tutorial", "url": "https://example.com", "provider": "Kaggle"}]'),
('SQL', 'Data Science', 'Structured Query Language for databases', 90, 88, 18000, ARRAY['PostgreSQL', 'MySQL', 'Data Analysis'], '[{"type": "course", "title": "SQL Fundamentals", "url": "https://example.com", "provider": "W3Schools"}]'),

-- Mobile Development
('React Native', 'Mobile', 'Cross-platform mobile development framework', 75, 78, 18000, ARRAY['React', 'JavaScript', 'Mobile Development'], '[{"type": "course", "title": "React Native Complete Guide", "url": "https://example.com", "provider": "Expo"}]'),
('Flutter', 'Mobile', 'Google UI toolkit for mobile development', 70, 80, 20000, ARRAY['Dart', 'Mobile Development', 'Cross-platform'], '[{"type": "course", "title": "Flutter Development", "url": "https://example.com", "provider": "Google"}]'),
('Swift', 'Mobile', 'Apple programming language for iOS development', 68, 75, 22000, ARRAY['iOS', 'Xcode', 'Mobile Development'], '[{"type": "course", "title": "iOS Development", "url": "https://example.com", "provider": "Apple"}]'),

-- Soft Skills
('Project Management', 'Soft Skills', 'Planning and executing projects effectively', 85, 80, 15000, ARRAY['Agile', 'Scrum', 'Leadership'], '[{"type": "certification", "title": "PMP Certification", "url": "https://example.com", "provider": "PMI"}]'),
('Agile', 'Soft Skills', 'Iterative approach to project management', 80, 85, 12000, ARRAY['Scrum', 'Kanban', 'Project Management'], '[{"type": "certification", "title": "Certified ScrumMaster", "url": "https://example.com", "provider": "Scrum Alliance"}]'),
('Leadership', 'Soft Skills', 'Ability to guide and influence others', 88, 90, 20000, ARRAY['Communication', 'Team Management', 'Strategic Thinking'], '[{"type": "course", "title": "Leadership Fundamentals", "url": "https://example.com", "provider": "LinkedIn Learning"}]'),
('Communication', 'Soft Skills', 'Effective verbal and written communication', 92, 95, 18000, ARRAY['Presentation', 'Writing', 'Interpersonal Skills'], '[{"type": "course", "title": "Communication Skills", "url": "https://example.com", "provider": "Coursera"}]');

-- Insert sample users (these will be created when users sign up through auth)
-- The trigger will handle creating user profiles automatically

-- Insert sample jobs
INSERT INTO public.jobs (recruiter_id, title, company, location, job_type, experience_level, salary_min, salary_max, description, requirements, responsibilities, benefits, remote_allowed, required_skills, preferred_skills, status) VALUES
-- Note: These will need actual recruiter_ids once users are created
-- For now, using placeholder UUIDs that should be replaced with actual user IDs

-- Sample job postings with realistic data
('00000000-0000-0000-0000-000000000001', 'Senior Full Stack Developer', 'TechCorp Inc.', 'San Francisco, CA', 'full-time', 'senior', 120000, 180000, 
'We are looking for a Senior Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.',
'5+ years of experience in full stack development. Strong knowledge of React, Node.js, and PostgreSQL. Experience with cloud platforms preferred.',
'Develop and maintain web applications, collaborate with cross-functional teams, mentor junior developers, participate in code reviews.',
'Health insurance, 401k matching, flexible work hours, remote work options, professional development budget.',
true, ARRAY['React', 'Node.js', 'PostgreSQL', 'JavaScript', 'TypeScript'], ARRAY['AWS', 'Docker', 'Kubernetes'], 'active'),

('00000000-0000-0000-0000-000000000001', 'Data Scientist', 'DataFlow Analytics', 'New York, NY', 'full-time', 'mid', 90000, 130000,
'Join our data science team to build machine learning models and extract insights from large datasets.',
'3+ years of experience in data science. Proficiency in Python, SQL, and machine learning frameworks. Experience with big data tools preferred.',
'Build and deploy machine learning models, analyze large datasets, create data visualizations, collaborate with product teams.',
'Comprehensive health benefits, stock options, learning stipend, flexible PTO.',
false, ARRAY['Python', 'SQL', 'Machine Learning', 'Pandas', 'TensorFlow'], ARRAY['AWS', 'Spark', 'Tableau'], 'active'),

('00000000-0000-0000-0000-000000000002', 'Frontend Developer', 'StartupXYZ', 'Austin, TX', 'full-time', 'mid', 70000, 100000,
'Looking for a creative Frontend Developer to build beautiful and responsive user interfaces.',
'2+ years of frontend development experience. Strong skills in React, CSS, and JavaScript. Experience with modern build tools.',
'Develop user interfaces, implement responsive designs, optimize for performance, work closely with designers.',
'Health insurance, equity package, unlimited PTO, modern office space.',
true, ARRAY['React', 'JavaScript', 'CSS', 'HTML'], ARRAY['TypeScript', 'Next.js', 'Figma'], 'active'),

('00000000-0000-0000-0000-000000000002', 'DevOps Engineer', 'CloudFirst Solutions', 'Seattle, WA', 'full-time', 'senior', 110000, 150000,
'Seeking an experienced DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines.',
'4+ years of DevOps experience. Strong knowledge of AWS, Docker, and Kubernetes. Experience with infrastructure as code.',
'Manage cloud infrastructure, implement CI/CD pipelines, monitor system performance, ensure security best practices.',
'Excellent benefits package, remote work flexibility, conference attendance budget.',
true, ARRAY['AWS', 'Docker', 'Kubernetes', 'Terraform'], ARRAY['Jenkins', 'Monitoring', 'Security'], 'active'),

('00000000-0000-0000-0000-000000000003', 'Mobile Developer', 'MobileFirst Inc.', 'Los Angeles, CA', 'contract', 'mid', 80000, 120000,
'Contract position for a Mobile Developer to build cross-platform mobile applications.',
'3+ years of mobile development experience. Proficiency in React Native or Flutter. Experience with app store deployment.',
'Develop mobile applications, implement new features, optimize for performance, collaborate with design team.',
'Competitive hourly rate, flexible schedule, potential for full-time conversion.',
false, ARRAY['React Native', 'JavaScript', 'Mobile Development'], ARRAY['Flutter', 'iOS', 'Android'], 'active'),

('00000000-0000-0000-0000-000000000003', 'Backend Developer', 'APIFirst Corp', 'Chicago, IL', 'full-time', 'junior', 60000, 85000,
'Entry-level Backend Developer position to work on scalable API development.',
'1-2 years of backend development experience. Knowledge of Node.js or Python. Understanding of database design.',
'Develop REST APIs, implement business logic, work with databases, participate in code reviews.',
'Health benefits, mentorship program, learning opportunities, career growth path.',
true, ARRAY['Node.js', 'JavaScript', 'MongoDB'], ARRAY['Python', 'PostgreSQL', 'Docker'], 'active');

-- Insert sample skill recommendations (these would normally be generated by the system)
-- Will be populated when users are created and matches are generated

-- Insert sample notifications templates
-- These will be created dynamically based on user actions

-- Create some initial analytics events
-- These will be populated as users interact with the system

-- Update skill popularity and demand scores based on job requirements
UPDATE public.skills SET 
    popularity_score = popularity_score + 5,
    demand_score = demand_score + 3
WHERE name IN (
    SELECT DISTINCT unnest(required_skills || preferred_skills) 
    FROM public.jobs 
    WHERE status = 'active'
);

-- Create indexes for better performance on sample data
ANALYZE public.skills;
ANALYZE public.jobs;

