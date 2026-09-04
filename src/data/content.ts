/** Homepage content. Kept separate so copy can be edited without touching layout. */

export const capabilities = [
  {
    id: 'clinical',
    index: '01',
    title: 'Clinical Systems',
    body: 'Electronic medical records, order entry and clinical documentation engineered around how care teams actually work.',
    points: ['EMR & EHR platforms', 'Clinical decision support', 'Care pathway automation'],
  },
  {
    id: 'interop',
    index: '02',
    title: 'Interoperability',
    body: 'HL7 and FHIR integration that lets separate systems exchange patient information safely and without friction.',
    points: ['HL7 v2 & FHIR R4', 'Integration engines', 'Health information exchange'],
  },
  {
    id: 'data',
    index: '03',
    title: 'Health Data & Analytics',
    body: 'Turning clinical and operational data into measurements teams can act on, governed end to end.',
    points: ['Clinical data warehousing', 'Operational dashboards', 'Population health analytics'],
  },
  {
    id: 'ai',
    index: '04',
    title: 'Applied AI',
    body: 'Machine intelligence applied where it changes outcomes — triage support, documentation, and workflow automation.',
    points: ['Clinical documentation AI', 'Predictive risk models', 'Intelligent automation'],
  },
  {
    id: 'patient',
    index: '05',
    title: 'Patient Platforms',
    body: 'Portals, scheduling and telehealth that extend care beyond the facility without adding administrative load.',
    points: ['Patient portals', 'Appointment & scheduling', 'Telehealth delivery'],
  },
  {
    id: 'compliance',
    index: '06',
    title: 'Security & Compliance',
    body: 'Protected health information handled to standard, with auditability designed in rather than added later.',
    points: ['Access control & audit', 'Data protection', 'Regulatory alignment'],
  },
]

/** Layers of the "Digital Anatomy" scroll section — the concept made concrete. */
export const anatomyLayers = [
  {
    id: 'people',
    label: 'People',
    title: 'Patients and care teams',
    body: 'Every system begins with the people using it. Clinicians, administrators and patients each need a different view of the same truth.',
  },
  {
    id: 'workflow',
    label: 'Workflow',
    title: 'Clinical processes',
    body: 'Admission, diagnosis, treatment, follow-up. Software should follow the shape of care, not force care to follow the software.',
  },
  {
    id: 'data',
    label: 'Data',
    title: 'The clinical record',
    body: 'Results, notes, medications and history — structured so they remain meaningful wherever they travel.',
  },
  {
    id: 'exchange',
    label: 'Exchange',
    title: 'Connected systems',
    body: 'Laboratories, pharmacies, imaging and national registries, exchanging information through open standards.',
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    title: 'Insight and automation',
    body: 'Analytics and machine intelligence layered on top, surfacing what matters and removing repetitive work.',
  },
]

/**
 * The statement directly under the hero. Split into two clauses so the first
 * can carry the crimson accent, matching the About page's page hero.
 */
export const positioning = {
  eyebrow: 'Who we are',
  lead: 'Healthcare runs on software.',
  rest: 'We build the systems that clinicians, administrators and patients depend on every day.',
  // Deliberately not `metrics` — that array renders further down the same page
  // in Clients, and repeating it would show the same figures twice on one scroll.
  proof: [
    { value: 'Clinical-first', label: 'Built around care workflows, not retrofitted onto them' },
    { value: 'HL7 & FHIR', label: 'Systems that exchange patient information safely' },
    { value: 'Qatar-based', label: 'Engineering locally, deployed across three continents' },
  ],
}

export const metrics = [
  { value: '250', label: 'General practices running on indici' },
  { value: '85%', label: 'Telehealth coverage across deployed services' },
  { value: '600+', label: 'People across our global team' },
  { value: '2004', label: 'Building healthcare software since' },
]

export const industries = [
  {
    name: 'Hospitals',
    body: 'Multi-department platforms for inpatient and outpatient care.',
    image: '/industries/hospitals.webp',
  },
  {
    name: 'Clinics & Polyclinics',
    body: 'Right-sized systems for high-throughput ambulatory settings.',
    image: '/industries/clinics.webp',
  },
  {
    name: 'Diagnostics & Laboratories',
    body: 'Order-to-result workflows with instrument integration.',
    image: '/industries/diagnostics.webp',
  },
  {
    name: 'Pharmacy',
    body: 'Dispensing, inventory and medication safety systems.',
    image: '/industries/pharmacy.webp',
  },
  {
    name: 'Insurers & Payers',
    body: 'Claims, eligibility and provider network platforms.',
    image: '/industries/insurers.webp',
  },
  {
    name: 'Public Health',
    body: 'Registries and reporting for population-level programmes.',
    image: '/industries/public-health.webp',
  },
]

