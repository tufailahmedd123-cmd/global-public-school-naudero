/**
 * GLOBAL PUBLIC SCHOOL NAUDERO - Official Scripts
 * Pure Vanilla JavaScript (ES6+)
 * Fully responsive, accessible, interactive features with LocalStorage persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initCounters();
  initAdmissionsForm();
  initResultsChecker();
  initFeeCalculator();
  initGallery();
  initFacultyFilter();
  initTestimonialsSlider();
  initFaqAccordion();
  initContactForm();
  initErpPortals();
  initBackToTop();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL SPY
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggleBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Mobile dropdown toggle
  const dropdownItems = document.querySelectorAll('.nav-item');
  dropdownItems.forEach((item) => {
    const dropdown = item.querySelector('.dropdown-menu');
    const link = item.querySelector('.nav-link');
    if (dropdown && link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('mobile-show');
        }
      });
    }
  });

  // Close menu when clicking outside or clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navMenu.classList.remove('open');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      navMenu.classList.remove('open');
    }
  });
}

/* ==========================================================================
   3. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, target);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((num) => observer.observe(num));

  function animateCounter(element, target) {
    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start).toLocaleString();
      }
    }, stepTime);
  }
}

/* ==========================================================================
   4. ADMISSIONS ONLINE MULTI-STEP FORM WITH LOCALSTORAGE PERSISTENCE
   ========================================================================== */
