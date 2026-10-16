
/* =====================================
   MARINE PORTFOLIO - SCROLL REVEALS
   ===================================== */

document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", function () {
    // Elements that will animate when they enter the screen
    const revealTargets = document.querySelectorAll(
        "section, .hero-content, .hero-visual, " +
        ".interest-card, .project-card, .skill-card, " +
        ".profile-card, .education-card, .contact-card"
    );

    // Avoid animating the same element twice
    const uniqueTargets = [...new Set(revealTargets)];

    uniqueTargets.forEach(function (element) {
        element.classList.add("reveal");
    });

    // Animate cards in a slightly staggered sequence
    document.querySelectorAll(
        ".interest-card, .project-card, .skill-card"
    ).forEach(function (card, index) {
        const delay = (index % 4) * 100;
        card.style.setProperty("--reveal-delay", delay + "ms");
    });

    // If the browser doesn't support IntersectionObserver,
    // show every element normally.
    if (!("IntersectionObserver" in window)) {
        uniqueTargets.forEach(function (element) {
            element.classList.add("visible");
        });
        return;
    }

    const observer = new IntersectionObserver(
        function (entries, currentObserver) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    // Reveal each element only once
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    uniqueTargets.forEach(function (element) {
        observer.observe(element);
    });
});


/* ==================================
   LIVE INDIAN STANDARD TIME CLOCK
   ================================== */

document.addEventListener("DOMContentLoaded", function () {
    const timeDisplay = document.getElementById("istTime");
    const dateDisplay = document.getElementById("istDate");

    // Stop safely if the clock panel is not in the HTML
    if (!timeDisplay || !dateDisplay) {
        return;
    }

    // Always use India's time zone, regardless of laptop time zone
    function updateISTClock() {
        const now = new Date();

        timeDisplay.textContent = new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).format(now);

        dateDisplay.textContent = new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(now);
    }

    // Show the time immediately, then update every second
    updateISTClock();
    setInterval(updateISTClock, 1000);
});


/* =========================================
   INTERACTIVE MARINE DASHBOARD TABS
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const dashboard = document.querySelector("#marine-dashboard");

    // Do nothing if the dashboard HTML hasn't been added
    if (!dashboard) {
        return;
    }

    const tabs = dashboard.querySelectorAll(".dashboard-tab");
    const panels = dashboard.querySelectorAll(".dashboard-panel");

    function activateTab(selectedTab) {
        const targetPanelId = selectedTab.dataset.panel;

        tabs.forEach(function (tab) {
            const isActive = tab === selectedTab;

            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
            tab.tabIndex = isActive ? 0 : -1;
        });

        panels.forEach(function (panel) {
            panel.hidden = panel.id !== targetPanelId;
        });
    }

    tabs.forEach(function (tab, index) {
        tab.addEventListener("click", function () {
            activateTab(tab);
        });

        // Keyboard support: left/right arrow keys
        tab.addEventListener("keydown", function (event) {
            let nextIndex = index;

            if (event.key === "ArrowRight") {
                nextIndex = (index + 1) % tabs.length;
            } else if (event.key === "ArrowLeft") {
                nextIndex = (index - 1 + tabs.length) % tabs.length;
            } else {
                return;
            }

            event.preventDefault();
            tabs[nextIndex].focus();
            activateTab(tabs[nextIndex]);
        });
    });

    // Set the first tab as active when the page loads
    if (tabs.length > 0) {
        activateTab(tabs[0]);
    }
});


/* ==========================================
   DARK / LIGHT MODE TOGGLE
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("themeToggle");
    const icon = document.getElementById("themeIcon");
    const label = document.getElementById("themeLabel");

    if (!toggle || !icon || !label) {
        return;
    }

    const root = document.documentElement;
    const storageKey = "marinePortfolioTheme";

    // Start in dark mode unless a theme was saved previously.
    let savedTheme = "dark";

    try {
        const storedTheme = localStorage.getItem(storageKey);

        if (storedTheme === "dark" || storedTheme === "light") {
            savedTheme = storedTheme;
        }
    } catch (error) {
        // The toggle still works if browser storage is unavailable.
    }

    function applyTheme(theme, savePreference) {
        const isLight = theme === "light";

        root.setAttribute("data-theme", isLight ? "light" : "dark");

        // Update the button to show the NEXT available action.
        icon.textContent = isLight ? "☾" : "☀";
        label.textContent = isLight ? "Dark Mode" : "Light Mode";
        toggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark mode" : "Switch to light mode"
        );
        toggle.setAttribute("aria-pressed", String(isLight));

        if (savePreference) {
            try {
                localStorage.setItem(storageKey, isLight ? "light" : "dark");
            } catch (error) {
                // Theme switching remains available for this page session.
            }
        }
    }

    // Apply the saved preference when the page opens.
    applyTheme(savedTheme, false);

    // Switch theme whenever the visitor clicks the button.
    toggle.addEventListener("click", function () {
        const currentTheme = root.getAttribute("data-theme");
        const nextTheme = currentTheme === "light" ? "dark" : "light";

        applyTheme(nextTheme, true);
    });
});


/* ==========================================
   ANIMATED TECHNICAL SKILL BARS
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const skillsSection = document.querySelector(
        ".technical-skills-section"
    );

    if (!skillsSection) {
        return;
    }

    const skillBars = skillsSection.querySelectorAll(".skill-fill");

    skillBars.forEach(function (bar) {
        // Read and validate the percentage from the HTML.
        const rawValue = Number(bar.dataset.progress);
        const progress = Number.isFinite(rawValue)
            ? Math.max(0, Math.min(100, rawValue))
            : 0;

        // Store the target width for the CSS animation.
        bar.style.setProperty("--skill-progress", progress + "%");

        // Accessibility information for assistive technology.
        bar.setAttribute("role", "progressbar");
        bar.setAttribute("aria-valuemin", "0");
        bar.setAttribute("aria-valuemax", "100");
        bar.setAttribute("aria-valuenow", String(progress));
        bar.setAttribute(
            "aria-label",
            bar.id.replace("skill-", "").replaceAll("-", " ") +
            " learning progress"
        );
    });

    function animateSkills() {
        skillBars.forEach(function (bar) {
            bar.classList.add("animated");
        });
    }

    // Fallback for browsers without IntersectionObserver.
    if (!("IntersectionObserver" in window)) {
        animateSkills();
        return;
    }

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateSkills();
                    observer.disconnect();
                }
            });
        },
        {
            threshold: 0.2
        }
    );

    observer.observe(skillsSection);
});

```javascript
/* =====================================
   INTERACTIVE PROJECTS GALLERY
   ===================================== */