export const approach = [
  {
    step: 'Understand',
    body: 'We start in the clinical environment, mapping how work actually happens before proposing any system.',
  },
  {
    step: 'Architect',
    body: 'Systems designed for interoperability, auditability and change — because healthcare requirements never stand still.',
  },
  {
    step: 'Engineer',
    body: 'Built and tested against real clinical scenarios, with security and data protection designed in from the start.',
  },
  {
    step: 'Sustain',
    body: 'Deployment, training and long-term support. Healthcare software is a commitment, not a delivery.',
  },
]

/**
 * Per-service detail for /services. Keyed by capability id rather than kept as
 * a parallel array, so the two cannot drift out of order.
 */
export const serviceDetail: Record<
  string,
  { lead: string; deliverables: string[]; outcomes: string[] }
> = {
  clinical: {
    lead: 'A clinical system is judged at three in the morning, by a nurse who needs one screen to load. We build electronic medical records around observed clinical work rather than around a data model, so the software disappears into the task instead of competing with it.',
    deliverables: [
      'EMR and EHR platform implementation',
      'Computerised provider order entry',
      'Clinical documentation and templating',
      'Decision support and alerting rules',
      'Care pathway and protocol automation',
    ],
    outcomes: [
      'Less time documenting, more time with patients',
      'Fewer transcription and ordering errors',
      'Consistent practice across departments',
    ],
  },
  interop: {
    lead: 'Most healthcare data problems are not storage problems, they are movement problems. We engineer the interfaces that let a laboratory, a pharmacy and a national registry speak to each other without a human retyping anything in between.',
    deliverables: [
      'HL7 v2 interface development',
      'FHIR R4 APIs and resource modelling',
      'Integration engine deployment and tuning',
      'Terminology mapping — SNOMED, LOINC, ICD',
      'Health information exchange connectivity',
    ],
    outcomes: [
      'Results reach the record without manual entry',
      'New systems connect in weeks, not quarters',
      'One patient identity across the estate',
    ],
  },
  data: {
    lead: 'Clinical data is only useful once it can be trusted and compared. We build the warehousing and governance underneath the dashboard, so the number a manager acts on means what they think it means.',
    deliverables: [
      'Clinical data warehouse design',
      'ETL pipelines and data quality monitoring',
      'Operational and executive dashboards',
      'Population health and cohort analytics',
      'Regulatory and statutory reporting',
    ],
    outcomes: [
      'One agreed set of operational figures',
      'Reporting cycles measured in minutes',
      'Trends visible early enough to act on',
    ],
  },
  ai: {
    lead: 'We apply machine intelligence where it removes work or catches something a person would miss, and nowhere else. Every model ships with the clinician kept in the loop and its reasoning visible, because an unexplainable recommendation is not usable in care.',
    deliverables: [
      'Ambient and assisted clinical documentation',
      'Predictive risk and deterioration models',
      'Triage and prioritisation support',
      'Document classification and extraction',
      'Model monitoring and drift detection',
    ],
    outcomes: [
      'Administrative load reduced measurably',
      'Earlier flags on deteriorating patients',
      'Decisions a clinician can audit and override',
    ],
  },
  patient: {
    lead: 'Digital front doors fail when they add work for the staff behind them. We build patient-facing platforms that write back into the clinical system properly, so a booking made at midnight is simply a booking.',
    deliverables: [
      'Patient portals and mobile applications',
      'Appointment booking and scheduling',
      'Telehealth and remote consultation',
      'Automated reminders and follow-up',
      'Results release and secure messaging',
    ],
    outcomes: [
      'Fewer missed appointments',
      'Call volume shifted to self-service',
      'Care continued beyond the facility',
    ],
  },
  compliance: {
    lead: 'Protected health information carries obligations that do not bend. We design access control, encryption and audit into the architecture at the start, because retrofitting them into a live clinical system is expensive and rarely complete.',
    deliverables: [
      'Role-based access control design',
      'End-to-end audit logging',
      'Encryption at rest and in transit',
      'Regulatory alignment and documentation',
      'Security review and penetration testing',
    ],
    outcomes: [
      'Every record access attributable',
      'Audits answered from the system itself',
      'Breach exposure reduced by design',
    ],
  },
}