function initAdmissionsForm() {
  const form = document.getElementById('onlineAdmissionForm');
  if (!form) return;

  const steps = form.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const prevBtn = document.getElementById('admissionsPrevBtn');
  const nextBtn = document.getElementById('admissionsNextBtn');
  const submitBtn = document.getElementById('admissionsSubmitBtn');
  let currentStep = 0;

  function showStep(stepIndex) {
    steps.forEach((step, idx) => {
      step.classList.toggle('active', idx === stepIndex);
    });

    progressSteps.forEach((step, idx) => {
      step.classList.toggle('active', idx === stepIndex);
      step.classList.toggle('completed', idx < stepIndex);
    });

    if (prevBtn) prevBtn.style.display = stepIndex === 0 ? 'none' : 'inline-flex';
    if (nextBtn) nextBtn.style.display = stepIndex === steps.length - 1 ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.style.display = stepIndex === steps.length - 1 ? 'inline-flex' : 'none';

    // If on review step, populate summary
    if (stepIndex === steps.length - 1) {
      populateReviewSummary();
    }
  }

  function validateStep(stepIndex) {
    const currentStepEl = steps[stepIndex];
    const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach((input) => {
      const errEl = input.parentElement.querySelector('.field-error');
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        if (errEl) errEl.textContent = 'This field is required';
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
        if (errEl) errEl.textContent = '';
      }

      // Check phone number format if relevant
      if (input.type === 'tel' && input.value.trim()) {
        const phonePattern = /^03\d{2}-?\d{7}$|^\+92\d{10}$/;
        if (!phonePattern.test(input.value.trim().replace(/\s/g, ''))) {
          input.classList.add('is-invalid');
          if (errEl) errEl.textContent = 'Valid Pak format: 0300-1234567';
          isValid = false;
        }
      }
    });

    return isValid;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        showToast('Please complete all required fields correctly.', 'error');
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  }

  function populateReviewSummary() {
    const summaryBox = document.getElementById('admissionReviewSummary');
    if (!summaryBox) return;

    const sName = document.getElementById('admStudentName')?.value || 'N/A';
    const sDob = document.getElementById('admDob')?.value || 'N/A';
    const sGender = document.getElementById('admGender')?.value || 'N/A';
    const sClass = document.getElementById('admClass')?.value || 'N/A';
    const fName = document.getElementById('admFatherName')?.value || 'N/A';
    const fPhone = document.getElementById('admPhone')?.value || 'N/A';
    const fCnic = document.getElementById('admCnic')?.value || 'N/A';
    const transport = document.getElementById('admTransport')?.value || 'No Transport';

    summaryBox.innerHTML = `
      <div style="background: var(--navy-50); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--navy-100);">
        <h4 style="color: var(--navy-900); margin-bottom: 0.75rem; font-family: var(--font-serif); font-size: 1.1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem;">Application Preview</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; font-size: 0.875rem;">
          <div><strong style="color: var(--navy-800);">Candidate:</strong> ${sName} (${sGender})</div>
          <div><strong style="color: var(--navy-800);">Applying For:</strong> Class ${sClass}</div>
          <div><strong style="color: var(--navy-800);">Date of Birth:</strong> ${sDob}</div>
          <div><strong style="color: var(--navy-800);">Guardian Name:</strong> ${fName}</div>
          <div><strong style="color: var(--navy-800);">Guardian CNIC:</strong> ${fCnic}</div>
          <div><strong style="color: var(--navy-800);">Emergency Contact:</strong> ${fPhone}</div>
          <div><strong style="color: var(--navy-800);">School Transport:</strong> ${transport}</div>
        </div>
      </div>
    `;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      showToast('Please fix required fields.', 'error');
      return;
    }

    const appId = 'GPS-ADM-2024-' + Math.floor(1000 + Math.random() * 9000);
    const applicantData = {
      id: appId,
      studentName: document.getElementById('admStudentName')?.value || 'Unknown',
      fatherName: document.getElementById('admFatherName')?.value || 'Unknown',
      grade: document.getElementById('admClass')?.value || 'Grade 1',
      phone: document.getElementById('admPhone')?.value || '',
      date: new Date().toLocaleDateString('en-GB'),
      status: 'Pending',
      transport: document.getElementById('admTransport')?.value || 'No'
    };

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem('gps_admission_applications') || '[]');
    existing.unshift(applicantData);
    localStorage.setItem('gps_admission_applications', JSON.stringify(existing));

    // Show confirmation modal or replace form content
    const formWrapper = document.querySelector('.admission-form');
    if (formWrapper) {
      formWrapper.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <div style="width: 70px; height: 70px; background: var(--success-bg); color: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
            <svg style="width: 36px; height: 36px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 style="font-family: var(--font-serif); font-size: 1.85rem; color: var(--navy-900); margin-bottom: 0.5rem;">Admission Application Submitted!</h3>
          <p style="color: var(--text-muted); max-width: 540px; margin: 0 auto 1.5rem auto;">Thank you for choosing Global Public School Naudero. Your application has been logged into our school registry system.</p>
          <div style="display: inline-block; background: var(--gold-pale); border: 2px dashed var(--gold-primary); padding: 1rem 2rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--gold-dark); font-weight: 700;">Your Application Tracking ID</span>
            <div style="font-size: 1.6rem; font-family: var(--font-serif); font-weight: 800; color: var(--navy-900);">${appId}</div>
          </div>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button onclick="window.print()" class="btn btn-navy">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Print Receipt
            </button>
            <a href="#erpSection" class="btn btn-primary" onclick="showErpTab('admissionsTab')">View in Admin Portal</a>
          </div>
        </div>
      `;
    }

    showToast(`Application ${appId} submitted successfully!`, 'success');
    refreshErpAdmissionsTable();
  });
}

/* ==========================================================================
   5. EXAMINATION & ONLINE RESULT PORTAL
   ========================================================================== */
const sampleStudentResults = {
  'GPS-101': {
    rollNo: 'GPS-101',
    name: 'Muhammad Ali Shah',
    father: 'Syed Qadir Bux Shah',
    class: 'Grade 10 (Matric Science - SSC II)',
    session: 'Annual Examination 2024',
    subjects: [
      { name: 'English Compulsory', total: 100, obtained: 92, grade: 'A-1' },
      { name: 'Mathematics', total: 100, obtained: 98, grade: 'A-1' },
      { name: 'Sindhi / Urdu Salees', total: 100, obtained: 88, grade: 'A-1' },
      { name: 'Physics (Theory + Practical)', total: 100, obtained: 94, grade: 'A-1' },
      { name: 'Chemistry (Theory + Practical)', total: 100, obtained: 93, grade: 'A-1' },
      { name: 'Computer Science', total: 100, obtained: 96, grade: 'A-1' },
      { name: 'Pakistan Studies', total: 50, obtained: 47, grade: 'A-1' },
      { name: 'Islamiat Compulsory', total: 50, obtained: 48, grade: 'A-1' }
    ],
    remarks: 'Outstanding performance. First Position in District Larkana region.'
  },
  'GPS-102': {
    rollNo: 'GPS-102',
    name: 'Dua Fatima Bhutto',
    father: 'Sardar Inayatullah Bhutto',
    class: 'Grade 9 (SSC I)',
    session: 'Annual Examination 2024',
    subjects: [
      { name: 'English Compulsory', total: 100, obtained: 89, grade: 'A-1' },
      { name: 'Mathematics', total: 100, obtained: 95, grade: 'A-1' },
      { name: 'Sindhi Literature', total: 100, obtained: 91, grade: 'A-1' },
      { name: 'Biology & Zoology', total: 100, obtained: 92, grade: 'A-1' },
      { name: 'Physics (Theory)', total: 75, obtained: 69, grade: 'A-1' },
      { name: 'Chemistry (Theory)', total: 75, obtained: 68, grade: 'A-1' },
      { name: 'Islamiat', total: 50, obtained: 46, grade: 'A-1' }
    ],
    remarks: 'Exceptional analytical aptitude. Consistently high rank.'
  },
  'GPS-103': {
    rollNo: 'GPS-103',
    name: 'Bilawal Ahmed Soomro',
    father: 'Ghulam Rasool Soomro',
    class: 'Grade 8',
    session: 'Middle Standard Exam 2024',
    subjects: [
      { name: 'English Grammar & Comp', total: 100, obtained: 84, grade: 'A' },
      { name: 'Mathematics', total: 100, obtained: 89, grade: 'A-1' },
      { name: 'General Science', total: 100, obtained: 86, grade: 'A' },
      { name: 'Computer Literacy', total: 100, obtained: 90, grade: 'A-1' },
      { name: 'Social Studies & History', total: 100, obtained: 82, grade: 'A' },
      { name: 'Sindhi / Urdu', total: 100, obtained: 85, grade: 'A' }
    ],
    remarks: 'Very dedicated student with great co-curricular participation.'
  },
  'GPS-104': {
    rollNo: 'GPS-104',
    name: 'Zainab Noor Kalhoro',
    father: 'Dr. Tariq Kalhoro',
    class: 'Grade 7',
    session: 'Final Term Examination 2024',
    subjects: [
      { name: 'English', total: 100, obtained: 90, grade: 'A-1' },
      { name: 'Mathematics', total: 100, obtained: 92, grade: 'A-1' },
      { name: 'Science', total: 100, obtained: 88, grade: 'A-1' },
      { name: 'Computer Studies', total: 100, obtained: 95, grade: 'A-1' },
      { name: 'Islamiat & Ethics', total: 100, obtained: 91, grade: 'A-1' }
    ],
    remarks: 'Top in Science and Robotics competitions.'
  }
};

function initResultsChecker() {
  const form = document.getElementById('resultSearchForm');
  const displayContainer = document.getElementById('resultDisplayContainer');
  if (!form || !displayContainer) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rollInput = document.getElementById('searchRollNumber');
    const rollNo = rollInput ? rollInput.value.trim().toUpperCase() : '';

    if (!rollNo) {
      showToast('Please enter a student Roll Number.', 'error');
      return;
    }

    let record = sampleStudentResults[rollNo];

    // If not found in static list, generate a verified demo record for any other roll number
    if (!record) {
      record = generateDynamicRecord(rollNo);
    }

    renderMarksheet(record, displayContainer);
    displayContainer.classList.add('active');
    displayContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast(`Result loaded for ${record.name} (${record.rollNo})`, 'success');
  });
}

window.showResultsChecker = function() {
  const resultSec = document.getElementById('results');
  if (resultSec) {
    resultSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const rollInput = document.getElementById('searchRollNumber');
    if (rollInput) {
      rollInput.focus();
      rollInput.select();
    }
  }
};

function generateDynamicRecord(rollNo) {
  const firstNames = ['Hamza', 'Ayesha', 'Farhan', 'Sara', 'Zubair', 'Nida', 'Kashif', 'Maria'];
  const lastNames = ['Abro', 'Larik', 'Mangi', 'Channa', 'Sangi', 'Tunio', 'Khuhro'];
  const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return {
    rollNo: rollNo,
    name: `${fName} ${lName}`,
    father: `Jan Muhammad ${lName}`,
    class: 'Grade 9 (Science Stream)',
    session: 'Annual Examination 2024',
    subjects: [
      { name: 'English Language', total: 100, obtained: 86, grade: 'A' },
      { name: 'Mathematics', total: 100, obtained: 91, grade: 'A-1' },
      { name: 'Sindhi Compulsory', total: 100, obtained: 84, grade: 'A' },
      { name: 'General Science', total: 100, obtained: 88, grade: 'A-1' },
      { name: 'Computer Education', total: 100, obtained: 92, grade: 'A-1' },
      { name: 'Islamiat & Ethics', total: 100, obtained: 89, grade: 'A-1' }
    ],
    remarks: 'Promoted with distinction to the next academic level.'
  };
}

function renderMarksheet(record, container) {
  let totalMarks = 0;
  let totalObtained = 0;

  const rowsHtml = record.subjects.map((sub) => {
    totalMarks += sub.total;
    totalObtained += sub.obtained;
    const percentage = ((sub.obtained / sub.total) * 100).toFixed(1);
    return `
      <tr>
        <td style="font-weight: 600;">${sub.name}</td>
        <td style="text-align: center;">${sub.total}</td>
        <td style="text-align: center; font-weight: 700; color: var(--navy-900);">${sub.obtained}</td>
        <td style="text-align: center;">${percentage}%</td>
        <td style="text-align: center;"><span class="badge badge-gold">${sub.grade}</span></td>
      </tr>
    `;
  }).join('');

  const overallPercentage = ((totalObtained / totalMarks) * 100).toFixed(1);
  let overallGrade = 'A-1';
  if (overallPercentage < 80) overallGrade = 'A';
  if (overallPercentage < 70) overallGrade = 'B';
  if (overallPercentage < 60) overallGrade = 'C';

  container.innerHTML = `
    <div class="marksheet-header">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <svg style="width: 44px; height: 44px; color: var(--gold-accent);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5z"></path></svg>
        <div>
          <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--navy-900); margin: 0;">GLOBAL PUBLIC SCHOOL NAUDERO</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Official Statement of Academic Marks & Transcript</p>
        </div>
      </div>
      <div style="text-align: right;">
        <span class="badge badge-gold">Verified Electronic Copy</span>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Issued: Nov 2024</div>
      </div>
    </div>

    <div class="student-meta-grid">
      <div><strong>Student Name:</strong> ${record.name}</div>
      <div><strong>Father's Name:</strong> ${record.father}</div>
      <div><strong>Roll Number:</strong> <span style="color: var(--navy-800); font-weight: 700;">${record.rollNo}</span></div>
      <div><strong>Class / Grade:</strong> ${record.class}</div>
      <div><strong>Examination Session:</strong> ${record.session}</div>
      <div><strong>School Campus:</strong> Naudero Sindh Campus</div>
    </div>

    <table class="marksheet-table">
      <thead>
        <tr>
          <th>Subject</th>
          <th style="text-align: center;">Max Marks</th>
          <th style="text-align: center;">Marks Obtained</th>
          <th style="text-align: center;">Percentage</th>
          <th style="text-align: center;">Grade</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
      <tfoot>
        <tr style="background: var(--navy-50); font-weight: 700;">
          <td>Total Aggregate</td>
          <td style="text-align: center;">${totalMarks}</td>
          <td style="text-align: center; color: var(--gold-dark);">${totalObtained}</td>
          <td style="text-align: center;">${overallPercentage}%</td>
          <td style="text-align: center;"><span class="badge badge-navy" style="font-size: 0.85rem;">${overallGrade}</span></td>
        </tr>
      </tfoot>
    </table>

    <div style="background: var(--gold-pale); padding: 0.85rem 1.25rem; border-radius: var(--radius-sm); border: 1px solid rgba(212, 175, 55, 0.4); margin-bottom: 1.5rem;">
      <strong style="color: var(--navy-900);">Controller of Examinations Remarks:</strong>
      <span style="color: var(--text-main); font-size: 0.9rem; margin-left: 0.5rem;">${record.remarks}</span>
    </div>

    <div class="marksheet-footer">
      <div style="font-size: 0.78rem; color: var(--text-muted);">
        Verification QR: GPS-TRANSCRIPT-${record.rollNo}-AUTH
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button onclick="window.print()" class="btn btn-navy btn-sm">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Print / Save Transcript
        </button>
      </div>
    </div>
  `;
}

/* ==========================================================================
   6. DYNAMIC FEE CALCULATOR
   ========================================================================== */
function initFeeCalculator() {
  const gradeSelect = document.getElementById('calcGradeSelect');
  const routeSelect = document.getElementById('calcTransportRoute');
  const siblingCheck = document.getElementById('calcSiblingCheck');
  const meritCheck = document.getElementById('calcMeritCheck');
  const labCheck = document.getElementById('calcLabCheck');

  if (!gradeSelect) return;

  const baseFeeMap = {
    'playgroup': 3500,
    'kg': 3800,
    'primary': 4500,
    'middle': 5200,
    'matric': 6000
  };

  const transportMap = {
    'none': 0,
    'naudero_city': 1500,
    'larkana_road': 2200,
    'garhi_khuda_bakhsh': 2500,
    'villages': 2800
  };

  function updateFee() {
    const baseFee = baseFeeMap[gradeSelect.value] || 4500;
    const transportFee = transportMap[routeSelect.value] || 0;
    const labFee = labCheck && labCheck.checked ? 600 : 0;

    let discountPercent = 0;
    if (siblingCheck && siblingCheck.checked) discountPercent += 15;
    if (meritCheck && meritCheck.checked) discountPercent += 20;

    const discountAmount = Math.round((baseFee * discountPercent) / 100);
    const totalPayable = baseFee + transportFee + labFee - discountAmount;

    const baseEl = document.getElementById('calcBaseFee');
    const transEl = document.getElementById('calcTransportFee');
    const labEl = document.getElementById('calcLabFee');
    const discEl = document.getElementById('calcDiscountAmount');
    const totalEl = document.getElementById('calcTotalPayable');

    if (baseEl) baseEl.textContent = `₨ ${baseFee.toLocaleString()}`;
    if (transEl) transEl.textContent = `₨ ${transportFee.toLocaleString()}`;
    if (labEl) labEl.textContent = `₨ ${labFee.toLocaleString()}`;
    if (discEl) discEl.textContent = `- ₨ ${discountAmount.toLocaleString()} (${discountPercent}%)`;
    if (totalEl) totalEl.textContent = `₨ ${totalPayable.toLocaleString()} / month`;
  }

  [gradeSelect, routeSelect, siblingCheck, meritCheck, labCheck].forEach((el) => {
    if (el) el.addEventListener('change', updateFee);
  });

  updateFee();
}

/* ==========================================================================
   7. PHOTO GALLERY FILTER & LIGHTBOX
   ========================================================================== */
const galleryItemsData = [
  {
    id: 1,
    title: 'Modern Science & Chemistry Laboratory',
    category: 'labs',
    src: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
    caption: 'State-of-the-art laboratory for Physics, Chemistry, and Biology experiments.'
  },
  {
    id: 2,
    title: 'High-Tech Computer & Robotics Center',
    category: 'labs',
    src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
    caption: 'Air-conditioned digital computing hub with high-speed internet and coding curriculum.'
  },
  {
    id: 3,
    title: 'Main Academic Campus & Courtyard',
    category: 'campus',
    src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80',
    caption: 'Spacious, secure, and solar-powered campus environment in Naudero.'
  },
  {
    id: 4,
    title: 'Smart Classrooms with Interactive Boards',
    category: 'classes',
    src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
    caption: 'Ergonomic learning spaces designed to inspire collaboration and deep focus.'
  },
  {
    id: 5,
    title: 'Annual Sports Gala & Athletics Day',
    category: 'sports',
    src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80',
    caption: 'House competitions in Cricket, Football, Badminton, and Track events.'
  },
  {
    id: 6,
    title: 'Sindh Cultural & Iqbal Day Celebrations',
    category: 'events',
    src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    caption: 'Celebrating our rich heritage, poetry, speech debates, and national unity.'
  },
  {
    id: 7,
    title: 'Central School Library & Reading Oasis',
    category: 'campus',
    src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',
    caption: 'Over 6,000 titles spanning curriculum, encyclopedias, literature, and Islamic heritage.'
  },
  {
    id: 8,
    title: 'Early Childhood Montessori Activity Wing',
    category: 'classes',
    src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
    caption: 'Playgroup and Kindergarten rooms equipped with sensorial manipulative tools.'
  },
  {
    id: 9,
    title: 'Inter-School Science Exhibition Winners',
    category: 'events',
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    caption: 'Our students demonstrating solar and clean water filtration models.'
  }
];

function initGallery() {
  const grid = document.getElementById('galleryGrid');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!grid) return;

  let currentCategory = 'all';
  let activeFilteredList = [...galleryItemsData];
  let currentLightboxIdx = 0;

  function renderGallery() {
    activeFilteredList = currentCategory === 'all'
      ? galleryItemsData
      : galleryItemsData.filter((item) => item.category === currentCategory);

    grid.innerHTML = activeFilteredList.map((item, index) => `
      <div class="gallery-item" data-index="${index}" tabindex="0">
        <img src="${item.src}" alt="${item.title}" loading="lazy" />
        <div class="gallery-overlay">
          <span class="gallery-category-tag">${item.category}</span>
          <div class="gallery-caption">${item.title}</div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.gallery-item').forEach((itemEl) => {
      itemEl.addEventListener('click', () => {
        const idx = parseInt(itemEl.getAttribute('data-index'), 10);
        openLightbox(idx);
      });
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      renderGallery();
    });
  });

  function openLightbox(idx) {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    currentLightboxIdx = idx;
    const item = activeFilteredList[currentLightboxIdx];
    if (!item) return;

    lightboxImg.src = item.src;
    lightboxCaption.textContent = `${item.title} — ${item.caption}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextImage() {
    currentLightboxIdx = (currentLightboxIdx + 1) % activeFilteredList.length;
    openLightbox(currentLightboxIdx);
  }

  function prevImage() {
    currentLightboxIdx = (currentLightboxIdx - 1 + activeFilteredList.length) % activeFilteredList.length;
    openLightbox(currentLightboxIdx);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  renderGallery();
}

/* ==========================================================================
   8. FACULTY DEPARTMENT FILTER
   ========================================================================== */
function initFacultyFilter() {
  const filterBtns = document.querySelectorAll('.faculty-filter-btn');
  const facultyCards = document.querySelectorAll('.faculty-card');

  if (!filterBtns.length || !facultyCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const dept = btn.getAttribute('data-dept') || 'all';

      facultyCards.forEach((card) => {
        if (dept === 'all' || card.getAttribute('data-dept') === dept) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   9. TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  if (!slides.length || !dotsContainer) return;

  let currentSlide = 0;
  let autoplayInterval;

  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.slider-dot');

  function goToSlide(idx) {
    slides.forEach((s) => s.classList.remove('active'));
    dots.forEach((d) => d.classList.remove('active'));

    currentSlide = idx;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 6000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  const container = document.querySelector('.slider-container');
  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

/* ==========================================================================
   10. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const body = item.querySelector('.faq-body');

    if (trigger && body) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other FAQs
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBody = other.querySelector('.faq-body');
            if (otherBody) otherBody.style.maxHeight = null;
          }
        });

        if (!isActive) {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        } else {
          item.classList.remove('active');
          body.style.maxHeight = null;
        }
      });
    }
  });
}

/* ==========================================================================
   11. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('schoolContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required contact fields.', 'error');
      return;
    }

    showToast('Your message has been sent to GPS Naudero Administration. We will respond within 24 hours.', 'success');
    form.reset();
  });
}

/* ==========================================================================
   12. SCHOOL MANAGEMENT ERP DASHBOARD & PORTALS SUITE
   ========================================================================== */
function initErpPortals() {
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const panes = document.querySelectorAll('.erp-tab-pane');
  const roleBtns = document.querySelectorAll('.erp-role-btn');

  // Tab navigation
  sidebarItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-target-tab');
      if (targetTab) showErpTab(targetTab);
    });
  });

  // Role Switcher
  roleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      roleBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.getAttribute('data-role');

      if (role === 'admin') showErpTab('adminOverviewTab');
      if (role === 'parent') showErpTab('parentPortalTab');
      if (role === 'student') showErpTab('studentPortalTab');
      if (role === 'teacher') showErpTab('attendanceTab');

      showToast(`Switched view to: ${role.toUpperCase()} Portal`, 'info');
    });
  });

  initErpAttendanceToggles();
  initErpStudentSearch();
  initErpAddStudentModal();
  refreshErpAdmissionsTable();
}

window.showErpTab = function(tabId) {
  const panes = document.querySelectorAll('.erp-tab-pane');
  const sidebarItems = document.querySelectorAll('.sidebar-item');

  panes.forEach((pane) => {
    pane.classList.toggle('active', pane.id === tabId);
  });

  sidebarItems.forEach((item) => {
    item.classList.toggle('active', item.getAttribute('data-target-tab') === tabId);
  });

  const erpSection = document.getElementById('erpSection');
  if (erpSection) {
    erpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

function initErpAttendanceToggles() {
  const attCards = document.querySelectorAll('.attendance-card-student');
  attCards.forEach((card) => {
    const btns = card.querySelectorAll('.att-btn');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        calculateAttendanceKPI();
      });
    });
  });

  const markAllPresentBtn = document.getElementById('markAllPresentBtn');
  if (markAllPresentBtn) {
    markAllPresentBtn.addEventListener('click', () => {
      document.querySelectorAll('.att-btn.p').forEach((pBtn) => {
        const parent = pBtn.parentElement;
        parent.querySelectorAll('.att-btn').forEach((b) => b.classList.remove('active'));
        pBtn.classList.add('active');
      });
      calculateAttendanceKPI();
      showToast('All students marked PRESENT for today.', 'success');
    });
  }
}

function calculateAttendanceKPI() {
  const activePresent = document.querySelectorAll('.att-btn.p.active').length;
  const total = document.querySelectorAll('.attendance-card-student').length;
  const pct = total > 0 ? ((activePresent / total) * 100).toFixed(1) : '96.4';

  const kpiEl = document.getElementById('attendanceLiveKpi');
  if (kpiEl) kpiEl.textContent = `${pct}%`;
}

function initErpStudentSearch() {
  const searchInput = document.getElementById('erpStudentSearch');
  const table = document.getElementById('erpStudentsTable');
  if (!searchInput || !table) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

function initErpAddStudentModal() {
  const btn = document.getElementById('erpAddStudentBtn');
  const table = document.getElementById('erpStudentsTable');
  if (!btn || !table) return;

  btn.addEventListener('click', () => {
    const sName = prompt('Enter Student Full Name:');
    if (!sName) return;
    const sClass = prompt('Enter Class (e.g. Grade 9-A):') || 'Grade 9-A';
    const sRoll = 'GPS-' + Math.floor(200 + Math.random() * 800);

    const tbody = table.querySelector('tbody');
    if (tbody) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><strong style="color: var(--navy-800);">${sRoll}</strong></td>
        <td>${sName}</td>
        <td>${sClass}</td>
        <td>Syed Ali / Guardian</td>
        <td>0301-2345678</td>
        <td><span class="status-pill status-active">Active</span></td>
        <td><button class="btn btn-sm btn-outline-navy" onclick="alert('Viewing record for ${sName}')">View</button></td>
      `;
      tbody.prepend(newRow);
      showToast(`Student ${sName} added successfully with Roll ${sRoll}!`, 'success');
    }
  });
}

