-- Add vehicle_capacity to drivers table
ALTER TABLE drivers
ADD COLUMN vehicle_capacity DECIMAL(10,2) NOT NULL DEFAULT 100.0;

-- Add volume to orders table
ALTER TABLE orders
ADD COLUMN volume DECIMAL(10,2) NOT NULL DEFAULT 1.0;

-- Update existing data with some sample values
UPDATE drivers
SET vehicle_capacity = 
  CASE 
    WHEN id = ANY(ARRAY(SELECT id FROM drivers LIMIT 1)) THEN 100.0
    WHEN id = ANY(ARRAY(SELECT id FROM drivers LIMIT 1 OFFSET 1)) THEN 150.0
    ELSE 200.0
  END;

UPDATE orders
SET volume = 
  CASE 
    WHEN id = ANY(ARRAY(SELECT id FROM orders LIMIT 5)) THEN 10.0
    WHEN id = ANY(ARRAY(SELECT id FROM orders LIMIT 5 OFFSET 5)) THEN 15.0
    ELSE 20.0
  END;