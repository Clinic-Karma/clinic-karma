-- Idempotent reference data only. No demo users or passwords are stored here.

INSERT INTO "Branch" ("Branch_Name", "Contact_Number", "Address") VALUES
  ('Colombo', '+94112000001', 'Colombo'),
  ('Kandy', '+94812000002', 'Kandy'),
  ('Galle', '+94912000003', 'Galle')
ON CONFLICT ("Branch_Name") DO NOTHING;

INSERT INTO "Specialization" ("Specialization_Name", "Consultation_Fee") VALUES
  ('Cardiology', 4500.00),
  ('Dermatology', 3500.00),
  ('General Medicine', 2500.00),
  ('Neurology', 5000.00),
  ('Orthopedics', 4000.00),
  ('Pediatrics', 3000.00)
ON CONFLICT DO NOTHING;

INSERT INTO "Catalogue" ("Treatment_name", "Price") VALUES
  ('Complete Blood Count', 1800.00),
  ('Fasting Blood Sugar', 900.00),
  ('Lipid Profile', 2200.00),
  ('Liver Function Test', 2800.00),
  ('Urine Full Report', 1000.00),
  ('X-Ray', 3000.00)
ON CONFLICT DO NOTHING;

INSERT INTO "Insurance" ("Provider_Name", "Coverage_Percentage", "Type") VALUES
  ('Ceylinco Health', 80.00, 'Health'),
  ('Sri Lanka Insurance', 70.00, 'Health'),
  ('Union Assurance', 75.00, 'Health')
ON CONFLICT DO NOTHING;
