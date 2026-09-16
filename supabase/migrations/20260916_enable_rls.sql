-- Enable Row Level Security on all tables
-- Run this migration in Supabase SQL Editor

-- Users: only admins can see all users; users can see own profile
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update user roles" ON users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Sessions: users can only see/modify their own sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = sessions.user_id AND id = auth.uid())
  );

CREATE POLICY "Users can delete own sessions" ON sessions
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = sessions.user_id AND id = auth.uid())
  );

-- Complaints: users can CRUD own complaints; admins can see all
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own complaints" ON complaints
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all complaints" ON complaints
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert own complaints" ON complaints
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own complaints" ON complaints
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own submitted complaints" ON complaints
  FOR DELETE USING (user_id = auth.uid() AND status = 'submitted');

CREATE POLICY "Admins can update any complaint" ON complaints
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Feedback: users can CRUD own feedback; admins can see all
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback" ON feedback
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all feedback" ON feedback
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert own feedback" ON feedback
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Permission Requests: users can CRUD own; admins can see all
ALTER TABLE permission_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own permission requests" ON permission_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all permission requests" ON permission_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert own permission requests" ON permission_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update permission requests" ON permission_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Password Resets: system-level only (no RLS needed beyond default deny)
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;

-- Department Info: public read, admin write
ALTER TABLE department_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view department info" ON department_info
  FOR SELECT USING (true);

CREATE POLICY "Admins can update department info" ON department_info
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Faculty: public read, admin write
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view faculty" ON faculty
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage faculty" ON faculty
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Student Roles: public read, admin write
ALTER TABLE student_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view student roles" ON student_roles
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage student roles" ON student_roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Announcements: public read, admin write
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view announcements" ON announcements
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage announcements" ON announcements
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Events: public read, admin write
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage events" ON events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Companies: public read, admin write
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view companies" ON companies
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage companies" ON companies
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
