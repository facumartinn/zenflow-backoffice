-- Insert sample drivers
INSERT INTO public.drivers (full_name, license_number, phone, email, status)
VALUES 
  ('John Smith', 'DL123456', '+1234567890', 'john.smith@example.com', 'AVAILABLE'),
  ('Sarah Johnson', 'DL789012', '+1234567891', 'sarah.johnson@example.com', 'AVAILABLE'),
  ('Michael Brown', 'DL345678', '+1234567892', 'michael.brown@example.com', 'BUSY'),
  ('Emily Davis', 'DL901234', '+1234567893', 'emily.davis@example.com', 'AVAILABLE'),
  ('David Wilson', 'DL567890', '+1234567894', 'david.wilson@example.com', 'BUSY')
ON CONFLICT (email) DO NOTHING;

-- Insert sample orders
INSERT INTO public.orders (
  customer_name,
  customer_phone,
  delivery_address,
  products,
  latitude,
  longitude,
  status
)
VALUES 
  (
    'Alice Cooper',
    '+1987654321',
    '123 Main St, New York, NY 10001',
    '{"items": [{"name": "Laptop", "quantity": 1}, {"name": "Mouse", "quantity": 2}]}'::jsonb,
    40.7505, 
    -73.9934,
    'PENDING'
  ),
  (
    'Bob Martinez',
    '+1987654322',
    '456 Broadway, New York, NY 10013',
    '{"items": [{"name": "Smartphone", "quantity": 1}]}'::jsonb,
    40.7219,
    -74.0009,
    'IN_TRANSIT'
  ),
  (
    'Carol White',
    '+1987654323',
    '789 5th Ave, New York, NY 10065',
    '{"items": [{"name": "Tablet", "quantity": 1}, {"name": "Keyboard", "quantity": 1}]}'::jsonb,
    40.7641,
    -73.9720,
    'PENDING'
  ),
  (
    'Daniel Lee',
    '+1987654324',
    '321 Park Ave, New York, NY 10022',
    '{"items": [{"name": "Monitor", "quantity": 2}]}'::jsonb,
    40.7573,
    -73.9709,
    'DELIVERED'
  ),
  (
    'Eva Garcia',
    '+1987654325',
    '654 Madison Ave, New York, NY 10065',
    '{"items": [{"name": "Printer", "quantity": 1}]}'::jsonb,
    40.7677,
    -73.9716,
    'PENDING'
  ),
  (
    'Frank Taylor',
    '+1987654326',
    '987 Lexington Ave, New York, NY 10065',
    '{"items": [{"name": "Headphones", "quantity": 3}]}'::jsonb,
    40.7668,
    -73.9654,
    'IN_TRANSIT'
  ),
  (
    'Grace Anderson',
    '+1987654327',
    '147 3rd Ave, New York, NY 10003',
    '{"items": [{"name": "Camera", "quantity": 1}]}'::jsonb,
    40.7338,
    -73.9875,
    'PENDING'
  ),
  (
    'Henry Wilson',
    '+1987654328',
    '258 7th Ave, New York, NY 10001',
    '{"items": [{"name": "Speaker", "quantity": 2}]}'::jsonb,
    40.7462,
    -73.9957,
    'CANCELLED'
  ),
  (
    'Isabel Rodriguez',
    '+1987654329',
    '369 6th Ave, New York, NY 10011',
    '{"items": [{"name": "Router", "quantity": 1}]}'::jsonb,
    40.7353,
    -73.9991,
    'PENDING'
  ),
  (
    'Jack Thompson',
    '+1987654330',
    '741 2nd Ave, New York, NY 10016',
    '{"items": [{"name": "Hard Drive", "quantity": 1}]}'::jsonb,
    40.7462,
    -73.9734,
    'DELIVERED'
  ),
  (
    'Karen Miller',
    '+1987654331',
    '852 1st Ave, New York, NY 10016',
    '{"items": [{"name": "Webcam", "quantity": 1}]}'::jsonb,
    40.7456,
    -73.9704,
    'PENDING'
  ),
  (
    'Luis Martinez',
    '+1987654332',
    '963 8th Ave, New York, NY 10019',
    '{"items": [{"name": "Microphone", "quantity": 1}]}'::jsonb,
    40.7644,
    -73.9857,
    'IN_TRANSIT'
  ),
  (
    'Mary Johnson',
    '+1987654333',
    '159 9th Ave, New York, NY 10011',
    '{"items": [{"name": "Gaming Console", "quantity": 1}]}'::jsonb,
    40.7462,
    -74.0027,
    'PENDING'
  ),
  (
    'Nathan Brown',
    '+1987654334',
    '357 10th Ave, New York, NY 10001',
    '{"items": [{"name": "Smart Watch", "quantity": 2}]}'::jsonb,
    40.7539,
    -74.0024,
    'DELIVERED'
  ),
  (
    'Olivia Davis',
    '+1987654335',
    '951 11th Ave, New York, NY 10019',
    '{"items": [{"name": "Wireless Earbuds", "quantity": 1}]}'::jsonb,
    40.7685,
    -73.9900,
    'PENDING'
  ),
  (
    'Peter Wilson',
    '+1987654336',
    '753 12th Ave, New York, NY 10019',
    '{"items": [{"name": "Power Bank", "quantity": 3}]}'::jsonb,
    40.7674,
    -74.0045,
    'IN_TRANSIT'
  ),
  (
    'Quinn Taylor',
    '+1987654337',
    '852 West End Ave, New York, NY 10025',
    '{"items": [{"name": "USB Hub", "quantity": 1}]}'::jsonb,
    40.7998,
    -73.9708,
    'PENDING'
  ),
  (
    'Rachel Green',
    '+1987654338',
    '741 Amsterdam Ave, New York, NY 10025',
    '{"items": [{"name": "External SSD", "quantity": 1}]}'::jsonb,
    40.7957,
    -73.9711,
    'DELIVERED'
  ),
  (
    'Samuel Clark',
    '+1987654339',
    '963 Columbus Ave, New York, NY 10025',
    '{"items": [{"name": "Graphics Card", "quantity": 1}]}'::jsonb,
    40.7944,
    -73.9668,
    'PENDING'
  ),
  (
    'Teresa Lee',
    '+1987654340',
    '159 Central Park West, New York, NY 10023',
    '{"items": [{"name": "RAM Module", "quantity": 2}]}'::jsonb,
    40.7766,
    -73.9761,
    'IN_TRANSIT'
  )
ON CONFLICT (customer_phone) DO NOTHING;

-- Create some routes for available drivers with pending orders
WITH available_drivers AS (
  SELECT id FROM public.drivers WHERE status = 'AVAILABLE' LIMIT 3
),
pending_orders AS (
  SELECT id FROM public.orders WHERE status = 'PENDING' AND route_id IS NULL
)
INSERT INTO public.routes (driver_id, status)
SELECT 
  d.id,
  'NOT_STARTED'
FROM available_drivers d
ON CONFLICT DO NOTHING;

-- Assign some pending orders to routes
WITH routes_to_assign AS (
  SELECT id FROM public.routes WHERE status = 'NOT_STARTED' LIMIT 3
),
orders_to_assign AS (
  SELECT id FROM public.orders WHERE status = 'PENDING' AND route_id IS NULL LIMIT 9
)
UPDATE public.orders o
SET route_id = r.id
FROM (
  SELECT 
    o.id as order_id,
    r.id as route_id,
    ROW_NUMBER() OVER (PARTITION BY r.id) as rn
  FROM orders_to_assign o
  CROSS JOIN routes_to_assign r
) r
WHERE o.id = r.order_id
AND r.rn <= 3; -- Assign 3 orders per route