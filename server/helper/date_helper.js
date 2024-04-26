const dateFilter = () => {
  try {
    // Get today's date
    let today = new Date();

    // Set the time to the start of the day
    today.setHours(0, 0, 0, 0);

    // Get yesterday's date
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Set the time to the start of the day
    yesterday.setHours(0, 0, 0, 0);

    // Get the end of today
    let endOfToday = new Date(today);
    endOfToday.setDate(today.getDate() + 1);
    endOfToday.setMilliseconds(-1);

    return { yesterday, endOfToday };
  } catch (err) {}
};

module.exports = { dateFilter };
