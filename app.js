/* =========================================================
   WV WIC STOCKCHECK — Guided Assessment
   ========================================================= */
let selectedPeerGroup = null;
let currentCategoryIndex = 0;
let assessmentState = {};

document.addEventListener("DOMContentLoaded", initializePeerGroupCards);

function initializePeerGroupCards() {
  document.querySelectorAll(".peer-card").forEach(card => {
    card.addEventListener("click", () => selectPeerGroup(card.dataset.peer));
  });
}

function selectPeerGroup(peerNumber) {
  const peerData = STOCKING_REQUIREMENTS[peerNumber];
  if (!peerData) return;
  selectedPeerGroup = String(peerNumber);
  currentCategoryIndex = 0;
  assessmentState = {};
  peerData.requirements.forEach(r => assessmentState[r.id] = { values: {}, result: "not-checked", complete: false });
  renderAssessment();
}

function renderAssessment() {
  const peerData = STOCKING_REQUIREMENTS[selectedPeerGroup];
  const main = document.querySelector("main");
  main.innerHTML = `
    <section class="assessment-page">
      <div class="assessment-topbar"><div class="assessment-topbar-inner">
        <div class="assessment-brand"><img src="wic-color.jpg" alt="WIC"><strong>WV WIC StockCheck</strong></div>
        <button class="back-button" id="backToPeerGroups" type="button">← Change Peer Group</button>
        <div class="assessment-peer-badge">Peer Group ${selectedPeerGroup}</div>
      </div></div>
      <div class="assessment-container">
        <div class="assessment-heading-row">
          <div><span class="section-kicker">GUIDED STOCKING ASSESSMENT</span><h1>${peerData.name}</h1><p>Complete one food category at a time. Your entries are saved as you move through the assessment.</p></div>
          <div class="progress-summary"><strong id="progressText">0 of ${peerData.requirements.length} categories completed</strong><div class="progress-track"><div class="progress-fill" id="assessmentProgress"></div></div></div>
        </div>
        <div class="category-nav-wrap"><div class="category-nav" id="categoryNav"></div></div>
        <div class="assessment-workspace">
          <div id="categoryWorkspace"></div>
          <aside class="assessment-sidebar">
            <img src="wic-color.jpg" class="sidebar-logo" alt="WIC">
            <span class="section-kicker">YOUR STOCKCHECK</span><h3>Assessment Summary</h3>
            <div class="sidebar-stats">
              <div class="sidebar-stat"><span>Not checked</span><strong id="notCheckedCount">${peerData.requirements.length}</strong></div>
              <div class="sidebar-stat"><span>Meets requirement</span><strong id="meetsCount">0</strong></div>
              <div class="sidebar-stat"><span>Needs attention</span><strong id="attentionCount">0</strong></div>
            </div>
            <button class="finish-button" id="finishAssessment" type="button" disabled>View StockCheck Results →</button>
            <p class="sidebar-tip">The results button becomes available after every category has been completed.</p>
          </aside>
        </div>
      </div>
    </section>`;
  document.getElementById("backToPeerGroups").addEventListener("click", returnToHome);
  document.getElementById("finishAssessment").addEventListener("click", showAssessmentResults);
  renderCategoryNav();
  renderCurrentCategory();
  updateAssessmentSummary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCategoryNav() {
  const peerData = STOCKING_REQUIREMENTS[selectedPeerGroup];
  const nav = document.getElementById("categoryNav");
  if (!nav) return;
  nav.innerHTML = peerData.requirements.map((r, i) => {
    const state = assessmentState[r.id];
    const doneClass = state.complete ? `done ${state.result}` : "";
    const icon = state.complete ? (state.result === "meets" ? "✓ " : "! ") : "";
    return `<button type="button" class="category-chip ${i === currentCategoryIndex ? "active" : ""} ${doneClass}" data-index="${i}">${icon}${r.category}</button>`;
  }).join("");
  nav.querySelectorAll(".category-chip").forEach(btn => btn.addEventListener("click", () => {
    saveVisibleCategory();
    currentCategoryIndex = Number(btn.dataset.index);
    renderCategoryNav();
    renderCurrentCategory();
  }));
  requestAnimationFrame(() => nav.querySelector(".category-chip.active")?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}));
}

