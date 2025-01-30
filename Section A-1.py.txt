from datetime import datetime, timedelta

# Event class to hold event details (start time, end time, and description)
class Event:
    def __init__(self, start, end, description):
        self.start = datetime.strptime(start, "%Y-%m-%d %H:%M")
        self.end = datetime.strptime(end, "%Y-%m-%d %H:%M")
        self.description = description

    def __repr__(self):
        return f"'{self.description}' from {self.start.strftime('%Y-%m-%d %H:%M')} to {self.end.strftime('%Y-%m-%d %H:%M')}"

# Event manager class to manage adding and checking events
class EventManager:
    def __init__(self):
        self.events = []

    def add_event(self, start, end, description):
        # Create a new event
        new_event = Event(start, end, description)
        
        # Check if the new event conflicts with any existing events
        if self._has_conflict(new_event):
            print(f"Sorry, there's a conflict with the event '{description}'.")
            conflict_events = self._get_conflicting_events(new_event)
            print("Conflicting events:")
            for event in conflict_events:
                print(event)
            alternative = self._suggest_alternative_time(new_event)
            print(f"Suggested time to reschedule: {alternative}")
        else:
            self.events.append(new_event)
            print(f"Event '{description}' added successfully!")

    def _has_conflict(self, new_event):
        # Check if the new event overlaps with any existing events
        for event in self.events:
            if (new_event.start < event.end and new_event.end > event.start):
                return True
        return False

    def _get_conflicting_events(self, new_event):
        # Return a list of conflicting events
        conflicts = []
        for event in self.events:
            if (new_event.start < event.end and new_event.end > event.start):
                conflicts.append(event)
        return conflicts

    def _suggest_alternative_time(self, new_event):
        # Try to find a free slot between existing events
        sorted_events = sorted(self.events + [new_event], key=lambda e: e.start)
        for i in range(1, len(sorted_events)):
            prev_event = sorted_events[i - 1]
            curr_event = sorted_events[i]

            # Check if there's a gap between the end of one event and the start of the next
            gap_start = prev_event.end
            gap_end = curr_event.start

            if gap_end - gap_start >= timedelta(minutes=30):
                suggested_time = gap_start.strftime("%Y-%m-%d %H:%M")
                return suggested_time

        return "Sorry, no available time slots."

    def show_events(self):
        # Display all the scheduled events
        if not self.events:
            print("No events scheduled.")
        else:
            print("Here are your scheduled events:")
            for event in self.events:
                print(event)

# Example Usage
if __name__ == "__main__":
    manager = EventManager()

    # Add a few events
    manager.add_event("2025-01-29 09:00", "2025-01-29 10:00", "Morning Meeting")
    manager.add_event("2025-01-29 10:30", "2025-01-29 11:30", "Team Check-in")

    # Try to add a conflicting event
    manager.add_event("2025-01-29 09:30", "2025-01-29 10:30", "Client Call")

    # Try adding a non-conflicting event
    manager.add_event("2025-01-29 13:00", "2025-01-29 14:00", "Lunch Break")

    # Show all events
    manager.show_events()
