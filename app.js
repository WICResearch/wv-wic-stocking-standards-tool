const APP_VERSION = "2026.09.24";
let selectedPeerGroup = null;
let currentCategoryIndex = 0;
let assessmentState = {};

document.addEventListener("DOMContentLoaded", () => {
  initializePeerGroupCards();
  trackPageView();
});

function initializePeerGroupCards() {
  const peerCards = document.querySelectorAll(".peer-card");

  peerCards.forEach((card) => {
    card.addEventListener("click", () => {
      const peerGroup = Number(card.dataset.peer);

      if (!peerGroup || !STOCK_REQUIREMENTS[peerGroup]) {
        console.error("Invalid peer group selected:", peerGroup);
        return;
      }

      selectedPeerGroup = peerGroup;
      currentCategoryIndex = 0;
      assessmentState = {};

      trackEvent("peer_group_selected", {
        peer_group: peerGroup,
        peer_group_name: STOCK_REQUIREMENTS[peerGroup].name
      });

      renderAssessment(peerGroup);
    });
  });
}

function renderAssessment(peerGroup) {
  const peerData = STOCK_REQUIREMENTS[peerGroup];

  if (!peerData) {
    return;
  }

  const requirements = peerData.requirements;
  const currentRequirement = requirements[currentCategoryIndex];

  document.body.innerHTML = `
    <div class="assessment-shell">

      <header class="assessment-topbar">
        <div class="assessment-topbar-inner">

          <button
            type="button"
            class="assessment-brand"
            id="returnHomeButton"
            aria-label="Return to StockCheck home"
          >
            <img src="wic-color.jpg" alt="WIC">
            <div>
              <strong>WV WIC</strong>
              <span>StockCheck</span>
            </div>
          </button>

          <div class="assessment-peer-pill">
            <span>Peer Group ${peerGroup}</span>
            <strong>${peerData.name}</strong>
          </div>

        </div>
      </header>

      <main class="assessment-main">

        <section class="assessment-heading">
          <div>
            <span class="section-kicker">STOCK ASSESSMENT</span>
            <h1>Check your current inventory</h1>
            <p>
              Work through each food category and enter the stock
              currently available in your store.
            </p>
          </div>

          <button
            type="button"
            class="change-peer-button"
            id="changePeerButton"
          >
            Change peer group
          </button>
        </section>

        <section class="assessment-progress-card">

          <div class="assessment-progress-copy">
            <div>
              <span class="progress-label">Assessment progress</span>
              <strong id="completedCount">0 of ${requirements.length} checked</strong>
            </div>

            <span id="progressPercent">0%</span>
          </div>

          <div class="assessment-progress-track">
            <div
              class="assessment-progress-fill"
              id="assessmentProgress"
              style="width: 0%"
            ></div>
          </div>

          <div class="assessment-status-summary">

            <div class="summary-stat summary-neutral">
              <span class="summary-stat-number" id="notCheckedCount">
                ${requirements.length}
              </span>
              <span>Not yet checked</span>
            </div>

            <div class="summary-stat summary-success">
              <span class="summary-stat-number" id="meetsCount">0</span>
              <span>Meets requirement</span>
            </div>

            <div class="summary-stat summary-attention">
              <span class="summary-stat-number" id="attentionCount">0</span>
              <span>Needs attention</span>
            </div>

          </div>

        </section>

        <section class="category-nav-wrap">
          <div class="category-nav-heading">
            <div>
              <span class="section-kicker">FOOD CATEGORIES</span>
              <h2>Jump to a category</h2>
            </div>

            <span class="category-count">
              ${requirements.length} categories
            </span>
          </div>

          <div
            class="category-nav"
            id="categoryNav"
          ></div>
        </section>

        <div class="assessment-layout">

          <section
            class="assessment-workspace"
            id="requirementsList"
          >
            ${renderCurrentCategory(
              currentRequirement,
              requirements,
              currentCategoryIndex
            )}
          </section>

          <aside class="assessment-sidebar">

            <div class="sidebar-card">
              <span class="sidebar-kicker">CURRENT PEER GROUP</span>
              <strong>Peer Group ${peerGroup}</strong>
              <p>${peerData.name}</p>
            </div>

            <div class="sidebar-card">
              <span class="sidebar-kicker">HOW TO USE STOCKCHECK</span>

              <div class="sidebar-step">
                <span>1</span>
                <p>
                  Enter the inventory currently available for the
                  category shown.
                </p>
              </div>

              <div class="sidebar-step">
                <span>2</span>
                <p>
                  StockCheck compares your entries with the minimum
                  requirement for your peer group.
                </p>
              </div>

              <div class="sidebar-step">
                <span>3</span>
                <p>
                  Continue through all categories and review your
                  results when finished.
                </p>
              </div>
            </div>

            <div class="sidebar-card sidebar-help-card">
              <span class="sidebar-kicker">REMINDER</span>
              <p>
                StockCheck is a self-check tool. Always refer to
                current West Virginia WIC vendor guidance for
                official program requirements.
              </p>
            </div>

          </aside>

        </div>

      </main>

    </div>
  `;

  renderCategoryNavigation(requirements);
  initializeAssessmentEvents(requirements);
  restoreCurrentCategoryValues(currentRequirement);
  updateAssessmentSummary();
}

function renderCategoryNavigation(requirements) {
  const categoryNav = document.getElementById("categoryNav");

  if (!categoryNav) {
    return;
  }

  categoryNav.innerHTML = requirements
    .map((requirement, index) => {
      const state = assessmentState[requirement.id];
      const isCurrent = index === currentCategoryIndex;

      let statusClass = "";
      let statusSymbol = "";

      if (state?.result === "meets") {
        statusClass = "nav-success";
        statusSymbol = "✓";
      } else if (state?.result === "attention") {
        statusClass = "nav-attention";
        statusSymbol = "!";
      }

      return `
        <button
          type="button"
          class="
            category-nav-item
            ${isCurrent ? "active" : ""}
            ${statusClass}
          "
          data-category-index="${index}"
        >
          <span class="category-nav-symbol">
            ${statusSymbol || index + 1}
          </span>

          <span class="category-nav-name">
            ${requirement.category}
          </span>
        </button>
      `;
    })
    .join("");

  categoryNav
    .querySelectorAll(".category-nav-item")
    .forEach((button) => {
      button.addEventListener("click", () => {
        saveCurrentCategoryValues(requirements[currentCategoryIndex]);

        currentCategoryIndex =
          Number(button.dataset.categoryIndex);

        renderAssessment(selectedPeerGroup);
      });
    });
}

