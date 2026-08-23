import { supabase } from '../supabase';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const initialRoles = [
  { title: 'Senior Frontend Engineer', department: 'Engineering', budget: '180000', location: 'San Francisco, CA', work_mode: 'remote', status: 'done' },
  { title: 'Product Designer', department: 'Design', budget: '140000', location: 'New York, NY', work_mode: 'hybrid', status: 'done' },
  { title: 'Growth Lead', department: 'Growth', budget: '150000', location: 'Remote', work_mode: 'remote', status: 'done' },
  { title: 'Backend Engineer', department: 'Engineering', budget: '175000', location: 'Seattle, WA', work_mode: 'onsite', status: 'done' },
];

const initialLegalDocuments = [
  {
    document_type: 'nda',
    business_id: 'Commercial',
    input_context: {
      party_name: 'Studio Monochrome LLC',
      location: 'Delaware, USA',
      purpose: 'Standard Delaware bilateral confidentiality protection prepared for Studio Monochrome contract designer.'
    },
    status: 'done',
    draft_content: 'All proprietary software architectures, design systems, and product roadmaps disclosed by Acme Inc.\n\nAll deliverables created under this engagement constitute work-for-hire and belong 100% to Acme Inc.\n\nConfidentiality obligations survive for a duration of two (2) years from execution date.'
  },
  {
    document_type: 'nda',
    business_id: 'Corporate',
    input_context: {
      party_name: 'Foundry Group LP',
      location: 'Delaware, USA',
      purpose: 'Mutual confidentiality agreement executed for Series Seed data room access.'
    },
    status: 'done',
    draft_content: 'Standard Delaware investor mutual protection excluding portfolio conflicts.'
  },
  {
    document_type: 'freelancer_agreement',
    business_id: 'Employment',
    input_context: {
      party_name: 'Studio Monochrome LLC',
      location: 'Delaware, USA',
      purpose: 'Master services agreement and statement of work covering Q4 design token refactor sprint.'
    },
    status: 'done',
    draft_content: 'Delivery of core design token libraries, icon assets, and accessibility compliance specifications.\n\nFixed monthly retainer of $4,200 billed Net 15 upon milestone acceptance.'
  }
];

async function seed() {
  console.log('Seeding data...');
  
  for (const role of initialRoles) {
    const { error } = await supabase.from('hiring_jobs').insert([
      {
        role: role.title,
        business_id: role.department,
        budget: role.budget,
        location: role.location,
        work_mode: role.work_mode,
        status: role.status,
        jd_content: `Job Description for ${role.title} at ${role.department}.`
      }
    ]);
    if (error) console.error(`Failed to insert role ${role.title}:`, error);
  }
  
  for (const doc of initialLegalDocuments) {
    const { error } = await supabase.from('legal_documents').insert([
      {
        document_type: doc.document_type,
        business_id: doc.business_id,
        input_context: doc.input_context,
        status: doc.status,
        draft_content: doc.draft_content
      }
    ]);
    if (error) console.error(`Failed to insert document ${doc.document_type}:`, error);
  }

  console.log('Seeding complete!');
}

seed();