document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.querySelector("#project-gallery");

    // Stop safely if the gallery HTML is not present.
    if (!gallery) return;

    const filterButtons = gallery.querySelectorAll(".gallery-filter");
    const projectCards = gallery.querySelectorAll(".gallery-card");
    const openButtons = gallery.querySelectorAll(".project-open");

    const modal = document.querySelector("#projectModal");
    const closeButton = document.querySelector("#closeProjectModal");
    const doneButton = document.querySelector("#doneProjectModal");

    const modalCategory = document.querySelector("#modalProjectCategory");
    const modalTitle = document.querySelector("#modalProjectTitle");
    const modalDescription = document.querySelector("#modalProjectDescription");
    const modalTools = document.querySelector("#modalProjectTools");
    const modalStatus = document.querySelector("#modalProjectStatus");

    if (
        !modal || !closeButton || !doneButton ||
        !modalTitle || !modalDescription ||
        !modalTools || !modalStatus
    ) {
        return;
    }

    // 1. Filter the project cards.
    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedCategory = button.dataset.filter;

            filterButtons.forEach(function (item) {
                const isActive = item === button;
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            projectCards.forEach(function (card) {
                const matches =
                    selectedCategory === "all" ||
                    card.dataset.category === selectedCategory;

                card.hidden = !matches;
            });
        });
    });

    // 2. Open a popup containing the selected project's details.
    let previouslyFocusedElement = null;

    function openProject(button) {
        previouslyFocusedElement = button;

        modalCategory.textContent = button.dataset.category || "PROJECT DETAILS";
        modalTitle.textContent = button.dataset.title || "Project";
        modalDescription.textContent =
            button.dataset.description || "Project information coming soon.";
        modalTools.textContent = button.dataset.tools || "Not specified";
        modalStatus.textContent = button.dataset.status || "Learning project";

        modal.hidden = false;
        document.body.style.overflow = "hidden";
        closeButton.focus();
    }

    // 3. Close the popup and return focus to the previous button.
    function closeProject() {
        modal.hidden = true;
        document.body.style.overflow = "";

        if (
            previouslyFocusedElement &&
            document.contains(previouslyFocusedElement)
        ) {
            previouslyFocusedElement.focus();
        }
    }

    openButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            openProject(button);
        });
    });

    closeButton.addEventListener("click", closeProject);
    doneButton.addEventListener("click", closeProject);

    // Close if the user clicks the dark area outside the popup.
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeProject();
        }
    });

    // Close the popup using the Escape key.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) {
            closeProject();
        }
    });
});
```

```javascript
/* ===== MOBILE NAVIGATION CONTROLLER ===== */

document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.getElementById("menuToggle");
    const navigation = document.getElementById("mainNavigation");

    if (!menuButton || !navigation) return;

    function closeMenu() {
        navigation.classList.remove("open");
        menuButton.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
    }

    menuButton.addEventListener("click", function () {
        const isOpen = navigation.classList.toggle("open");

        menuButton.classList.toggle("active", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navigation.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });
});
```