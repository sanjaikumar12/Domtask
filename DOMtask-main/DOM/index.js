try {
  fetchData();
} catch (e) {
  console.log("error", e.message);
}

function fetchData() {
  return fetch(
    "https://gist.githubusercontent.com/17uite035/061ca0859c513bfb4ccd0dad8eec8693/raw/5b8eaa0bbadec336b2a1e40c1eab99a7fd96897d/pagenation.json"
  )
    .then((res) => res.json())
    .then((res) => originalData(res))
    .catch((error) => console.log(error));
}

function originalData(original_data) {
  let current_page = 1; //be global ->so used with prev and next btns
  //  this goTo func takes btn-id as input, so we can make request to call renderData based on btn click,
  function goTo(input) {
    //   console.log("input", input);
    if (typeof input === "number") {
      // console.log("No");
      renderData(input);
    } else if (typeof input === "string") {
      // console.log("Str", input);
      switch (input) {
        case "next": {
          if (current_page < no_of_pages) {
            current_page = current_page + 1;
            renderData(current_page);
          }
          break;
        }
        case "first": {
          if (current_page !== 1) renderData(1);
          break;
        }
        case "prev": {
          if (current_page > 1) {
            current_page = current_page - 1;
            renderData(current_page);
          }
          break;
        }
        default: {
          // console.log("default");
          renderData(1);
        }
      }
    }
  }

  let pagiButtons = document.getElementById("pagi-buttons");

  //this will render a group of buttons for page creation includes addEventlistnr to btns -->calling goTo func.
  const reqButtons = (no_pages) => {
    for (let i = 0; i < no_pages; i++) {
      let button = document.createElement("button");
      button.textContent = i + 1;
      button.setAttribute("id", i + 1);
      button.addEventListener("click", () => goTo(i + 1));
      pagiButtons.appendChild(button);
    }

    if (no_pages > 2) {
      //   prev,next and first btns
      let prev = document.createElement("button");
      prev.textContent = "prev";
      prev.setAttribute("id", "prev");
      prev.addEventListener("click", () => goTo("prev"));
      pagiButtons.insertBefore(prev, pagiButtons.firstChild);

      let next = document.createElement("button");
      next.textContent = "next";
      next.setAttribute("id", "next");
      next.addEventListener("click", () => goTo("next"));
      pagiButtons.append(next);

      let first = document.createElement("button");
      first.textContent = "first";
      first.setAttribute("id", "first");
      first.addEventListener("click", () => goTo("first"));
      pagiButtons.insertBefore(first, pagiButtons.firstChild);
    }
  };

  //  some table essential tags used as global for displayTableHead and tableBodyDisplay functions
  const dataBox = document.getElementById("data-box");
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  //  rendered 1 time only on starting to give table headers , called globally
  const displayTableHead = () => {
    thead.innerHTML = `
<tr>
<th>Id</th>
<th>Name</th>
<th>Email</th>
</tr>`;
    table.append(thead);
    dataBox.appendChild(table);
  };

  //  used to display table body with data-array from renderData
  const tableBodyDisplay = (data) => {
    tbody.textContent = "";

    data.map((el) => {
      tbody.innerHTML += `
        <tr>
        <td>${el.id}</td>
        <td>${el.name}</td>
        <td>${el.email}</td>
        </tr>
        `;
    });

    table.append(tbody);
    dataBox.appendChild(table);
  };

  // below variable declaration, arrow functions required to be initialised b4 calling that,(since-unhoisted)
  // so first arrow function declaration  then calling  those functions
  let total_no_of_data = original_data.length;

  //change this to get desired data per page
  let data_per_page = 10; // be accessible to all functions
  let no_of_pages = Math.ceil(total_no_of_data / data_per_page); // ceil to solve odd-even probs and provide required pages [in ceil -> even 1.1 results only to 2]

  displayTableHead();
  reqButtons(no_of_pages);
  renderData(current_page);

  //this will accept current page as input ,
  //copies value to current_page global variable and slice and returns a array based on desired data per page input
  function renderData(curr_page) {
    current_page = curr_page;
    let startIndex = (current_page - 1) * data_per_page;
    let stopIndex = startIndex + data_per_page;
    let dummyData = original_data.slice(startIndex, stopIndex);
    // here "dummyData" will be that particular array, we will determine after slicing
    console.log("startIndex", startIndex);
    console.log("stopIndex", stopIndex);
    console.log(dummyData);
    tableBodyDisplay(dummyData);

    //conditions to disable prev and first when page = starting page
    if (current_page === 1) {
      prev.setAttribute("disabled", true);
      first.setAttribute("disabled", true);
      prev.classList.add("disable-button");
      first.classList.add("disable-button");
    } else {
      prev.removeAttribute("disabled");
      first.removeAttribute("disabled");
      prev.classList.remove("disable-button");
      first.classList.remove("disable-button");
    }
    //conditions to disable next when hits last page
    if (current_page === no_of_pages) {
      next.setAttribute("disabled", true);
      next.classList.add("disable-button");
    } else {
      next.removeAttribute("disabled");

      next.classList.remove("disable-button");
    }

    //checks active btn condition for no btns
    for (let i = 0; i < no_of_pages; i++) {
      if (i + 1 === current_page) {
        document.getElementById(i + 1).classList.add("active");
      } else {
        document.getElementById(i + 1).classList.remove("active");
      }
    }
  }
}