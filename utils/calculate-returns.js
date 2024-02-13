let startTimeStringFromMongoDB = "2024-01-21T05:19:23.140Z";

// let activeHours = [2];
// let startTime = new Date(startTimeStringFromMongoDB);
// let pauseTime = null;
// let isActive = false;
// let investAmount = 100;
// let growthRate = 100;
// let currentAmount = 0;

const calcReturn = (
  startTime,
  investAmount,
  activeHours,
  growthRate,
  isActive
) => {
  if (isActive) {
    const timeDiff = Math.floor(
      (new Date().getTime() - new Date(startTime).getTime()) /
        (60 * 60 * 1000)
    );

    const activeHoursSum = activeHours.reduce(
      (sum, hours) => sum + hours,
      0
    );

    const totalTime = timeDiff + activeHoursSum;

    const ret = investAmount * (growthRate / 100) * totalTime;
    currentAmount = investAmount + ret;
    return currentAmount;
  } else {
    const activeHoursSum = activeHours.reduce(
      (sum, hours) => sum + hours,
      0
    );

    const ret = investAmount * (growthRate / 100) * activeHoursSum;
    currentAmount = investAmount + ret;
    return currentAmount;
  }
};

const pause = () => {
  pauseTime = new Date().getTime();
  activeHours.push(
    Math.floor((pauseTime - startTime.getTime()) / (60 * 60 * 1000))
  );

  pauseTime = new Date(pauseTime).toISOString();

  isActive = false;
  startTime = null;
};

const resume = () => {
  startTime = new Date().getTime();
  pauseTime = null;
  isActive = true;

  startTime = new Date(startTime).toISOString();
};
// calcReturn();
// pause();
// calcReturn();
// resume();
// calcReturn();
// console.log(currentAmount);
module.exports = calcReturn;
