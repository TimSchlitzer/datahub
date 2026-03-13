export const getGreetingText = (): string => {
    const currentHour = new Date().getHours(); // gets the current hour (0-23)
    if (currentHour < 12) {
        return 'home.greeting.morning';
    }
    if (currentHour < 17) {
        return 'home.greeting.afternoon';
    }
    return 'home.greeting.evening';
};
