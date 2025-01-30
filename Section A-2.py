import math

# DeliveryPoint class to represent each delivery location
class DeliveryPoint:
    def __init__(self, x, y, priority, description):
        self.x = x
        self.y = y
        self.priority = priority
        self.description = description

    def __repr__(self):
        return f"{self.description} ({self.x}, {self.y}) - {self.priority}"

    def distance_to(self, other):
        # Calculate Euclidean distance between two points
        return math.sqrt((self.x - other.x) ** 2 + (self.y - other.y) ** 2)

# Function to calculate the route based on the given deliveries
def calculate_route(deliveries):
    # Sort deliveries by priority (high > medium > low)
    priority_order = {'high': 0, 'medium': 1, 'low': 2}
    deliveries.sort(key=lambda x: (priority_order[x.priority], deliveries.index(x)))
    
    # Start the route with the first delivery (you could choose a start point if needed)
    route = []
    current_location = (0, 0)  # Assuming the starting point is (0, 0)
    
    while deliveries:
        # Find the closest delivery point to the current location
        closest_delivery = min(deliveries, key=lambda dp: dp.distance_to(DeliveryPoint(current_location[0], current_location[1], 'low', 'Start')))
        route.append(closest_delivery)
        deliveries.remove(closest_delivery)
        
        # Update current location to the delivery point's location
        current_location = (closest_delivery.x, closest_delivery.y)
    
    return route

# Example of using the system
if __name__ == "__main__":
    # List of deliveries with coordinates (x, y), priority (high, medium, low), and description
    deliveries = [
        DeliveryPoint(1, 2, 'medium', 'Package A'),
        DeliveryPoint(4, 3, 'high', 'Package B'),
        DeliveryPoint(2, 7, 'low', 'Package C'),
        DeliveryPoint(5, 5, 'high', 'Package D'),
        DeliveryPoint(6, 2, 'medium', 'Package E'),
    ]
    
    # Calculate and print the optimized route
    optimized_route = calculate_route(deliveries)
    
    print("Optimized Delivery Route:")
    for point in optimized_route:
        print(point)