function renderCurrentCategory() {
  const peerData = STOCKING_REQUIREMENTS[selectedPeerGroup];
  const requirement = peerData.requirements[currentCategoryIndex];
  const state = assessmentState[requirement.id];
  const workspace = document.getElementById("categoryWorkspace");
  workspace.innerHTML = `
    <article class="guided-card" data-requirement="${requirement.id}">
      <div class="guided-card-header">
        <span class="category-counter">CATEGORY ${currentCategoryIndex + 1} OF ${peerData.requirements.length}</span>
        <div class="guided-title-row"><h2>${requirement.category}</h2>${statusMarkup(state.result)}</div>
      </div>
      <div class="guided-card-body">
        <div class="minimum-box"><span class="minimum-label">MINIMUM REQUIREMENT</span><p>${getRequirementSummary(requirement)}</p></div>
        ${requirement.note ? `<div class="requirement-note"><strong>Good to know:</strong> ${requirement.note}</div>` : ""}
        ${requirement.sourceNote ? `<div class="source-note"><strong>Source note:</strong> ${requirement.sourceNote}</div>` : ""}
        <div class="inventory-section">
          <div class="inventory-section-header"><div><span class="inventory-kicker">CURRENT INVENTORY</span><strong>What do you have in stock right now?</strong></div><span class="inventory-help">Enter 0 when you have none</span></div>
          ${buildInventoryFields(requirement)}
        </div>
      </div>
      <div class="guided-actions">
        <span class="validation-message" id="validationMessage"></span>
        <div class="action-group">
          <button class="secondary-button" id="previousCategory" type="button" ${currentCategoryIndex === 0 ? "disabled" : ""}>← Previous</button>
          <button class="continue-button" id="continueCategory" type="button">${currentCategoryIndex === peerData.requirements.length - 1 ? "Save Category" : "Save & Continue →"}</button>
        </div>
      </div>
    </article>`;
  restoreCategoryValues(requirement);
  workspace.querySelectorAll("input[data-field]").forEach(input => {
    input.addEventListener("input", previewVisibleCategory);
    input.addEventListener("change", previewVisibleCategory);
  });
  document.getElementById("previousCategory").addEventListener("click", () => {
    saveVisibleCategory(false);
    if (currentCategoryIndex > 0) { currentCategoryIndex--; renderCategoryNav(); renderCurrentCategory(); scrollToWorkspace(); }
  });
  document.getElementById("continueCategory").addEventListener("click", () => {
    if (!saveVisibleCategory(true)) return;
    if (currentCategoryIndex < peerData.requirements.length - 1) {
      currentCategoryIndex++; renderCategoryNav(); renderCurrentCategory(); scrollToWorkspace();
    } else {
      renderCategoryNav(); updateAssessmentSummary();
      if (allCategoriesComplete()) showAssessmentResults();
    }
  });
}

function statusMarkup(result) {
  if (result === "meets") return `<div class="requirement-status status-success">✓ Meets Requirement</div>`;
  if (result === "attention") return `<div class="requirement-status status-attention">! Needs Attention</div>`;
  return `<div class="requirement-status status-not-checked">○ Not Checked</div>`;
}

function numberField(id, field, label, helper, step="1") {
  return `<label class="stock-field"><span class="stock-field-label">${label}</span><input type="number" min="0" step="${step}" inputmode="decimal" placeholder="0" data-requirement="${id}" data-field="${field}"><span class="stock-field-helper">${helper}</span></label>`;
}

