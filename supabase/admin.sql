-- Function to make a user an admin
CREATE OR REPLACE FUNCTION make_user_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET is_admin = true
  WHERE id IN (
    SELECT id FROM auth.users
    WHERE email = user_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Run this function with your email after you've created your account
-- SELECT make_user_admin('your-email@example.com'); 