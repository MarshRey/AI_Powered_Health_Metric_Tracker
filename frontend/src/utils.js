export function generateDaysOfYear(year) {
    const days = [];
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
  
    let current = start;
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }
  
export function getStepsColor (value, goal) {
    const ratio = Math.min(value / goal, 1);
    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(255 * ratio);
    return `rgb(${red}, ${green}, 0)`;
  }

export function getSleepColor(value, goal) {
    const diff = Math.abs(value - goal);
    const maxDiff = goal; // If you sleep 0 or 2x goal, very bad
    const ratio = Math.min(diff / maxDiff, 1);
    const red = Math.round(255 * ratio);
    const green = Math.round(255 * (1 - ratio));
    return `rgb(${red}, ${green}, 0)`;
}

export function getHeartRateColor(value, goal) {
    const ratio = Math.min(goal / value, 1); // lower HR = greener
    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(255 * ratio);
    return `rgb(${red}, ${green}, 0)`;
}
  
  