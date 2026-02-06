-- 存储 Passkey 凭证
CREATE TABLE passkey_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_id text UNIQUE NOT NULL,
  public_key text NOT NULL,
  counter integer DEFAULT 0,
  device_name text,
  created_at timestamptz DEFAULT now()
);

-- 存储 TOTP secret
CREATE TABLE totp_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  secret text NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE passkey_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE totp_secrets ENABLE ROW LEVEL SECURITY;

-- 只允许 service role 访问
CREATE POLICY "Service role only" ON passkey_credentials FOR ALL USING (false);
CREATE POLICY "Service role only" ON totp_secrets FOR ALL USING (false);