/** The company narrative for /about — the site had none before. */
export const story = [
  {
    heading: 'Less paperwork, more patient care',
    body: 'Valentia Technologies has been building healthcare software since 2004, from a straightforward observation: most clinical systems are designed at a distance from the floor they end up running on, and it shows in every workaround a nurse invents to get through a shift. We build the other way round — time spent in the department first, architecture second.',
  },
  {
    heading: 'A suite, not a single system',
    body: 'Care does not happen in one setting, so neither does our software. indici for primary care, InnovaCare for home care, Spectrum for telehealth and triage, Vivasta for community services, CareMonX for emergency response and Maha for oncology — six platforms that share standards and speak to each other.',
  },
  {
    heading: 'Global footprint, local delivery',
    body: 'Over 600 people support services across New Zealand, Australia, the South Pacific, Ireland, South Africa, Qatar and Dubai. We build to HL7 and FHIR because open standards are what keep patient records readable and portable long after any single vendor relationship ends.',
  },
  {
    heading: 'Engineering as a commitment',
    body: 'Clinical software is not delivered and forgotten. Requirements shift with regulation, services reorganise, and a system that cannot change becomes the obstacle. We plan for that from the first design review, and we stay with what we build.',
  },
]

/** Principles behind the engineering decisions. */
export const values = [
  {
    title: 'Collaboration',
    body: 'We work alongside care teams rather than at a distance from them. The workflow session on the floor shapes the architecture, not the other way round.',
  },
  {
    title: 'Excellence',
    body: 'Clinical software is judged in service, not at handover. We are accountable for whether the system works on the ward, not for whether it matched a specification written a year earlier.',
  },
  {
    title: 'Innovation',
    body: 'Cloud, mobile and machine intelligence applied where they remove work or catch what a person would miss — and nowhere else.',
  },
  {
    title: 'Integrity',
    body: 'Patient data outlives the system holding it. We build on open standards, with security and auditability designed in at the start, so information stays readable and protected whoever runs it next.',
  },
]

/** How engagements are structured — shown on /services. */
export const engagement = [
  {
    model: 'Platform delivery',
    body: 'End-to-end design, build and deployment of a clinical or patient-facing system, from discovery through to go-live and handover.',
  },
  {
    model: 'Systems integration',
    body: 'Connecting systems that were never designed to speak to each other — interface engineering, terminology mapping and migration.',
  },
  {
    model: 'Managed operations',
    body: 'Long-term support of systems in live clinical use: monitoring, incident response, regulatory updates and continuous improvement.',
  },
]

/**
 * The product suite. Deliberately the same shape as `capabilities` so
 * Capabilities and ServiceDetail render either list without a second component.
 */
export const products = [
  {
    id: 'indici',
    icon: '/solutions/indici.svg',
    index: '01',
    title: 'indici',
    body: 'A true cloud-based electronic health record, richly integrated across every clinical and administrative part of a practice.',
    points: ['360˚ longitudinal record', 'Shared care planning', 'Smart reporting & analytics'],
  },
  {
    id: 'innovacare',
    icon: '/solutions/innovacare.svg',
    index: '02',
    title: 'InnovaCare',
    body: 'Home care management for private and public providers — scheduling, case management, rehabilitation, payroll and client monitoring in one platform.',
    points: ['Client & staff management', 'Scheduling and payroll', 'Quality of care monitoring'],
  },
  {
    id: 'spectrum',
    icon: '/solutions/spectrum.svg',
    index: '03',
    title: 'Spectrum',
    body: 'Telehealth and case management for clinical and mental health services, turning referrals and service requests into cases that can be triaged and tracked.',
    points: ['Contact centre management', 'Clinical decision support', 'Waiting room management'],
  },
  {
    id: 'vivasta',
    icon: '/solutions/vivasta.svg',
    index: '04',
    title: 'Vivasta',
    body: 'Community healthcare delivery end to end — referrals, patient records, logistics and field communication, on web and mobile.',
    points: ['Referral management', 'Nursing and field apps', 'Remote patient monitoring'],
  },
  {
    id: 'caremonx',
    icon: '/solutions/caremonx.svg',
    index: '05',
    title: 'CareMonX',
    body: 'An emergency care suite covering call taking and dispatch, resource mobilisation and electronic patient care reporting.',
    points: ['Real-time routing', 'Mobile data terminals', 'Tactical incident boards'],
  },
  {
    id: 'maha',
    icon: '/solutions/maha.svg',
    index: '06',
    title: 'Maha',
    body: 'Cloud-based anti-cancer therapeutics, designed for both adult and paediatric populations, with clinical decision support throughout.',
    points: ['Regimen builder', 'Prescribing workflows', 'In-built pharmacy & formulary'],
  },
]

