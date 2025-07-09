import { supabase } from '@/lib/supabase';

export async function migrateRobertData() {
  try {
    console.log('Starting Robert\'s data migration...');

    // 1. Migrate personal info
    console.log('Migrating personal info...');
    const { error: personalError } = await supabase
      .from('personal_info')
      .insert([{
        name: 'Robert Mill',
        role: 'Innovation Strategy Consultant',
        company: 'CIBC',
        location: 'Toronto, Ontario',
        email: 'bertmill19@gmail.com',
        linkedin: 'https://www.linkedin.com/in/bertomill/'
      }]);
    
    if (personalError) {
      console.error('Personal info migration error:', personalError);
      throw personalError;
    }

    // 2. Migrate education
    console.log('Migrating education...');
    const educationData = [
      {
        degree: 'Masters of Science (MSc), Digital Management',
        institution: 'Ivey Business School',
        graduation_year: '2022',
        achievements: [
          'Dean\'s honors list',
          '2 time national champion football player during studies',
          'Elected president of the Fintech club at Ivey Business School',
          'Winner of the Ivey Design Innovation Studio competition'
        ],
        relevant_coursework: [
          'Digital Management (frameworks for adopting technology)',
          'Prescriptive Analytics',
          'Design thinking'
        ],
        why_chosen: 'I did my undergraduate degree in business and was super fascinated in coding and web development, so I felt this was a great bridge between technology and business, without doing a full software engineering degree.'
      },
      {
        degree: 'Graduate Diploma (GDip) in Business & Sustainability',
        institution: 'Ivey Business School',
        graduation_year: '2022',
        achievements: ['Completed alongside MSc program'],
        relevant_coursework: [
          'Business sustainability frameworks',
          'Environmental strategy'
        ],
        why_chosen: 'Complemented my digital management studies with sustainability focus.'
      },
      {
        degree: 'Bachelors of Arts (BA), Business Management & Legal Studies',
        institution: 'Western University',
        graduation_year: '2021',
        achievements: ['2 time national champion football player during studies'],
        relevant_coursework: [
          'Business Management',
          'Legal Studies'
        ],
        why_chosen: 'Foundation in business with legal understanding to prepare for future career opportunities.'
      }
    ];

    for (const edu of educationData) {
      const { error: eduError } = await supabase
        .from('education')
        .insert([edu]);
      
      if (eduError) {
        console.error('Education migration error:', eduError);
        throw eduError;
      }
    }

    // 3. Migrate all work experience
    console.log('Migrating work experience...');
    const experienceData = [
      // CIBC Experience
      {
        company: 'CIBC',
        position: 'Innovation Strategy Consultant',
        start_date: 'August 2023',
        end_date: 'Present',
        location: 'Toronto, Ontario',
        how_found_job: 'Discovered this opportunity through the Ivey Design Innovation Studio, where CIBC was a key partner. During my final presentation, the Director of CIBC Innovation was impressed with my strategic analysis and directly recruited me to join the team.',
        who_hired_you: 'Director of CIBC Innovation',
        what_hired_to_do: 'Hired as an Innovation Strategy Consultant to analyze market trends, assess emerging technologies, develop strategic recommendations for executive leadership, and drive AI maturity initiatives across the organization.',
        manager_description: 'My manager would describe my key strengths as being highly analytical with the ability to rapidly ingest complex information and synthesize it into clear, actionable strategic recommendations. They would highlight my strong communication skills and collaborative approach to cross-functional teamwork.',
        areas_for_growth: 'Areas for development include deepening technical understanding of database systems and enhancing stakeholder management skills when working with diverse teams across different business units and understanding how to optimize my role in various organizational contexts.',
        biggest_win: 'Led a transformational AI maturity initiative that elevated CIBC from #41 to the top 20 among global banks. Analyzed thousands of data points from industry benchmarking to develop a comprehensive strategic plan with 21 specific initiatives covering investment decisions, vendor partnerships, talent acquisition, and communications strategy. This work was featured in the CEO\'s annual report and quarterly earnings calls as one of the bank\'s key achievements.',
        toughest_challenge: 'The most challenging aspect has been navigating complex organizational structures to identify the right stakeholders and drive action across multiple business units with different priorities and timelines.',
        why_left: 'Transitioning to pursue new opportunities in technology strategy and database-focused roles.',
        why_made_move: 'This role represented an ideal opportunity to bridge my business strategy background with hands-on experience in technology innovation at a major financial institution, directly applying insights from my Digital Management education.',
        what_learned: 'Gained deep understanding of enterprise organizational dynamics, including how to navigate hierarchical structures, identify cost and revenue centers, and align strategic initiatives with stakeholder objectives to drive meaningful organizational change.',
        accomplishments: [
          'Spearheaded AI maturity transformation that moved CIBC from #41 to top 20 globally among banks',
          'Developed and executed 21 strategic initiatives covering AI investments, vendor partnerships, and talent strategy',
          'Created executive-level strategic recommendations that were featured in CEO communications',
          'Built custom AI-powered tools for research analysis and competitor benchmarking'
        ],
        challenges: [
          'Navigated complex stakeholder environments across multiple business units',
          'Synthesized massive datasets into actionable executive insights',
          'Drove organizational change initiatives across traditional banking hierarchies'
        ],
        exceptional_performance: [
          'Project outcomes featured in CEO annual report and quarterly earnings calls',
          'Direct recruitment by senior leadership based on presentation performance',
          'Successfully influenced enterprise-level strategic decisions',
          'Created innovative AI tools to enhance personal and team productivity'
        ],
        skills: [
          'Strategic consulting',
          'Executive communication',
          'Complex data analysis and synthesis',
          'Stakeholder management',
          'AI strategy development',
          'Competitive intelligence',
          'Cross-functional team leadership'
        ],
        technologies: [
          'Google Vertex AI',
          'Microsoft Azure',
          'AI-powered research and analysis tools',
          'Executive presentation platforms',
          'Data visualization tools'
        ]
      },
      // Scelta Inc Experience
      {
        company: 'Scelta Inc',
        position: 'Software Integration Consultant',
        start_date: 'September 2022',
        end_date: 'June 2023',
        location: 'London, Ontario',
        how_found_job: 'Found this opportunity through a personal connection with the founder, who I went to school with and is only a few years older than me. I was hired as one of the first 10 employees.',
        who_hired_you: 'Company founder',
        what_hired_to_do: 'Hired to work directly with construction industry clients to understand their needs, map out their business processes, and lead digital transformation initiatives. Main focus was transitioning companies from paper-based systems to digital solutions using Google Cloud Platform, including payroll, project management, and inventory management systems.',
        manager_description: 'My manager described me as one of the most resourceful people he\'s ever met. He highlighted my ability to quickly identify and implement the right tools, AI solutions, or software for any given challenge, which often saved the team weeks of effort due to my knowledge of the latest technological tools.',
        areas_for_growth: 'Key area for growth was improving internal documentation and process tracking. We needed better systems for documenting meetings, tracking our work, and creating processes for onboarding new employees as the team scaled.',
        biggest_win: 'Successfully set up the entire team on Google Cloud Platform and created replicable solution templates. This transformation allowed us to scale from 5 customers to 20 customers without significant additional effort, moving from custom one-off solutions to standardized, duplicatable templates using Firebase and Google App Sheets.',
        toughest_challenge: 'The biggest challenge was transitioning from completely customized solutions for each client to creating standardized, scalable templates while still meeting each company\'s unique needs in the construction industry.',
        why_left: 'Left when recruited by CIBC for an Innovation Strategy Consultant role. It was a difficult decision as I loved the startup environment, but CIBC offered an opportunity to do similar AI consulting work at one of Canada\'s largest enterprises, which was an exciting new challenge.',
        why_made_move: 'I was passionate about technology transformation and helping legacy companies integrate technology to make their operations 10x more efficient and deliver 10x more value to their customers. I was attracted to the startup environment, fast-moving pace, direct customer interaction, and ability to build and iterate quickly.',
        what_learned: 'Gained deep experience in customer journey mapping, client relationship management, and scaling technology solutions. Learned how to identify and implement the most effective tools for specific business challenges, and how to transition from custom solutions to scalable, template-based approaches.',
        accomplishments: [
          'Scaled company from 5 to 20 customers by creating replicable solution templates',
          'Successfully led digital transformation for construction companies, reducing project timelines from weeks to days',
          'Implemented Google Cloud Platform infrastructure that enabled standardized, scalable solutions',
          'Built comprehensive mobile and web applications for project management, inventory, and payroll systems'
        ],
        challenges: [
          'Transitioning legacy construction companies from paper-based to digital systems',
          'Creating standardized solutions while meeting unique client requirements',
          'Scaling team processes and documentation as the company grew rapidly'
        ],
        exceptional_performance: [
          'Hired as one of the first 10 employees due to founder\'s confidence in abilities',
          'Recognized as \'most resourceful person\' by management for tool selection and implementation',
          'Achieved 4x customer growth through process innovation and template creation',
          'Successfully balanced startup role while completing Master\'s degree'
        ],
        skills: [
          'Customer journey mapping',
          'Client relationship management',
          'Technology solution architecture',
          'Digital transformation consulting',
          'Sales and pitching',
          'Cold outreach and email marketing',
          'Process documentation and scaling'
        ],
        technologies: [
          'Google Cloud Platform',
          'Firebase',
          'Google App Sheets',
          'React',
          'React Native',
          'HubSpot',
          'Mobile app development'
        ]
      },
      // Sick Kids Hospital Experience
      {
        company: 'Sick Kids Hospital',
        position: 'Integration Consultant (Summer Internship)',
        start_date: 'May 2023',
        end_date: 'August 2023',
        location: 'Toronto, Ontario',
        how_found_job: 'Found this opportunity through the Ivey Masters program job board, where internships are recommended to students. Applied and was selected for a 4-month consulting engagement.',
        who_hired_you: 'Sick Kids Hospital hiring manager',
        what_hired_to_do: 'Hired to conduct process mining and analysis of their Electronic Health Record (EHR) system. Primary responsibility was to understand current hospital processes and identify opportunities to implement technology solutions that would improve convenience and efficiency for both patients and healthcare professionals.',
        manager_description: 'Our manager was extremely pleased with the diligent and in-depth nature of our analysis. They highlighted our thoroughness in going through painstaking detail to examine every single process in the physician\'s journey and our ability to identify areas where physicians were experiencing burnout and where AI solutions could provide relief.',
        areas_for_growth: 'Key area for growth was developing faster domain expertise in healthcare. I could have spent more time understanding the healthcare industry background before diving into the analysis, which would have provided better context for the recommendations.',
        biggest_win: 'Successfully recommended and influenced the implementation of an AI-powered note-taking system for physicians. We provided detailed analysis of vendor options, and the hospital chose Dragon Notes (Microsoft partnership) for recording patient interactions. While not solely credited to our work, our recommendation was a major factor in their decision.',
        toughest_challenge: 'The biggest challenges were accessing the necessary data for our analysis and understanding the complex hospital system operations - how patients, staff, and processes move through the facility. Getting first-person experience of the healthcare environment was initially difficult.',
        why_left: 'The summer internship concluded at the end of August. While Sick Kids offered us the opportunity to continue, I had already committed to starting my role at CIBC and was excited about that new opportunity.',
        why_made_move: 'This was my summer internship during my master\'s program. I was interested in applying my digital management and process optimization skills to the healthcare sector, which presented unique challenges in technology integration.',
        what_learned: 'Learned that healthcare technology implementation is significantly more complex than other industries due to multiple stakeholders, regulatory requirements, and interconnected services. Gained experience in healthcare process analysis and understanding the critical importance of physician workflow optimization.',
        accomplishments: [
          'Conducted comprehensive process mining analysis of hospital EHR systems',
          'Identified key areas of physician burnout and inefficiency in patient care workflows',
          'Successfully recommended AI note-taking solution that was implemented by the hospital',
          'Provided detailed vendor analysis and implementation recommendations'
        ],
        challenges: [
          'Navigating complex healthcare data access requirements',
          'Understanding intricate hospital operational processes and stakeholder relationships',
          'Learning healthcare domain expertise quickly to provide meaningful recommendations'
        ],
        exceptional_performance: [
          'Received exceptional feedback for thoroughness and attention to detail in process analysis',
          'Recommended solution was actually implemented by the hospital',
          'Offered opportunity to continue engagement beyond internship period',
          'Successfully analyzed complex healthcare workflows with limited domain background'
        ],
        skills: [
          'Healthcare process analysis',
          'Customer journey mapping',
          'Process mining',
          'Technology vendor evaluation',
          'Stakeholder analysis',
          'Healthcare workflow optimization',
          'AI solution recommendation'
        ],
        technologies: [
          'Electronic Health Record (EHR) systems',
          'Process mapping tools',
          'Microsoft Excel for analysis',
          'Dragon Notes (AI transcription)',
          'Healthcare process frameworks'
        ]
      },
      // Wood Gundy Experience
      {
        company: 'CIBC Wood Gundy Private Wealth',
        position: 'Customer Service Associate',
        start_date: 'January 2022',
        end_date: 'August 2022',
        location: 'London, Ontario',
        how_found_job: 'Found this opportunity through my football coach from undergrad, who invited me to join his wealth management team as a customer service associate. This aligned perfectly with my interest in finance and customer service.',
        who_hired_you: 'Football coach who was also a wealth manager',
        what_hired_to_do: 'Hired to serve as a wealth manager\'s assistant, providing comprehensive customer support including answering client questions, conducting marketing initiatives, understanding customer needs, and consulting clients on their financial futures. Responsibilities included teaching clients about financial planning, creating detailed financial plans and projections, and providing data-driven portfolio recommendations.',
        manager_description: 'My manager would describe me as very professional, kind, and caring. He would highlight my excellence in customer relations, diligent work ethic, strong communication skills, reliability in always showing up on time, and consistently delivering high-quality work.',
        areas_for_growth: 'Key area for growth was developing deeper industry expertise in wealth management. Building an intuitive understanding of customer pain points and concerns was important, especially given the sensitive nature of financial planning and the emotional aspects of managing personal wealth.',
        biggest_win: 'Led a comprehensive marketing campaign that included flyers, digital advertising, and offering free upfront financial plans to prospective clients. This campaign successfully grew our client portfolio by 20%, adding 10 new clients to our existing base of 50 clients within one year.',
        toughest_challenge: 'The most challenging aspect was supporting customers during market downturns when they were worried and wanted to withdraw their investments. This required explaining market dynamics in a matter-of-fact, reassuring tone while providing clear guidance on long-term financial strategies.',
        why_left: 'Left to begin my master\'s program as I wanted to focus more on the technology implementation side of finance rather than purely traditional wealth management. I was interested in exploring how technology could transform the financial services industry.',
        why_made_move: 'I was passionate about finance and wanted to gain hands-on experience in the industry. This role offered an excellent first step into a finance career while working with someone I respected and who knew me well through our football connection.',
        what_learned: 'Gained comprehensive understanding of client relationship management in financial services, learned how to communicate complex financial concepts to non-expert clients, and developed skills in creating data-driven recommendations for sensitive financial decisions.',
        accomplishments: [
          'Successfully grew client portfolio by 20% through comprehensive marketing campaign',
          'Created detailed financial plans and projections for numerous clients',
          'Provided data-driven portfolio recommendations that helped clients achieve their financial goals',
          'Developed and executed successful digital and traditional marketing initiatives'
        ],
        challenges: [
          'Managing client relationships during volatile market conditions',
          'Explaining complex financial concepts to clients with varying levels of financial literacy',
          'Building trust and confidence with clients regarding sensitive financial decisions'
        ],
        exceptional_performance: [
          'Recommended by football coach based on character and work ethic',
          'Successfully managed client relationships while completing undergraduate studies',
          'Delivered measurable results through marketing campaign (20% client growth)',
          'Maintained high client satisfaction during challenging market conditions'
        ],
        skills: [
          'Customer relationship management',
          'Financial planning and analysis',
          'Data-driven consulting',
          'Client education and training',
          'Marketing campaign development',
          'Financial projections and modeling',
          'Customer service excellence'
        ],
        technologies: [
          'Goal Planner software',
          'Microsoft Excel (advanced functions)',
          'Morningstar Direct',
          'HTML',
          'CSS',
          'Company website management',
          'Digital advertising platforms'
        ]
      }
    ];

    for (const exp of experienceData) {
      const { error: expError } = await supabase
        .from('experience')
        .insert([exp]);
      
      if (expError) {
        console.error('Experience migration error:', expError);
        throw expError;
      }
    }

    console.log('Robert\'s data migration completed successfully!');
    return { success: true, message: 'All data migrated successfully' };

  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error: error };
  }
}