const resumeForm = document.getElementById("resumeForm");
const nameInput = document.getElementById("name");
const jobTitleInput = document.getElementById("jobTitle");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const linkedinInput = document.getElementById("linkedin");
const githubInput = document.getElementById("github");
const locationInput = document.getElementById("location");
const summaryInput = document.getElementById("summary");
const skillInput = document.getElementById("skill");
const skillBtn = document.getElementById("skill-btn");
const skillList = document.getElementById("skillList");
const degreeInput = document.getElementById("degree");
const instituteInput = document.getElementById("institute");
const startYearInput = document.getElementById("startYear");
const endYearInput = document.getElementById("endYear");
const cgpaInput = document.getElementById("cgpa");
const educationBtn = document.getElementById("education-btn");
const educationList = document.getElementById("educationList");
const companyNameInput = document.getElementById("companyName");
const jobRoleInput = document.getElementById("jobRole");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const workDescriptionsInput = document.getElementById("workDescriptions");
const experienceBtn = document.getElementById("experience-btn");
const experienceList = document.getElementById("experienceList");
const projectNameInput = document.getElementById("projectName");
const technologiesInput = document.getElementById("technologies");
const projectDescriptionInput = document.getElementById("projectDescription");
const gitLinkInput = document.getElementById("gitLink");
const projectBtn = document.getElementById("project-btn");
const projectList = document.getElementById("projectList");
const certificateNameInput = document.getElementById("certificateName");
const issuedByInput = document.getElementById("issuedBy");
const issuedDateInput = document.getElementById("issuedDate");
const certificateBtn = document.getElementById("certificate-btn");
const certificateList = document.getElementById("certificateList");
const generateResumeBtn = document.getElementById("generateresume-btn");
const downloadResumeBtn = document.getElementById("downloadResume-btn");
const updatePreviewBtn = document.getElementById("updatePreview-btn");
const saveResumeBtn = document.getElementById("saveResume-btn");
const resetFormBtn = document.getElementById("resetForm-btn");
const previewContainer = document.getElementById("previewContainer");
const modeBtn = document.getElementById("mode");
let skills = [];
let educations = [];
let experiences = [];
let projects = [];
let certificates = [];
let skillEditIndex = -1;
let educationEditIndex = -1;
let experienceEditIndex = -1;
let projectEditIndex = -1;
let certificateEditIndex = -1;
const templateCards = document.querySelectorAll(".template-card");
let selectedTemplate = "template1";
templateCards.forEach((card) => {
    card.addEventListener("click", () => {
        templateCards.forEach((item) => {
            item.classList.remove("active");
        });
        card.classList.add("active");
        selectedTemplate = card.dataset.template;
        localStorage.setItem("selectedTemplate", selectedTemplate);
    });
});
skillBtn.addEventListener("click", addSkill);
function addSkill() {
    const skill = skillInput.value.trim();
    if (skill === "") {
        alert("Enter Skill");
        return;
    }
    if (skillEditIndex === -1) {
        skills.push(skill);
    } else {
        skills[skillEditIndex] = skill;
        skillEditIndex = -1;
    }
    skillInput.value = "";
    renderSkills();
}
function renderSkills() {
    skillList.innerHTML = "";
    skills.forEach(function (skill, index) {
        const li = document.createElement("li");
        li.textContent = skill;
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = function () {
            skillInput.value = skill;
            skillEditIndex = index;
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function () {
            skills.splice(index, 1);
            renderSkills();
        };
        li.append(editBtn);
        li.append(deleteBtn);
        skillList.append(li);
    });
}
educationBtn.addEventListener("click", addEducation);
function addEducation() {
    const degree = degreeInput.value.trim();
    const institute = instituteInput.value.trim();
    const startYear = startYearInput.value.trim();
    const endYear = endYearInput.value.trim();
    const cgpa = cgpaInput.value.trim();
    if (
        degree === "" ||
        institute === "" ||
        startYear === "" ||
        endYear === "" ||
        cgpa === ""
    ) {
        alert("Fill all fields");
        return;
    }
    if (startYear > endYear) {
        alert("Invalid Year");
        return;
    }
    const education = {
        degree,
        institute,
        startYear,
        endYear,
        cgpa
    };
    if (educationEditIndex === -1) {
        educations.push(education);
    } else {
        educations[educationEditIndex] = education;
        educationEditIndex = -1;
    }
    degreeInput.value = "";
    instituteInput.value = "";
    startYearInput.value = "";
    endYearInput.value = "";
    cgpaInput.value = "";
    renderEducation();
}
function renderEducation() {
    educationList.innerHTML = "";
    educations.forEach(function (education, index) {
        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML = `
            <h4>${education.degree}</h4>
            <p>${education.institute}</p>
            <p>${education.startYear} - ${education.endYear}</p>
            <p>${education.cgpa}</p>
        `;
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = function () {
            degreeInput.value = education.degree;
            instituteInput.value = education.institute;
            startYearInput.value = education.startYear;
            endYearInput.value = education.endYear;
            cgpaInput.value = education.cgpa;
            educationEditIndex = index;
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function () {
            educations.splice(index, 1);
            renderEducation();
        };
        card.append(editBtn);
        card.append(deleteBtn);
        educationList.append(card);
    });
}
experienceBtn.addEventListener("click", addExperience);
function addExperience() {
    const companyName = companyNameInput.value.trim();
    const jobRole = jobRoleInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const workDescriptions = workDescriptionsInput.value.trim();
    if (
        companyName === "" ||
        jobRole === "" ||
        startDate === "" ||
        endDate === "" ||
        workDescriptions === ""
    ) {
        alert("Please fill all experience fields.");
        return;
    }
    const experience = {
        companyName,
        jobRole,
        startDate,
        endDate,
        workDescriptions
    };
    if (experienceEditIndex === -1) {
        experiences.push(experience);
    } else {
        experiences[experienceEditIndex] = experience;
        experienceEditIndex = -1;
    }
    companyNameInput.value = "";
    jobRoleInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
    workDescriptionsInput.value = "";
    renderExperience();
}
function renderExperience() {
    experienceList.innerHTML = "";
    experiences.forEach(function (experience, index) {
        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML = `
            <h4>${experience.jobRole}</h4>
            <p>${experience.companyName}</p>
            <p>${experience.startDate} - ${experience.endDate}</p>
            <p>${experience.workDescriptions}</p>
        `;
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = function () {
            companyNameInput.value = experience.companyName;
            jobRoleInput.value = experience.jobRole;
            startDateInput.value = experience.startDate;
            endDateInput.value = experience.endDate;
            workDescriptionsInput.value = experience.workDescriptions;
            experienceEditIndex = index;
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function () {
            experiences.splice(index, 1);
            renderExperience();
        };
        card.append(editBtn);
        card.append(deleteBtn);
        experienceList.append(card);
    });
}
projectBtn.addEventListener("click", addProject);
function addProject() {
    const projectName = projectNameInput.value.trim();
    const technologies = technologiesInput.value.trim();
    const projectDescription = projectDescriptionInput.value.trim();
    const gitLink = gitLinkInput.value.trim();
    if (
        projectName === "" ||
        technologies === "" ||
        projectDescription === "" ||
        gitLink === ""
    ) {
        alert("Please fill all project fields.");
        return;
    }
    const project = {
        projectName,
        technologies,
        projectDescription,
        gitLink
    };
    if (projectEditIndex === -1) {
        projects.push(project);
    } else {
        projects[projectEditIndex] = project;
        projectEditIndex = -1;
    }
    projectNameInput.value = "";
    technologiesInput.value = "";
    projectDescriptionInput.value = "";
    gitLinkInput.value = "";
    renderProjects();
}
function renderProjects() {
    projectList.innerHTML = "";
    projects.forEach(function (project, index) {
        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML = `
            <h4>${project.projectName}</h4>
            <p><strong>Technology:</strong> ${project.technologies}</p>
            <p>${project.projectDescription}</p>
            <a href="${project.gitLink}" target="_blank">GitHub Link</a>
        `;
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = function () {
            projectNameInput.value = project.projectName;
            technologiesInput.value = project.technologies;
            projectDescriptionInput.value = project.projectDescription;
            gitLinkInput.value = project.gitLink;
            projectEditIndex = index;
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function () {
            projects.splice(index, 1);
            renderProjects();
        };
        card.append(editBtn);
        card.append(deleteBtn);
        projectList.append(card);
    });
}
certificateBtn.addEventListener("click", addCertificate);
function addCertificate() {
    const certificateName = certificateNameInput.value.trim();
    const issuedBy = issuedByInput.value.trim();
    const issuedDate = issuedDateInput.value;
    if (
        certificateName === "" ||
        issuedBy === "" ||
        issuedDate === ""
    ) {
        alert("Please fill all certificate fields.");
        return;
    }
    const certificate = {
        certificateName,
        issuedBy,
        issuedDate
    };
    if (certificateEditIndex === -1) {
        certificates.push(certificate);
    } else {
        certificates[certificateEditIndex] = certificate;
        certificateEditIndex = -1;
    }
    certificateNameInput.value = "";
    issuedByInput.value = "";
    issuedDateInput.value = "";
    renderCertificates();
}
function renderCertificates() {
    certificateList.innerHTML = "";
    certificates.forEach(function (certificate, index) {
        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML = `
            <h4>${certificate.certificateName}</h4>
            <p>${certificate.issuedBy}</p>
            <p>${certificate.issuedDate}</p>
        `;
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = function () {
            certificateNameInput.value = certificate.certificateName;
            issuedByInput.value = certificate.issuedBy;
            issuedDateInput.value = certificate.issuedDate;
            certificateEditIndex = index;
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function () {
            certificates.splice(index, 1);
            renderCertificates();
        };
        card.append(editBtn);
        card.append(deleteBtn);
        certificateList.append(card);
    });
}
resetFormBtn.addEventListener("click", () => {
    resumeForm.reset();
    skills = [];
    educations = [];
    experiences = [];
    projects = [];
    certificates = [];
    renderSkills();
    renderEducation();
    renderExperience();
    renderProjects();
    renderCertificates();
    previewContainer.innerHTML = "";
    skillEditIndex = -1;
    educationEditIndex = -1;
    experienceEditIndex = -1;
    projectEditIndex = -1;
    certificateEditIndex = -1;
});
modeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        modeBtn.textContent = "Light Mode";
    } else {
        modeBtn.textContent = "Dark Mode";
    }
});
generateResumeBtn.addEventListener("click", generateResume);
function generateResume() {
    const fullName = nameInput.value.trim();
    const jobTitle = jobTitleInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const linkedin = linkedinInput.value.trim();
    const github = githubInput.value.trim();
    const location = locationInput.value.trim();
    const summary = summaryInput.value.trim();
    let html = "";
    if(selectedTemplate === "template1"){
        html += `
        <div class="resume template1">
            <div class="resume-header">
                <h1>${fullName}</h1>
                <h3>${jobTitle}</h3>
                <p>
                    ${phone}
                    ${email ? " | " + email : ""}
                    ${location ? " | " + location : ""}
                </p>
                <p>
                    ${linkedin ? linkedin : ""}
                    ${github ? " | " + github : ""}
                </p>
            </div>
        `;
        if(summary !== ""){
            html += `
            <section class="resume-section">
                <h2>Professional Summary</h2>
                <p>
                    ${summary}
                </p>
            </section>
            `;
        }
        if(skills.length > 0){
            html += `
            <section class="resume-section">
                <h2>Skills</h2>
                <ul class="skills-list">
            `;
            skills.forEach((skill)=>{
                html += `
                    <li>
                        ${skill}
                    </li>
                `;
            });
            html += `
                </ul>
            </section>
            `;
        }
        if(educations.length > 0){
            html += `
            <section class="resume-section">
                <h2>Education</h2>
            `;
            educations.forEach((education)=>{
                html += `
                <div class="education-item">
                    <h3>
                        ${education.degree}
                    </h3>
                    <p>
                        ${education.institute}
                    </p>
                    <p>
                        ${education.startYear}
                        -
                        ${education.endYear}
                    </p>
                    <p>
                        CGPA : ${education.cgpa}
                    </p>
                </div>
                `;
            });
            html += `
            </section>
            `;
        }
        if(experiences.length > 0){
            html += `
            <section class="resume-section">
                <h2>Experience</h2>
            `;
            experiences.forEach((experience)=>{
                html += `
                <div class="experience-item">
                    <h3>
                        ${experience.jobRole}
                    </h3>
                    <h4>
                        ${experience.companyName}
                    </h4>
                    <p>
                        ${experience.startDate}
                        -
                        ${experience.endDate}
                    </p>
                    <p>
                        ${experience.workDescriptions}
                    </p>
                </div>
                `;
            });
            html += `
            </section>
            `;
        }
        if(projects.length > 0){
            html += `
            <section class="resume-section">
                <h2>Projects</h2>
            `;
            projects.forEach((project)=>{
                html += `
                <div class="project-item">
                    <h3>
                        ${project.projectName}
                    </h3>
                    <p>
                        <strong>
                        Technologies:
                        </strong>
                        ${project.technologies}
                    </p>
                    <p>
                        ${project.projectDescription}
                    </p>
                    ${
                        project.gitLink
                        ?
                        `
                        <a href="${project.gitLink}" target="_blank">
                            GitHub Link
                        </a>
                        `
                        :
                        ""
                    }
                </div>
                `;
            });
            html += `
            </section>
            `;
        }
        if(certificates.length > 0){
            html += `
            <section class="resume-section">
                <h2>Certificates</h2>
            `;
            certificates.forEach((certificate)=>{
                html += `
                <div class="certificate-item">
                    <h3>
                        ${certificate.certificateName}
                    </h3>
                    <p>
                        Issued By:
                        ${certificate.issuedBy}
                    </p>
                    <p>
                        ${certificate.issuedDate}
                    </p>
                </div>
                `;
            });
            html += `
            </section>
            `;
        } 
        html += `
        </div>
        `;
    }
    else if(selectedTemplate === "template2"){
        html += `
        <div class="resume template2">
            <div class="left-section">
                <h1>
                    ${fullName}
                </h1>
                <h3>
                    ${jobTitle}
                </h3>
                <div class="contact-info">
                    <p>
                        ${phone}
                    </p>
                    <p>
                        ${email}
                    </p>
                    <p>
                        ${location}
                    </p>
                    ${
                        linkedin
                        ?
                        `<p>${linkedin}</p>`
                        :
                        ""
                    }
                    ${
                        github
                        ?
                        `<p>${github}</p>`
                        :
                        ""
                    }
                </div>
            </div>
            <div class="right-section">
                ${
                    summary
                    ?
                    `
                    <section>
                        <h2>
                            Profile
                        </h2>
                        <p>
                            ${summary}
                        </p>
                    </section>
                    `
                    :
                    ""
                }
                ${
                    skills.length > 0
                    ?
                    `
                    <section>
                        <h2>
                            Skills
                        </h2>
                        <ul>
                        ${
                            skills.map((skill)=>{
                                return `
                                    <li>
                                        ${skill}
                                    </li>
                                `;
                            }).join("")
                        }
                        </ul>
                    </section>
                    `
                    :
                    ""
                }
                ${
                    educations.length > 0
                    ?
                    `
                    <section>
                        <h2>
                            Education
                        </h2>
                        ${
                            educations.map((education)=>{
                                return `
                                <div>
                                    <h3>
                                        ${education.degree}
                                    </h3>
                                    <p>
                                        ${education.institute}
                                    </p>
                                    <p>
                                        ${education.startYear}
                                        -
                                        ${education.endYear}
                                    </p>
                                </div>
                                `;
                            }).join("")
                        }
                    </section>
                    `
                    :
                    ""
                }
                ${
                    experiences.length > 0
                    ?
                    `
                    <section>
                        <h2>
                            Experience
                        </h2>
                        ${
                            experiences.map((experience)=>{
                                return `
                                <div>
                                    <h3>
                                        ${experience.jobRole}
                                    </h3>
                                    <p>
                                        ${experience.companyName}
                                    </p>
                                    <p>
                                        ${experience.workDescriptions}
                                    </p>
                                </div>
                                `;
                            }).join("")
                        }
                    </section>
                    `
                    :
                    ""
                }  
                ${
                    projects.length > 0
                    ?
                    `
                    <section>
                        <h2>
                            Projects
                        </h2>
                        ${
                            projects.map((project)=>{
                                return `
                                <div>
                                    <h3>
                                        ${project.projectName}
                                    </h3>
                                    <p>
                                        ${project.technologies}
                                    </p>
                                    <p>
                                        ${project.projectDescription}
                                    </p>
                                </div>
                                `;
                            }).join("")
                        }
                    </section>
                    `
                    :
                    ""
                }
                ${
                    certificates.length > 0
                    ?
                    `
                    <section>
                        <h2>
                            Certificates
                        </h2>
                        ${
                            certificates.map((certificate)=>{
                                return `
                                <p>
                                ${certificate.certificateName}
                                -
                                ${certificate.issuedBy}
                                </p>
                                `;
                            }).join("")
                        }
                    </section>
                    `
                    :
                    ""
                }
            </div>
        </div>
        `;
    }
    previewContainer.innerHTML = html;
    localStorage.setItem(
        "resumePreview",
        html
    );
}
updatePreviewBtn.addEventListener("click", () => {
    generateResume();
});
saveResumeBtn.addEventListener("click", () => {
    const resumeData = {
        personalInfo: {
            name: nameInput.value,
            jobTitle: jobTitleInput.value,
            phone: phoneInput.value,
            email: emailInput.value,
            linkedin: linkedinInput.value,
            github: githubInput.value,
            location: locationInput.value,
            summary: summaryInput.value
        },
        skills,
        educations,
        experiences,
        projects,
        certificates,
        template:selectedTemplate
    };
 localStorage.setItem(
        "resumeData",
        JSON.stringify(resumeData)
    );
    alert("Resume Saved Successfully");
});
window.addEventListener("load", () => {
    const savedResume = localStorage.getItem("resumeData");
    if(savedResume){
        const data = JSON.parse(savedResume);
        nameInput.value = data.personalInfo.name || "";
        jobTitleInput.value = data.personalInfo.jobTitle || "";
        phoneInput.value = data.personalInfo.phone || "";
        emailInput.value = data.personalInfo.email || "";
        linkedinInput.value = data.personalInfo.linkedin || "";
        githubInput.value = data.personalInfo.github || "";
        locationInput.value = data.personalInfo.location || "";
        summaryInput.value = data.personalInfo.summary || "";
        skills = data.skills || [];
        educations = data.educations || [];
        experiences = data.experiences || [];
        projects = data.projects || [];
        certificates = data.certificates || [];
        selectedTemplate = localStorage.getItem("selectedTemplate") || "template1";
        templateCards.forEach(card => {
        card.classList.remove("active");
        if (card.dataset.template === selectedTemplate) {
        card.classList.add("active");
        }
    });
        renderSkills();
        renderEducation();
        renderExperience();
        renderProjects();
        renderCertificates();
        generateResume();
    }
});
downloadResumeBtn.addEventListener("click", () => {
    const resume = document.querySelector(".resume");
    if (!resume) {
        alert("Generate Resume First");
        return;
    }
    const opt = {
        margin: 0.5,
        filename: "Resume.pdf",
        image: {
            type: "jpeg",
            quality: 1
        },
        html2canvas: {
            scale: 3,
            scrollY: 0,
            useCORS: true
        },
        jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait"
        }
    };
    html2pdf().set(opt).from(resume).save();
});