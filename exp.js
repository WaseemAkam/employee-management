// Import built-in modules
const fs = require("fs");              // File system → read/write JSON file
const readline = require("readline");  // For CLI user input

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// File where employees will be stored
const FILE = "employees.json";

// Load employees from file
function loadEmployees() {
    if (!fs.existsSync(FILE)) return []; // if file doesn't exist → empty array
    const data = fs.readFileSync(FILE);
    return JSON.parse(data);
}

// Save employees to file
function saveEmployees(employees) {
    fs.writeFileSync(FILE, JSON.stringify(employees, null, 2));
}

// Display menu
function showMenu() {
    console.log("\nEmployee Management System");
    console.log("1. Add Employee");
    console.log("2. List Employees");
    console.log("3. Update Employee");
    console.log("4. Delete Employee");
    console.log("5. Exit");

    rl.question("Select an option: ", handleMenu);
}

// Handle menu selection
function handleMenu(choice) {
    switch (choice) {
        case "1": addEmployee(); break;
        case "2": listEmployees(); break;
        case "3": updateEmployee(); break;
        case "4": deleteEmployee(); break;
        case "5": rl.close(); break;
        default:
            console.log("Invalid option!");
            showMenu();
    }
}

// Add employee
function addEmployee() {
    rl.question("Employee Name: ", name => {
        rl.question("Position: ", position => {
            rl.question("Salary: ", salary => {

                // validation
                if (!name || !position || isNaN(salary)) {
                    console.log("Invalid input!");
                    return showMenu();
                }

                const employees = loadEmployees();

                const employee = {
                    id: Date.now(),        // unique ID using timestamp
                    name,
                    position,
                    salary: Number(salary)
                };

                employees.push(employee);
                saveEmployees(employees);

                console.log("Employee added successfully!");
                showMenu();
            });
        });
    });
}

// List employees
function listEmployees() {
    const employees = loadEmployees();

    console.log("\nEmployee List:");
    if (employees.length === 0) {
        console.log("No employees found.");
    } else {
        employees.forEach(emp => {
            console.log(
                `ID: ${emp.id}, Name: ${emp.name}, Position: ${emp.position}, Salary: $${emp.salary}`
            );
        });
        console.log(`Total employees: ${employees.length}`);
    }

    showMenu();
}

// Update employee
function updateEmployee() {
    rl.question("Enter Employee ID to update: ", id => {
        let employees = loadEmployees();
        const index = employees.findIndex(emp => emp.id == id);

        if (index === -1) {
            console.log("Employee not found!");
            return showMenu();
        }

        rl.question("New Name: ", name => {
            rl.question("New Position: ", position => {
                rl.question("New Salary: ", salary => {

                    if (!name || !position || isNaN(salary)) {
                        console.log("Invalid input!");
                        return showMenu();
                    }

                    employees[index] = {
                        ...employees[index],
                        name,
                        position,
                        salary: Number(salary)
                    };

                    saveEmployees(employees);
                    console.log("Employee updated!");
                    showMenu();
                });
            });
        });
    });
}

// Delete employee
function deleteEmployee() {
    rl.question("Enter Employee ID to delete: ", id => {
        let employees = loadEmployees();
        const newEmployees = employees.filter(emp => emp.id != id);

        if (employees.length === newEmployees.length) {
            console.log("Employee not found!");
        } else {
            saveEmployees(newEmployees);
            console.log("Employee deleted!");
        }

        showMenu();
    });
}

// Start program
showMenu();