function buildInventoryFields(r) {
  switch (r.type) {
    case "standard": return `<div class="inventory-grid">${r.varieties !== undefined ? numberField(r.id,"varieties","Varieties in stock",`Minimum: ${r.varieties}`) : ""}${numberField(r.id,"quantity","Quantity in stock",`Minimum: ${r.minimum} ${r.unit}`)}</div>`;
    case "formula": return `<div class="inventory-grid">${numberField(r.id,"quantity","Total qualifying containers",`Minimum: ${r.minimum}`)}</div>${checkboxSection(r.id,"Required formulas represented","Check each formula currently represented in stock.",r.formulas,"formula-")}`;
    case "formula-request": return `<div class="inventory-grid">${numberField(r.id,"quantity","Total qualifying containers",`Minimum: ${r.minimum}`)}</div>${checkboxSection(r.id,"Required formulas represented","Check each required formula currently represented in stock.",r.formulasRequired,"required-formula-")}<div class="request-formula-note"><strong>72-hour request provision</strong><span>${r.formulasOnRequest.join(" and ")} must be stocked within 72 hours when requested by a WIC customer or staff member.</span></div>`;
    case "infant-produce": return `<div class="inventory-grid">${numberField(r.id,"varieties","Varieties in stock",`Minimum: ${r.varieties}`)}${numberField(r.id,"singles","Single containers",`Equivalent minimum: ${r.singleMinimum}`)}${numberField(r.id,"twoPacks","2-packs",`Equivalent minimum: ${r.twoPackMinimum}`)}</div><p class="field-footnote">Enter both fields, using 0 if you have none of a package type. Singles and 2-packs are combined for the equivalent total.</p>`;
    case "yogurt": return `<div class="inventory-grid">${numberField(r.id,"varieties","Varieties in stock",`Minimum: ${r.varieties}`)}${numberField(r.id,"wholeFat","Whole-fat containers",`Minimum: ${r.wholeFatMinimum}`)}${numberField(r.id,"lowFat","Low-fat containers",`Minimum: ${r.lowFatMinimum}`)}</div>`;
    case "either-size": return `<div class="inventory-grid">${numberField(r.id,"varieties","Varieties in stock",`Minimum: ${r.varieties}`)}${numberField(r.id,"sizeOne",r.options[0].size,`Minimum if used alone: ${r.options[0].minimum}`)}${numberField(r.id,"sizeTwo",r.options[1].size,`Minimum if used alone: ${r.options[1].minimum}`)}</div>`;
    case "cereal": return `<div class="inventory-grid">${numberField(r.id,"varieties","Total varieties",`Minimum: ${r.varieties}`)}${numberField(r.id,"quantity","Boxes or bags",`Minimum: ${r.minimum}`)}${numberField(r.id,"wholeGrain","Whole-grain varieties",`Minimum: ${r.wholeGrainVarieties}`)}</div>`;
    case "beans": return `<div class="inventory-grid">${numberField(r.id,"varieties","Varieties in stock",`Minimum: ${r.varieties}`)}${numberField(r.id,"dried","Dried packages",`Minimum if used alone: ${r.driedMinimum}`)}${numberField(r.id,"canned","Cans",`Minimum if used alone: ${r.cannedMinimum}`)}</div>`;
    case "whole-grain": return `<div class="inventory-grid">${numberField(r.id,"varieties","Total varieties",`Minimum: ${r.varieties}`)}${numberField(r.id,"quantity","Total packages",`Minimum: ${r.minimum}`)}${numberField(r.id,"breadVarieties","Bread varieties",`Minimum: ${r.breadVarieties}`)}</div>`;
    case "milk-pg1": case "milk-pg2": case "milk-pg3": return `<div class="inventory-grid">${numberField(r.id,"quantity","Total gallons",`Minimum: ${r.minimum}`)}${numberField(r.id,"sizes","Container sizes represented",`Minimum: ${r.sizesRequired}`)}</div>${checkboxSection(r.id,"Milk types currently in stock","Check every listed type currently represented.",r.milkTypes,"milk-type-")}`;
    case "split-milk": return `<div class="inventory-grid">${numberField(r.id,"varieties","Qualifying milk types",`Minimum: ${r.varieties}`)}${numberField(r.id,"whole","Whole milk gallons",`Minimum: ${r.wholeMinimum}`)}${numberField(r.id,"lowFat","Low-fat / fat-free gallons",`Minimum: ${r.lowFatMinimum}`)}</div>`;
    case "produce-and": return `<div class="inventory-grid">${numberField(r.id,"varieties","Total varieties",`Minimum: ${r.varieties}`)}${numberField(r.id,"subcategories","Subcategories represented",`Minimum: ${r.subcategories}`)}${r.freshVarieties !== undefined ? numberField(r.id,"freshVarieties","Fresh varieties",`Minimum: ${r.freshVarieties}`) : ""}${numberField(r.id,"freshPounds","Fresh pounds",`Minimum: ${r.freshPounds} lb`)}</div><div class="inventory-subsection"><span class="inventory-subheading">ADDITIONAL CANNED, FROZEN, OR DOLLAR-VALUE STOCK</span><div class="inventory-grid">${numberField(r.id,"canned","Cans",`Minimum if used alone: ${r.cannedMinimum}`)}${numberField(r.id,"frozen","Frozen bags",`Minimum if used alone: ${r.frozenMinimum}`)}${numberField(r.id,"dollarValue","Dollar value",`Minimum if used alone: $${r.dollarMinimum}`,"0.01")}</div></div>`;
    case "produce-or": return `<div class="inventory-grid">${numberField(r.id,"varieties","Varieties in stock",`Minimum: ${r.varieties}`)}${numberField(r.id,"freshPounds","Fresh pounds",`Minimum if used alone: ${r.freshPounds} lb`)}${numberField(r.id,"canned","Cans",`Minimum if used alone: ${r.cannedMinimum}`)}${numberField(r.id,"frozen","Frozen bags",`Minimum if used alone: ${r.frozenMinimum}`)}${numberField(r.id,"dollarValue","Dollar value",`Minimum if used alone: $${r.dollarMinimum}`,"0.01")}</div>`;
    default: return `<div class="requirement-note">Inventory check unavailable for this category.</div>`;
  }
}

