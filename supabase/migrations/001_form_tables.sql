-- Form submission tables for Vado Speedway Park
-- Run this in the Supabase SQL editor

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsor inquiry submissions
CREATE TABLE IF NOT EXISTS sponsor_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shout out requests
CREATE TABLE IF NOT EXISTS shout_out_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Driver registrations
CREATE TABLE IF NOT EXISTS driver_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  car_number TEXT NOT NULL,
  division TEXT NOT NULL,
  experience TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event entry forms
CREATE TABLE IF NOT EXISTS entry_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  car_number TEXT NOT NULL,
  division TEXT NOT NULL,
  event_name TEXT,
  hometown TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fan program signups
CREATE TABLE IF NOT EXISTS fan_program_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  interests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables (service key bypasses RLS, but good practice)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE shout_out_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_program_signups ENABLE ROW LEVEL SECURITY;
