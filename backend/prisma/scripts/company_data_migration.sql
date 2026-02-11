-- Idempotent data migration for Company multi-tenancy
-- Creates a default company and assigns all existing users/projects to it.

DO $$
DECLARE
  default_company_id uuid;
BEGIN
  -- Create default company if it does not exist
  INSERT INTO companies (id, name, slug, "isActive", "createdAt", "updatedAt")
  VALUES (gen_random_uuid(), 'Default', 'default', TRUE, now(), now())
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO default_company_id
  FROM companies
  WHERE slug = 'default'
  LIMIT 1;

  IF default_company_id IS NULL THEN
    RAISE EXCEPTION 'Default company could not be created or found';
  END IF;

  -- Attach existing users/projects without companyId
  UPDATE users
  SET "companyId" = default_company_id
  WHERE "companyId" IS NULL;

  UPDATE projects
  SET "companyId" = default_company_id
  WHERE "companyId" IS NULL;
END $$;