function checkboxSection(id,title,instruction,items,prefix) {
  return `<div class="inventory-subsection"><span class="inventory-subheading">${title.toUpperCase()}</span><p class="inventory-instruction">${instruction}</p><div class="check-grid">${items.map((item,i)=>`<label class="inventory-check"><input type="checkbox" data-requirement="${id}" data-field="${prefix}${i}"><span>${item}</span></label>`).join("")}</div></div>`;
}

function restoreCategoryValues(requirement) {
  const state = assessmentState[requirement.id];
  document.querySelectorAll(`input[data-requirement="${requirement.id}"]`).forEach(input => {
    const value = state.values[input.dataset.field];
    if (input.type === "checkbox") input.checked = value === true;
    else if (value !== undefined) input.value = value;
  });
}

function collectVisibleValues(requirement) {
  const values = {};
  document.querySelectorAll(`input[data-requirement="${requirement.id}"]`).forEach(input => {
    values[input.dataset.field] = input.type === "checkbox" ? input.checked : input.value;
  });
  return values;
}

function requiredNumericFields(r) {
  switch(r.type) {
    case "standard": return r.varieties !== undefined ? ["varieties","quantity"] : ["quantity"];
    case "formula": case "formula-request": return ["quantity"];
    case "infant-produce": return ["varieties","singles","twoPacks"];
    case "yogurt": return ["varieties","wholeFat","lowFat"];
    case "either-size": return ["varieties","sizeOne","sizeTwo"];
    case "cereal": return ["varieties","quantity","wholeGrain"];
    case "beans": return ["varieties","dried","canned"];
    case "whole-grain": return ["varieties","quantity","breadVarieties"];
    case "milk-pg1": case "milk-pg2": case "milk-pg3": return ["quantity","sizes"];
    case "split-milk": return ["varieties","whole","lowFat"];
    case "produce-and": return ["varieties","subcategories",...(r.freshVarieties!==undefined?["freshVarieties"]:[]),"freshPounds","canned","frozen","dollarValue"];
    case "produce-or": return ["varieties","freshPounds","canned","frozen","dollarValue"];
    default: return [];
  }
}

function isCategoryComplete(requirement, values) {
  return requiredNumericFields(requirement).every(field => values[field] !== undefined && values[field] !== "");
}

function saveVisibleCategory(showValidation=true) {
  const peerData = STOCKING_REQUIREMENTS[selectedPeerGroup];
  const r = peerData.requirements[currentCategoryIndex];
  const values = collectVisibleValues(r);
  const complete = isCategoryComplete(r, values);
  assessmentState[r.id].values = values;
  assessmentState[r.id].complete = complete;
  assessmentState[r.id].result = complete ? evaluateRequirement(r, values) : "not-checked";
  if (!complete && showValidation) {
    const msg = document.getElementById("validationMessage");
    if (msg) msg.textContent = "Please complete every number field. Enter 0 when you have none.";
    updateVisibleStatus(r);
    return false;
  }
  updateVisibleStatus(r);
  updateAssessmentSummary();
  renderCategoryNav();
  return true;
}

