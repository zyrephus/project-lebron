const monthNames: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const url = "http://127.0.0.1:5000/"
// Change to http://172.20.10.3:5000/ in production

export function convertToISO8601(dateStr: string): string {
    const parts = dateStr.match(/(\w+) (\w+) (\d+) (\d+):(\d+):(\d+) (\d+)/);
    if (!parts) {
        throw new Error('Invalid date format');
    }

    const monthIndex = monthNames.indexOf(parts[2]);
    const month = monthIndex >= 0 ? (monthIndex + 1).toString().padStart(2, '0') : '00';

    return `${parts[7]}-${month}-${parts[3]}T${parts[4]}:${parts[5]}:${parts[6]}Z`;
  }

export function formatDate(inputDateStr: string): string {
    // Define the month names
    const monthNames: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Split the input date string into components
    const parts: string[] = inputDateStr.split(' ');

    // Extract the components of the date
    const year: string = parts[parts.length - 1]; // Year is the last part of the string
    var month: string = (monthNames.indexOf(parts[1])+1).toString();
    var day: string = parts[2];

    if (day.length === 1) {
        day = '0' + day;
    } 
    if (month.length === 1) {
        month = '0' + month;
    }    

    // Return the formatted date in "DD.MM.YYYY" format
    return `${day}.${month}.${year}`;
}

export function isInPastWeek(dateStr: string): boolean {
    // Assuming dateStr format is "Sat Nov 25 16:53:58 2023"

    const parts = dateStr.split(' ');
    const year = parseInt(parts[4]);
    const month = monthNames.indexOf(parts[1]);
    const day = parseInt(parts[2]);

    // Get current date values using Date object
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Month is 0-indexed
    const currentDay = currentDate.getDate();

    // Calculate differences
    const yearDiff = currentYear - year;
    const monthDiff = currentMonth - month;
    const dayDiff = currentDay - day;

    // Calculate total difference in days (very approximate, ignores leap years and varying month lengths)
    const totalDaysDiff = yearDiff * 365 + monthDiff * 30 + dayDiff;

    // Check if the difference is less than or equal to 7
    return totalDaysDiff <= 7;
}

export function isDateInPastYear(dateStr: string): boolean {
    // Assuming dateStr format is "Sat Nov 25 16:53:58 2023"

    const parts = dateStr.split(' ');
    const year = parseInt(parts[4]);
    
    // Get current date values using Date object
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Calculate differences
    const yearDiff = currentYear - year;

    // Calculate total difference in years (very approximate, ignores leap years and varying month lengths)
    const totalDaysDiff = yearDiff*365;

    // Check if the difference is less than or equal to 1
    return totalDaysDiff <= 365;
}



export function formatTime(seconds: number): string {
    seconds = Math.round(seconds)
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    // Padding single digits with '0' for consistent formatting
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  // Define an async function to fetch JSON data
export async function fetchJsonData(url: string): Promise<any> {
    try {
        // Fetch data from the provided URL
        const response = await fetch(url);
        // Parse the response as JSON
        const data = await response.json();
        return data;
    } catch (error) {
        // Handle any errors that occur during the fetch
        console.error('Error fetching data:', error);
        throw error;
    }
  }