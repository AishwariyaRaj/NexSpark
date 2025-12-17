# Admin Panel Guide

## Overview
The Admin Panel allows administrators to manage the vehicle inventory for the NexSpark vehicle rental platform.

## Accessing Admin Panel

### Admin Login
1. Navigate to the login page
2. Login with admin credentials:
   - Email: `admin@nexspark.com`
   - Password: (your admin password)
3. After successful login, you'll see "Admin Panel" link in the navigation bar
4. Click on "Admin Panel" to access the vehicle management interface

## Admin Features

### 1. View Vehicle Inventory
- See all vehicles in the system
- View details: make, model, year, type, location, daily rate, status
- Quick overview with table format

### 2. Add New Vehicle
Click the "+ Add Vehicle" button to open the add vehicle form.

#### Required Fields:
- **Make** - Vehicle manufacturer (e.g., Toyota, Honda)
- **Model** - Vehicle model name (e.g., Camry, Civic)
- **Daily Rate** - Rental price per day in dollars
- **Location** - Where the vehicle is available

#### Optional Fields:
- **Year** - Manufacturing year (defaults to current year)
- **Type** - Vehicle category (Sedan, SUV, Hatchback, Luxury, Sports, Van, Truck)
- **License Plate** - Vehicle registration number
- **Color** - Vehicle color
- **Fuel Type** - Petrol, Diesel, Electric, or Hybrid
- **Transmission** - Automatic or Manual
- **Seats** - Number of seats (2-12)
- **Image URL** - URL to vehicle image

#### Steps to Add Vehicle:
1. Click "+ Add Vehicle" button
2. Fill in all required fields (marked with *)
3. Optionally fill in additional details
4. Click "Add Vehicle" button
5. Success message will appear
6. Vehicle will be added to inventory list

### 3. Delete Vehicle
- Click "Delete" button next to any vehicle in the inventory table
- Confirm deletion in the popup dialog
- Vehicle will be removed from the system

## User Rental Features

### How Users Rent Vehicles:

1. **Search for Vehicles**
   - Users go to Search page
   - Enter location and dates
   - Browse available vehicles

2. **Select Vehicle**
   - Click on a vehicle card
   - View vehicle details

3. **Rent Vehicle**
   - Select rental start date
   - Select rental end date
   - View rental summary (duration and total cost)
   - Click "Proceed to Rent & Payment"

4. **Complete Payment**
   - User is redirected to payment page
   - Enter payment details
   - Confirm rental purchase

5. **View Rentals**
   - Navigate to "My Bookings"
   - See all current and past rentals
   - View rental details and status

## API Endpoints

### Admin Operations (via vehicleService)

```javascript
// Add new vehicle
vehicleService.addVehicle(vehicleData)

// Update vehicle
vehicleService.updateVehicle(vehicleId, vehicleData)

// Delete vehicle
vehicleService.deleteVehicle(vehicleId)

// Get all vehicles
vehicleService.getAllVehicles()

// Get vehicle by ID
vehicleService.getVehicleById(vehicleId)
```

### User Operations

```javascript
// Search vehicles
vehicleService.searchVehicles(startDate, endDate, location)

// Create rental booking
bookingService.createBooking(bookingData)
```

## Role-Based Access

### Admin Role
- Can access Admin Panel
- Can add, update, and delete vehicles
- Can view all bookings
- Has "Admin Panel" link in navigation

### User Role
- Can search and view vehicles
- Can create rental bookings
- Can make payments
- Can view their own bookings
- Cannot access Admin Panel

## Technical Details

### Admin Protection
- Admin routes are protected with `AdminRoute` component
- Only users with role='ADMIN' or email='admin@nexspark.com' can access
- Non-admin users are redirected to dashboard

### Vehicle Data Structure
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2024,
  "type": "Sedan",
  "dailyRate": 50.00,
  "location": "New York",
  "licensePlate": "ABC-1234",
  "color": "Black",
  "fuelType": "Petrol",
  "transmission": "Automatic",
  "seats": 5,
  "imageUrl": "https://example.com/image.jpg"
}
```

## Troubleshooting

### Cannot Access Admin Panel
- Check if logged in with admin account
- Verify email is 'admin@nexspark.com' or role is 'ADMIN'
- Try logging out and logging back in

### Failed to Add Vehicle
- Ensure all required fields are filled
- Check network connection
- Verify backend service is running (localhost:8082)

### Failed to Delete Vehicle
- Check if vehicle has active bookings
- Verify backend service connection
- Check browser console for error details

## Best Practices

1. **Vehicle Images**
   - Use high-quality images (recommended: 930x620px)
   - Provide full URL with https://
   - Test image URL before adding

2. **Pricing**
   - Set competitive daily rates
   - Consider vehicle type and location
   - Update rates seasonally

3. **Inventory Management**
   - Regularly review vehicle list
   - Remove unavailable vehicles
   - Keep information up-to-date

4. **Location Management**
   - Use consistent location names
   - Consider adding multiple locations per city
   - Make locations easy to search

## Support

For technical issues or questions:
- Check backend logs at availability-service
- Review browser console for frontend errors
- Verify all services are running via `check-services.bat`
