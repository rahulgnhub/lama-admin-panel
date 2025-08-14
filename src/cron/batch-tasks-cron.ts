import axios from "axios";

// Function to format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Function to get dates between two dates
const getDatesBetween = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    dates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// Function to get next week's dates
const getNextWeekDates = (): { startDate: string; endDate: string } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + ((6 + 7 - today.getDay()) % 7));
  nextSaturday.setHours(23, 59, 59, 999);

  return {
    startDate: formatDate(today),
    endDate: formatDate(nextSaturday),
  };
};

// Function to check if tasks exist for a specific date and type
const checkExistingTasks = async (
  date: string,
  type: string,
): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BaseUrl}/admin/tasks/dailytasks?date=${date}&type=${type}`,
    );
    return response.data.data.length > 0;
  } catch (error) {
    console.error(
      `Error checking existing tasks for ${date} and type ${type}:`,
      error,
    );
    return false;
  }
};

// Function to create a task
const createTask = async (taskData: any): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BaseUrl}/admin/tasks/add-dailytasks`,
      taskData,
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error creating task:", error);
    return false;
  }
};

// Main function to handle batch task creation
const createBatchTasks = async () => {
  console.log('Batch task creation started');
  const { startDate, endDate } = getNextWeekDates();
  const dates = getDatesBetween(startDate, endDate);

  // Task templates
  const adTaskTemplate = {
    task_name: "Watch Mini Video",
    task_medium: "Other",
    task_summary: "",
    task_link: "ads.com",
    is_active: "1",
    task_reward: "50000",
    task_image: "other.png",
    type: "Ad",
  };

  const storyTaskTemplate = {
    task_name: "Publish a Story",
    task_medium: "Other",
    task_summary: "",
    task_link: "story.com",
    is_active: "1",
    task_reward: "50000",
    task_image: "other.png",
    type: "Story",
  };

  // Helper to process a single date
  const processDate = async (date: string) => {
    // Check and create Ad task
    const adTaskExists = await checkExistingTasks(date, "Ad");
    if (!adTaskExists) {
      const adTaskData = {
        ...adTaskTemplate,
        start_date: date,
        end_date: date,
      };
      await createTask(adTaskData);
      console.log(`Created Ad task for ${date}`);
    }

    // Check and create Story task
    const storyTaskExists = await checkExistingTasks(date, "Story");
    if (!storyTaskExists) {
      const storyTaskData = {
        ...storyTaskTemplate,
        start_date: date,
        end_date: date,
      };
      await createTask(storyTaskData);
      console.log(`Created Story task for ${date}`);
    }
  };

  // Concurrency limit
  const CONCURRENCY_LIMIT = 3;
  let index = 0;
  const results: Promise<void>[] = [];

  const runNext = async () => {
    if (index >= dates.length) return;
    const currentIndex = index++;
    await processDate(dates[currentIndex]);
    await runNext();
  };

  // Start up to CONCURRENCY_LIMIT parallel runners
  for (let i = 0; i < Math.min(CONCURRENCY_LIMIT, dates.length); i++) {
    results.push(runNext());
  }

  await Promise.all(results);
  console.log('Batch task creation finished');
};

// Export for testing purposes
export { createBatchTasks, getNextWeekDates, checkExistingTasks };
