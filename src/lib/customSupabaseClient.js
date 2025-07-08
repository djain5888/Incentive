import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qkexzjqqkwzugftpmpbp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrZXh6anFxa3d6dWdmdHBtcGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDcxNTQsImV4cCI6MjA2NzQ4MzE1NH0.6CHj7U9x-CTYdGgLcgq29tuFU9mAEyBp0s3eIBzIwbU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);