function refreshErpAdmissionsTable() {
  const tableBody = document.getElementById('erpAdmissionsTableBody');
  if (!tableBody) return;

  const defaultApplications = [
    { id: 'GPS-ADM-2024-9041', studentName: 'Imran Khan Larik', fatherName: 'Dr. Abdul Rauf', grade: 'Grade 9', phone: '0300-3456789', date: '01/11/2024', status: 'Pending' },
    { id: 'GPS-ADM-2024-8832', studentName: 'Zehra Batool', fatherName: 'Manzoor Ahmed', grade: 'Playgroup', phone: '0302-8765432', date: '29/10/2024', status: 'Approved' },
    { id: 'GPS-ADM-2024-8519', studentName: 'Fahad Mustafa Solangi', fatherName: 'Mustafa Solangi', grade: 'Grade 6', phone: '0333-7654321', date: '27/10/2024', status: 'Approved' }
  ];

  const localStored = JSON.parse(localStorage.getItem('gps_admission_applications') || '[]');
  const combined = [...localStored, ...defaultApplications];

  tableBody.innerHTML = combined.map((app) => `
    <tr>
      <td><strong style="color: var(--navy-800); font-family: monospace;">${app.id}</strong></td>
      <td><strong>${app.studentName}</strong></td>
      <td>${app.fatherName}</td>
      <td><span class="badge badge-navy">${app.grade}</span></td>
      <td>${app.phone}</td>
      <td>${app.date}</td>
      <td>
        <span class="status-pill ${app.status === 'Approved' ? 'status-approved' : 'status-pending'}">
          ${app.status}
        </span>
      </td>
      <td>
        <div style="display: flex; gap: 0.35rem;">
          <button class="btn btn-sm btn-outline-navy" onclick="changeAppStatus('${app.id}', 'Approved')">Approve</button>
          <button class="btn btn-sm" style="background: var(--navy-50); color: var(--navy-900);" onclick="alert('Applicant details: ${app.studentName}, Guardian: ${app.fatherName}, Phone: ${app.phone}')">View</button>
        </div>
      </td>
    </tr>
  `).join('');

  // Update badge count
  const badge = document.getElementById('admissionsBadgeCount');
  if (badge) badge.textContent = combined.length;
}

window.changeAppStatus = function(appId, newStatus) {
  const localStored = JSON.parse(localStorage.getItem('gps_admission_applications') || '[]');
  const found = localStored.find((a) => a.id === appId);
  if (found) {
    found.status = newStatus;
    localStorage.setItem('gps_admission_applications', JSON.stringify(localStored));
  }
  showToast(`Application ${appId} marked as ${newStatus}!`, 'success');
  refreshErpAdmissionsTable();
};

/* ==========================================================================
   13. TOAST NOTIFICATIONS HELPER
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   14. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
