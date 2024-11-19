// Define the Customer interface
interface CustomerInterface {
  cno: string;
  phno: number;
  name: string;
}

// Define the Ticket class
class Ticket {
  cost: number;

  constructor(cost: number) {
    this.cost = cost;
  }

  computeOverallPrice(): number {
    let discount = 0;

    if (this.cost > 70000) discount = 0.18;
    else if (this.cost >= 55001) discount = 0.16;
    else if (this.cost >= 35001) discount = 0.12;
    else if (this.cost >= 25001) discount = 0.10;
    else discount = 0.02;

    return this.cost * (1 - discount);
  }
}

// Define the Customer class
class Customer implements CustomerInterface {
  cno: string;
  phno: number;
  name: string;
  tickets: Ticket[] = [];

  constructor(cno: string, phno: number, name: string) {
    this.cno = cno;
    this.phno = phno;
    this.name = name;
  }

  addTicket(ticket: Ticket): void {
    this.tickets.push(ticket);
  }

  computeOverallPrice(): number {
    return this.tickets.reduce((total, ticket) => total + ticket.computeOverallPrice(), 0);
  }
}

// Define the TravelCalc class
class TravelCalc {
  customers: Customer[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage(): void {
    const data = localStorage.getItem('customers');
    if (data) {
      const parsedData: any[] = JSON.parse(data);
      this.customers = parsedData.map(c => {
        const customer = new Customer(c.cno, c.phno, c.name);
        customer.tickets = c.tickets.map((t: any) => new Ticket(t.cost));
        return customer;
      });
    }
  }

  saveToLocalStorage(): void {
    const customerData = this.customers.map(c => ({
      cno: c.cno,
      phno: c.phno,
      name: c.name,
      tickets: c.tickets.map(t => ({ cost: t.cost }))
    }));
    localStorage.setItem('customers', JSON.stringify(customerData));
  }

  addCustomer(customer: Customer): boolean {
    if (this.customers.some(c => c.cno === customer.cno)) {
      return false; // Customer number already exists
    }
    this.customers.push(customer);
    this.saveToLocalStorage();
    return true;
  }

  getCustomerByCno(cno: string): Customer | undefined {
    return this.customers.find(c => c.cno === cno);
  }

  addTicketToCustomer(cno: string, ticket: Ticket): boolean {
    const customer = this.getCustomerByCno(cno);
    if (customer) {
      customer.addTicket(ticket);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  getAllCustomers(): Customer[] {
    return this.customers;
  }
}

// Initialize TravelCalc instance
const travelCalc = new TravelCalc();

// Function to add customer
function addCustomer() {
  const cnoInput = document.getElementById('customerNo') as HTMLInputElement;
  const phnoInput = document.getElementById('customerPhNo') as HTMLInputElement;
  const nameInput = document.getElementById('customerName') as HTMLInputElement;

  const cno = cnoInput.value.trim();
  const phno = phnoInput.value.trim();
  const name = nameInput.value.trim();

  const cnoErr = document.getElementById('customerNumberError') as HTMLDivElement;
  const phnoErr = document.getElementById('customerPhNoError') as HTMLDivElement;
  const cnameErr = document.getElementById('customerNameError') as HTMLDivElement;

  // Clear previous errors
  cnoErr.innerText = "";
  phnoErr.innerText = "";
  cnameErr.innerText = "";

  let isValid = true;

  // Validate Customer Number
  if (!cno) {
    cnoErr.innerText = "Customer Number Required";
    isValid = false;
  } else if (travelCalc.getCustomerByCno(cno)) {
    cnoErr.innerText = "Customer Number Already Present";
    isValid = false;
  }

  // Validate Phone Number
  if (!phno) {
    phnoErr.innerText = "Phone Number Required";
    isValid = false;
  } else if (phno.length !== 10 || !/^\d{10}$/.test(phno)) {
    phnoErr.innerText = "Phone Number length must be 10";
    isValid = false;
  }

  // Validate Customer Name
  if (!name) {
    cnameErr.innerText = "Customer Name Required";
    isValid = false;
  } else if (name.length < 3 || name.length > 10) {
    cnameErr.innerText = "Customer Name length should be at least 3 characters and at most 10 characters";
    isValid = false;
  }

  if (isValid) {
    const newCustomer = new Customer(cno, Number(phno), name);
    const success = travelCalc.addCustomer(newCustomer);
    if (success) {
      alert('Customer added successfully');
      addToLocalStorage();
      redirectToHomePage();
    } else {
      cnoErr.innerText = "Customer Number Already Present";
    }
  }
}

// Function to add ticket
function addTicket() {
  const customerNumberSelect = document.getElementById('customerNumber') as HTMLSelectElement;
  const ticketCostInput = document.getElementById('ticketCost') as HTMLInputElement;

  const selectedCno = customerNumberSelect.value;
  const ticketCostStr = ticketCostInput.value.trim();

  const customerNumberError = document.getElementById('customerNumberDropDownError') as HTMLDivElement;
  const ticketCostError = document.getElementById('ticketCostError') as HTMLDivElement;

  // Clear previous errors
  customerNumberError.innerText = "";
  ticketCostError.innerText = "";

  let isValid = true;

  // Validate Customer Number
  if (!selectedCno) {
    customerNumberError.innerText = "Select customer Number";
    isValid = false;
  }

  // Validate Ticket Cost
  if (!ticketCostStr) {
    ticketCostError.innerText = "Ticket Cost Required";
    isValid = false;
  } else {
    const ticketCost = Number(ticketCostStr);
    if (isNaN(ticketCost) || ticketCost <= 0) {
      ticketCostError.innerText = "Ticket Cost must be positive";
      isValid = false;
    }
  }

  if (isValid && selectedCno) {
    const ticketCost = Number(ticketCostStr);
    const newTicket = new Ticket(ticketCost);
    const success = travelCalc.addTicketToCustomer(selectedCno, newTicket);
    if (success) {
      alert('Ticket added successfully');
      travelCalc.saveToLocalStorage();
      redirectToHomePage();
    } else {
      customerNumberError.innerText = "Customer not found";
    }
  }
}

// Function to populate customer dropdown in Ticket Form
function populateCustomerDropdown() {
  const customerSelect = document.getElementById('customerNumber') as HTMLSelectElement;
  customerSelect.innerHTML = '<option value="">Select Customer</option>'; // default option

  travelCalc.getAllCustomers().forEach(customer => {
    const option = document.createElement('option');
    option.value = customer.cno;
    option.text = `${customer.cno} - ${customer.name}`;
    customerSelect.appendChild(option);
  });
}

// Function to display customers and their tickets on Home Page
function displayCustomers() {
  const mainTableBody = document.getElementById('CustomerTableBody') as HTMLTableSectionElement;
  if (!mainTableBody) return;

  mainTableBody.innerHTML = ""; // Clear existing rows

  travelCalc.getAllCustomers().forEach(customer => {
    const tr = document.createElement('tr');

    // Customer details
    const cnoTd = document.createElement('td');
    cnoTd.innerText = customer.cno;
    tr.appendChild(cnoTd);

    const phnoTd = document.createElement('td');
    phnoTd.innerText = customer.phno.toString();
    tr.appendChild(phnoTd);

    const nameTd = document.createElement('td');
    nameTd.innerText = customer.name;
    tr.appendChild(nameTd);

    // Ticket History (Nested Table)
    const ticketTd = document.createElement('td');
    const nestedTable = document.createElement('table');
    nestedTable.id = `nestedTable-${customer.cno}`;
    nestedTable.border = "1";

    const nestedThead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const costHeader = document.createElement('th');
    costHeader.innerText = "Ticket Cost";
    const discountedCostHeader = document.createElement('th');
    discountedCostHeader.innerText = "Discounted Cost";
    headerRow.appendChild(costHeader);
    headerRow.appendChild(discountedCostHeader);
    nestedThead.appendChild(headerRow);
    nestedTable.appendChild(nestedThead);

    const nestedTbody = document.createElement('tbody');
    customer.tickets.forEach(ticket => {
      const ticketRow = document.createElement('tr');
      const costTd = document.createElement('td');
      costTd.innerText = ticket.cost.toFixed(2);
      const discountedCostTd = document.createElement('td');
      discountedCostTd.innerText = ticket.computeOverallPrice().toFixed(2);
      ticketRow.appendChild(costTd);
      ticketRow.appendChild(discountedCostTd);
      nestedTbody.appendChild(ticketRow);
    });
    nestedTable.appendChild(nestedTbody);
    ticketTd.appendChild(nestedTable);
    tr.appendChild(ticketTd);

    mainTableBody.appendChild(tr);
  });
}

// Function to add to localStorage (handled by TravelCalc)
function addToLocalStorage() {
  travelCalc.saveToLocalStorage();
}

// Function to redirect to Home Page
function redirectToHomePage() {
  window.location.href = "/"; // Adjust the path as necessary
}

// Function to initialize Navbar click events
function initializeNavbar() {
  const homeLink = document.getElementById('home') as HTMLAnchorElement;
  const customerFormLink = document.getElementById('customerForm') as HTMLAnchorElement;
  const ticketFormLink = document.getElementById('ticketForm') as HTMLAnchorElement;

  homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "/";
  });

  customerFormLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "/customerForm.html";
  });

  ticketFormLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "/ticketForm.html";
  });
}

// Event Listeners for forms
document.getElementById('addCustomerFormBtn')?.addEventListener('click', addCustomer);
document.getElementById('ticketFormSubmitBtn')?.addEventListener('click', addTicket);

// On page load
window.onload = () => {
  initializeNavbar();
  populateCustomerDropdown();
  displayCustomers();
};