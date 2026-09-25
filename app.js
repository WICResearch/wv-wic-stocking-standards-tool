/* =========================================================
   WV WIC STOCKCHECK
   Main Application
   ========================================================= */

let selectedPeerGroup = null;


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initializePeerGroupCards();
});


/* =========================================================
   PEER GROUP SELECTION
   ========================================================= */

function initializePeerGroupCards() {
  const peerCards = document.querySelectorAll(".peer-card");

  peerCards.forEach((card) => {
    card.addEventListener("click", () => {
      const peerNumber = card.dataset.peer;
      selectPeerGroup(peerNumber);
    });
  });
}


function selectPeerGroup(peerNumber) {
  const peerData = STOCKING_REQUIREMENTS[peerNumber];

  if (!peerData) {
    console.error(`Peer Group ${peerNumber} was not found.`);
    return;
  }

  selectedPeerGroup = peerNumber;

  renderAssessment(peerNumber, peerData);
}


/* =========================================================
   ASSESSMENT SCREEN
   ========================================================= */

function renderAssessment(peerNumber, peerData) {
  const main = document.querySelector("main");

  const requirementCount = peerData.requirements.length;

  main.innerHTML = `
    <section class="assessment-page">

      <div class="assessment-topbar">

        <div class="assessment-topbar-inner">

          <button
            class="back-button"
            id="backToPeerGroups"
            type="button"
          >
            <span>←</span>
            Change Peer Group
          </button>

          <div class="assessment-peer-badge">
            Peer Group ${peerNumber}
          </div>

        </div>

      </div>


      <div class="assessment-container">

        <section class="assessment-intro">

          <div class="assessment-heading">

            <span class="section-kicker">
              WV WIC STOCKCHECK
            </span>

            <h1>
              ${peerData.name}
            </h1>

            <p>
              Enter your current inventory for each category.
              StockCheck will compare your inventory with the
              minimum stocking requirements for Peer Group
              ${peerNumber}.
            </p>

          </div>


          <div class="assessment-summary-card">

            <div class="summary-ring">
              <span id="progressPercent">0%</span>
            </div>

            <div class="summary-copy">

              <span class="summary-label">
                ASSESSMENT PROGRESS
              </span>

              <strong>
                <span id="completedCount">0</span>
                of ${requirementCount} categories checked
              </strong>

              <div class="assessment-progress-track">
                <div
                  class="assessment-progress-fill"
                  id="assessmentProgress"
                  style="width: 0%"
                ></div>
              </div>

            </div>

          </div>

        </section>


        <section class="assessment-layout">

          <div class="assessment-main">

            <div class="assessment-section-heading">

              <div>
                <span class="section-kicker">
                  CURRENT INVENTORY
                </span>

                <h2>
                  Check each category
                </h2>
              </div>

              <span class="requirement-count">
                ${requirementCount} categories
              </span>

            </div>


            <div
              class="requirements-list"
              id="requirementsList"
            >
              ${buildRequirementCards(peerData.requirements)}
            </div>

          </div>


          <aside class="assessment-sidebar">

            <div class="sidebar-card sticky-card">

              <span class="sidebar-kicker">
                YOUR STOCKCHECK
              </span>

              <h3>
                Assessment Summary
              </h3>


              <div class="sidebar-stats">

                <div class="sidebar-stat">

                  <div class="stat-icon stat-neutral">
                    ○
                  </div>

                  <div>
                    <strong id="notCheckedCount">
                      ${requirementCount}
                    </strong>

                    <span>
                      Not Checked
                    </span>
                  </div>

                </div>


                <div class="sidebar-stat">

                  <div class="stat-icon stat-success">
                    ✓
                  </div>

                  <div>
                    <strong id="meetsCount">
                      0
                    </strong>

                    <span>
                      Meets Requirement
                    </span>
                  </div>

                </div>


                <div class="sidebar-stat">

                  <div class="stat-icon stat-warning">
                    !
                  </div>

                  <div>
                    <strong id="attentionCount">
                      0
                    </strong>

                    <span>
                      Needs Attention
                    </span>
                  </div>

                </div>

              </div>


              <div class="sidebar-divider"></div>


              <div class="sidebar-help">

                <strong>
                  How it works
                </strong>

                <p>
                  Enter the inventory currently available
                  in your store. Each category will update
                  automatically when enough information
                  has been entered.
                </p>

              </div>


              <button
                class="finish-button"
                id="finishAssessment"
                type="button"
                disabled
              >
                View StockCheck Results
                <span>→</span>
              </button>

            </div>

          </aside>

        </section>

      </div>

    </section>
  `;

  addAssessmentStyles();

  document
    .getElementById("backToPeerGroups")
    .addEventListener("click", returnToHome);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   REQUIREMENT CARDS
   ========================================================= */

function buildRequirementCards(requirements) {
  return requirements
    .map((requirement, index) => {
      return `
        <article
          class="requirement-card"
          data-requirement="${requirement.id}"
        >

          <div class="requirement-number">
            ${String(index + 1).padStart(2, "0")}
          </div>


          <div class="requirement-body">

            <div class="requirement-header">

              <div>

                <span class="requirement-label">
                  CATEGORY ${index + 1}
                </span>

                <h3>
                  ${requirement.category}
                </h3>

              </div>


              <div class="requirement-status status-not-checked">

                <span class="status-symbol">
                  ○
                </span>

                <span>
                  Not Checked
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


            ${
              requirement.sourceNote
                ? `
                  <div class="source-note">
                    <strong>
                      Source note:
                    </strong>

                    ${requirement.sourceNote}
                  </div>
                `
                : ""
            }


            <div class="inventory-placeholder">

              <span>
                Inventory fields coming next
              </span>

            </div>

          </div>

        </article>
      `;
    })
    .join("");
}


/* =========================================================
   HUMAN-READABLE REQUIREMENT SUMMARIES
   ========================================================= */

function getRequirementSummary(requirement) {
  switch (requirement.type) {

    case "standard":
      return buildStandardSummary(requirement);


    case "formula":
      return `
        ${requirement.minimum} ${requirement.unit}
        across the required contract formulas.
        One representative container of each required
        brand/formula must be available.
      `;


    case "formula-request":
      return `
        ${requirement.minimum} ${requirement.unit}
        across the required contract formulas.
        ${requirement.formulasRequired.join(" and ")}
        are required for minimum stock.
      `;


    case "infant-produce":
      return `
        At least ${requirement.varieties} varieties and
        either ${requirement.singleMinimum} single containers
        OR ${requirement.twoPackMinimum} two-packs.
      `;


    case "yogurt":
      return `
        At least ${requirement.varieties} varieties,
        ${requirement.wholeFatMinimum} whole-fat containers
        AND ${requirement.lowFatMinimum} low-fat containers.
      `;


    case "either-size":
      return `
        At least ${requirement.varieties}
        ${pluralize("variety", requirement.varieties)} and
        either ${requirement.options[0].minimum}
        ${requirement.options[0].size}
        OR ${requirement.options[1].minimum}
        ${requirement.options[1].size}.
      `;


    case "cereal":
      return `
        At least ${requirement.varieties} varieties and
        ${requirement.minimum} ${requirement.unit}.
        At least ${requirement.wholeGrainVarieties}
        ${pluralize(
          "variety",
          requirement.wholeGrainVarieties
        )} must be whole grain.
      `;


    case "beans":
      return `
        At least ${requirement.varieties}
        ${pluralize("variety", requirement.varieties)}
        and either ${requirement.driedMinimum}
        ${requirement.driedSize} of dried beans
        OR ${requirement.cannedMinimum}
        ${requirement.cannedSize}.
      `;


    case "whole-grain":
      return `
        At least ${requirement.varieties} varieties and
        ${requirement.minimum} ${requirement.unit}.
        At least ${requirement.breadVarieties}
        ${pluralize(
          "variety",
          requirement.breadVarieties
        )} must be bread.
      `;


    case "milk-pg1":
    case "milk-pg2":
    case "milk-pg3":
      return `
        ${requirement.minimum} ${requirement.unit}.
        Required milk types:
        ${requirement.milkTypes.join(", ")}.
        At least ${requirement.sizesRequired} sizes.
      `;


    case "split-milk":
      return `
        At least ${requirement.varieties} approved milk
        types, including ${requirement.wholeMinimum}
        ${pluralize("gallon", requirement.wholeMinimum)}
        of whole milk AND ${requirement.lowFatMinimum}
        gallons of low-fat and/or fat-free milk.
      `;


    case "produce-and":
      return buildProduceAndSummary(requirement);


    case "produce-or":
      return `
        At least ${requirement.varieties} varieties and
        either ${requirement.freshPounds} pounds fresh,
        ${requirement.cannedMinimum} cans,
        ${requirement.frozenMinimum} bags frozen,
        OR $${requirement.dollarMinimum} value.
      `;


    default:
      return "See current WV WIC minimum stocking requirements.";
  }
}


function buildStandardSummary(requirement) {
  const varietyText = requirement.varieties
    ? `At least ${requirement.varieties} ${pluralize(
        "variety",
        requirement.varieties
      )} and `
    : "";

  return `
    ${varietyText}${requirement.minimum}
    ${requirement.unit}.
  `;
}


function buildProduceAndSummary(requirement) {
  const freshVarietyText =
    requirement.freshVarieties !== undefined
      ? ` At least ${requirement.freshVarieties} must be fresh.`
      : "";

  return `
    At least ${requirement.varieties} varieties across
    ${requirement.subcategories} subcategories.
    ${freshVarietyText}
    Minimum fresh stock: ${requirement.freshPounds} pounds,
    PLUS either ${requirement.cannedMinimum} cans,
    ${requirement.frozenMinimum} bags frozen,
    OR $${requirement.dollarMinimum} value.
  `;
}


function pluralize(word, number) {
  return number === 1
    ? word
    : `${word}s`;
}


/* =========================================================
   RETURN TO LANDING PAGE
   ========================================================= */

function returnToHome() {
  window.location.reload();
}


/* =========================================================
   ASSESSMENT-SPECIFIC STYLES
   ========================================================= */

function addAssessmentStyles() {
  if (document.getElementById("assessmentStyles")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "assessmentStyles";

  style.textContent = `

    .assessment-page {
      min-height: 100vh;
      background:
        linear-gradient(
          180deg,
          #edf5f7 0,
          #f7f9fa 260px
        );
    }


    .assessment-topbar {
      background: #003f56;
      color: white;
    }


    .assessment-topbar-inner {
      width:
        min(
          calc(100% - 40px),
          var(--max-width)
        );

      min-height: 58px;

      margin: auto;

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }


    .back-button {
      padding: 0;

      display: flex;
      align-items: center;
      gap: 8px;

      border: 0;
      background: transparent;

      color:
        rgba(255,255,255,.82);

      font-size: 12px;
      font-weight: 700;
    }


    .back-button:hover {
      color: white;
    }


    .back-button span {
      font-size: 18px;
    }


    .assessment-peer-badge {
      padding: 6px 11px;

      border:
        1px solid rgba(255,255,255,.18);

      border-radius: 999px;

      background:
        rgba(255,255,255,.08);

      font-size: 10px;
      font-weight: 800;

      letter-spacing: .5px;
    }


    .assessment-container {
      width:
        min(
          calc(100% - 40px),
          var(--max-width)
        );

      margin: auto;

      padding: 45px 0 90px;
    }


    .assessment-intro {
      display: grid;

      grid-template-columns:
        1fr 430px;

      align-items: center;

      gap: 60px;

      margin-bottom: 48px;
    }


    .assessment-heading h1 {
      margin: 5px 0 9px;

      color: var(--wic-blue-dark);

      font-family:
        "Manrope",
        sans-serif;

      font-size:
        clamp(
          32px,
          4vw,
          48px
        );

      line-height: 1.08;

      letter-spacing: -1.8px;
    }


    .assessment-heading p {
      max-width: 650px;

      margin: 0;

      color: var(--text-medium);

      font-size: 14px;
      line-height: 1.7;
    }


    .assessment-summary-card {
      padding: 22px;

      display: flex;
      align-items: center;
      gap: 18px;

      border:
        1px solid var(--border);

      border-radius: 18px;

      background: white;

      box-shadow: var(--shadow-sm);
    }


    .summary-ring {
      flex: 0 0 auto;

      width: 68px;
      height: 68px;

      display: grid;
      place-items: center;

      border-radius: 50%;

      background:
        conic-gradient(
          var(--wic-green) 0deg,
          #e6edef 0deg
        );

      position: relative;
    }


    .summary-ring::after {
      content: "";

      position: absolute;

      width: 53px;
      height: 53px;

      border-radius: 50%;

      background: white;
    }


    .summary-ring span {
      position: relative;
      z-index: 2;

      color: var(--wic-blue-dark);

      font-family:
        "Manrope",
        sans-serif;

      font-size: 13px;
      font-weight: 800;
    }


    .summary-copy {
      flex: 1;

      display: flex;
      flex-direction: column;
    }


    .summary-label {
      color: var(--wic-magenta);

      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1px;
    }


    .summary-copy strong {
      margin-top: 2px;

      color: var(--wic-blue-dark);

      font-size: 13px;
    }


    .assessment-progress-track {
      height: 6px;

      margin-top: 10px;

      overflow: hidden;

      border-radius: 999px;

      background: #e7edef;
    }


    .assessment-progress-fill {
      height: 100%;

      border-radius: inherit;

      background:
        linear-gradient(
          90deg,
          var(--wic-green),
          #a9d866
        );

      transition: width .3s ease;
    }


    .assessment-layout {
      display: grid;

      grid-template-columns:
        minmax(0, 1fr)
        300px;

      align-items: start;

      gap: 30px;
    }


    .assessment-section-heading {
      margin-bottom: 18px;

      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
    }


    .assessment-section-heading h2 {
      margin: 3px 0 0;

      color: var(--wic-blue-dark);

      font-family:
        "Manrope",
        sans-serif;

      font-size: 25px;
    }


    .requirement-count {
      color: var(--text-light);

      font-size: 10px;
      font-weight: 700;
    }


    .requirements-list {
      display: grid;
      gap: 15px;
    }


    .requirement-card {
      position: relative;

      display: grid;

      grid-template-columns:
        52px 1fr;

      overflow: hidden;

      border:
        1px solid var(--border);

      border-radius: 18px;

      background: white;

      box-shadow: var(--shadow-sm);
    }


    .requirement-number {
      padding-top: 25px;

      background:
        linear-gradient(
          180deg,
          #f0f7f9,
          #f8fbfc
        );

      color: #9bb0b7;

      text-align: center;

      font-family:
        "Manrope",
        sans-serif;

      font-size: 11px;
      font-weight: 800;
    }


    .requirement-body {
      padding: 22px 23px;
    }


    .requirement-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
    }


    .requirement-label {
      color: var(--wic-magenta);

      font-size: 8px;
      font-weight: 800;
      letter-spacing: 1px;
    }


    .requirement-header h3 {
      margin: 2px 0 0;

      color: var(--wic-blue-dark);

      font-family:
        "Manrope",
        sans-serif;

      font-size: 19px;
    }


    .requirement-status {
      flex: 0 0 auto;

      padding: 6px 9px;

      display: flex;
      align-items: center;
      gap: 5px;

      border-radius: 999px;

      font-size: 9px;
      font-weight: 800;
    }


    .status-not-checked {
      background: #f1f4f5;
      color: #778b92;
    }


    .status-symbol {
      font-size: 11px;
    }


    .minimum-box {
      margin-top: 16px;
      padding: 13px 15px;

      border-radius: 11px;

      background: #f3f8f9;
    }


    .minimum-label {
      color: var(--wic-blue);

      font-size: 8px;
      font-weight: 800;
      letter-spacing: .8px;
    }


    .minimum-box p {
      margin: 3px 0 0;

      color: #405b64;

      font-size: 11px;
      line-height: 1.55;
    }


    .requirement-note {
      margin-top: 11px;

      display: flex;
      align-items: flex-start;
      gap: 8px;

      color: var(--text-medium);
    }


    .requirement-note > span {
      flex: 0 0 auto;

      width: 18px;
      height: 18px;

      display: grid;
      place-items: center;

      border-radius: 50%;

      background: var(--light-blue);

      color: var(--wic-blue);

      font-family: Georgia, serif;
      font-size: 11px;
      font-weight: bold;
    }


    .requirement-note p {
      margin: 0;

      font-size: 10px;
      line-height: 1.55;
    }


    .source-note {
      margin-top: 10px;
      padding: 9px 11px;

      border-left:
        3px solid var(--wic-magenta);

      background: #fbf3f8;

      color: #75556a;

      font-size: 9px;
      line-height: 1.5;
    }


    .inventory-placeholder {
      margin-top: 17px;
      padding: 15px;

      border:
        1px dashed #cbdadd;

      border-radius: 11px;

      background: #fbfcfc;

      color: #8aa0a7;

      text-align: center;

      font-size: 10px;
      font-weight: 700;
    }


    .sticky-card {
      position: sticky;
      top: 100px;

      padding: 22px;

      border:
        1px solid var(--border);

      border-radius: 18px;

      background: white;

      box-shadow: var(--shadow-sm);
    }


    .sidebar-kicker {
      color: var(--wic-magenta);

      font-size: 8px;
      font-weight: 800;
      letter-spacing: 1px;
    }


    .sidebar-card h3 {
      margin: 3px 0 20px;

      color: var(--wic-blue-dark);

      font-family:
        "Manrope",
        sans-serif;

      font-size: 17px;
    }


    .sidebar-stats {
      display: grid;
      gap: 15px;
    }


    .sidebar-stat {
      display: flex;
      align-items: center;
      gap: 11px;
    }


    .stat-icon {
      flex: 0 0 auto;

      width: 35px;
      height: 35px;

      display: grid;
      place-items: center;

      border-radius: 10px;

      font-size: 13px;
      font-weight: 900;
    }


    .stat-neutral {
      background: #edf1f2;
      color: #758a91;
    }


    .stat-success {
      background: var(--light-green);
      color: var(--success);
    }


    .stat-warning {
      background: #fff0dd;
      color: var(--warning);
    }


    .sidebar-stat > div:last-child {
      display: flex;
      flex-direction: column;
    }


    .sidebar-stat strong {
      color: var(--wic-blue-dark);

      font-family:
        "Manrope",
        sans-serif;

      font-size: 16px;
      line-height: 1;
    }


    .sidebar-stat span {
      margin-top: 3px;

      color: var(--text-light);

      font-size: 9px;
    }


    .sidebar-divider {
      height: 1px;

      margin: 21px 0;

      background: var(--border);
    }


    .sidebar-help strong {
      color: var(--wic-blue-dark);

      font-size: 11px;
    }


    .sidebar-help p {
      margin: 5px 0 0;

      color: var(--text-medium);

      font-size: 9px;
      line-height: 1.6;
    }


    .finish-button {
      width: 100%;

      margin-top: 20px;
      padding: 12px 14px;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;

      border: 0;
      border-radius: 11px;

      background: var(--wic-blue);

      color: white;

      font-size: 10px;
      font-weight: 800;
    }


    .finish-button:disabled {
      cursor: not-allowed;

      background: #d8e1e4;
      color: #8da0a6;
    }


    @media (max-width: 900px) {

      .assessment-intro {
        grid-template-columns: 1fr;

        gap: 25px;
      }


      .assessment-layout {
        grid-template-columns: 1fr;
      }


      .assessment-sidebar {
        order: -1;
      }


      .sticky-card {
        position: static;
      }


      .sidebar-stats {
        grid-template-columns:
          repeat(3, 1fr);
      }


      .sidebar-help,
      .sidebar-divider {
        display: none;
      }

    }


    @media (max-width: 600px) {

      .assessment-topbar-inner,
      .assessment-container {
        width:
          min(
            calc(100% - 28px),
            var(--max-width)
          );
      }


      .assessment-container {
        padding-top: 30px;
      }


      .assessment-heading h1 {
        font-size: 31px;
      }


      .assessment-summary-card {
        padding: 17px;
      }


      .summary-ring {
        width: 59px;
        height: 59px;
      }


      .summary-ring::after {
        width: 46px;
        height: 46px;
      }


      .sidebar-stats {
        grid-template-columns: 1fr;
      }


      .assessment-section-heading {
        align-items: flex-start;
        flex-direction: column;
        gap: 4px;
      }


      .requirement-card {
        grid-template-columns: 1fr;
      }


      .requirement-number {
        padding: 7px 16px;

        text-align: left;
      }


      .requirement-body {
        padding: 18px;
      }


      .requirement-header {
        flex-direction: column;
        gap: 9px;
      }


      .requirement-status {
        align-self: flex-start;
      }

    }

  `;

  document.head.appendChild(style);
}
