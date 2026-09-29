/* =========================================================
   WV WIC STOCKCHECK
   MINIMUM STOCKING REQUIREMENTS

   Source:
   Vendor Policy 8.11
   Attachment #1
   Vendor Peer Group Minimum Stock Requirements

   Policy reconciliation: September 2026
   ========================================================= */

const STOCK_REQUIREMENTS = {

  /* =======================================================
     PEER GROUP 1
     MASS MERCHANDISERS
     ======================================================= */

  1: {
    name: "Mass Merchandisers",

    requirements: [

      {
        id: "formula",
        category: "Infant Formula",
        type: "formula",

        formulas: [
          "Similac Advance OptiGRO",
          "Similac Sensitive for Fussiness and Gas",
          "Similac Total Comfort",
          "Gerber Good Start Soy"
        ],

        minimum: 108,
        unit: "containers",
        representativeMinimum: 4,

        note:
          "Stock 108 total containers of contract infant formula. Vendors must have at least one representative container of each required formula in concentrate, Ready-to-Feed (RTF), or powder. Only contract formula counts toward the minimum stocking requirement."
      },

      {
        id: "infant-cereal",
        category: "Infant Cereal",
        type: "standard",

        varieties: 3,
        minimum: 15,
        unit: "8-ounce boxes or plastic containers"
      },

      {
        id: "infant-fruits",
        category: "Infant Fruits",
        type: "infant-produce",

        varieties: 4,
        singleMinimum: 64,
        twoPackMinimum: 32,

        unit: "4-ounce jars or plastic containers",

        note:
          "WV WIC approved single ingredient or combinations of single ingredient fruit without added sugars, starches, or salt (sodium). Meet the container requirement with any equivalent combination of single containers and 2-packs."
      },

      {
        id: "infant-vegetables",
        category: "Infant Vegetables",
        type: "infant-produce",

        varieties: 4,
        singleMinimum: 64,
        twoPackMinimum: 32,

        unit: "4-ounce jars or plastic containers",

        note:
          "WV WIC approved single ingredient or combinations of single ingredient vegetables without added sugars, starches, or salt (sodium). Meet the container requirement with any equivalent combination of single containers and 2-packs."
      },

      {
        id: "infant-meats",
        category: "Infant Meats",
        type: "standard",

        varieties: 2,
        minimum: 20,
        unit: "2.5-ounce jars or plastic containers",

        note:
          "WV WIC approved infant food meat or poultry with added broth or gravy, but without added sugars or salt."
      },

      {
        id: "milk",
        category: "Milk",
        type: "milk-total",

        varieties: 5,
        minimum: 16,
        sizesRequired: 2,

        unit: "gallons total",

        milkTypes: [
          "Whole",
          "Low-fat (1%)",
          "Fat free (skim)",
          "Lactose free",
          "Soy milk"
        ],

        note:
          "Stock five qualifying milk types and at least 16 gallons total in any combination of gallons and/or half gallons. At least two different container sizes must be stocked."
      },

      {
        id: "yogurt",
        category: "Yogurt",
        type: "yogurt",

        varieties: 2,
        wholeFatMinimum: 4,
        lowFatMinimum: 12,

        note:
          "Stock at least two varieties. Minimum stock includes four whole-fat 32-ounce containers AND twelve low-fat containers in any combination of approved sizes."
      },

      {
        id: "cheese",
        category: "Cheese",
        type: "equivalent-package",

        varieties: 3,

        packageOptions: [
          {
            field: "eightOunce",
            label: "8-ounce packages",
            ouncesEach: 8
          },
          {
            field: "sixteenOunce",
            label: "16-ounce packages",
            ouncesEach: 16
          }
        ],

        requiredOunces: 80,

        note:
          "Stock at least three varieties in sliced, shredded, or block form. The package requirement is equivalent to ten 8-ounce packages OR five 16-ounce packages, including equivalent combinations."
      },

      {
        id: "eggs",
        category: "Eggs",
        type: "standard",

        minimum: 10,
        unit: "dozen",

        note:
          "Any grade of any size WV WIC approved white chicken eggs."
      },

      {
        id: "breakfast-cereal",
        category: "Breakfast Cereal",
        type: "cereal",

        varieties: 4,
        minimum: 24,
        wholeGrainVarieties: 2,

        unit: "boxes or bags",

        note:
          "At least two varieties must be whole grain. Cold cereal must be 12–36 ounces; hot cereal must be 11–36 ounces."
      },

      {
        id: "juice-64",
        category: "100% Shelf-Stable/Refrigerated Juice",
        type: "standard",

        varieties: 2,
        minimum: 12,

        unit: "64-ounce cans, plastic containers, or cartons"
      },

      {
        id: "juice-concentrate",
        category: "100% Frozen or Shelf-Stable Concentrate Juice",
        type: "standard",

        varieties: 2,
        minimum: 12,

        unit:
          "12-ounce frozen or 11.5-ounce shelf-stable concentrate containers"
      },

      {
        id: "beans",
        category: "Dried or Canned Beans",
        type: "beans-equivalent",

        varieties: 4,
        driedMinimum: 8,
        cannedMinimum: 32,

        driedSize: "16-ounce packages",
        cannedSize: "15- to 16-ounce cans",

        note:
          "Stock at least four varieties. Meet the quantity requirement with dried beans, canned beans, or an equivalent combination."
      },

      {
        id: "peanut-butter",
        category: "Peanut Butter",
        type: "standard",

        varieties: 2,
        minimum: 10,

        unit: "16- to 18-ounce containers"
      },

      {
        id: "whole-grains",
        category: "Whole Grains",
        type: "whole-grain",

        varieties: 4,
        minimum: 16,
        breadVarieties: 2,

        unit: "packages",

        note:
          "Qualifying whole grains include bread, buns, tortillas, pasta, and brown rice. At least two varieties must be bread."
      },

      {
        id: "fruits",
        category: "Fruits",
        type: "produce-policy",

        varieties: 8,
        subcategories: 3,
        freshVarieties: 4,

        freshPounds: 30,
        cannedFrozenOunces: 480,
        dollarMinimum: 35,

        physicalRule: "and",

        note:
          "Stock at least eight varieties across three subcategories (canned, fresh, or frozen), with at least four fresh varieties. Meet the quantity requirement with 30 pounds fresh AND 480 ounces of any combination canned or frozen, OR at least $35 retail value."
      },

      {
        id: "vegetables",
        category: "Vegetables",
        type: "produce-policy",

        varieties: 8,
        subcategories: 3,
        freshVarieties: 4,

        freshPounds: 30,
        cannedFrozenOunces: 480,
        dollarMinimum: 35,

        physicalRule: "and",

        note:
          "Stock at least eight varieties across three subcategories (canned, fresh, or frozen), with at least four fresh varieties. Meet the quantity requirement with 30 pounds fresh AND 480 ounces of any combination canned or frozen, OR at least $35 retail value."
      }

    ]
  },


  /* =======================================================
     PEER GROUP 2
     NATIONAL GROCERY CHAINS
     ======================================================= */

  2: {
    name: "National Grocery Chains",

    requirements: [

      {
        id: "formula",
        category: "Infant Formula",
        type: "formula",

        formulas: [
          "Similac Advance OptiGRO",
          "Similac Sensitive for Fussiness and Gas",
          "Similac Total Comfort",
          "Gerber Good Start Soy"
        ],

        minimum: 84,
        unit: "containers",
        representativeMinimum: 4,

        note:
          "Stock 84 total containers of contract infant formula. Vendors must have at least one representative container of each required formula in concentrate, Ready-to-Feed (RTF), or powder. Only contract formula counts toward the minimum stocking requirement."
      },

      {
        id: "infant-cereal",
        category: "Infant Cereal",
        type: "standard",

        varieties: 3,
        minimum: 12,

        unit: "8-ounce boxes or plastic containers"
      },

      {
        id: "infant-fruits",
        category: "Infant Fruits",
        type: "infant-produce",

        varieties: 4,
        singleMinimum: 48,
        twoPackMinimum: 24,

        unit: "4-ounce jars or plastic containers",

        note:
          "WV WIC approved single ingredient or combinations of single ingredient fruit without added sugars, starches, or salt (sodium). Meet the container requirement with any equivalent combination of single containers and 2-packs."
      },

      {
        id: "infant-vegetables",
        category: "Infant Vegetables",
        type: "infant-produce",

        varieties: 4,
        singleMinimum: 48,
        twoPackMinimum: 24,

        unit: "4-ounce jars or plastic containers",

        note:
          "WV WIC approved single ingredient or combinations of single ingredient vegetables without added sugars, starches, or salt (sodium). Meet the container requirement with any equivalent combination of single containers and 2-packs."
      },

      {
        id: "infant-meats",
        category: "Infant Meats",
        type: "standard",

        varieties: 1,

        /*
         Policy Attachment #1 prints:
         "Ten (1) 2.5-ounce jars..."

         StockCheck uses 10 because the written
         quantity is "Ten." Confirm the parenthetical
         typo with WV WIC policy staff.
        */

        minimum: 10,

        unit: "2.5-ounce jars or plastic containers",

        note:
          "WV WIC approved infant food meat or poultry with added broth or gravy, but without added sugars or salt."
      },

      {
        id: "milk",
        category: "Milk",
        type: "milk-total",

        /*
         Policy states four types while listing:
         whole, low-fat, fat-free, lactose-free, or soy.
         The minimum explicitly says four types.
        */

        varieties: 4,
        minimum: 12,
        sizesRequired: 2,

        unit: "gallons total",

        milkTypes: [
          "Whole",
          "Low-fat (1%)",
          "Fat free (skim)",
          "Lactose free",
          "Soy milk"
        ],

        note:
          "Stock at least four qualifying milk types and 12 gallons total in any combination of gallons and/or half gallons. At least two different container sizes must be stocked."
      },

      {
        id: "yogurt",
        category: "Yogurt",
        type: "yogurt",

        varieties: 2,
        wholeFatMinimum: 2,
        lowFatMinimum: 6,

        note:
          "Stock at least two varieties. Minimum stock includes two whole-fat 32-ounce containers AND six low-fat containers in any combination of approved sizes."
      },

      {
        id: "cheese",
        category: "Cheese",
        type: "equivalent-package",

        varieties: 3,

        packageOptions: [
          {
            field: "eightOunce",
            label: "8-ounce packages",
            ouncesEach: 8
          },
          {
            field: "sixteenOunce",
            label: "16-ounce packages",
            ouncesEach: 16
          }
        ],

        requiredOunces: 64,

        note:
          "Stock at least three varieties in sliced, shredded, or block form. The package requirement is equivalent to eight 8-ounce packages OR four 16-ounce packages, including equivalent combinations."
      },

      {
        id: "eggs",
        category: "Eggs",
        type: "standard",

        minimum: 8,
        unit: "dozen",

        note:
          "Any grade of any size WV WIC approved white chicken eggs."
      },

      {
        id: "breakfast-cereal",
        category: "Breakfast Cereal",
        type: "cereal",

        varieties: 4,
        minimum: 20,
        wholeGrainVarieties: 2,

        unit: "boxes or bags",

        note:
          "At least two varieties must be whole grain. Cold cereal must be 12–36 ounces; hot cereal must be 11–36 ounces."
      },

      {
        id: "juice-64",
        category: "100% Shelf-Stable/Refrigerated Juice",
        type: "standard",

        varieties: 2,
        minimum: 8,

        unit: "64-ounce cans, plastic containers, or cartons"
      },

      {
        id: "juice-concentrate",
        category: "100% Frozen or Shelf-Stable Concentrate Juice",
        type: "standard",

        varieties: 2,
        minimum: 6,

        unit:
          "12-ounce frozen or 11.5-ounce shelf-stable concentrate containers"
      },

      {
        id: "beans",
        category: "Dried or Canned Beans",
        type: "beans-equivalent",

        varieties: 3,
        driedMinimum: 6,
        cannedMinimum: 24,

        driedSize: "16-ounce packages",
        cannedSize: "15- to 16-ounce cans",

        note:
          "Stock at least three varieties. Meet the quantity requirement with dried beans, canned beans, or an equivalent combination."
      },

      {
        id: "peanut-butter",
        category: "Peanut Butter",
        type: "standard",

        varieties: 2,
        minimum: 8,

        unit: "16- to 18-ounce containers"
      },

      {
        id: "whole-grains",
        category: "Whole Grains",
        type: "whole-grain",

        varieties: 2,
        minimum: 8,
        breadVarieties: 1,

        unit: "packages",

        note:
          "Qualifying whole grains include bread, buns, tortillas, pasta, and brown rice. At least one variety must be bread."
      },

      {
        id: "fruits",
        category: "Fruits",
        type: "produce-policy",

        varieties: 6,
        subcategories: 2,
        freshVarieties: 3,

        freshPounds: 15,
        cannedFrozenOunces: 240,
        dollarMinimum: 30,

        physicalRule: "and",

        note:
          "Stock at least six varieties across two different subcategories, with at least three fresh varieties. Meet the quantity requirement with 15 pounds fresh AND 240 ounces of any combination canned or frozen, OR at least $30 retail value."
      },

      {
        id: "vegetables",
        category: "Vegetables",
        type: "produce-policy",

        varieties: 6,
        subcategories: 2,
        freshVarieties: 3,

        freshPounds: 15,
        cannedFrozenOunces: 240,
        dollarMinimum: 30,

        physicalRule: "and",

        note:
          "Stock at least six varieties across two different subcategories, with at least three fresh varieties. Meet the quantity requirement with 15 pounds fresh AND 240 ounces of any combination canned or frozen, OR at least $30 retail value."
      }

    ]
  },


  /* =======================================================
     PEER GROUP 3
     REGIONAL GROCERY CHAINS
     ======================================================= */

  3: {
    name: "Regional Grocery Chains",

    requirements: [

      {
        id: "formula",
        category: "Infant Formula",
        type: "formula",

        formulas: [
          "Similac Advance OptiGRO",
          "Similac Sensitive for Fussiness and Gas",
          "Similac Total Comfort",
          "Gerber Good Start Soy"
        ],

        minimum: 66,
        unit: "containers",
        representativeMinimum: 4,

        note:
          "Stock 66 total containers of contract infant formula. Vendors must have at least one representative container of each required formula in concentrate, Ready-to-Feed (RTF), or powder. Only contract formula counts toward the minimum stocking requirement."
      },

      {
        id: "infant-cereal",
        category: "Infant Cereal",
        type: "standard",

        varieties: 2,
        minimum: 9,

        unit: "8-ounce boxes or plastic containers"
      },

      {
        id: "infant-fruits",
        category: "Infant Fruits",
        type: "infant-produce",

        varieties: 4,
        singleMinimum: 32,
        twoPackMinimum: 16,

        unit: "4-ounce jars or plastic containers",

        note:
          "WV WIC approved single ingredient or combinations of single ingredient fruit without added sugars, starches, or salt (sodium). Meet the container requirement with any equivalent combination of single containers and 2-packs."
      },

      {
        id: "infant-vegetables",
        category: "Infant Vegetables",
        type: "infant-produce",

        varieties: 4,
        singleMinimum: 32,
        twoPackMinimum: 16,

        unit: "4-ounce jars or plastic containers",

        note:
          "WV WIC approved single ingredient or combinations of single ingredient vegetables without added sugars, starches, or salt (sodium). Meet the container requirement with any equivalent combination of single containers and 2-packs."
      },

      {
        id: "milk",
        category: "Milk",
        type: "milk-total",

        varieties: 3,
        minimum: 8,
        sizesRequired: 2,

        unit: "gallons total",

        milkTypes: [
          "Whole",
          "Low-fat (1%)",
          "Fat free (skim)",
          "Lactose free"
        ],

        note:
          "Stock at least three qualifying milk types and eight gallons total in any combination of gallons and/or half gallons. At least two different container sizes must be stocked. The attachment states that no minimum stock requirement exists for soy milk."
      },

      {
        id: "cheese",
        category: "Cheese",
        type: "equivalent-package",

        varieties: 2,

        packageOptions: [
          {
            field: "eightOunce",
            label: "8-ounce packages",
            ouncesEach: 8
          },
          {
            field: "sixteenOunce",
            label: "16-ounce packages",
            ouncesEach: 16
          }
        ],

        requiredOunces: 48,

        note:
          "Stock at least two varieties in sliced, shredded, or block form. The package requirement is equivalent to six 8-ounce packages OR three 16-ounce packages, including equivalent combinations."
      },

      {
        id: "eggs",
        category: "Eggs",
        type: "standard",

        minimum: 6,
        unit: "dozen",

        note:
          "Any grade of any size WV WIC approved white chicken eggs."
      },

      {
        id: "breakfast-cereal",
        category: "Breakfast Cereal",
        type: "cereal",

        varieties: 4,
        minimum: 12,
        wholeGrainVarieties: 2,

        unit: "boxes or bags",

        note:
          "At least two varieties must be whole grain. Cold cereal must be 12–36 ounces; hot cereal must be 11–36 ounces."
      },

      {
        id: "juice-64",
        category: "100% Shelf-Stable/Refrigerated Juice",
        type: "standard",

        varieties: 2,
        minimum: 4,

        unit: "64-ounce cans, plastic containers, or cartons"
      },

      {
        id: "juice-concentrate",
        category: "100% Shelf-Stable/Frozen Juice",
        type: "standard",

        varieties: 1,
        minimum: 3,

        unit:
          "12-ounce frozen or 11.5-ounce shelf-stable concentrate containers"
      },

      {
        id: "beans",
        category: "Dried or Canned Beans",
        type: "beans-equivalent",

        varieties: 2,
        driedMinimum: 4,
        cannedMinimum: 16,

        driedSize: "16-ounce bags",
        cannedSize: "15- to 16-ounce cans",

        note:
          "Stock at least two varieties. Meet the quantity requirement with dried beans, canned beans, or an equivalent combination."
      },

      {
        id: "peanut-butter",
        category: "Peanut Butter",
        type: "standard",

        varieties: 1,
        minimum: 6,

        unit: "16- to 18-ounce containers"
      },

      {
        id: "whole-grains",
        category: "Whole Grains",
        type: "whole-grain",

        varieties: 2,
        minimum: 6,
        breadVarieties: 1,

        unit: "packages",

        note:
          "Qualifying whole grains include bread, buns, tortillas, pasta, and brown rice. At least one variety must be bread."
      },

      {
        id: "fruits",
        category: "Fruits",
        type: "produce-policy",

        varieties: 4,
        subcategories: 2,
        freshVarieties: 2,

        freshPounds: 10,
        cannedFrozenOunces: 160,
        dollarMinimum: 25,

        physicalRule: "and",

        note:
          "Stock at least four varieties across two different subcategories, with at least two fresh varieties. Meet the quantity requirement with 10 pounds fresh AND 160 ounces of any combination canned or frozen, OR at least $25 retail value."
      },

      {
        id: "vegetables",
        category: "Vegetables",
        type: "produce-policy",

        varieties: 4,
        subcategories: 2,
        freshVarieties: 2,

        freshPounds: 10,
        cannedFrozenOunces: 160,
        dollarMinimum: 25,

        physicalRule: "and",

        note:
          "Stock at least four varieties across two different subcategories, with at least two fresh varieties. Meet the quantity requirement with 10 pounds fresh AND 160 ounces of any combination canned or frozen, OR at least $25 retail value."
      }

    ]
  },


  /* =======================================================
     PEER GROUP 4
     LOCAL GROCERY CHAINS
     ======================================================= */

  4: {
    name: "Local Grocery Chains",

    requirements: [

      {
        id: "formula",
        category: "Infant Formula",
        type: "formula-request",

        formulasRequired: [
          "Similac Advance OptiGRO",
          "Similac Sensitive for Fussiness and Gas"
        ],

        formulasOnRequest: [
          "Similac Total Comfort",
          "Gerber Good Start Soy"
        ],

        minimum: 48,
        unit: "containers",
        representativeMinimum: 2,

        note:
          "Stock 48 total containers of required contract infant formula. Vendors must have at least one representative container of each required formula in concentrate, Ready-to-Feed (RTF), or powder. If a WIC customer or WIC staff member requests Similac Total Comfort and/or Gerber Good Start Soy, the store has 72 hours to stock the product. Only contract formula counts toward the minimum."
      },

      {
        id: "infant-cereal",
        category: "Infant Cereal",
        type: "standard",

        varieties: 2,
        minimum: 6,

        unit: "8-ounce boxes or plastic containers"
      },

      {
        id: "infant-fruits",
        category: "Infant Fruits",
        type: "infant-produce",

        varieties: 2,
        singleMinimum: 20,
        twoPackMinimum: 10,

        unit: "4-ounce jars or plastic containers",

        note:
          "WV WIC approved single ingredient or combinations of single ingredient fruit without added sugars, starches, or salt (sodium). Meet the container requirement with any equivalent combination of single containers and 2-packs."
      },

      {
        id: "infant-vegetables",
        category: "Infant Vegetables",
        type: "infant-produce",

        varieties: 2,
        singleMinimum: 20,
        twoPackMinimum: 10,

        unit: "4-ounce jars or plastic containers",

        note:
          "WV WIC approved single ingredient or combinations of single ingredient vegetables without added sugars, starches, or salt (sodium). Meet the container requirement with any equivalent combination of single containers and 2-packs."
      },

      {
        id: "milk",
        category: "Milk",
        type: "split-milk",

        varieties: 2,

        wholeMinimum: 2,
        lowFatMinimum: 4,

        milkTypes: [
          "Whole",
          "Low-fat (1%)",
          "Fat free (skim)"
        ],

        note:
          "Stock two gallons of whole milk AND four gallons of low-fat and/or fat-free milk. No minimum stock requirement exists for soy milk, lactose-free milk, yogurt, or half gallons."
      },

      {
        id: "cheese",
        category: "Cheese",
        type: "equivalent-package",

        varieties: 2,

        packageOptions: [
          {
            field: "eightOunce",
            label: "8-ounce packages",
            ouncesEach: 8
          },
          {
            field: "sixteenOunce",
            label: "16-ounce packages",
            ouncesEach: 16
          }
        ],

        requiredOunces: 32,

        note:
          "Stock at least two varieties in sliced, shredded, or block form. The package requirement is equivalent to four 8-ounce packages OR two 16-ounce packages, including equivalent combinations."
      },

      {
        id: "eggs",
        category: "Eggs",
        type: "standard",

        minimum: 4,
        unit: "dozen",

        note:
          "Any grade of any size WV WIC approved white chicken eggs."
      },

      {
        id: "breakfast-cereal",
        category: "Breakfast Cereal",
        type: "cereal",

        varieties: 3,
        minimum: 9,
        wholeGrainVarieties: 1,

        unit: "boxes or bags",

        note:
          "At least one variety must be whole grain. Cold cereal must be 12–36 ounces; hot cereal must be 11–36 ounces."
      },

      {
        id: "juice-64",
        category: "100% Shelf-Stable/Refrigerated Juice",
        type: "standard",

        varieties: 2,
        minimum: 4,

        unit: "64-ounce cans, plastic containers, or cartons"
      },

      {
        id: "juice-concentrate",
        category: "100% Shelf-Stable/Frozen Juice",
        type: "standard",

        varieties: 1,
        minimum: 2,

        unit:
          "11.5-ounce shelf-stable or 12-ounce frozen containers"
      },

      {
        id: "beans",
        category: "Dried or Canned Beans",
        type: "beans-equivalent",

        varieties: 1,
        driedMinimum: 2,
        cannedMinimum: 8,

        driedSize: "16-ounce packages",
        cannedSize: "15- to 16-ounce cans",

        note:
          "Stock at least one qualifying variety. Meet the quantity requirement with dried beans, canned beans, or an equivalent combination."
      },

      {
        id: "peanut-butter",
        category: "Peanut Butter",
        type: "standard",

        varieties: 1,
        minimum: 4,

        unit: "16- to 18-ounce containers"
      },

      {
        id: "whole-grains",
        category: "Whole Grains",
        type: "standard",

        varieties: 2,
        minimum: 4,

        unit: "packages",

        note:
          "Qualifying whole grains include bread, buns, tortillas, pasta, and brown rice."
      },

      {
        id: "fruits",
        category: "Fruits",
        type: "produce-policy",

        varieties: 3,
        subcategories: 1,
        freshVarieties: 1,

        freshPounds: 6,
        cannedFrozenOunces: 128,
        dollarMinimum: 15,

        physicalRule: "and",

        note:
          "Stock at least three varieties, including at least one fresh variety. Meet the quantity requirement with six pounds fresh AND 128 ounces of any combination canned or frozen, OR at least $15 retail value."
      },

      {
        id: "vegetables",
        category: "Vegetables",
        type: "produce-policy",

        varieties: 3,
        subcategories: 1,
        freshVarieties: 1,

        freshPounds: 6,
        cannedFrozenOunces: 128,
        dollarMinimum: 15,

        physicalRule: "and",

        note:
          "Stock at least three varieties, including at least one fresh variety. Meet the quantity requirement with six pounds fresh AND 128 ounces of any combination canned or frozen, OR at least $15 retail value."
      }

    ]
  },


  /* =======================================================
     PEER GROUP 5
     RURAL INDEPENDENT GROCERS
     ======================================================= */

  5: {
    name: "Rural Independent Grocers",

    requirements: buildPeerGroupFiveSixRequirements()
  },


  /* =======================================================
     PEER GROUP 6
     ISOLATED INDEPENDENT STORES
     ======================================================= */

  6: {
    name: "Isolated Independent Stores",

    requirements: buildPeerGroupFiveSixRequirements()
  }

};