/**
 * Per-product detail, keyed by product id — mirrors `serviceDetail` so the same
 * ServiceDetail section renders it.
 */
export const productDetail: Record<
  string,
  { lead: string; deliverables: string[]; outcomes: string[] }
> = {
  indici: {
    lead: 'indici is a cloud-based, richly integrated electronic health record encompassing all clinical and administrative components of a practice — the next step in cloud EHR, built for unparalleled patient and practice management.',
    deliverables: [
      'Cloud-based EHR with access from any location',
      'Automated scheduling and billing workflows',
      'Patient portal with online booking and records access',
      'Telehealth integrated into the clinical record',
      'FHIR and HL7 data interoperability',
      'Population health and preventive care tools',
    ],
    outcomes: [
      'One longitudinal record across the care team',
      'Administrative work absorbed by the system',
      'Care continued beyond the consultation room',
    ],
  },
  innovacare: {
    lead: 'InnovaCare manages home care services for private and public healthcare organisations, covering scheduling, case management, staff attendants, rehabilitation, payroll, budget management and client monitoring.',
    deliverables: [
      'Centralised client and staff data',
      'Streamlined scheduling and payroll',
      'Web-based access from any device',
      'Service quality and satisfaction monitoring',
      'Integration with HealthLink, NHI, eSAM, HL7 and FHIR',
      'Payroll and budget management',
    ],
    outcomes: [
      'Staff coordinated without a spreadsheet',
      'Consistent quality of care, evidenced',
      'Clients engaged with responsive service',
    ],
  },
  spectrum: {
    lead: 'Spectrum is tailored for clinical and mental health services, letting users create referrals and service requests that become cases — managed with safety plans, documents, notes and triage scores.',
    deliverables: [
      'Full contact centre management',
      'Clinical decision support and triage',
      'Appointments and waiting room management',
      'Case monitoring across the patient journey',
      'Clinical consultation record',
      'Mobile doctor management for on-call cover',
    ],
    outcomes: [
      'High call volumes triaged safely',
      'Providers informed by real-time updates',
      'After-hours access without a hospital visit',
    ],
  },
  vivasta: {
    lead: 'Vivasta manages every clinical and administrative aspect of community healthcare delivery — referrals, electronic patient records, logistics and communication, on web and mobile.',
    deliverables: [
      'Referral management and status tracking',
      'Centralised electronic patient records',
      'Healthcare logistics and service delivery',
      'Nursing tablet application',
      'Handheld apps for drivers, pharmacists and field staff',
      'Third-party integration and remote monitoring',
    ],
    outcomes: [
      'Community services coordinated as one',
      'Field staff working from live data',
      'Patients monitored where they live',
    ],
  },
  caremonx: {
    lead: 'CareMonX is a versatile and robust emergency care platform, designed to improve the efficiency and effectiveness of emergency response across sectors.',
    deliverables: [
      'Call taking and dispatch',
      'Resource mobilisation',
      'Real-time routing and updates for units',
      'Mobile data terminals for field capture',
      'Tactical boards for live incident tracking',
      'Electronic patient care reporting and billing',
    ],
    outcomes: [
      'Response times cut by live routing',
      'Accurate data captured at the scene',
      'Resources allocated against real demand',
    ],
  },
  maha: {
    lead: 'Maha is a cloud-based oncology solution that fuses a broad feature suite with digital intelligence for high-impact clinical decision support, explicitly designed to support both adult and paediatric populations.',
    deliverables: [
      'Regimen builder for single and multi-cycle protocols',
      'Prescribing with dose adjustment, deferral and splitting',
      'In-built pharmacy for validation and dispensing',
      'Medication administration workflows',
      'ACT-NOW regimen integration',
      'In-built formulary',
    ],
    outcomes: [
      'Complex protocols built once, applied safely',
      'The whole team alerted to every variation',
      'Clinical trials supported as standard',
    ],
  },
}

/**
 * Care settings served. Each carries the problems the sector reports and the
 * products that answer them.
 */
