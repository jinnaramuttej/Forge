import { supabase } from './src/supabase';
console.log('Got supabase client');
async function run() {
  const { data, error } = await supabase.from('hiring_jobs').select('*');
  console.log('Error:', error);
  console.log('Data count:', data?.length);
  process.exit(0);
}
run();
