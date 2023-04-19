const COUNT_OF_DAYS = 31;
const COUNT_OF_VIEWS = 1000;

export const daysAgoFromNow = (date: string) => {
  const now = new Date();
  const postDate = new Date(date);

  const diff = now.getTime() - postDate.getTime();

  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const isAfterDate = (date: string) => {
  const now = new Date();
  const postDate = new Date(date);

  return now.getTime() > postDate.getTime();
};

export const isHot = (views: number, date: string) =>
  views > COUNT_OF_VIEWS && daysAgoFromNow(date) < COUNT_OF_DAYS;

export const delay = (ms: number) =>
  // eslint-disable-next-line no-promise-executor-return
  new Promise((resolve) => setTimeout(resolve, ms));
