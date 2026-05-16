import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function registerUser() {
  console.log("Attempting to register princychauhan1304@gmail.com with password 'password123'...");
  const { data, error } = await supabase.auth.signUp({
    email: 'princychauhan1304@gmail.com',
    password: 'password123',
    options: {
      data: {
        name: 'Princy Chauhan',
      }
    }
  });

  if (error) {
    console.error("Failed to register:", error.message);
  } else {
    console.log("Success! User registered:", data.user?.email);
    console.log("If email confirmation is ON, it will be in a 'pending' state.");
  }
}

registerUser();
