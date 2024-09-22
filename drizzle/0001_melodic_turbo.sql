ALTER TABLE roles_to_permissions
ALTER COLUMN permission_id TYPE text USING permission_id::text;