function previewVisibleCategory() {
  const peerData = STOCKING_REQUIREMENTS[selectedPeerGroup];
  const r = peerData.requirements[currentCategoryIndex];
  const values = collectVisibleValues(r);
  assessmentState[r.id].values = values;
  if (isCategoryComplete(r, values)) {
    assessmentState[r.id].complete = true;
    assessmentState[r.id].result = evaluateRequirement(r, values);
  } else {
    assessmentState[r.id].complete = false;
    assessmentState[r.id].result = "not-checked";
  }
  updateVisibleStatus(r);
  updateAssessmentSummary();
}

function updateVisibleStatus(r) {
  const el = document.querySelector(".requirement-status");
  if (el) el.outerHTML = statusMarkup(assessmentState[r.id].result);
}

function n(values, field) { return Number(values[field] || 0); }
function checkedCount(values,prefix){ return Object.keys(values).filter(k=>k.startsWith(prefix)&&values[k]===true).length; }
function allChecked(values,prefix,count){ for(let i=0;i<count;i++) if(values[`${prefix}${i}`]!==true) return false; return count>0; }

function evaluateRequirement(r,v) {
  switch(r.type) {
    case "standard": return (n(v,"quantity")>=r.minimum && (r.varieties===undefined || n(v,"varieties")>=r.varieties)) ? "meets":"attention";
    case "formula": return (n(v,"quantity")>=r.minimum && allChecked(v,"formula-",r.formulas.length)) ? "meets":"attention";
    case "formula-request": return (n(v,"quantity")>=r.minimum && allChecked(v,"required-formula-",r.formulasRequired.length)) ? "meets":"attention";
    case "infant-produce": return (n(v,"varieties")>=r.varieties && n(v,"singles")+(n(v,"twoPacks")*2)>=r.singleMinimum) ? "meets":"attention";
    case "yogurt": return (n(v,"varieties")>=r.varieties && n(v,"wholeFat")>=r.wholeFatMinimum && n(v,"lowFat")>=r.lowFatMinimum) ? "meets":"attention";
    case "either-size": return (n(v,"varieties")>=r.varieties && (n(v,"sizeOne")>=r.options[0].minimum || n(v,"sizeTwo")>=r.options[1].minimum)) ? "meets":"attention";
    case "cereal": return (n(v,"varieties")>=r.varieties && n(v,"quantity")>=r.minimum && n(v,"wholeGrain")>=r.wholeGrainVarieties) ? "meets":"attention";
    case "beans": return (n(v,"varieties")>=r.varieties && (n(v,"dried")>=r.driedMinimum || n(v,"canned")>=r.cannedMinimum)) ? "meets":"attention";
    case "whole-grain": return (n(v,"varieties")>=r.varieties && n(v,"quantity")>=r.minimum && (r.breadVarieties===undefined || n(v,"breadVarieties")>=r.breadVarieties)) ? "meets":"attention";
    case "milk-pg1": return (n(v,"quantity")>=r.minimum && n(v,"sizes")>=r.sizesRequired && allChecked(v,"milk-type-",r.milkTypes.length)) ? "meets":"attention";
    case "milk-pg2": case "milk-pg3": { const count=r.statedTypeCount ?? r.varieties ?? r.typeCount ?? r.milkTypeMinimum ?? r.milkTypes.length; return (n(v,"quantity")>=r.minimum && n(v,"sizes")>=r.sizesRequired && checkedCount(v,"milk-type-")>=count) ? "meets":"attention"; }
    case "split-milk": return (n(v,"varieties")>=r.varieties && n(v,"whole")>=r.wholeMinimum && n(v,"lowFat")>=r.lowFatMinimum) ? "meets":"attention";
    case "produce-and": { const freshOk=r.freshVarieties===undefined || n(v,"freshVarieties")>=r.freshVarieties; const extra=n(v,"canned")>=r.cannedMinimum || n(v,"frozen")>=r.frozenMinimum || n(v,"dollarValue")>=r.dollarMinimum; return (n(v,"varieties")>=r.varieties && n(v,"subcategories")>=r.subcategories && freshOk && n(v,"freshPounds")>=r.freshPounds && extra) ? "meets":"attention"; }
    case "produce-or": return (n(v,"varieties")>=r.varieties && (n(v,"freshPounds")>=r.freshPounds || n(v,"canned")>=r.cannedMinimum || n(v,"frozen")>=r.frozenMinimum || n(v,"dollarValue")>=r.dollarMinimum)) ? "meets":"attention";
    default: return "attention";
  }
}