export const sectors = [
  {
    id: 'primary-care',
    icon: '/sectors/primary-care.svg',
    name: 'Primary Care',
    body: 'Advanced digital solutions for primary care providers, replacing fragmented records and manual process with one connected practice.',
    challenges: [
      'Disparate patient records hinder comprehensive care',
      'Manual processes slow down operations and patient management',
      'Lack of tools for patient engagement affects care continuity',
    ],
    products: ['indici', 'spectrum'],
  },
  {
    id: 'supported-living',
    icon: '/sectors/supported-living.svg',
    name: 'Supported Living',
    body: 'Tools for managing supported living services, from staff coordination through to quality monitoring and budget control.',
    challenges: [
      'Coordinating staff schedules and duties can be complex',
      'Maintaining consistent quality of care is essential',
      'Ensuring client satisfaction requires efficient management tools',
    ],
    products: ['innovacare', 'vivasta'],
  },
  {
    id: 'out-of-hours-care',
    icon: '/sectors/out-of-hours-care.svg',
    name: 'Out of Hours Care',
    body: 'Solutions for unplanned and after-hours care — triage, on-call coordination and telehealth when the practice is closed.',
    challenges: [
      'Managing high volumes of patient calls can be overwhelming',
      'Lack of coordination among care providers leads to inefficiencies',
      'Ensuring patients can access care after hours is a significant challenge',
    ],
    products: ['spectrum', 'innovacare'],
  },
  {
    id: 'community-care',
    icon: '/sectors/community-care.svg',
    name: 'Community Care',
    body: 'Comprehensive community healthcare — referrals, records, logistics and monitoring, coordinated across services and field teams.',
    challenges: [
      'Managing large volumes of patient data can be daunting',
      'Coordinating various community services is challenging',
      'Ensuring patients have access to necessary care is crucial',
    ],
    products: ['vivasta', 'innovacare', 'indici'],
  },
  {
    id: 'emergency-care',
    icon: '/sectors/emergency-care.svg',
    name: 'Emergency Care',
    body: 'Robust systems for emergency medical services, where response time and data accuracy decide the outcome.',
    challenges: [
      'Delays in emergency response can be life-threatening',
      'Accurate data is crucial for effective emergency care',
      'Efficient allocation of resources is often challenging in emergencies',
    ],
    products: ['caremonx'],
  },
]

/**
 * Technology partners. Copy follows the site: what each partner is, so the
 * list reads as a capability statement rather than a logo wall.
 */
export const partners = [
  {
    name: 'Microsoft',
    logo: '/partners/microsoft.png',
    body: 'Multinational producer of computer software, consumer electronics, personal computers and related services.',
  },
  {
    name: 'VMware',
    logo: '/partners/vmware.png',
    body: 'Leading cloud-computing and virtualization technology company.',
  },
  {
    name: 'Fortinet',
    logo: '/partners/fortinet.png',
    body: 'Global producer of cyber security solutions, securing large enterprises, SMBs, service providers and government organisations globally.',
  },
  {
    name: 'Zerto',
    logo: '/partners/zerto.png',
    body: 'Provider of disaster recovery, backup and workload mobility software for virtualized infrastructures and cloud environments.',
  },
  {
    name: 'Veeam',
    logo: '/partners/veeam.png',
    body: 'An industry leader in backup, recovery and data management solutions.',
  },
  {
    name: 'Huawei',
    logo: '/partners/huawei.png',
    body: 'A leading global provider of information and communications technology infrastructure and smart devices.',
  },
  {
    name: 'Rhipe',
    logo: '/partners/rhipe.png',
    body: 'Cloud-computing distributor supporting businesses in realising the full benefits of cloud-based models.',
  },
]

export const partnersIntro =
  'Valentia works with industry-leading technologies to ensure our clients benefit from consistently high-quality and secure services.'

/** Who runs the software, and where. Used for the clients section. */
export const clientProof = {
  lead: "Valentia's diverse customer base spans an extensive range of healthcare disciplines and multiple continents, united by an interest in tapping the potential of modern technology to transform how healthcare is provided.",
  relationship:
    'Our relationship with our customers is deeply rooted in our strong partnership ethos and personal approach to all engagements.',
  proof: [
    '250 general practices running indici',
    'Community and age care delivered by nationwide providers',
    'National ambulance services powered by Valentia',
    'Out of hours and hospital services in Ireland',
    'General practices across Australia',
    'Ambulance services in South Africa, Qatar and Dubai',
  ],
  regions: [
    'New Zealand',
    'Australia',
    'South Pacific',
    'Ireland',
    'South Africa',
    'Qatar',
    'Dubai',
  ],
}

export const contactDetails = {
  location: 'Doha, Qatar',
  responseTime: 'We reply to every enquiry within two business days.',
  include: [
    'The systems you are running today',
    'What is not working, in practical terms',
    'Any regulatory or integration constraints',
    'Your timeline, if you have one',
  ],
}
