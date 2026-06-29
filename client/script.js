// ==========================================================
// CoverCraft AI
// Frontend Script
// Developed By: ARPIT RAJ KATIYAR
// ==========================================================

// Backend URL
const API_URL = "http://localhost:5000/api/generate";

// Elements
const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const companyInput = document.getElementById("company");
const skillsInput = document.getElementById("skills");
const jobDescriptionInput = document.getElementById("jobDescription");
const resumeInput = document.getElementById("resume");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

const output = document.getElementById("output");
const loading = document.getElementById("loading");

// Generate Button
generateBtn.addEventListener("click", generateCoverLetter);

// Copy Button
copyBtn.addEventListener("click", copyCoverLetter);

// Download Button
downloadBtn.addEventListener("click", downloadCoverLetter);

// Clear Button
clearBtn.addEventListener("click", clearForm);

// ==========================================================
// Generate Cover Letter
// ==========================================================

async function generateCoverLetter() {

    const name = nameInput.value.trim();
    const role = roleInput.value.trim();
    const company = companyInput.value.trim();
    const skills = skillsInput.value.trim();
    const jobDescription = jobDescriptionInput.value.trim();

    if (!name || !role || !company || !skills) {

        alert("Please fill all required fields.");

        return;

    }

    loading.classList.remove("hidden");

    output.innerHTML = "";
    if(resumeInput.files.length>0){

    const file = resumeInput.files[0];

    if(file.type!=="application/pdf"){

        alert("Please upload PDF Resume.");

        loading.classList.add("hidden");

        return;

    }

}
    const formData = new FormData();

    formData.append("name", name);
    formData.append("role", role);
    formData.append("company", company);
    formData.append("skills", skills);
    formData.append("jobDescription", jobDescription);

    // Resume Upload

    if (resumeInput.files.length > 0) {

        formData.append("resume", resumeInput.files[0]);

    }

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            body: formData

        });

        const data = await response.json();

        loading.classList.add("hidden");

        if (data.success) {

            typeWriterEffect(data.coverLetter);

        }

        else {

            output.innerHTML =
                "❌ " + (data.error || data.message);

        }

    }

    catch (error) {

        loading.classList.add("hidden");

        output.innerHTML =
            "Unable to connect to server.";

        console.log(error);

    }

}

function typeWriterEffect(text) {

    output.innerHTML = "";

    let index = 0;

    const speed = 10;

    function type() {

        if (index < text.length) {

            output.innerHTML += text.charAt(index);

            index++;

            setTimeout(type, speed);

        }

    }

    type();

}
// ==========================================================
// Copy
// ==========================================================

async function copyCoverLetter() {

    await navigator.clipboard.writeText(output.innerText);

    copyBtn.innerHTML =
        "✅ Copied";

    setTimeout(() => {

        copyBtn.innerHTML =
            '<i class="fa-solid fa-copy"></i> Copy';

    },2000);

}

// ==========================================================
// Download
// ==========================================================

async function downloadCoverLetter() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    // =============================
    // Header
    // =============================

    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageWidth, 30, "F");

    doc.setTextColor(255,255,255);
    doc.setFont("helvetica","bold");
    doc.setFontSize(22);

    doc.text("CoverCraft AI", 15, 18);

    // =============================
    // Title
    // =============================

    doc.setTextColor(40);

    doc.setFontSize(18);

    doc.text("Professional Cover Letter",15,45);

    // =============================
    // Candidate Details
    // =============================

    doc.setFontSize(11);

    doc.setFont("helvetica","normal");

    doc.text(`Candidate : ${nameInput.value}`,15,58);

    doc.text(`Company : ${companyInput.value}`,15,66);

    doc.text(`Role : ${roleInput.value}`,15,74);

    doc.text(`Generated : ${new Date().toLocaleString()}`,15,82);

    // =============================
    // Cover Letter
    // =============================

    const body = doc.splitTextToSize(
        output.innerText,
        180
    );

    doc.setFontSize(12);

    doc.text(body,15,95);

    // =============================
    // Footer
    // =============================

    doc.setFontSize(10);

    doc.setTextColor(120);

    doc.text(
        "Generated using CoverCraft AI | Project by ARPIT RAJ KATIYAR",
        15,
        285
    );

    doc.save("CoverLetter.pdf");

}

// ==========================================================
// Clear Form
// ==========================================================

function clearForm(){

    nameInput.value="";
    roleInput.value="";
    companyInput.value="";
    skillsInput.value="";
    jobDescriptionInput.value="";

    resumeInput.value="";

    output.innerHTML=
        "Your AI generated cover letter will appear here...";

}

// ==========================================================
// End
// ==========================================================