/* =========================================================
   PEER GROUPS 5 & 6

   Attachment 8.11 gives PG5 and PG6 the same
   minimum stocking requirements, so they are generated
   from the same policy definition to prevent the two
   groups from drifting apart later.
   ========================================================= */

function buildPeerGroupFiveSixRequirements() {

  return [

    {
      id: "formula",
      category: "Infant Formula",
      type: "formula-request",

      formulasRequired: [
        "Similac Advance OptiGRO",
        "Similac Sensitive for Fussiness and Gas"
      ],

      formulasOnRequest: [
        "Similac Total Comfort",
        "Gerber Good Start Soy"
      ],

      minimum: 24,
      unit: "containers",
      representativeMinimum: 2,

      note:
        "Stock 24 total containers of required contract infant formula. Vendors must have at least one representative container of each required formula in concentrate, Ready-to-Feed (RTF), or powder. If a WIC customer or WIC staff member requests Similac Total Comfort and/or Gerber Good Start Soy, the store has 72 hours to stock the product. Only contract formula counts toward the minimum."
    },

    {
      id: "infant-cereal",
      category: "Infant Cereal",
      type: "standard",

      varieties: 1,
      minimum: 3,

      unit: "8-ounce boxes or plastic containers"
    },

    {
      id: "infant-fruits",
      category: "Infant Fruits",
      type: "infant-produce",

      varieties: 2,
      singleMinimum: 16,
      twoPackMinimum: 8,

      unit: "4-ounce jars or plastic containers",

      note:
        "WV WIC approved single ingredient or combinations of single ingredient fruit without added sugars, starches, or salt (sodium). Meet the container requirement with any equivalent combination of single containers and 2-packs."
    },

    {
      id: "infant-vegetables",
      category: "Infant Vegetables",
      type: "infant-produce",

      varieties: 2,
      singleMinimum: 16,
      twoPackMinimum: 8,

      unit: "4-ounce jars or plastic containers",

      note:
        "WV WIC approved single ingredient or combinations of single ingredient vegetables without added sugars, starches, or salt (sodium). Meet the container requirement with any equivalent combination of single containers and 2-packs."
    },

    {
      id: "milk",
      category: "Milk",
      type: "split-milk",

      varieties: 2,

      wholeMinimum: 1,
      lowFatMinimum: 3,

      milkTypes: [
        "Whole",
        "Low-fat (1%)",
        "Fat free (skim)"
      ],

      note:
        "Stock one gallon of whole milk AND three gallons of low-fat and/or fat-free milk. No minimum stock requirement exists for soy milk, lactose-free milk, yogurt, or half gallons."
    },

    {
      id: "cheese",
      category: "Cheese",
      type: "equivalent-package",

      varieties: 1,

      packageOptions: [
        {
          field: "eightOunce",
          label: "8-ounce packages",
          ouncesEach: 8
        },
        {
          field: "sixteenOunce",
          label: "16-ounce packages",
          ouncesEach: 16
        }
      ],

      requiredOunces: 16,

      note:
        "Stock at least one variety in sliced, shredded, or block form. The package requirement is equivalent to two 8-ounce packages OR one 16-ounce package, including equivalent combinations."
    },

    {
      id: "eggs",
      category: "Eggs",
      type: "standard",

      minimum: 2,
      unit: "dozen",

      note:
        "Any grade of any size WV WIC approved white chicken eggs."
    },

    {
      id: "breakfast-cereal",
      category: "Breakfast Cereal",
      type: "cereal",

      varieties: 3,
      minimum: 6,
      wholeGrainVarieties: 1,

      unit: "boxes or bags",

      note:
        "At least one variety must be whole grain. Cold cereal must be 12–36 ounces; hot cereal must be 11–36 ounces."
    },

    {
      id: "juice-64",
      category: "100% Shelf-Stable/Refrigerated Juice",
      type: "standard",

      varieties: 1,
      minimum: 2,

      unit: "64-ounce cans, plastic containers, or cartons"
    },

    {
      id: "beans",
      category: "Dried or Canned Beans",
      type: "beans-equivalent",

      varieties: 1,
      driedMinimum: 1,
      cannedMinimum: 4,

      driedSize: "16-ounce package",
      cannedSize: "15- to 16-ounce cans",

      note:
        "Stock at least one qualifying variety. Meet the quantity requirement with dried beans, canned beans, or an equivalent combination."
    },

    {
      id: "peanut-butter",
      category: "Peanut Butter",
      type: "standard",

      varieties: 1,
      minimum: 2,

      unit: "16- to 18-ounce containers"
    },

    {
      id: "whole-grains",
      category: "Whole Grains",
      type: "standard",

      varieties: 1,
      minimum: 2,

      unit: "16-ounce packages",

      note:
        "Qualifying whole grains include bread, buns, tortillas, pasta, and brown rice."
    },

    {
      id: "fruits",
      category: "Fruits",
      type: "produce-policy",

      varieties: 3,
      subcategories: 1,

      freshPounds: 3,
      cannedFrozenOunces: 64,
      dollarMinimum: 10,

      physicalRule: "or",

      note:
        "Stock at least three varieties of canned, fresh, or frozen fruit. Meet the quantity requirement with three pounds fresh OR 64 ounces of any combination canned or frozen, OR at least $10 retail value."
    },

    {
      id: "vegetables",
      category: "Vegetables",
      type: "produce-policy",

      varieties: 3,
      subcategories: 1,

      freshPounds: 3,
      cannedFrozenOunces: 64,
      dollarMinimum: 10,

      physicalRule: "or",

      note:
        "Stock at least three varieties of canned, fresh, or frozen vegetables, including potatoes. Meet the quantity requirement with three pounds fresh OR 64 ounces of any combination canned or frozen, OR at least $10 retail value."
    }

  ];

}
