import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cjsoktkgshjfvclecxpj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqc29rdGtnc2hqZnZjbGVjeHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5Mjg5ODYsImV4cCI6MjA5NDUwNDk4Nn0.GJ0ffKk8LQzQeKvHTuRfP2468SbzBKLBUyWNY7gqYcU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log("Testing login...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'princychauhan1304@gmail.com',
    password: 'password123',
  });

  if (error) {
    console.error("Login Error:", error.message);
  } else {
    console.log("Login Success! User ID:", data.user?.id);
  }
}

testLogin();
