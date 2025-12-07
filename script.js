document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // LOGIN VALIDATION
  // =========================
  const loginForm = document.getElementById("loginForm");
  const loginErrors = document.getElementById("loginErrors");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      let errors = [];

      if (!email) {
        errors.push("Email is required.");
      }

      if (!password) {
        errors.push("Password is required.");
      }

      if (errors.length > 0) {
        e.preventDefault();
        loginErrors.style.display = "block";
        loginErrors.innerHTML = errors.join("<br>");
      } else {
        loginErrors.style.display = "none";
        e.preventDefault(); // demo only
        alert("Login successful! (Demo only, no real backend)");
      }
    });
  }

  // =========================
  // SIGNUP ROLE TOGGLE
  // =========================
  const roleRadios = document.querySelectorAll('input[name="role"]');
  const jobSeekerSection = document.getElementById("jobSeekerSection");
  const employerSection = document.getElementById("employerSection");

  if (roleRadios.length > 0) {
    roleRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.value === "seeker" && radio.checked) {
          jobSeekerSection.style.display = "block";
          employerSection.style.display = "none";
        } else if (radio.value === "employer" && radio.checked) {
          jobSeekerSection.style.display = "none";
          employerSection.style.display = "block";
        }
      });
    });
  }

  // =========================
  // SIGNUP VALIDATION
  // =========================
  const signupForm = document.getElementById("signupForm");
  const signupErrors = document.getElementById("signupErrors");

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      const fullName = document.getElementById("fullName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document
        .getElementById("signupPassword")
        .value.trim();
      const confirmPassword = document
        .getElementById("signupConfirmPassword")
        .value.trim();

      const selectedRole = document.querySelector(
        'input[name="role"]:checked'
      )?.value;

      let errors = [];

      // Basic fields
      if (!fullName) errors.push("Full name is required.");

      if (!email) {
        errors.push("Email is required.");
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        errors.push("Please enter a valid email address.");
      }

      if (!password) {
        errors.push("Password is required.");
      } else if (password.length < 6) {
        errors.push("Password must be at least 6 characters long.");
      }

      if (!confirmPassword) {
        errors.push("Please confirm your password.");
      } else if (password !== confirmPassword) {
        errors.push("Passwords do not match.");
      }

      if (!selectedRole) {
        errors.push("Please select an account type.");
      }

      // Role-specific validation
      if (selectedRole === "seeker") {
        const resume = document.getElementById("resume");
        if (!resume || resume.files.length === 0) {
          errors.push("Please upload your resume.");
        }
      }

      if (selectedRole === "employer") {
        const companyName = document
          .getElementById("companyName")
          .value.trim();
        const companyWebsite = document
          .getElementById("companyWebsite")
          .value.trim();

        if (!companyName) {
          errors.push("Company name is required for employer accounts.");
        }

        if (companyWebsite && !/^https?:\/\/.+/i.test(companyWebsite)) {
          errors.push("Please enter a valid company website URL.");
        }
      }

      if (errors.length > 0) {
        e.preventDefault();
        signupErrors.style.display = "block";
        signupErrors.innerHTML = errors.join("<br>");
      } else {
        signupErrors.style.display = "none";
        e.preventDefault(); // prevent actual submit in demo
        alert("Account created successfully! (Demo only, no real backend)");
      }
    });
  }

  // =========================
  // JOB DATA & STORAGE HELPERS
  // =========================

  // Default jobs (hard-coded)
  const defaultJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechNova Pvt Ltd",
      location: "Bangalore",
      type: "Full-time",
      description:
        "Build modern user interfaces using HTML, CSS, and JavaScript.",
    },
    {
      id: 2,
      title: "Java Intern",
      company: "CodeCraft Solutions",
      location: "Remote",
      type: "Internship",
      description:
        "Assist in developing backend services using Java and basic SQL.",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Pixel Studio",
      location: "Mumbai",
      type: "Full-time",
      description:
        "Create wireframes and design modern interfaces for web apps.",
    },
  ];

  function getStoredJobs() {
    const stored = localStorage.getItem("postedJobs");
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Error parsing postedJobs from localStorage", err);
      return [];
    }
  }

  function saveJobToStorage(job) {
    const jobs = getStoredJobs();
    jobs.push(job);
    localStorage.setItem("postedJobs", JSON.stringify(jobs));
  }

  function getAllJobs() {
    return [...defaultJobs, ...getStoredJobs()];
  }

  // =========================
  // RENDER JOBS + FILTERS
  // =========================
  const jobList = document.getElementById("jobList");
  const filterTitleInput = document.getElementById("filterTitle");
  const filterLocationSelect = document.getElementById("filterLocation");
  const filterTypeSelect = document.getElementById("filterType");
  const applyFilterBtn = document.getElementById("applyFilterBtn");

  function renderJobs(jobs) {
    if (!jobList) return;

    jobList.innerHTML = "";

    if (!jobs || jobs.length === 0) {
      jobList.innerHTML =
        '<p class="muted">No jobs match your filters. Try changing the filters.</p>';
      return;
    }

    jobs.forEach((job) => {
      const article = document.createElement("article");
      article.className = "job-card shadow";

      article.innerHTML = `
        <h2>${job.title}</h2>
        <p class="company">${job.company} · ${job.location} · ${job.type}</p>
        <p class="job-desc">${job.description}</p>
        <button class="btn btn-small">Apply Now</button>
      `;

      jobList.appendChild(article);
    });
  }

  function applyFilters() {
    const allJobs = getAllJobs();
    const titleFilter = filterTitleInput
      ? filterTitleInput.value.trim().toLowerCase()
      : "";
    const locationFilter = filterLocationSelect
      ? filterLocationSelect.value.trim().toLowerCase()
      : "";
    const typeFilter = filterTypeSelect
      ? filterTypeSelect.value.trim().toLowerCase()
      : "";

    const filtered = allJobs.filter((job) => {
      const matchesTitle =
        !titleFilter ||
        job.title.toLowerCase().includes(titleFilter) ||
        job.description.toLowerCase().includes(titleFilter);

      const matchesLocation =
        !locationFilter ||
        job.location.toLowerCase().includes(locationFilter);

      const matchesType =
        !typeFilter || job.type.toLowerCase() === typeFilter;

      return matchesTitle && matchesLocation && matchesType;
    });

    renderJobs(filtered);
  }

  // Initialize jobs page
  if (jobList) {
    // If coming from index.html search, pick up URL params
    const params = new URLSearchParams(window.location.search);
    const keywordParam = params.get("keyword") || "";
    const locationParam = params.get("location") || "";

    if (filterTitleInput && keywordParam) {
      filterTitleInput.value = keywordParam;
    }
    if (filterLocationSelect && locationParam) {
      // Try to match if same as one of the options
      const options = Array.from(filterLocationSelect.options).map(
        (o) => o.value.toLowerCase()
      );
      if (options.includes(locationParam.toLowerCase())) {
        filterLocationSelect.value = locationParam;
      }
    }

    // Initially show all (or filtered if params)
    applyFilters();

    if (applyFilterBtn) {
      applyFilterBtn.addEventListener("click", applyFilters);
    }

    // Optional: live filtering while typing
    if (filterTitleInput) {
      filterTitleInput.addEventListener("input", () => {
        applyFilters();
      });
    }
  }

  // =========================
  // POST A JOB FORM HANDLING
  // =========================
  const postJobForm = document.getElementById("postJobForm");
  const postJobErrors = document.getElementById("postJobErrors");

  if (postJobForm) {
    postJobForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("jobTitle").value.trim();
      const company = document.getElementById("jobCompany").value.trim();
      const location = document.getElementById("jobLocation").value.trim();
      const type = document.getElementById("jobType").value.trim();
      const description = document
        .getElementById("jobDescription")
        .value.trim();

      let errors = [];

      if (!title) errors.push("Job title is required.");
      if (!company) errors.push("Company name is required.");
      if (!location) errors.push("Location is required.");
      if (!type) errors.push("Please select a job type.");
      if (!description) errors.push("Job description is required.");

      if (errors.length > 0) {
        postJobErrors.style.display = "block";
        postJobErrors.innerHTML = errors.join("<br>");
        return;
      }

      postJobErrors.style.display = "none";

      const newJob = {
        id: Date.now(),
        title,
        company,
        location,
        type,
        description,
      };

      saveJobToStorage(newJob);

      alert("Job posted successfully! It will now appear on the Jobs page.");
      window.location.href = "jobs.html";
    });
  }
});
