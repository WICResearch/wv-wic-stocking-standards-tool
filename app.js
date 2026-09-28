/* =========================================================
   WV WIC STOCKCHECK — Guided Assessment
   ========================================================= */

let selectedPeerGroup = null;
let currentCategoryIndex = 0;
let assessmentState = {};

document.addEventListener("DOMContentLoaded", initializePeerGroupCards);


/* =========================================================
   PEER GROUP SELECTION
   ========================================================= */

function initializePeerGroupCards() {
  document.querySelectorAll(".peer-card").forEach(card => {
    card.addEventListener("click", () => {
      selectPeerGroup(card.dataset.peer);
    });
  });
}


function selectPeerGroup(peerNumber) {
  const peerData = STOCKING_REQUIREMENTS[peerNumber];

  if (!peerData) return;

  selectedPeerGroup = String(peerNumber);
  currentCategoryIndex = 0;
  assessmentState = {};

  peerData.requirements.forEach(requirement => {
    assessmentState[requirement.id] = {
      values: {},
      result: "not-checked",
      complete: false
    };
  });

  renderAssessment();
}


/* =========================================================
   MAIN ASSESSMENT
   ========================================================= */

function renderAssessment() {
  const peerData = STOCKING_REQUIREMENTS[selectedPeerGroup];
  const main = document.querySelector("main");

  main.innerHTML = `
    <section class="assessment-page">

      <div class="assessment-topbar">
        <div class="assessment-topbar-inner">

          <div class="assessment-brand">
            <img src="wic-color.jpg" alt="WIC">
            <strong>WV WIC StockCheck</strong>
          </div>

          <button
            class="back-button"
            id="backToPeerGroups"
            type="button"
          >
            ← Change Peer Group
          </button>

          <div class="assessment-peer-badge">
            Peer Group ${selectedPeerGroup}
          </div>

        </div>
      </div>

      <div class="assessment-container">

        <div class="assessment-heading-row">

          <div>
            <span class="section-kicker">
              GUIDED STOCKING ASSESSMENT
            </span>

            <h1>${peerData.name}</h1>

            <p>
              Complete one food category at a time.
              Your entries are saved as you move through the assessment.
            </p>
          </div>

          <div class="progress-summary">
            <strong id="progressText">
              0 of ${peerData.requirements.length} categories completed
            </strong>

            <div class="progress-track">
              <div
                class="progress-fill"
                id="assessmentProgress"
              ></div>
            </div>
          </div>

        </div>

        <div class="category-nav-wrap">
          <div
            class="category-nav"
            id="categoryNav"
          ></div>
        </div>

        <div class="assessment-workspace">

          <div id="categoryWorkspace"></div>

          <aside class="assessment-sidebar">

            <img
              src="wic-color.jpg"
              class="sidebar-logo"
              alt="WIC"
            >

            <span class="section-kicker">
              YOUR STOCKCHECK
            </span>

            <h3>Assessment Summary</h3>

            <div class="sidebar-stats">

              <div class="sidebar-stat">
                <span>Not checked</span>
                <strong id="notCheckedCount">
                  ${peerData.requirements.length}
                </strong>
              </div>

              <div class="sidebar-stat">
                <span>Meets requirement</span>
                <strong id="meetsCount">0</strong>
              </div>

              <div class="sidebar-stat">
                <span>Needs attention</span>
                <strong id="attentionCount">0</strong>
              </div>

            </div>

            <button
              class="finish-button"
              id="finishAssessment"
              type="button"
              disabled
            >
              View StockCheck Results →
            </button>

            <p class="sidebar-tip">
              The results button becomes available after every
              category has been completed.
            </p>

          </aside>

        </div>

      </div>

    </section>
  `;

  document
    .getElementById("backToPeerGroups")
    .addEventListener("click", returnToHome);

  document
    .getElementById("finishAssessment")
    .addEventListener("click", showAssessmentResults);

  renderCategoryNav();
  renderCurrentCategory();
  updateAssessmentSummary();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   CATEGORY NAVIGATION
   ========================================================= */

function renderCategoryNav() {
  const peerData = STOCKING_REQUIREMENTS[selectedPeerGroup];
  const nav = document.getElementById("categoryNav");

  if (!nav) return;

  nav.innerHTML = peerData.requirements
    .map((requirement, index) => {

      const state = assessmentState[requirement.id];

      let statusClass = "nav-not-checked";
      let symbol = "○";

      if (state.complete && state.result === "meets") {
        statusClass = "nav-success";
        symbol = "✓";
      }

      if (state.complete && state.result === "attention") {
        statusClass = "nav-attention";
        symbol = "!";
      }

      return `
        <button
          type="button"
          class="category-nav-item
                 ${index === currentCategoryIndex ? "active" : ""}
                 ${statusClass}"
          data-index="${index}"
        >
          <span class="category-nav-symbol">
            ${symbol}
          </span>

          <span class="category-nav-name">
            ${requirement.category}
          </span>
        </button>
      `;
    })
    .join("");

  nav.querySelectorAll(".category-nav-item").forEach(button => {
    button.addEventListener("click", () => {
      currentCategoryIndex = Number(button.dataset.index);
      renderCategoryNav();
      renderCurrentCategory();
      scrollToWorkspace();
    });
  });
}


/* =========================================================
   CURRENT CATEGORY
   ========================================================= */

function renderCurrentCategory() {
  const peerData = STOCKING_REQUIREMENTS[selectedPeerGroup];
  const requirement = peerData.requirements[currentCategoryIndex];
  const state = assessmentState[requirement.id];
  const workspace = document.getElementById("categoryWorkspace");

  if (!workspace) return;

  let statusClass = "status-not-checked";
  let statusText = "Not Checked";
  let statusSymbol = "○";

  if (state.complete && state.result === "meets") {
    statusClass = "status-success";
    statusText = "Meets Requirement";
    statusSymbol = "✓";
  }

  if (state.complete && state.result === "attention") {
    statusClass = "status-attention";
    statusText = "Needs Attention";
    statusSymbol = "!";
  }

  workspace.innerHTML = `
    <article class="guided-category-card">

      <div class="guided-category-header">

        <div>
          <span class="requirement-label">
            CATEGORY ${currentCategoryIndex + 1}
            OF ${peerData.requirements.length}
          </span>

          <h2>${requirement.category}</h2>
        </div>

        <div class="requirement-status ${statusClass}">
          <span class="status-symbol">
            ${statusSymbol}
          </span>

          <span>
            ${statusText}
          </span>
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
              <span>i</span>

              <p>
                ${requirement.note}
              </p>
            </div>
          `
          : ""
      }

      <div class="inventory-section">

        <div class="inventory-section-header">

          <div>
            <span class="inventory-kicker">
              CURRENT INVENTORY
            </span>

            <strong>
              What do you have in stock?
            </strong>
          </div>

          <span class="inventory-help">
            Enter what is available right now
          </span>

        </div>

        ${buildInventoryFields(requirement)}

      </div>

      <div class="guided-category-actions">

        <button
          type="button"
          class="secondary-button"
          id="previousCategory"
          ${currentCategoryIndex === 0 ? "disabled" : ""}
        >
          ← Previous
        </button>

        <button
          type="button"
          class="primary-button"
          id="saveCategory"
        >
          ${
            currentCategoryIndex === peerData.requirements.length - 1
              ? "Save Category"
              : "Save & Continue →"
          }
        </button>

      </div>

    </article>
  `;

  restoreCurrentValues(requirement);
  attachCurrentInputListeners(requirement);

  document
    .getElementById("previousCategory")
    ?.addEventListener("click", () => {

      if (currentCategoryIndex > 0) {
        currentCategoryIndex--;
        renderCategoryNav();
        renderCurrentCategory();
        scrollToWorkspace();
      }
    });

  document
    .getElementById("saveCategory")
    ?.addEventListener("click", () => {
      saveCurrentCategory(requirement);
    });
}


/* =========================================================
   INVENTORY FIELDS
   ========================================================= */

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
            "quantity",
            "Total containers",
            `Minimum: ${requirement.minimum}`
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
            "quantity",
            "Qualifying containers",
            `Minimum: ${requirement.minimum}`
          )}

        </div>
      `;


    case "either-size":
      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "small",
            "Smaller-size containers",
            "Enter current stock"
          )}

          ${numberField(
            requirement.id,
            "large",
            "Larger-size containers",
            "Enter current stock"
          )}

        </div>
      `;


    case "cereal":
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
            "ounces",
            "Total ounces in stock",
            `Minimum: ${requirement.minimum} oz`
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
            "cans",
            "Cans in stock",
            "Enter current stock"
          )}

          ${numberField(
            requirement.id,
            "dry",
            "Dry packages in stock",
            "Enter current stock"
          )}

        </div>
      `;


    case "whole-grain":
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
            "quantity",
            "Qualifying items in stock",
            `Minimum: ${requirement.minimum}`
          )}

        </div>
      `;


    case "milk-pg1":
    case "milk-pg2":
    case "milk-pg3":
      return buildMilkFields(requirement);


    case "split-milk":
      return `
        <div class="inventory-grid">

          ${numberField(
            requirement.id,
            "whole",
            "Whole milk",
            "Enter current stock"
          )}

          ${numberField(
            requirement.id,
            "lowfat",
            "Low-fat / fat-free milk",
            "Enter current stock"
          )}

        </div>
      `;


    case "produce-and":
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
            "fresh",
            "Fresh pounds",
            "Enter current stock"
          )}

          ${numberField(
            requirement.id,
            "cans",
            "Cans",
            "Enter current stock"
          )}

          ${numberField(
            requirement.id,
            "frozen",
            "Frozen bags",
            "Enter current stock"
          )}

          ${numberField(
            requirement.id,
            "value",
            "Dollar value",
            "Enter current stock"
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
            "fresh",
            "Fresh pounds",
            "Enter current stock"
          )}

          ${numberField(
            requirement.id,
            "cans",
            "Cans",
            "Enter current stock"
          )}

          ${numberField(
            requirement.id,
            "frozen",
            "Frozen bags",
            "Enter current stock"
          )}

          ${numberField(
            requirement.id,
            "value",
            "Dollar value",
            "Enter current stock"
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


function buildMilkFields(requirement) {
  return `
    <div class="inventory-grid">

      ${numberField(
        requirement.id,
        "whole",
        "Whole milk",
        "Enter current stock"
      )}

      ${numberField(
        requirement.id,
        "onePercent",
        "1% milk",
        "Enter current stock"
      )}

      ${numberField(
        requirement.id,
        "skim",
        "Fat-free / skim milk",
        "Enter current stock"
      )}

      ${numberField(
        requirement.id,
        "twoPercent",
        "2% milk",
        "Enter current stock"
      )}

    </div>
  `;
}


function numberField(requirementId, field, label, helper) {
  return `
    <label class="inventory-field">

      <span class="inventory-field-label">
        ${label}
      </span>

      <input
        type="number"
        min="0"
        step="any"
        inputmode="decimal"
        data-requirement="${requirementId}"
        data-field="${field}"
        placeholder="0"
      >

      <small>
        ${helper || ""}
      </small>

    </label>
  `;
}


/* =========================================================
   SAVE / RESTORE INPUT
   ========================================================= */

function attachCurrentInputListeners(requirement) {

  document
    .querySelectorAll(
      `[data-requirement="${requirement.id}"]`
    )
    .forEach(input => {

      input.addEventListener("input", event => {

        const field = event.target.dataset.field;

        assessmentState[requirement.id].values[field] =
          parseNumber(event.target.value);
      });
    });
}


function restoreCurrentValues(requirement) {
  const values =
    assessmentState[requirement.id]?.values || {};

  document
    .querySelectorAll(
      `[data-requirement="${requirement.id}"]`
    )
    .forEach(input => {

      const field = input.dataset.field;

      if (
        values[field] !== undefined &&
        values[field] !== null
      ) {
        input.value = values[field];
      }
    });
}


function saveCurrentCategory(requirement) {

  const inputs = document.querySelectorAll(
    `[data-requirement="${requirement.id}"]`
  );

  const values = {};

  inputs.forEach(input => {
    values[input.dataset.field] =
      parseNumber(input.value);
  });

  const result =
    evaluateRequirement(requirement, values);

  assessmentState[requirement.id] = {
    values,
    result,
    complete: true
  };

  renderCategoryNav();
  updateAssessmentSummary();

  const peerData =
    STOCKING_REQUIREMENTS[selectedPeerGroup];

  if (
    currentCategoryIndex <
    peerData.requirements.length - 1
  ) {
    currentCategoryIndex++;
    renderCategoryNav();
    renderCurrentCategory();
    scrollToWorkspace();
  } else {
    renderCurrentCategory();

    if (allCategoriesComplete()) {
      showAssessmentResults();
    }
  }
}


/* =========================================================
   REQUIREMENT EVALUATION
   ========================================================= */

function evaluateRequirement(requirement, values) {

  const v = key => Number(values[key] || 0);

  switch (requirement.type) {

    case "standard":
      return (
        (
          requirement.varieties === undefined ||
          v("varieties") >= requirement.varieties
        ) &&
        v("quantity") >= requirement.minimum
      )
        ? "meets"
        : "attention";


    case "formula":
    case "formula-request":
      return v("quantity") >= requirement.minimum
        ? "meets"
        : "attention";


    case "infant-produce":
    case "yogurt":
    case "whole-grain":
      return (
        v("varieties") >=
          Number(requirement.varieties || 0) &&
        (
          requirement.minimum === undefined ||
          v("quantity") >=
            Number(requirement.minimum || 0)
        )
      )
        ? "meets"
        : "attention";


    case "either-size": {
      const total =
        v("small") + v("large");

      return total >=
        Number(requirement.minimum || 0)
          ? "meets"
          : "attention";
    }


    case "cereal":
      return (
        v("varieties") >=
          Number(requirement.varieties || 0) &&
        v("ounces") >=
          Number(requirement.minimum || 0)
      )
        ? "meets"
        : "attention";


    case "beans": {
      const varietiesOK =
        v("varieties") >=
        Number(requirement.varieties || 0);

      const quantity =
        v("cans") + v("dry");

      const quantityOK =
        quantity >=
        Number(requirement.minimum || 0);

      return varietiesOK && quantityOK
        ? "meets"
        : "attention";
    }


    case "milk-pg1":
    case "milk-pg2":
    case "milk-pg3": {
      const total =
        v("whole") +
        v("onePercent") +
        v("skim") +
        v("twoPercent");

      return total >=
        Number(requirement.minimum || 0)
          ? "meets"
          : "attention";
    }


    case "split-milk": {
      const total =
        v("whole") + v("lowfat");

      return total >=
        Number(requirement.minimum || 0)
          ? "meets"
          : "attention";
    }


    case "produce-and": {
      const varietiesOK =
        v("varieties") >=
        Number(requirement.varieties || 0);

      const produceOK =
        evaluateProduceQuantity(
          requirement,
          values,
          true
        );

      return varietiesOK && produceOK
        ? "meets"
        : "attention";
    }


    case "produce-or": {
      const varietiesOK =
        v("varieties") >=
        Number(requirement.varieties || 0);

      const produceOK =
        evaluateProduceQuantity(
          requirement,
          values,
          false
        );

      return varietiesOK && produceOK
        ? "meets"
        : "attention";
    }


    default:
      return v("quantity") >=
        Number(requirement.minimum || 0)
          ? "meets"
          : "attention";
  }
}


function evaluateProduceQuantity(
  requirement,
  values,
  useAnd
) {
  const checks = [];

  const freshMinimum =
    getFirstNumber(
      requirement,
      ["fresh", "freshMinimum", "pounds"]
    );

  const cansMinimum =
    getFirstNumber(
      requirement,
      ["cans", "canMinimum"]
    );

  const frozenMinimum =
    getFirstNumber(
      requirement,
      ["frozen", "frozenMinimum", "bags"]
    );

  const valueMinimum =
    getFirstNumber(
      requirement,
      ["value", "dollarValue", "minimumValue"]
    );

  if (freshMinimum !== null) {
    checks.push(
      Number(values.fresh || 0) >= freshMinimum
    );
  }

  if (cansMinimum !== null) {
    checks.push(
      Number(values.cans || 0) >= cansMinimum
    );
  }

  if (frozenMinimum !== null) {
    checks.push(
      Number(values.frozen || 0) >= frozenMinimum
    );
  }

  if (valueMinimum !== null) {
    checks.push(
      Number(values.value || 0) >= valueMinimum
    );
  }

  if (!checks.length) {
    return (
      Number(values.fresh || 0) > 0 ||
      Number(values.cans || 0) > 0 ||
      Number(values.frozen || 0) > 0 ||
      Number(values.value || 0) > 0
    );
  }

  return useAnd
    ? checks.every(Boolean)
    : checks.some(Boolean);
}


function getFirstNumber(object, keys) {

  for (const key of keys) {

    if (
      object[key] !== undefined &&
      object[key] !== null &&
      object[key] !== ""
    ) {
      const number = Number(object[key]);

      if (!Number.isNaN(number)) {
        return number;
      }
    }
  }

  return null;
}


/* =========================================================
   SUMMARY
   ========================================================= */

function updateAssessmentSummary() {

  const peerData =
    STOCKING_REQUIREMENTS[selectedPeerGroup];

  const states =
    peerData.requirements.map(
      requirement =>
        assessmentState[requirement.id]
    );

  const completed =
    states.filter(
      state => state.complete
    ).length;

  const meets =
    states.filter(
      state =>
        state.complete &&
        state.result === "meets"
    ).length;

  const attention =
    states.filter(
      state =>
        state.complete &&
        state.result === "attention"
    ).length;

  const total = states.length;

  const percent =
    total
      ? Math.round(
          (completed / total) * 100
        )
      : 0;

  const setText =
    (id, value) => {
      const element =
        document.getElementById(id);

      if (element) {
        element.textContent = value;
      }
    };

  setText(
    "progressText",
    `${completed} of ${total} categories completed`
  );

  setText(
    "notCheckedCount",
    total - completed
  );

  setText(
    "meetsCount",
    meets
  );

  setText(
    "attentionCount",
    attention
  );

  const progress =
    document.getElementById(
      "assessmentProgress"
    );

  if (progress) {
    progress.style.width =
      `${percent}%`;
  }

  const finish =
    document.getElementById(
      "finishAssessment"
    );

  if (finish) {
    finish.disabled =
      completed !== total;
  }
}


function allCategoriesComplete() {

  const peerData =
    STOCKING_REQUIREMENTS[selectedPeerGroup];

  return peerData.requirements.every(
    requirement =>
      assessmentState[requirement.id].complete
  );
}


function scrollToWorkspace() {

  document
    .querySelector(".category-nav-wrap")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}


/* =========================================================
   RESULTS
   ========================================================= */

function showAssessmentResults() {

  if (!allCategoriesComplete()) {
    return;
  }

  const peerData =
    STOCKING_REQUIREMENTS[selectedPeerGroup];

  const results =
    peerData.requirements.map(
      requirement => ({
        requirement,
        result:
          assessmentState[
            requirement.id
          ].result
      })
    );

  renderResultsPage(results);
}


function renderResultsPage(results) {

  const peerData =
    STOCKING_REQUIREMENTS[selectedPeerGroup];

  const meets =
    results.filter(
      item => item.result === "meets"
    );

  const attention =
    results.filter(
      item => item.result === "attention"
    );

  const total =
    results.length;

  const allMeet =
    attention.length === 0;

  document.querySelector("main").innerHTML = `
    <section class="results-page">

      <div class="assessment-topbar">

        <div class="assessment-topbar-inner">

          <div class="assessment-brand">
            <img
              src="wic-color.jpg"
              alt="WIC"
            >

            <strong>
              WV WIC StockCheck
            </strong>
          </div>

          <button
            class="back-button"
            id="resultsBackHome"
            type="button"
          >
            ← Start New StockCheck
          </button>

          <div class="assessment-peer-badge">
            Peer Group ${selectedPeerGroup}
          </div>

        </div>

      </div>

      <div class="results-container">

        <section class="results-hero ${
          allMeet
            ? "success"
            : "attention"
        }">

          <img
            src="wic-color.jpg"
            class="results-logo"
            alt="WIC"
          >

          <div>

            <span class="section-kicker">
              STOCKCHECK RESULTS
            </span>

            <h1>
              ${
                allMeet
                  ? "All categories meet the minimum requirements"
                  : `${attention.length} ${pluralize(
                      "category",
                      attention.length
                    )} need attention`
              }
            </h1>

            <p>
              ${
                allMeet
                  ? `Based on the inventory entered, all ${total} categories for Peer Group ${selectedPeerGroup} meet the displayed minimum stocking requirements.`
                  : `${meets.length} of ${total} categories meet the displayed minimum stocking requirements. Review the items below that need attention.`
              }
            </p>

          </div>

        </section>


        <section class="results-stat-grid">

          <div class="results-stat-card">
            <span>Total Categories</span>
            <strong>${total}</strong>
          </div>

          <div class="results-stat-card">
            <span>Meets Requirement</span>
            <strong>${meets.length}</strong>
          </div>

          <div class="results-stat-card">
            <span>Needs Attention</span>
            <strong>${attention.length}</strong>
          </div>

        </section>


        ${
          attention.length
            ? `
              <section class="results-section">

                <div class="results-section-heading">

                  <div>
                    <span class="section-kicker">
                      REVIEW THESE ITEMS
                    </span>

                    <h2>
                      Needs Attention
                    </h2>
                  </div>

                </div>

                <div class="results-list">
                  ${buildResultsList(
                    attention,
                    false
                  )}
                </div>

              </section>
            `
            : ""
        }


        <section class="results-section">

          <div class="results-section-heading">

            <div>
              <span class="section-kicker">
                REQUIREMENTS MET
              </span>

              <h2>
                Meets Requirement
              </h2>
            </div>

          </div>

          <div class="results-list">

            ${
              meets.length
                ? buildResultsList(
                    meets,
                    true
                  )
                : `
                  <div class="results-disclaimer">
                    No categories currently meet
                    the displayed minimum requirements.
                  </div>
                `
            }

          </div>

        </section>


        <section class="results-disclaimer">

          <strong>
            About these results
          </strong>

          <br>

          StockCheck compares the inventory entered with
          the minimum stocking requirements represented
          in this tool. It is intended to support stocking
          review and does not replace official WV WIC
          guidance or vendor requirements.

        </section>


        <div class="results-actions">

          <button
            class="results-primary-button"
            id="startNewAssessment"
            type="button"
          >
            Start New StockCheck
          </button>

        </div>

      </div>

    </section>
  `;

  document
    .getElementById("resultsBackHome")
    .addEventListener(
      "click",
      returnToHome
    );

  document
    .getElementById("startNewAssessment")
    .addEventListener(
      "click",
      returnToHome
    );

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function buildResultsList(items, isSuccess) {

  return items
    .map(({ requirement }) => `
      <article class="result-item">

        <div class="
          result-item-icon
          ${
            isSuccess
              ? "result-icon-success"
              : "result-icon-attention"
          }
        ">
          ${isSuccess ? "✓" : "!"}
        </div>

        <div>

          <h3>
            ${requirement.category}
          </h3>

          <p>
            ${getRequirementSummary(requirement)}
          </p>

        </div>

        <span class="
          result-item-status
          ${
            isSuccess
              ? "result-status-success"
              : "result-status-attention"
          }
        ">
          ${
            isSuccess
              ? "Meets Requirement"
              : "Needs Attention"
          }
        </span>

      </article>
    `)
    .join("");
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
      return `${requirement.minimum} ${requirement.unit} across the required contract formulas. One representative container of each required formula must be available.`;


    case "formula-request":
      return `${requirement.minimum} ${requirement.unit} across the required contract formulas.`;


    case "infant-produce":
      return `At least ${requirement.varieties} ${pluralize(
        "variety",
        requirement.varieties
      )} and ${requirement.minimum} ${requirement.unit}.`;


    case "yogurt":
      return `At least ${requirement.varieties} ${pluralize(
        "variety",
        requirement.varieties
      )} and ${requirement.minimum} ${requirement.unit}.`;


    case "either-size":
      return `${requirement.minimum} qualifying containers using either approved size option.`;


    case "cereal":
      return `At least ${requirement.varieties} ${pluralize(
        "variety",
        requirement.varieties
      )} and ${requirement.minimum} ounces total.`;


    case "beans":
      return `At least ${requirement.varieties} ${pluralize(
        "variety",
        requirement.varieties
      )} and ${requirement.minimum} qualifying packages or cans.`;


    case "whole-grain":
      return `At least ${requirement.varieties} ${pluralize(
        "variety",
        requirement.varieties
      )} and ${requirement.minimum} qualifying items.`;


    case "milk-pg1":
    case "milk-pg2":
    case "milk-pg3":
      return `${requirement.minimum} qualifying milk containers across the required milk types.`;


    case "split-milk":
      return `${requirement.minimum} qualifying milk containers across the required milk types.`;


    case "produce-and":
    case "produce-or": {

      const varieties =
        requirement.varieties !== undefined
          ? `At least ${requirement.varieties} ${pluralize(
              "variety",
              requirement.varieties
            )}`
          : "Meet the required variety minimum";

      const options = [];

      const fresh =
        getFirstNumber(
          requirement,
          ["fresh", "freshMinimum", "pounds"]
        );

      const cans =
        getFirstNumber(
          requirement,
          ["cans", "canMinimum"]
        );

      const frozen =
        getFirstNumber(
          requirement,
          ["frozen", "frozenMinimum", "bags"]
        );

      const value =
        getFirstNumber(
          requirement,
          ["value", "dollarValue", "minimumValue"]
        );

      if (fresh !== null) {
        options.push(
          `${fresh} pounds fresh`
        );
      }

      if (cans !== null) {
        options.push(
          `${cans} cans`
        );
      }

      if (frozen !== null) {
        options.push(
          `${frozen} bags frozen`
        );
      }

      if (value !== null) {
        options.push(
          `$${value} value`
        );
      }

      if (!options.length) {
        return `${varieties}.`;
      }

      return `${varieties} and ${
        requirement.type === "produce-and"
          ? options.join(", ")
          : formatOrList(options)
      }.`;
    }


    default:
      return requirement.minimum !== undefined
        ? `${requirement.minimum} ${requirement.unit || "qualifying items"}.`
        : "Meet the minimum stocking requirement shown.";
  }
}


/* =========================================================
   HELPERS
   ========================================================= */

function formatOrList(items) {

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} OR ${items[1]}`;
  }

  return `${
    items.slice(0, -1).join(", ")
  }, OR ${items[items.length - 1]}`;
}


function pluralize(word, amount) {
  return Number(amount) === 1
    ? word
    : `${word}s`;
}


function parseNumber(value) {

  const number =
    parseFloat(value);

  return Number.isFinite(number)
    ? number
    : 0;
}


/* =========================================================
   RETURN HOME
   ========================================================= */

function returnToHome() {

  window.location.reload();
}
