
// MY UNIVERSITY MANAGEMENT SYSTEM

// Load saved information

let students = JSON.parse(localStorage.getItem("uniStudents") || "[]");
let lecturers = JSON.parse(localStorage.getItem("uniLecturers") || "[]");
let courses = JSON.parse(localStorage.getItem("uniCourses") || "[]");
let departments = JSON.parse(localStorage.getItem("uniDepartments") || "[]");

let editingStudent = null;
let editingLecturer = null;
let editingCourse = null;
let editingDepartment = null;


// SAVE DATA

function saveData() {
    localStorage.setItem("uniStudents", JSON.stringify(students));
    localStorage.setItem("uniLecturers", JSON.stringify(lecturers));
    localStorage.setItem("uniCourses", JSON.stringify(courses));
    localStorage.setItem("uniDepartments", JSON.stringify(departments));
}


// SHOW AND RESET FORMS

function showForm(id) {
    const form = document.getElementById(id);
    form.classList.remove("hidden");
    form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetForm(id) {
    document.getElementById(id).reset();
    document.getElementById(id).classList.add("hidden");

    if (id === "studentForm") editingStudent = null;
    if (id === "lecturerForm") editingLecturer = null;
    if (id === "courseForm") editingCourse = null;
    if (id === "departmentForm") editingDepartment = null;
}


// UPDATE DASHBOARD

function updateDashboard() {
    document.getElementById("totalStudents").textContent = students.length;
    document.getElementById("totalLecturers").textContent = lecturers.length;
    document.getElementById("totalCourses").textContent = courses.length;
    document.getElementById("totalDepartments").textContent = departments.length;
}


// UPDATE SELECT OPTIONS

function updateOptions() {
    const courseSelect = document.getElementById("studentCourse");
    const departmentSelect = document.getElementById("lecturerDepartment");

    courseSelect.innerHTML = '<option value="">Select Course</option>';
    departmentSelect.innerHTML = '<option value="">Select Department</option>';

    courses.forEach(course => {
        const option = document.createElement("option");
        option.value = course.name;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });

    departments.forEach(department => {
        const option = document.createElement("option");
        option.value = department.name;
        option.textContent = department.name;
        departmentSelect.appendChild(option);
    });
}


// CREATE TABLE ROW

function createRow(tableId, values, actions) {
    const row = document.createElement("tr");

    values.forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    const actionCell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "action-btn";
    editButton.onclick = actions.edit;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "action-btn delete";
    deleteButton.onclick = actions.delete;

    actionCell.append(editButton, deleteButton);
    row.appendChild(actionCell);

    document.getElementById(tableId).appendChild(row);
}


// STUDENTS

function displayStudents(search = "") {
    const table = document.getElementById("studentTable");
    table.innerHTML = "";

    students.filter(student =>
        Object.values(student).some(value =>
            String(value).toLowerCase().includes(search.toLowerCase())
        )
    ).forEach(student => {
        createRow("studentTable", [
            student.name,
            student.reg,
            student.course,
            student.gender
        ], {
            edit: () => editStudent(student.id),
            delete: () => deleteStudent(student.id)
        });
    });

    updateDashboard();
}

document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const reg = document.getElementById("studentReg").value.trim();
    const course = document.getElementById("studentCourse").value;
    const gender = document.getElementById("studentGender").value;

    const duplicate = students.some(student =>
        student.reg.toLowerCase() === reg.toLowerCase() &&
        student.id !== editingStudent
    );

    if (duplicate) {
        alert("Registration number already exists!");
        return;
    }

    if (editingStudent) {
        students = students.map(student =>
            student.id === editingStudent
                ? { ...student, name, reg, course, gender }
                : student
        );
    } else {
        students.push({
            id: Date.now().toString(),
            name,
            reg,
            course,
            gender
        });
    }

    saveData();
    displayStudents();
    resetForm("studentForm");
});

function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    editingStudent = id;

    document.getElementById("studentName").value = student.name;
    document.getElementById("studentReg").value = student.reg;
    document.getElementById("studentCourse").value = student.course;
    document.getElementById("studentGender").value = student.gender;

    showForm("studentForm");
}

function deleteStudent(id) {
    if (confirm("Delete this student?")) {
        students = students.filter(s => s.id !== id);
        saveData();
        displayStudents();
    }
}

document.getElementById("studentSearch").addEventListener("input", e => {
    displayStudents(e.target.value);
});


// LECTURERS

