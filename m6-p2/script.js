fetch("https://res.cloudinary.com/des3si8bs/raw/upload/v1654770778/attendance/attandance_alc65n.JSON")
  .then((res) => res.json())
  .then((data) => displayEmployees(data))
  .catch((error) => console.error("Error fetching data:", error));

function displayEmployees(data) {
  const container = document.getElementById("cards");

  data.forEach((employee) => {
    const {
      EmployeeName,
      JoinDate,
      LeaveDays,
      PresentDays,
      TotalProductiveTime,
    } = employee;

    const productiveTime = PresentDays * 8.5;

    const card = document.createElement("div");
    card.classList.add("card");

    const name = document.createElement("h3");
    name.innerText = EmployeeName;
    card.appendChild(name);

    const joinDate = document.createElement("p");
    joinDate.innerText = `Join Date: ${JoinDate}`;
    card.appendChild(joinDate);

    const leaveDays = document.createElement("p");
    leaveDays.innerText = `Leave Days: ${LeaveDays}`;
    if (LeaveDays > 5) {
      leaveDays.classList.add("red");
    }
    card.appendChild(leaveDays);

    const presentDays = document.createElement("p");
    presentDays.innerText = `Present Days: ${PresentDays}`;
    card.appendChild(presentDays);

    if (productiveTime === TotalProductiveTime) {
      card.classList.add("green");
    }

    if (LeaveDays === 0) {
      card.classList.add("purple");
    }

    const leaveButton = document.createElement("button");
    leaveButton.innerText = "Show Leave Details";
    leaveButton.addEventListener("click", () => {
      alert(`Leave details for ${EmployeeName}: ${LeaveDays} leaves`);
    });
    card.appendChild(leaveButton);

    container.appendChild(card);
  });
}
