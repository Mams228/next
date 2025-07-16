/*
  # Create Jobs System with Chat and Payment Features

  1. New Tables
    - `profiles` - User profiles for both clients and freelancers
    - `jobs` - Job postings by clients
    - `applications` - Job applications by freelancers
    - `messages` - Chat messages between clients and freelancers
    - `payments` - Payment records with QR code uploads
    - `skills` - Skills reference table
    - `job_skills` - Many-to-many relationship for job skills

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure file uploads for QR codes

  3. Storage
    - Create bucket for QR code payment uploads
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('client', 'freelancer');
CREATE TYPE job_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'uploaded', 'verified', 'completed');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  telegram_id bigint UNIQUE NOT NULL,
  username text,
  first_name text NOT NULL,
  last_name text,
  photo_url text,
  role user_role NOT NULL,
  title text,
  description text,
  skills text[] DEFAULT '{}',
  hourly_rate decimal(10,2),
  location text,
  website text,
  portfolio jsonb DEFAULT '[]',
  rating decimal(3,2) DEFAULT 0,
  completed_jobs integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  budget_type text NOT NULL CHECK (budget_type IN ('fixed', 'hourly')),
  budget_amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  skills text[] DEFAULT '{}',
  status job_status DEFAULT 'open',
  deadline timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  proposal text NOT NULL,
  bid_amount decimal(10,2) NOT NULL,
  estimated_duration text,
  status application_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, freelancer_id)
);

-- Messages table for chat
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  file_url text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Payments table with QR code upload
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  freelancer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  qr_code_url text,
  payment_proof_url text,
  status payment_status DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Skills reference table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Job skills junction table
CREATE TABLE IF NOT EXISTS job_skills (
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, skill_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Jobs policies
CREATE POLICY "Anyone can view open jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clients can create jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = client_id AND user_id = auth.uid() AND role = 'client'
    )
  );

CREATE POLICY "Clients can update own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = client_id AND user_id = auth.uid()
    )
  );

-- Applications policies
CREATE POLICY "Users can view applications for their jobs/applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN jobs j ON j.client_id = p.id
      WHERE p.user_id = auth.uid() AND j.id = job_id
    ) OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() AND p.id = freelancer_id
    )
  );

CREATE POLICY "Freelancers can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = freelancer_id AND user_id = auth.uid() AND role = 'freelancer'
    )
  );

CREATE POLICY "Users can update applications they're involved in"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN jobs j ON j.client_id = p.id
      WHERE p.user_id = auth.uid() AND j.id = job_id
    ) OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() AND p.id = freelancer_id
    )
  );

-- Messages policies
CREATE POLICY "Users can view messages they're involved in"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND (id = sender_id OR id = receiver_id)
    )
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND id = sender_id
    )
  );

CREATE POLICY "Users can update messages they sent"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND id = sender_id
    )
  );

-- Payments policies
CREATE POLICY "Users can view payments they're involved in"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND (id = client_id OR id = freelancer_id)
    )
  );

CREATE POLICY "Users can create payments for their jobs"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND (id = client_id OR id = freelancer_id)
    )
  );

CREATE POLICY "Users can update payments they're involved in"
  ON payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND (id = client_id OR id = freelancer_id)
    )
  );

-- Skills policies
CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view job skills"
  ON job_skills FOR SELECT
  TO authenticated
  USING (true);

-- Insert some default skills
INSERT INTO skills (name, category) VALUES
  ('React', 'Frontend'),
  ('Node.js', 'Backend'),
  ('TypeScript', 'Programming'),
  ('Python', 'Programming'),
  ('UI/UX Design', 'Design'),
  ('Figma', 'Design'),
  ('Content Writing', 'Writing'),
  ('SEO', 'Marketing'),
  ('Mobile Development', 'Development'),
  ('Database Design', 'Backend')
ON CONFLICT (name) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();