function displayLecturers() {
    const table = document.getElementById("lecturerTable");
    table.innerHTML = "";

    lecturers.forEach(lecturer => {
        createRow("lecturerTable", [
            lecturer.name,
            lecturer.id,
            lecturer.department
        ], {
            edit: () => editLecturer(lecturer.id),
            delete: () => deleteLecturer(lecturer.id)
        });
    });

    updateDashboard();
}

document.getElementById("lecturerForm").addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("lecturerName").value.trim();
    const id = document.getElementById("lecturerId").value.trim();
    const department = document.getElementById("lecturerDepartment").value;

    const duplicate = lecturers.some(lecturer =>
        lecturer.id.toLowerCase() === id.toLowerCase() &&
        lecturer.id !== editingLecturer
    );

    if (duplicate) {
        alert("Staff ID already exists!");
        return;
    }

    if (editingLecturer) {
        lecturers = lecturers.map(lecturer =>
            lecturer.id === editingLecturer
                ? { ...lecturer, name, department }
                : lecturer
        );
    } else {
        lecturers.push({ name, id, department });
    }

    saveData();
    displayLecturers();
    resetForm("lecturerForm");
});

function editLecturer(id) {
    const lecturer = lecturers.find(l => l.id === id);
    if (!lecturer) return;

    editingLecturer = id;
    document.getElementById("lecturerName").value = lecturer.name;
    document.getElementById("lecturerId").value = lecturer.id;
    document.getElementById("lecturerDepartment").value = lecturer.department;

    showForm("lecturerForm");
}

function deleteLecturer(id) {
    if (confirm("Delete this lecturer?")) {
        lecturers = lecturers.filter(l => l.id !== id);
        saveData();
        displayLecturers();
    }
}


// COURSES

function displayCourses() {
    const table = document.getElementById("courseTable");
    table.innerHTML = "";

    courses.forEach(course => {
        createRow("courseTable", [
            course.name,
            course.code
        ], {
            edit: () => editCourse(course.code),
            delete: () => deleteCourse(course.code)
        });
    });

    updateDashboard();
}

document.getElementById("courseForm").addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("courseName").value.trim();
    const code = document.getElementById("courseCode").value.trim();

    const duplicate = courses.some(course =>
        course.code.toLowerCase() === code.toLowerCase() &&
        course.code !== editingCourse
    );

    if (duplicate) {
        alert("Course code already exists!");
        return;
    }

    if (editingCourse) {
        courses = courses.map(course =>
            course.code === editingCourse ? { name, code } : course
        );
    } else {
        courses.push({ name, code });
    }

    saveData();
    displayCourses();
    updateOptions();
    displayStudents();
    resetForm("courseForm");
});

function editCourse(code) {
    const course = courses.find(c => c.code === code);
    if (!course) return;

    editingCourse = code;
    document.getElementById("courseName").value = course.name;
    document.getElementById("courseCode").value = course.code;

    showForm("courseForm");
}

function deleteCourse(code) {
    if (confirm("Delete this course?")) {
        courses = courses.filter(c => c.code !== code);
        saveData();
        displayCourses();
        updateOptions();
    }
}


// DEPARTMENTS

function displayDepartments() {
    const table = document.getElementById("departmentTable");
    table.innerHTML = "";

    departments.forEach(department => {
        createRow("departmentTable", [
            department.name
        ], {
            edit: () => editDepartment(department.id),
            delete: () => deleteDepartment(department.id)
        });
    });

    updateDashboard();
}

document.getElementById("departmentForm").addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("departmentName").value.trim();

    const duplicate = departments.some(department =>
        department.name.toLowerCase() === name.toLowerCase() &&
        department.id !== editingDepartment
    );

    if (duplicate) {
        alert("Department already exists!");
        return;
    }

    if (editingDepartment) {
        departments = departments.map(department =>
            department.id === editingDepartment
                ? { ...department, name }
                : department
        );
    } else {
        departments.push({
            id: Date.now().toString(),
            name
        });
    }

    saveData();
    displayDepartments();
    updateOptions();
    resetForm("departmentForm");
});

function editDepartment(id) {
    const department = departments.find(d => d.id === id);
    if (!department) return;

    editingDepartment = id;
    document.getElementById("departmentName").value = department.name;

    showForm("departmentForm");
}

function deleteDepartment(id) {
    if (confirm("Delete this department?")) {
        departments = departments.filter(d => d.id !== id);
        saveData();
        displayDepartments();
        updateOptions();
    }
}


// INITIALIZE SYSTEM

function initializeSystem() {
    updateOptions();
    displayStudents();
    displayLecturers();
    displayCourses();
    displayDepartments();
    updateDashboard();
}

initializeSystem();
