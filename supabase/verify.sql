-- Check if all required tables exist
SELECT 
    table_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = table_name) 
        THEN '✅ Exists' 
        ELSE '❌ Missing' 
    END as status
FROM (VALUES 
    ('profiles'),
    ('deposits'),
    ('withdrawals'),
    ('tokens'),
    ('referrals'),
    ('plans')
) AS required_tables(table_name);

-- Check if RLS is enabled on tables
SELECT 
    schemaname || '.' || tablename as table_name,
    CASE 
        WHEN rowsecurity THEN '✅ Enabled' 
        ELSE '❌ Disabled' 
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'deposits', 'withdrawals', 'tokens', 'referrals', 'plans');

-- Check if storage bucket exists
SELECT 
    'payment-proofs' as bucket_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'payment-proofs') 
        THEN '✅ Exists' 
        ELSE '❌ Missing' 
    END as status;

-- Check if admin function exists
SELECT 
    'make_user_admin' as function_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'make_user_admin') 
        THEN '✅ Exists' 
        ELSE '❌ Missing' 
    END as status; 