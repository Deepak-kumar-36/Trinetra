import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktoyfgxbfmnhdqktyfcj.supabase.co';
const supabaseAnonKey = 'sb_publishable__aRkbsIitW_fCi-Z_G65lg_cn_ws9u3';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUsers() {
  const users = [
    { email: 'citizen@demo.com', password: 'password123', role: 'citizen', fullName: 'Test Citizen' },
    { email: 'volunteer@demo.com', password: 'password123', role: 'volunteer', fullName: 'Test Volunteer' },
    { email: 'coordinator@demo.com', password: 'password123', role: 'coordinator', fullName: 'Test Coordinator' }
  ];

  for (const u of users) {
    console.log(`Creating ${u.email}...`);
    const { data, error } = await supabase.auth.signUp({
      email: u.email,
      password: u.password,
    });
    
    if (error) {
      console.error(`Error creating ${u.email}:`, error.message);
      continue;
    }

    if (data.user) {
      console.log(`Success: ${u.email} created with ID ${data.user.id}`);
      
      // Now update the public.users table to set their correct role
      const { error: upsertError } = await supabase.from('users').upsert({
        id: data.user.id,
        role: u.role,
        full_name: u.fullName
      });
      
      if (upsertError) {
        console.error(`Error updating role for ${u.email}:`, upsertError.message);
      } else {
        console.log(`Role '${u.role}' set for ${u.email}`);
      }
    }
  }
}

createTestUsers();
