import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cjsoktkgshjfvclecxpj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqc29rdGtnc2hqZnZjbGVjeHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5Mjg5ODYsImV4cCI6MjA5NDUwNDk4Nn0.GJ0ffKk8LQzQeKvHTuRfP2468SbzBKLBUyWNY7gqYcU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function registerUser() {
  console.log("Attempting to register princychauhan1304@gmail.com...");
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
