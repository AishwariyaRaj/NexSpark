-- Insert various types of vehicles into availability_db

-- SUVs
INSERT INTO vehicles (make, model, year, type, location, daily_rate) VALUES
('Toyota', 'Fortuner', 2023, 'SUV', 'New York', 5500),
('Mahindra', 'XUV700', 2023, 'SUV', 'Los Angeles', 4500),
('Hyundai', 'Creta', 2023, 'SUV', 'Chicago', 3500),
('Kia', 'Seltos', 2023, 'SUV', 'Houston', 3200),
('Tata', 'Harrier', 2023, 'SUV', 'Phoenix', 4000);

-- Sedans
INSERT INTO vehicles (make, model, year, type, location, daily_rate) VALUES
('Honda', 'City', 2023, 'Sedan', 'New York', 2500),
('Hyundai', 'Verna', 2023, 'Sedan', 'Los Angeles', 2400),
('Maruti', 'Ciaz', 2023, 'Sedan', 'Chicago', 2200),
('Skoda', 'Octavia', 2023, 'Sedan', 'Philadelphia', 3500),
('Toyota', 'Camry', 2024, 'Sedan', 'San Antonio', 4000);

-- Hatchbacks
INSERT INTO vehicles (make, model, year, type, location, daily_rate) VALUES
('Maruti', 'Swift', 2023, 'Hatchback', 'San Diego', 1500),
('Hyundai', 'i20', 2023, 'Hatchback', 'Dallas', 1600),
('Tata', 'Altroz', 2023, 'Hatchback', 'San Jose', 1700),
('Honda', 'Jazz', 2023, 'Hatchback', 'New York', 1800),
('Maruti', 'Baleno', 2023, 'Hatchback', 'Los Angeles', 1650);

-- Luxury
INSERT INTO vehicles (make, model, year, type, location, daily_rate) VALUES
('Mercedes-Benz', 'E-Class', 2024, 'Luxury', 'New York', 8500),
('BMW', '5 Series', 2024, 'Luxury', 'Los Angeles', 8000),
('Audi', 'A6', 2024, 'Luxury', 'Chicago', 7500),
('Jaguar', 'XF', 2024, 'Luxury', 'Houston', 7000),
('Volvo', 'S90', 2024, 'Luxury', 'Phoenix', 7200);

-- MUVs (Multi-Utility Vehicles)
INSERT INTO vehicles (make, model, year, type, location, daily_rate) VALUES
('Toyota', 'Innova Crysta', 2023, 'MUV', 'Philadelphia', 3800),
('Maruti', 'Ertiga', 2023, 'MUV', 'San Antonio', 2500),
('Kia', 'Carens', 2023, 'MUV', 'San Diego', 3200),
('Mahindra', 'Marazzo', 2023, 'MUV', 'Dallas', 2800),
('Renault', 'Triber', 2023, 'MUV', 'San Jose', 2000);

-- Electric Vehicles
INSERT INTO vehicles (make, model, year, type, location, daily_rate) VALUES
('Tata', 'Nexon EV', 2023, 'Electric', 'New York', 3500),
('MG', 'ZS EV', 2023, 'Electric', 'Los Angeles', 4000),
('Hyundai', 'Kona Electric', 2023, 'Electric', 'Chicago', 4500),
('Tesla', 'Model 3', 2024, 'Electric', 'Houston', 9000),
('BYD', 'Atto 3', 2023, 'Electric', 'Phoenix', 3800);

-- Trucks/Pickups
INSERT INTO vehicles (make, model, year, type, location, daily_rate) VALUES
('Isuzu', 'D-Max', 2023, 'Truck', 'Philadelphia', 4500),
('Mahindra', 'Bolero Pickup', 2023, 'Truck', 'San Antonio', 3000),
('Tata', 'Xenon', 2023, 'Truck', 'San Diego', 3500),
('Ford', 'Ranger', 2023, 'Truck', 'Dallas', 5000),
('Toyota', 'Hilux', 2023, 'Truck', 'San Jose', 5500);