function renderCurrentCategory(
  requirement,
  requirements,
  categoryIndex
) {
  const storedState = assessmentState[requirement.id];
  const result = storedState?.result || "not-checked";

  let statusClass = "status-not-checked";
  let statusText = "Not Yet Checked";
  let statusSymbol = "○";

  if (result === "meets") {
    statusClass = "status-success";
    statusText = "Meets Requirement";
    statusSymbol = "✓";
  } else if (result === "attention") {
    statusClass = "status-attention";
    statusText = "Needs Attention";
    statusSymbol = "!";
  }

  return `
    <article
      class="guided-category-card requirement-card"
      data-requirement="${requirement.id}"
    >

      <div class="guided-category-header">

        <div>
          <span class="requirement-label">
            Category ${categoryIndex + 1} of ${requirements.length}
          </span>

          <h2>${requirement.category}</h2>
        </div>

        <div
          class="requirement-status ${statusClass}"
          id="status-${requirement.id}"
        >
          <span class="status-symbol">${statusSymbol}</span>
          <span>${statusText}</span>
        </div>

      </div>

      <div class="minimum-box">
        <span class="minimum-label">
          MINIMUM REQUIREMENT
        </span>

        <p>
          ${getRequirementSummary(requirement)}
        </p>
      </div>

      ${
        requirement.note
          ? `
            <div class="requirement-note">
              <span class="requirement-note-icon">i</span>

              <div class="requirement-note-content">
                <strong class="requirement-note-title">
                  STOCKING DETAILS
                </strong>

                <p>
                  ${requirement.note}
                </p>
              </div>
            </div>
          `
          : ""
      }

      <section class="inventory-section">

        <div class="inventory-section-heading">
          <div>
            <span class="section-kicker">
              CURRENT INVENTORY
            </span>

            <h3>What do you currently have in stock?</h3>
          </div>

          <span class="inventory-helper">
            Enter numbers only
          </span>
        </div>

        ${buildInventoryFields(requirement)}

      </section>

      <div class="guided-category-actions">

        <button
          type="button"
          class="secondary-button"
          id="previousCategoryButton"
          ${categoryIndex === 0 ? "disabled" : ""}
        >
          ← Previous
        </button>

        <div class="category-position">
          ${categoryIndex + 1} / ${requirements.length}
        </div>

        ${
          categoryIndex < requirements.length - 1
            ? `
              <button
                type="button"
                class="primary-button"
                id="nextCategoryButton"
              >
                Next Category →
              </button>
            `
            : `
              <button
                type="button"
                class="primary-button"
                id="viewResultsButton"
              >
                View Stock Results →
              </button>
            `
        }

      </div>

    </article>
  `;
}

