import { createClient } from '@supabase/supabase-js';

// Reemplaza con tu URL y clave API de Supabase
const supabaseUrl = 'https://psyauluoyjvrscijcafn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeWF1bHVveWp2cnNjaWpjYWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNTc1NDksImV4cCI6MjAzODYzMzU0OX0.aCF16iTqR2ioEMOA2Dupknnrr8cQJjUDEO7Lnwi75FU';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
