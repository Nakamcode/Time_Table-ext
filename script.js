const GRAPH_KEY = "graph_key";

const timeTable = [
  {
    0: "PAST Q.",
    1: "Exercise",
  },
  {
    0: "PCP",
    1: "SDA",
  },
  {
    0: "CNS",
    1: "MWD",
  },
  {
    0: "MWD",
    1: "PCP",
  },
  {
    0: "SDA",
    1: "CNS",
  },
  {
    0: "PAST Q.",
    1: "Exercise",
  },
  {
    0: "GO TO CLASS",
    1: "GO TO CLASS",
  },
];

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Selecting DOM elements
const day = document.querySelector("#day-el");
const tasks = document.querySelectorAll(".task");
// Selecting the two inputs elements
const checkboxs = document.querySelectorAll("input");

const date = new Date();

day.textContent = weekDays[date.getDay()];

//getting task for specific day
tasks.forEach((task, index) => {
  task.textContent = timeTable[date.getDay()][index];
});

// Get the stats value from the localStorage or set it to an empty array
const stat = JSON.parse(localStorage.getItem(GRAPH_KEY)) || [];

// Update the input button onload
updateCheckUI(stat, checkboxs, tasks);

// onclick event for the checkboxes
checkboxs.forEach((checkbox, index) => {
  checkbox.onclick = function () {
    if (checkbox.checked) {
      tasks[index].style.textDecoration = "line-through";
      checkbox.setAttribute("disabled", "");
    } else {
      tasks[index].style.textDecoration = "none";
    }
    AllTaskComplete(checkboxs);
  };
});

// Records the data if all tasks are completed
function AllTaskComplete(checkboxes) {
  if (checkboxes[0].checked && checkboxes[1].checked) {
    stat.push({ date: new Date().getDate(), completedAllTasks: true });
    localStorage.setItem(GRAPH_KEY, JSON.stringify(stat));
    updategGraphUI();
  }
}

// Update the check state if it already been done or not
function updateCheckUI(stat, checkboxs, tasks) {
  const findDateRecord = stat.filter((record) => {
    return record.date == new Date().getDate();
  });

  // if Date record doesn't exist it uses the current date with default value of false for completedAllTasks
  // if the date is duplicate it select the first one
  let currentRecord = findDateRecord[0] || {
    date: new Date().getDate(),
    completedAllTasks: false,
  };
  if (
    currentRecord.date == new Date().getDate() &&
    currentRecord.completedAllTasks
  ) {
    checkboxs.forEach((checkbox) => {
      checkbox.checked = true;
      checkbox.setAttribute("disabled", "");
    });
    tasks.forEach((task) => {
      task.style.textDecoration = "line-through";
    });
  } else {
    // console.log("Tasks not completed");
  }
}

// Update the Graph UI
const t_graph = Array.from(document.querySelectorAll(".g_data"));
function updategGraphUI() {
  t_graph.forEach((d, dIndex) => {
    stat.forEach((s) => {
      if (s.date == dIndex + 1 && s.completedAllTasks) {
        d.classList.add("check");
      }
    });
    // add indicator to current graphbox
    new Date().getDate() == dIndex + 1 && d.classList.add("now");
  });
}

updategGraphUI();

function getDaysRemaining() {
  let remaingdays = t_graph.length - new Date().getDate();
  return remaingdays;
}

// The following code relates to the pie chart
const ctx = document.getElementById("myChart");

new Chart(ctx, {
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
  },
  type: "doughnut",
  data: {
    labels: ["past days", "remaining days"],

    datasets: [
      {
        data: [t_graph.length - getDaysRemaining(), getDaysRemaining()],
        backgroundColor: ["rgb(222, 34, 59)", "rgb(0, 128, 0)"],
        hoverOffset: 3,
      },
    ],
  },
});