function buildInventoryFields(requirement) {
  switch (requirement.type) {

    case "standard":
      return `
        <div class="inventory-grid">

          ${
            requirement.varieties !== undefined
              ? numberField(
                  requirement.id,
                  "varieties",
                  "Varieties in stock",
                  `Minimum: ${requirement.varieties}`
                )
              : ""
          }

          ${numberField(
            requirement.id,
            "quantity",
            "Quantity in stock",
            `Minimum: ${requirement.minimum} ${requirement.unit}`
          )}

        </div>
      `;

    case "formula":
    case "formula-request":
      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "quantity",
            "Total qualifying containers",
            `Minimum: ${requirement.minimum}`
          )}

        </div>
      `;

    case "infant-produce":
      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "varieties",
            "Varieties in stock",
            `Minimum: ${requirement.varieties}`
          )}

          ${numberField(
            requirement.id,
            "single",
            "Single containers in stock",
            `Minimum: ${requirement.singleMinimum}`
          )}

          ${numberField(
            requirement.id,
            "twoPack",
            "2-pack containers in stock",
            `Minimum: ${requirement.twoPackMinimum}`
          )}

        </div>
      `;

    case "yogurt":
      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "varieties",
            "Varieties in stock",
            `Minimum: ${requirement.varieties}`
          )}

          ${numberField(
            requirement.id,
            "wholeFat",
            "Whole-fat containers",
            `Minimum: ${requirement.wholeFatMinimum}`
          )}

          ${numberField(
            requirement.id,
            "lowFat",
            "Low-fat containers",
            `Minimum: ${requirement.lowFatMinimum}`
          )}

        </div>
      `;

    case "either-size":
      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "varieties",
            "Varieties in stock",
            `Minimum: ${requirement.varieties}`
          )}

          ${numberField(
            requirement.id,
            "sizeOne",
            requirement.options[0].size,
            `Minimum if using this size: ${requirement.options[0].minimum}`
          )}

          ${numberField(
            requirement.id,
            "sizeTwo",
            requirement.options[1].size,
            `Minimum if using this size: ${requirement.options[1].minimum}`
          )}

        </div>
      `;

    case "cereal":
      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "varieties",
            "Total varieties",
            `Minimum: ${requirement.varieties}`
          )}

          ${numberField(
            requirement.id,
            "quantity",
            "Boxes or bags",
            `Minimum: ${requirement.minimum}`
          )}

          ${numberField(
            requirement.id,
            "wholeGrain",
            "Whole-grain varieties",
            `Minimum: ${requirement.wholeGrainVarieties}`
          )}

        </div>
      `;

    case "beans":
      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "varieties",
            "Varieties in stock",
            `Minimum: ${requirement.varieties}`
          )}

          ${numberField(
            requirement.id,
            "dried",
            "Dried packages",
            `Minimum if used alone: ${requirement.driedMinimum}`
          )}

          ${numberField(
            requirement.id,
            "canned",
            "Cans",
            `Minimum if used alone: ${requirement.cannedMinimum}`
          )}

        </div>
      `;

    case "whole-grain":
      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "varieties",
            "Total varieties",
            `Minimum: ${requirement.varieties}`
          )}

          ${numberField(
            requirement.id,
            "quantity",
            "Total packages",
            `Minimum: ${requirement.minimum}`
          )}

          ${numberField(
            requirement.id,
            "breadVarieties",
            "Bread varieties",
            `Minimum: ${requirement.breadVarieties}`
          )}

        </div>
      `;

    case "milk-pg1":
    case "milk-pg2":
    case "milk-pg3": {
      const typeMinimum =
        requirement.type === "milk-pg1"
          ? requirement.milkTypes.length
          : (
              requirement.statedTypeCount ??
              requirement.varieties ??
              requirement.milkTypes.length
            );

      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "quantity",
            "Total qualifying gallons",
            `Minimum: ${requirement.minimum}`
          )}

          ${numberField(
            requirement.id,
            "milkTypes",
            "Qualifying milk types in stock",
            `Minimum: ${typeMinimum}`
          )}

          ${numberField(
            requirement.id,
            "sizes",
            "Container sizes in stock",
            `Minimum: ${requirement.sizesRequired}`
          )}

        </div>
      `;
    }

    case "split-milk":
      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "varieties",
            "Qualifying milk types",
            `Minimum: ${requirement.varieties}`
          )}

          ${numberField(
            requirement.id,
            "whole",
            "Whole milk gallons",
            `Minimum: ${requirement.wholeMinimum}`
          )}

          ${numberField(
            requirement.id,
            "lowFat",
            "Low-fat / fat-free gallons",
            `Minimum: ${requirement.lowFatMinimum}`
          )}

        </div>
      `;

    case "produce-and":
      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "varieties",
            "Total varieties",
            `Minimum: ${requirement.varieties}`
          )}

          ${numberField(
            requirement.id,
            "subcategories",
            "Subcategories represented",
            `Minimum: ${requirement.subcategories}`
          )}

          ${
            requirement.freshVarieties !== undefined
              ? numberField(
                  requirement.id,
                  "freshVarieties",
                  "Fresh varieties",
                  `Minimum: ${requirement.freshVarieties}`
                )
              : ""
          }

          ${numberField(
            requirement.id,
            "freshPounds",
            "Fresh pounds",
            `Minimum: ${requirement.freshPounds} lb`
          )}

          ${numberField(
            requirement.id,
            "canned",
            "Cans",
            `Additional option minimum: ${requirement.cannedMinimum}`
          )}

          ${numberField(
            requirement.id,
            "frozen",
            "Frozen bags",
            `Additional option minimum: ${requirement.frozenMinimum}`
          )}

          ${numberField(
            requirement.id,
            "dollarValue",
            "Dollar value",
            `Additional option minimum: $${requirement.dollarMinimum}`
          )}

        </div>
      `;

    case "produce-or":
      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "varieties",
            "Varieties in stock",
            `Minimum: ${requirement.varieties}`
          )}

          ${numberField(
            requirement.id,
            "freshPounds",
            "Fresh pounds",
            `Option minimum: ${requirement.freshPounds} lb`
          )}

          ${numberField(
            requirement.id,
            "canned",
            "Cans",
            `Option minimum: ${requirement.cannedMinimum}`
          )}

          ${numberField(
            requirement.id,
            "frozen",
            "Frozen bags",
            `Option minimum: ${requirement.frozenMinimum}`
          )}

          ${numberField(
            requirement.id,
            "dollarValue",
            "Dollar value",
            `Option minimum: $${requirement.dollarMinimum}`
          )}

        </div>
      `;

    default:
      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "quantity",
            "Quantity in stock",
            "Enter current stock"
          )}

        </div>
      `;
  }
}

function numberField(
  requirementId,
  field,
  label,
  helper
) {
  return `
    <label class="inventory-field">

      <span class="inventory-field-label">
        ${label}
      </span>

      <input
        type="number"
        min="0"
        step="1"
        inputmode="numeric"
        data-requirement="${requirementId}"
        data-field="${field}"
        placeholder="0"
      >

      ${
        helper
          ? `<small>${helper}</small>`
          : ""
      }

    </label>
  `;
}
/* =========================================================
   ASSESSMENT EVENTS
   ========================================================= */

