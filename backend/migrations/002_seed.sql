INSERT INTO users (email, password_hash, role, name) VALUES
  ('customer@recraftlife.com', '$2a$10$W0B7r2iE0Y0D7WwLJ0am0e7QOEm5g6O4lD3n2gB1VQ7b3fVZY3fI2', 'customer', 'Jane Customer'),
  ('admin@recraftlife.com', '$2a$10$W0B7r2iE0Y0D7WwLJ0am0e7QOEm5g6O4lD3n2gB1VQ7b3fVZY3fI2', 'admin', 'Admin User'),
  ('collector@recraftlife.com', '$2a$10$W0B7r2iE0Y0D7WwLJ0am0e7QOEm5g6O4lD3n2gB1VQ7b3fVZY3fI2', 'collector', 'John Collector');

-- The seed password is not production-safe; replace with bcrypt-hashed real passwords after deployment.