function updateAssessmentSummary() {
  const peerData = STOCKING_REQUIREMENTS[selectedPeerGroup];
  const states = peerData.requirements.map(r=>assessmentState[r.id]);
  const completed=states.filter(s=>s.complete).length;
  const meets=states.filter(s=>s.complete&&s.result==="meets").length;
  const attention=states.filter(s=>s.complete&&s.result==="attention").length;
  const total=states.length;
  const pct=total?Math.round(completed/total*100):0;
  const set=(id,val)=>{const e=document.getElementById(id);if(e)e.textContent=val;};
  set("progressText",`${completed} of ${total} categories completed`); set("notCheckedCount",total-completed); set("meetsCount",meets); set("attentionCount",attention);
  const bar=document.getElementById("assessmentProgress"); if(bar)bar.style.width=`${pct}%`;
  const finish=document.getElementById("finishAssessment"); if(finish)finish.disabled=completed!==total;
}
function allCategoriesComplete(){ const p=STOCKING_REQUIREMENTS[selectedPeerGroup]; return p.requirements.every(r=>assessmentState[r.id].complete); }
function scrollToWorkspace(){ document.querySelector(".category-nav-wrap")?.scrollIntoView({behavior:"smooth",block:"start"}); }

function showAssessmentResults() {
  if (!allCategoriesComplete()) return;
  const peerData=STOCKING_REQUIREMENTS[selectedPeerGroup];
  const results=peerData.requirements.map(r=>({requirement:r,result:assessmentState[r.id].result}));
  renderResultsPage(results);
}

function renderResultsPage(results) {
  const peerData=STOCKING_REQUIREMENTS[selectedPeerGroup];
  const meets=results.filter(x=>x.result==="meets"), attention=results.filter(x=>x.result==="attention"), total=results.length, allMeet=attention.length===0;
  document.querySelector("main").innerHTML=`<section class="results-page">
    <div class="assessment-topbar"><div class="assessment-topbar-inner"><div class="assessment-brand"><img src="wic-color.jpg" alt="WIC"><strong>WV WIC StockCheck</strong></div><button class="back-button" id="resultsBackHome">← Start New StockCheck</button><div class="assessment-peer-badge">Peer Group ${selectedPeerGroup}</div></div></div>
    <div class="results-container">
      <section class="results-hero ${allMeet?"success":"attention"}"><img src="wic-color.jpg" class="results-logo" alt="WIC"><div><span class="section-kicker">STOCKCHECK RESULTS</span><h1>${allMeet?"All categories meet the minimum requirements":`${attention.length} ${pluralize("category",attention.length)} need attention`}</h1><p>${allMeet?`Based on the inventory entered, all ${total} categories for Peer Group ${selectedPeerGroup} meet the displayed minimum stocking requirements.`:`${meets.length} of ${total} categories meet the displayed minimum stocking requirements. Review the items below that need attention.`}</p></div></section>
      <section class="results-stat-grid"><div class="results-stat-card"><span>Total Categories</span><strong>${total}</strong></div><div class="results-stat-card"><span>Meets Requirement</span><strong>${meets.length}</strong></div><div class="results-stat-card"><span>Needs Attention</span><strong>${attention.length}</strong></div></section>
      ${attention.length?`<section class="results-section"><div class="results-section-heading"><div><span class="section-kicker">REVIEW THESE ITEMS</span><h2>Needs Attention</h2></div></div><div class="results-list">${buildResultsList(attention,false)}</div></section>`:""}
      <section class="results-section"><div class="results-section-heading"><div><span class="section-kicker">REQUIREMENTS MET</span><h2>Meets Requirement</h2></div></div><div class="results-list">${meets.length?buildResultsList(meets,true):`<div class="results-disclaimer">No categories currently meet the displayed minimum requirements.</div>`}</div></section>
      <section class="results-disclaimer"><strong>About these results</strong><br>StockCheck compares the inventory entered with the minimum stocking requirements represented in this tool. It is intended to support stocking review and does not replace official WV WIC guidance or vendor requirements.</section>
      <div class="results-actions"><button class="results-primary-button" id="startNewAssessment">Start New StockCheck</button></div>
    </div></section>`;
  document.getElementById("resultsBackHome").addEventListener("click",returnToHome); document.getElementById("startNewAssessment").addEventListener("click",returnToHome); window.scrollTo({top:0,behavior:"smooth"});
}
function buildResultsList(items,isSuccess){return items.map(({requirement})=>`<article class="result-item"><div class="result-item-icon ${isSuccess?"result-icon-success":"result-icon-attention"}">${isSuccess?"✓":"!"}</div><div><h3>${requirement.category}</h3><p>${getRequirementSummary(requirement)}</p>${requirement.sourceNote?`<div class="source-note"><strong>Source note:</strong> ${requirement.sourceNote}</div>`:""}</div><span class="result-item-status ${isSuccess?"result-status-success":"result-status-attention"}">${isSuccess?"Meets Requirement":"Needs Attention"}</span></article>`).join("");}