function initializeAssessmentEvents(requirements) {

  const returnHomeButton =
    document.getElementById("returnHomeButton");

  const changePeerButton =
    document.getElementById("changePeerButton");

  const previousButton =
    document.getElementById("previousCategoryButton");

  const nextButton =
    document.getElementById("nextCategoryButton");

  const resultsButton =
    document.getElementById("viewResultsButton");

  const inputs = document.querySelectorAll(
    'input[data-requirement]'
  );

  inputs.forEach((input) => {

    input.addEventListener("input", () => {
      saveCurrentCategoryValues(
        requirements[currentCategoryIndex]
      );

      updateCurrentCategoryStatus(
        requirements[currentCategoryIndex]
      );

      updateAssessmentSummary();
      renderCategoryNavigation(requirements);
    });

    input.addEventListener("change", () => {
      saveCurrentCategoryValues(
        requirements[currentCategoryIndex]
      );

      updateCurrentCategoryStatus(
        requirements[currentCategoryIndex]
      );

      updateAssessmentSummary();
      renderCategoryNavigation(requirements);
    });

  });

  if (previousButton) {
    previousButton.addEventListener("click", () => {

      saveCurrentCategoryValues(
        requirements[currentCategoryIndex]
      );

      if (currentCategoryIndex > 0) {
        currentCategoryIndex -= 1;
        renderAssessment(selectedPeerGroup);
      }

    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {

      saveCurrentCategoryValues(
        requirements[currentCategoryIndex]
      );

      if (
        currentCategoryIndex <
        requirements.length - 1
      ) {
        currentCategoryIndex += 1;
        renderAssessment(selectedPeerGroup);
      }

    });
  }

  if (resultsButton) {
    resultsButton.addEventListener("click", () => {

      saveCurrentCategoryValues(
        requirements[currentCategoryIndex]
      );

      renderResults();
    });
  }

  if (changePeerButton) {
    changePeerButton.addEventListener("click", () => {
      window.location.reload();
    });
  }

  if (returnHomeButton) {
    returnHomeButton.addEventListener("click", () => {
      window.location.reload();
    });
  }
}


/* =========================================================
   SAVE CURRENT CATEGORY
   ========================================================= */

function saveCurrentCategoryValues(requirement) {

  if (!requirement) {
    return;
  }

  const inputs = document.querySelectorAll(
    `[data-requirement="${requirement.id}"]`
  );

  const values = {};

  inputs.forEach((input) => {

    const field = input.dataset.field;

    if (!field) {
      return;
    }

    if (input.type === "checkbox") {
      values[field] = input.checked;
    } else {
      values[field] = input.value;
    }

  });

  const hasEntry = Object.values(values).some((value) => {
    return (
      value === true ||
      (
        value !== "" &&
        value !== null &&
        value !== undefined
      )
    );
  });

  let result = "not-checked";

  if (hasEntry) {
    result = evaluateRequirement(
      requirement,
      values
    );
  }

  assessmentState[requirement.id] = {
    values,
    result
  };

  trackEvent("category_checked", {
    peer_group: selectedPeerGroup,
    category: requirement.category,
    requirement_id: requirement.id,
    result
  });
}


/* =========================================================
   RESTORE CATEGORY VALUES
   ========================================================= */

function restoreCurrentCategoryValues(requirement) {

  if (!requirement) {
    return;
  }

  const stored =
    assessmentState[requirement.id];

  if (!stored?.values) {
    return;
  }

  Object.entries(stored.values)
    .forEach(([field, value]) => {

      const input = document.querySelector(
        `[data-requirement="${requirement.id}"][data-field="${field}"]`
      );

      if (!input) {
        return;
      }

      if (input.type === "checkbox") {
        input.checked = Boolean(value);
      } else {
        input.value = value;
      }

    });
}


/* =========================================================
   CURRENT CATEGORY STATUS
   ========================================================= */

function updateCurrentCategoryStatus(requirement) {

  if (!requirement) {
    return;
  }

  const stored =
    assessmentState[requirement.id];

  const result =
    stored?.result || "not-checked";

  const status =
    document.getElementById(
      `status-${requirement.id}`
    );

  if (!status) {
    return;
  }

  status.classList.remove(
    "status-not-checked",
    "status-success",
    "status-attention"
  );

  if (result === "meets") {

    status.classList.add(
      "status-success"
    );

    status.innerHTML = `
      <span class="status-symbol">✓</span>
      <span>Meets Requirement</span>
    `;

  } else if (result === "attention") {

    status.classList.add(
      "status-attention"
    );

    status.innerHTML = `
      <span class="status-symbol">!</span>
      <span>Needs Attention</span>
    `;

  } else {

    status.classList.add(
      "status-not-checked"
    );

    status.innerHTML = `
      <span class="status-symbol">○</span>
      <span>Not Yet Checked</span>
    `;

  }
}


/* =========================================================
   ASSESSMENT SUMMARY
   ========================================================= */

function updateAssessmentSummary() {

  if (!selectedPeerGroup) {
    return;
  }

  const requirements =
    STOCK_REQUIREMENTS[
      selectedPeerGroup
    ]?.requirements || [];

  let meets = 0;
  let attention = 0;
  let notChecked = 0;

  requirements.forEach((requirement) => {

    const result =
      assessmentState[
        requirement.id
      ]?.result || "not-checked";

    if (result === "meets") {
      meets += 1;
    } else if (result === "attention") {
      attention += 1;
    } else {
      notChecked += 1;
    }

  });

  const completed =
    meets + attention;

  const total =
    requirements.length;

  const percent =
    total > 0
      ? Math.round(
          (completed / total) * 100
        )
      : 0;

  const notCheckedCount =
    document.getElementById(
      "notCheckedCount"
    );

  const meetsCount =
    document.getElementById(
      "meetsCount"
    );

  const attentionCount =
    document.getElementById(
      "attentionCount"
    );

  const completedCount =
    document.getElementById(
      "completedCount"
    );

  const progressPercent =
    document.getElementById(
      "progressPercent"
    );

  const assessmentProgress =
    document.getElementById(
      "assessmentProgress"
    );

  if (notCheckedCount) {
    notCheckedCount.textContent =
      notChecked;
  }

  if (meetsCount) {
    meetsCount.textContent =
      meets;
  }

  if (attentionCount) {
    attentionCount.textContent =
      attention;
  }

  if (completedCount) {
    completedCount.textContent =
      `${completed} of ${total} checked`;
  }

  if (progressPercent) {
    progressPercent.textContent =
      `${percent}%`;
  }

  if (assessmentProgress) {
    assessmentProgress.style.width =
      `${percent}%`;
  }
}


/* =========================================================
   REQUIREMENT EVALUATION
   ========================================================= */

function evaluateRequirement(
  requirement,
  values
) {

  const v = (key) =>
    Number(values[key] || 0);

  switch (requirement.type) {

    /* -------------------------
       STANDARD
       ------------------------- */

    case "standard":
      return (
        (
          requirement.varieties ===
            undefined ||
          v("varieties") >=
            Number(
              requirement.varieties || 0
            )
        ) &&
        v("quantity") >=
          Number(
            requirement.minimum || 0
          )
      )
        ? "meets"
        : "attention";


    /* -------------------------
       FORMULA
       ------------------------- */

    case "formula":
    case "formula-request":
      return (
        v("quantity") >=
        Number(
          requirement.minimum || 0
        )
      )
        ? "meets"
        : "attention";


    /* -------------------------
       INFANT FRUITS /
       INFANT VEGETABLES
       ------------------------- */

    case "infant-produce": {

      const varietiesOK =
        v("varieties") >=
        Number(
          requirement.varieties || 0
        );

      const singleOK =
        v("single") >=
        Number(
          requirement.singleMinimum || 0
        );

      const twoPackOK =
        v("twoPack") >=
        Number(
          requirement.twoPackMinimum || 0
        );

      return (
        varietiesOK &&
        (
          singleOK ||
          twoPackOK
        )
      )
        ? "meets"
        : "attention";
    }


    /* -------------------------
       YOGURT
       PG 1–2
       ------------------------- */

    case "yogurt":
      return (
        v("varieties") >=
          Number(
            requirement.varieties || 0
          ) &&

        v("wholeFat") >=
          Number(
            requirement.wholeFatMinimum || 0
          ) &&

        v("lowFat") >=
          Number(
            requirement.lowFatMinimum || 0
          )
      )
        ? "meets"
        : "attention";


    /* -------------------------
       CHEESE
       ------------------------- */

    case "either-size": {

      const varietiesOK =
        v("varieties") >=
        Number(
          requirement.varieties || 0
        );

      const firstMinimum =
        Number(
          requirement.options?.[0]
            ?.minimum || 0
        );

      const secondMinimum =
        Number(
          requirement.options?.[1]
            ?.minimum || 0
        );

      /*
        This allows equivalent mixed stock.

        Example:
        If the requirement is either
        4 smaller packages OR
        2 larger packages,

        then:
        2 smaller + 1 larger
        equals one complete minimum.
      */

      const firstEquivalent =
        firstMinimum > 0
          ? (
              v("sizeOne") /
              firstMinimum
            )
          : 0;

      const secondEquivalent =
        secondMinimum > 0
          ? (
              v("sizeTwo") /
              secondMinimum
            )
          : 0;

      const quantityOK =
        (
          firstEquivalent +
          secondEquivalent
        ) >= 1;

      return (
        varietiesOK &&
        quantityOK
      )
        ? "meets"
        : "attention";
    }


    /* -------------------------
       BREAKFAST CEREAL
       ------------------------- */

    case "cereal":
      return (
        v("varieties") >=
          Number(
            requirement.varieties || 0
          ) &&

        v("quantity") >=
          Number(
            requirement.minimum || 0
          ) &&

        v("wholeGrain") >=
          Number(
            requirement
              .wholeGrainVarieties || 0
          )
      )
        ? "meets"
        : "attention";


    /* -------------------------
       DRIED / CANNED BEANS
       ------------------------- */

    case "beans": {

      const varietiesOK =
        v("varieties") >=
        Number(
          requirement.varieties || 0
        );

      const driedMinimum =
        Number(
          requirement.driedMinimum || 0
        );

      const cannedMinimum =
        Number(
          requirement.cannedMinimum || 0
        );

      /*
        Like cheese, the two stock
        formats are treated as equivalent
        portions of the minimum.
      */

      const driedEquivalent =
        driedMinimum > 0
          ? (
              v("dried") /
              driedMinimum
            )
          : 0;

      const cannedEquivalent =
        cannedMinimum > 0
          ? (
              v("canned") /
              cannedMinimum
            )
          : 0;

      const quantityOK =
        (
          driedEquivalent +
          cannedEquivalent
        ) >= 1;

      return (
        varietiesOK &&
        quantityOK
      )
        ? "meets"
        : "attention";
    }


    /* -------------------------
       WHOLE GRAINS
       PG 1–3
       ------------------------- */

    case "whole-grain":
      return (
        v("varieties") >=
          Number(
            requirement.varieties || 0
          ) &&

        v("quantity") >=
          Number(
            requirement.minimum || 0
          ) &&

        v("breadVarieties") >=
          Number(
            requirement.breadVarieties || 0
          )
      )
        ? "meets"
        : "attention";


    /* -------------------------
       MILK
       PEER GROUPS 1–3
       ------------------------- */

    case "milk-pg1":
    case "milk-pg2":
    case "milk-pg3": {

      /*
        PG1 explicitly lists five
        required milk types.

        PG2 and PG3 contain a discrepancy
        in the requirements data between
        the stated type count and the
        number of types listed.

        We therefore use statedTypeCount
        for PG2/PG3 rather than silently
        increasing their requirement.
      */

      const typeMinimum =
        requirement.type ===
          "milk-pg1"
          ? requirement.milkTypes.length
          : (
              requirement.statedTypeCount ??
              requirement.varieties ??
              requirement.milkTypes.length
            );

      const quantityOK =
        v("quantity") >=
        Number(
          requirement.minimum || 0
        );

      const typesOK =
        v("milkTypes") >=
        Number(
          typeMinimum || 0
        );

      const sizesOK =
        v("sizes") >=
        Number(
          requirement.sizesRequired || 0
        );

      return (
        quantityOK &&
        typesOK &&
        sizesOK
      )
        ? "meets"
        : "attention";
    }


    /* -------------------------
       MILK
       PEER GROUPS 4–6
       ------------------------- */

    case "split-milk":
      return (
        v("varieties") >=
          Number(
            requirement.varieties || 0
          ) &&

        v("whole") >=
          Number(
            requirement.wholeMinimum || 0
          ) &&

        v("lowFat") >=
          Number(
            requirement.lowFatMinimum || 0
          )
      )
        ? "meets"
        : "attention";


    /* -------------------------
       FRUITS / VEGETABLES
       PEER GROUPS 1–4
       ------------------------- */

    case "produce-and": {

      const varietiesOK =
        v("varieties") >=
        Number(
          requirement.varieties || 0
        );

      const subcategoriesOK =
        v("subcategories") >=
        Number(
          requirement.subcategories || 0
        );

      const freshPoundsOK =
        v("freshPounds") >=
        Number(
          requirement.freshPounds || 0
        );

      const freshVarietiesOK =
        requirement.freshVarieties ===
          undefined ||
        v("freshVarieties") >=
          Number(
            requirement.freshVarieties || 0
          );

      /*
        These peer groups require the
        fresh minimum PLUS one additional
        canned, frozen, or dollar-value
        minimum.
      */

      const additionalStockOK =
        v("canned") >=
          Number(
            requirement.cannedMinimum || 0
          ) ||

        v("frozen") >=
          Number(
            requirement.frozenMinimum || 0
          ) ||

        v("dollarValue") >=
          Number(
            requirement.dollarMinimum || 0
          );

      return (
        varietiesOK &&
        subcategoriesOK &&
        freshVarietiesOK &&
        freshPoundsOK &&
        additionalStockOK
      )
        ? "meets"
        : "attention";
    }


    /* -------------------------
       FRUITS / VEGETABLES
       PEER GROUPS 5–6
       ------------------------- */

    case "produce-or": {

      const varietiesOK =
        v("varieties") >=
        Number(
          requirement.varieties || 0
        );

      const quantityOK =
        v("freshPounds") >=
          Number(
            requirement.freshPounds || 0
          ) ||

        v("canned") >=
          Number(
            requirement.cannedMinimum || 0
          ) ||

        v("frozen") >=
          Number(
            requirement.frozenMinimum || 0
          ) ||

        v("dollarValue") >=
          Number(
            requirement.dollarMinimum || 0
          );

      return (
        varietiesOK &&
        quantityOK
      )
        ? "meets"
        : "attention";
    }


    /* -------------------------
       FALLBACK
       ------------------------- */

    default:
      return (
        v("quantity") >=
        Number(
          requirement.minimum || 0
        )
      )
        ? "meets"
        : "attention";
  }
}


/* =========================================================
   REQUIREMENT SUMMARY TEXT
   ========================================================= */

function getRequirementSummary(requirement) {

  switch (requirement.type) {

    case "standard":
      return `${
        requirement.varieties !== undefined
          ? `At least ${requirement.varieties} ${pluralize(
              "variety",
              requirement.varieties
            )} and `
          : ""
      }${requirement.minimum} ${requirement.unit}.`;


    case "formula":
      return `
        ${requirement.minimum} ${requirement.unit}
        across the required contract formulas.
        One representative container of each required
        formula must be available.
      `;


    case "formula-request":
      return `
        ${requirement.minimum} ${requirement.unit}
        across the required contract formulas.
      `;


    case "infant-produce":
      return `
        At least ${requirement.varieties}
        ${pluralize(
          "variety",
          requirement.varieties
        )} and either
        ${requirement.singleMinimum}
        single containers OR
        ${requirement.twoPackMinimum}
        2-packs.
      `;


    case "yogurt":
      return `
        At least ${requirement.varieties}
        ${pluralize(
          "variety",
          requirement.varieties
        )},
        ${requirement.wholeFatMinimum}
        whole-fat containers AND
        ${requirement.lowFatMinimum}
        low-fat containers.
      `;


    case "either-size":
      return `
        At least ${requirement.varieties}
        ${pluralize(
          "variety",
          requirement.varieties
        )} and either
        ${requirement.options[0].minimum}
        ${requirement.options[0].size}
        OR
        ${requirement.options[1].minimum}
        ${requirement.options[1].size}.
      `;


    case "cereal":
      return `
        At least ${requirement.varieties}
        ${pluralize(
          "variety",
          requirement.varieties
        )} and
        ${requirement.minimum}
        ${requirement.unit}.
        At least
        ${requirement.wholeGrainVarieties}
        ${pluralize(
          "variety",
          requirement.wholeGrainVarieties
        )}
        must be whole grain.
      `;


    case "beans":
      return `
        At least ${requirement.varieties}
        ${pluralize(
          "variety",
          requirement.varieties
        )} and either
        ${requirement.driedMinimum}
        ${requirement.driedSize}
        of dried beans OR
        ${requirement.cannedMinimum}
        ${requirement.cannedSize}.
      `;


    case "whole-grain":
      return `
        At least ${requirement.varieties}
        ${pluralize(
          "variety",
          requirement.varieties
        )} and
        ${requirement.minimum}
        ${requirement.unit}.
        At least
        ${requirement.breadVarieties}
        ${pluralize(
          "variety",
          requirement.breadVarieties
        )}
        must be bread.
      `;


    case "milk-pg1":
      return `
        ${requirement.minimum}
        ${requirement.unit};
        all ${requirement.milkTypes.length}
        listed milk types must be represented,
        with at least
        ${requirement.sizesRequired}
        container sizes.
      `;


    case "milk-pg2":
    case "milk-pg3": {

      const typeMinimum =
        requirement.statedTypeCount ??
        requirement.varieties ??
        requirement.milkTypes.length;

      return `
        ${requirement.minimum}
        ${requirement.unit};
        at least ${typeMinimum}
        qualifying milk types,
        with at least
        ${requirement.sizesRequired}
        container sizes.
      `;
    }


    case "split-milk":
      return `
        At least ${requirement.varieties}
        approved milk types,
        including
        ${requirement.wholeMinimum}
        ${pluralize(
          "gallon",
          requirement.wholeMinimum
        )}
        of whole milk AND
        ${requirement.lowFatMinimum}
        gallons of low-fat and/or
        fat-free milk.
      `;


    case "produce-and": {

      const freshVarietyText =
        requirement.freshVarieties !==
          undefined
          ? `,
            including at least
            ${requirement.freshVarieties}
            fresh ${pluralize(
              "variety",
              requirement.freshVarieties
            )}`
          : "";

      return `
        At least ${requirement.varieties}
        total ${pluralize(
          "variety",
          requirement.varieties
        )}
        across at least
        ${requirement.subcategories}
        subcategories${freshVarietyText};
        at least
        ${requirement.freshPounds}
        pounds fresh AND one additional
        minimum:
        ${requirement.cannedMinimum}
        cans,
        ${requirement.frozenMinimum}
        frozen bags,
        OR $${requirement.dollarMinimum}
        value.
      `;
    }


    case "produce-or":
      return `
        At least ${requirement.varieties}
        ${pluralize(
          "variety",
          requirement.varieties
        )}
        and either
        ${requirement.freshPounds}
        pounds fresh,
        ${requirement.cannedMinimum}
        cans,
        ${requirement.frozenMinimum}
        frozen bags,
        OR $${requirement.dollarMinimum}
        value.
      `;


    default:
      return (
        requirement.minimum !== undefined
          ? `
            ${requirement.minimum}
            ${
              requirement.unit ||
              "qualifying items"
            }.
          `
          : `
            Meet the minimum stocking
            requirement shown.
          `
      );
  }
}


/* =========================================================
   HELPERS
   ========================================================= */

function pluralize(
  word,
  quantity
) {
  return Number(quantity) === 1
    ? word
    : `${word}s`;
}

function escapeHtml(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
/* =========================================================
   RESULTS
   ========================================================= */

function renderResults() {

  if (!selectedPeerGroup) {
    return;
  }

  const peerData =
    STOCK_REQUIREMENTS[selectedPeerGroup];

  if (!peerData) {
    return;
  }

  const requirements =
    peerData.requirements;

  /*
    Make sure the category currently
    on screen is saved before building
    the results.
  */

  const currentRequirement =
    requirements[currentCategoryIndex];

  if (currentRequirement) {
    saveCurrentCategoryValues(
      currentRequirement
    );
  }

  let meets = 0;
  let attention = 0;
  let notChecked = 0;

  requirements.forEach(
    (requirement) => {

      const result =
        assessmentState[
          requirement.id
        ]?.result || "not-checked";

      if (result === "meets") {
        meets += 1;
      } else if (
        result === "attention"
      ) {
        attention += 1;
      } else {
        notChecked += 1;
      }

    }
  );

  const completed =
    meets + attention;

  const total =
    requirements.length;

  const percent =
    total > 0
      ? Math.round(
          (completed / total) * 100
        )
      : 0;

  trackEvent(
    "assessment_results_viewed",
    {
      peer_group:
        selectedPeerGroup,

      peer_group_name:
        peerData.name,

      total_categories:
        total,

      completed_categories:
        completed,

      meets_requirement:
        meets,

      needs_attention:
        attention,

      not_checked:
        notChecked
    }
  );

  document.body.innerHTML = `
    <div class="assessment-shell results-shell">

      <header class="assessment-topbar">

        <div class="assessment-topbar-inner">

          <button
            type="button"
            class="assessment-brand"
            id="resultsHomeButton"
            aria-label="Return to StockCheck home"
          >

            <img
              src="wic-color.jpg"
              alt="WIC"
            >

            <div>
              <strong>WV WIC</strong>
              <span>StockCheck</span>
            </div>

          </button>

          <div class="assessment-peer-pill">

            <span>
              Peer Group
              ${selectedPeerGroup}
            </span>

            <strong>
              ${peerData.name}
            </strong>

          </div>

        </div>

      </header>


      <main class="assessment-main results-main">

        <section class="results-hero">

          <span class="section-kicker">
            ASSESSMENT SUMMARY
          </span>

          <h1>
            Your StockCheck results
          </h1>

          <p>
            Review each category below.
            Categories marked
            <strong>Needs Attention</strong>
            may require additional stock
            before your store meets the
            minimum requirement shown.
          </p>

        </section>


        <section class="results-overview-card">

          <div class="results-overview-heading">

            <div>

              <span class="progress-label">
                Assessment progress
              </span>

              <strong>
                ${completed} of
                ${total} checked
              </strong>

            </div>

            <span>
              ${percent}%
            </span>

          </div>


          <div class="assessment-progress-track">

            <div
              class="assessment-progress-fill"
              style="width: ${percent}%"
            ></div>

          </div>


          <div class="assessment-status-summary">

            <div
              class="
                summary-stat
                summary-success
              "
            >

              <span
                class="summary-stat-number"
              >
                ${meets}
              </span>

              <span>
                Meets requirement
              </span>

            </div>


            <div
              class="
                summary-stat
                summary-attention
              "
            >

              <span
                class="summary-stat-number"
              >
                ${attention}
              </span>

              <span>
                Needs attention
              </span>

            </div>


            <div
              class="
                summary-stat
                summary-neutral
              "
            >

              <span
                class="summary-stat-number"
              >
                ${notChecked}
              </span>

              <span>
                Not yet checked
              </span>

            </div>

          </div>

        </section>


        ${
          notChecked > 0
            ? `
              <section class="results-notice">

                <span>i</span>

                <div>

                  <strong>
                    Your assessment
                    is not complete.
                  </strong>

                  <p>
                    ${notChecked}
                    ${
                      notChecked === 1
                        ? "category has"
                        : "categories have"
                    }
                    not yet been checked.
                    You can return to the
                    assessment to finish
                    entering your inventory.
                  </p>

                </div>

              </section>
            `
            : ""
        }


        <section class="results-list-section">

          <div class="results-section-heading">

            <div>

              <span class="section-kicker">
                CATEGORY RESULTS
              </span>

              <h2>
                Review your inventory
              </h2>

            </div>

          </div>


          <div class="results-category-list">

            ${requirements
              .map(
                (
                  requirement,
                  index
                ) => {

                  const stored =
                    assessmentState[
                      requirement.id
                    ];

                  const result =
                    stored?.result ||
                    "not-checked";

                  let statusClass =
                    "status-not-checked";

                  let statusText =
                    "Not Yet Checked";

                  let statusSymbol =
                    "○";

                  if (
                    result === "meets"
                  ) {

                    statusClass =
                      "status-success";

                    statusText =
                      "Meets Requirement";

                    statusSymbol =
                      "✓";

                  } else if (
                    result ===
                    "attention"
                  ) {

                    statusClass =
                      "status-attention";

                    statusText =
                      "Needs Attention";

                    statusSymbol =
                      "!";

                  }

                  return `
                    <article
                      class="
                        result-category-card
                        ${statusClass}
                      "
                    >

                      <div
                        class="
                          result-category-main
                        "
                      >

                        <span
                          class="
                            result-category-number
                          "
                        >
                          ${index + 1}
                        </span>

                        <div
                          class="
                            result-category-copy
                          "
                        >

                          <h3>
                            ${
                              requirement
                                .category
                            }
                          </h3>

                          <p>
                            ${getRequirementSummary(
                              requirement
                            )}
                          </p>

                        </div>

                      </div>


                      <div
                        class="
                          requirement-status
                          ${statusClass}
                        "
                      >

                        <span
                          class="
                            status-symbol
                          "
                        >
                          ${statusSymbol}
                        </span>

                        <span>
                          ${statusText}
                        </span>

                      </div>

                    </article>
                  `;
                }
              )
              .join("")}

          </div>

        </section>


        <section class="results-actions">

          <button
            type="button"
            class="secondary-button"
            id="backToAssessmentButton"
          >
            ← Back to Assessment
          </button>


          <button
            type="button"
            class="primary-button"
            id="startOverButton"
          >
            Start New StockCheck
          </button>

        </section>


        <section class="results-disclaimer">

          <img
            src="wic-color.jpg"
            alt=""
          >

          <div>

            <strong>
              Important
            </strong>

            <p>
              StockCheck is intended to
              assist West Virginia WIC
              vendors in reviewing minimum
              stocking requirements.
              Results are based on the
              inventory information entered
              into this tool and are not an
              official vendor compliance
              determination. Refer to current
              West Virginia WIC vendor
              guidance for official program
              requirements.
            </p>

          </div>

        </section>

      </main>

    </div>
  `;


  const resultsHomeButton =
    document.getElementById(
      "resultsHomeButton"
    );

  const backToAssessmentButton =
    document.getElementById(
      "backToAssessmentButton"
    );

  const startOverButton =
    document.getElementById(
      "startOverButton"
    );


  if (resultsHomeButton) {

    resultsHomeButton.addEventListener(
      "click",
      () => {
        window.location.reload();
      }
    );

  }


  if (backToAssessmentButton) {

    backToAssessmentButton
      .addEventListener(
        "click",
        () => {
          renderAssessment(
            selectedPeerGroup
          );
        }
      );

  }


  if (startOverButton) {

    startOverButton.addEventListener(
      "click",
      () => {

        trackEvent(
          "assessment_restarted",
          {
            peer_group:
              selectedPeerGroup
          }
        );

        selectedPeerGroup = null;
        currentCategoryIndex = 0;
        assessmentState = {};

        window.location.reload();
      }
    );

  }
}


/* =========================================================
   ANALYTICS
   ========================================================= */

/*
  StockCheck can send anonymous usage
  information to a Google Apps Script
  endpoint.

  No vendor name, vendor number,
  participant information, email
  address, or precise location is
  collected by this code.
*/

const ANALYTICS_ENDPOINT =
  typeof STOCKCHECK_ANALYTICS_ENDPOINT !==
    "undefined"
    ? STOCKCHECK_ANALYTICS_ENDPOINT
    : "";


/* =========================================================
   PAGE VIEW
   ========================================================= */

function trackPageView() {

  trackEvent(
    "page_view",
    {
      page:
        window.location.pathname,

      app_version:
        APP_VERSION
    }
  );

}


/* =========================================================
   TRACK EVENT
   ========================================================= */

function trackEvent(
  eventName,
  eventData = {}
) {

  if (!eventName) {
    return;
  }

  const payload = {

    event:
      eventName,

    timestamp:
      new Date().toISOString(),

    app_version:
      APP_VERSION,

    page:
      window.location.pathname,

    ...eventData

  };


  /*
    Keep a console record during
    development. This is useful if the
    analytics endpoint is unavailable.
  */

  console.log(
    "StockCheck analytics:",
    payload
  );


  if (!ANALYTICS_ENDPOINT) {
    return;
  }


  /*
    Google Apps Script web apps can
    reject requests that trigger a CORS
    preflight.

    text/plain allows the POST to remain
    a simple request while still sending
    JSON-formatted data.
  */

  try {

    fetch(
      ANALYTICS_ENDPOINT,
      {

        method: "POST",

        mode: "no-cors",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:
          JSON.stringify(payload),

        keepalive: true

      }
    ).catch(
      (error) => {

        console.warn(
          "StockCheck analytics request failed:",
          error
        );

      }
    );

  } catch (error) {

    console.warn(
      "StockCheck analytics unavailable:",
      error
    );

  }

}


/* =========================================================
   OPTIONAL ANALYTICS HELPER
   ========================================================= */

function trackAssessmentSnapshot() {

  if (!selectedPeerGroup) {
    return;
  }

  const peerData =
    STOCK_REQUIREMENTS[
      selectedPeerGroup
    ];

  if (!peerData) {
    return;
  }

  let meets = 0;
  let attention = 0;
  let notChecked = 0;

  peerData.requirements.forEach(
    (requirement) => {

      const result =
        assessmentState[
          requirement.id
        ]?.result || "not-checked";

      if (result === "meets") {

        meets += 1;

      } else if (
        result === "attention"
      ) {

        attention += 1;

      } else {

        notChecked += 1;

      }

    }
  );

  trackEvent(
    "assessment_snapshot",
    {

      peer_group:
        selectedPeerGroup,

      peer_group_name:
        peerData.name,

      meets_requirement:
        meets,

      needs_attention:
        attention,

      not_checked:
        notChecked

    }
  );

}


/* =========================================================
   ERROR SAFETY
   ========================================================= */

window.addEventListener(
  "error",
  (event) => {

    console.error(
      "StockCheck error:",
      event.error ||
      event.message
    );

  }
);

/* =========================================================
   END WV WIC STOCKCHECK
   ========================================================= */
