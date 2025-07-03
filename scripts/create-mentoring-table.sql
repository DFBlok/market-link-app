-- Create mentoring_bookings table for storing mentoring session bookings
CREATE TABLE IF NOT EXISTS mentoring_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  business_name VARCHAR(255),
  business_type VARCHAR(100) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(20) NOT NULL,
  topics TEXT NOT NULL,
  experience_level VARCHAR(50) NOT NULL,
  challenges TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mentoring_bookings_email ON mentoring_bookings(email);
CREATE INDEX IF NOT EXISTS idx_mentoring_bookings_status ON mentoring_bookings(status);
CREATE INDEX IF NOT EXISTS idx_mentoring_bookings_date ON mentoring_bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_mentoring_bookings_created_at ON mentoring_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mentoring_bookings_business_type ON mentoring_bookings(business_type);

-- Enable Row Level Security
ALTER TABLE mentoring_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert bookings (for public booking form)
CREATE POLICY "Allow public booking submissions" ON mentoring_bookings
  FOR INSERT WITH CHECK (true);

-- Create policy to allow users to view their own bookings
CREATE POLICY "Users can view their own bookings" ON mentoring_bookings
  FOR SELECT USING (auth.email() = email);

-- Create policy for service role to have full access (for admin operations)
CREATE POLICY "Service role has full access" ON mentoring_bookings
  FOR ALL USING (auth.role() = 'service_role');

-- Add trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mentoring_bookings_updated_at 
  BEFORE UPDATE ON mentoring_bookings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- INSERT INTO mentoring_bookings (
--   full_name, email, phone, business_name, business_type, 
--   preferred_date, preferred_time, topics, experience_level, challenges
-- ) VALUES (
--   'Test User', 'test@example.com', '+27 82 123 4567', 'Test Business', 'retail',
--   CURRENT_DATE + INTERVAL '7 days', '10:00', 'Business planning and funding', 'new',
--   'Need help with cash flow management'
-- );

-- Query to check if table was created successfully
-- SELECT table_name, column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'mentoring_bookings' 
-- ORDER BY ordinal_position;