function getRequirementSummary(r){switch(r.type){case"standard":return`${r.varieties!==undefined?`At least ${r.varieties} ${pluralize("variety",r.varieties)} and `:""}${r.minimum} ${r.unit}.`;case"formula":return`${r.minimum} ${r.unit} across the required contract formulas. One representative container of each required formula must be available.`;case"formula-request":return`${r.minimum} ${r.unit} across the required contract formulas. ${r.formulasRequired.join(" and ")} are required for minimum stock.`;case"infant-produce":return`At least ${r.varieties} varieties and the equivalent of ${r.singleMinimum} single containers (${r.twoPackMinimum} two-packs if used alone).`;case"yogurt":return`At least ${r.varieties} varieties, ${r.wholeFatMinimum} whole-fat containers AND ${r.lowFatMinimum} low-fat containers.`;case"either-size":return`At least ${r.varieties} ${pluralize("variety",r.varieties)} and either ${r.options[0].minimum} ${r.options[0].size} OR ${r.options[1].minimum} ${r.options[1].size}.`;case"cereal":return`At least ${r.varieties} varieties and ${r.minimum} ${r.unit}. At least ${r.wholeGrainVarieties} ${pluralize("variety",r.wholeGrainVarieties)} must be whole grain.`;case"beans":return`At least ${r.varieties} ${pluralize("variety",r.varieties)} and either ${r.driedMinimum} ${r.driedSize} of dried beans OR ${r.cannedMinimum} ${r.cannedSize}.`;case"whole-grain":return`At least ${r.varieties} varieties and ${r.minimum} ${r.unit}.${r.breadVarieties!==undefined?` At least ${r.breadVarieties} ${pluralize("variety",r.breadVarieties)} must be bread.`:""}`;case"milk-pg1":case"milk-pg2":case"milk-pg3":return`${r.minimum} ${r.unit}. Required milk types shown: ${r.milkTypes.join(", ")}. At least ${r.sizesRequired} sizes.`;case"split-milk":return`At least ${r.varieties} approved milk types, including ${r.wholeMinimum} ${pluralize("gallon",r.wholeMinimum)} whole milk AND ${r.lowFatMinimum} gallons low-fat and/or fat-free milk.`;case"produce-and":return`At least ${r.varieties} varieties across ${r.subcategories} subcategories.${r.freshVarieties!==undefined?` At least ${r.freshVarieties} must be fresh.`:""} Minimum fresh stock: ${r.freshPounds} pounds, PLUS either ${r.cannedMinimum} cans, ${r.frozenMinimum} bags frozen, OR $${r.dollarMinimum} value.`;case"produce-or":return`At least ${r.varieties} varieties and either ${r.freshPounds} pounds fresh, ${r.cannedMinimum} cans, ${r.frozenMinimum} bags frozen, OR $${r.dollarMinimum} value.`;default:return"See current WV WIC minimum stocking requirements."}}
function pluralize(word,number){return number===1?word:`${word}s`}
function returnToHome(){window.location.reload()}
