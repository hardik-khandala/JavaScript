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
    phnoErr.innerText = "Phone Number must be 10 digits";
    isValid = false;
  }

  // Validate Customer Name
  if (!name) {
    cnameErr.innerText = "Customer Name Required";
    isValid = false;
  } else if (name.length < 3 || name.length > 10) {
    cnameErr.innerText = "Customer Name length should be between 3 and 10 characters";
    isValid = false;
  }

  if (isValid) {
    const newCustomer = new Customer(cno, Number(phno), name);
    const success = travelCalc.addCustomer(newCustomer);
    if (success) {
      alert('Customer added successfully');
      redirectToHomePage();
    } else {
      cnoErr.innerText = "Customer Number Already Exists";
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
    customerNumberError.innerText = "Select Customer Number";
    isValid = false;
  }

  // Validate Ticket Cost
  if (!ticketCostStr) {
    ticketCostError.innerText = "Ticket Cost Required";
    isValid = false;
  } else {
    const ticketCost = Number(ticketCostStr);
    if (isNaN(ticketCost) || ticketCost <= 0) {
      ticketCostError.innerText = "Ticket Cost must be a positive number";
      isValid = false;
    }
  }

  if (isValid && selectedCno) {
    const ticketCost = Number(ticketCostStr);
    const newTicket = new Ticket(ticketCost);
    const success = travelCalc.addTicketToCustomer(selectedCno, newTicket);
    if (success) {
      alert('Ticket added successfully');
      redirectToHomePage();
    } else {
      customerNumberError.innerText = "Customer not found";
    }
  }
}

// Utility Functions
function redirectToHomePage() {
  window.location.href = "index.html"; // Adjust the path based on your project structure
}

function populateCustomerDropdown() {
  const customerSelect = document.getElementById('customerNumber') as HTMLSelectElement;
  customerSelect.innerHTML = '<option value="">Select Customer</option>';

  travelCalc.getAllCustomers().forEach(customer => {
    const option = document.createElement('option');
    option.value = customer.cno;
    option.text = `${customer.cno} - ${customer.name}`;
    customerSelect.appendChild(option);
  });
}

// Page Initialization
window.onload = () => {
  populateCustomerDropdown();
};