const STOCKING_REQUIREMENTS = {
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
          "Similac Gentle Comfort",
          "Similac Soy Isomil"
        ],
        minimum: 96,
        unit: "containers",
        representativeRequired: true,
        note: "Only contract formula is counted toward minimum stocking requirements."
      },
      {
        id: "infant-cereal",
        category: "Infant Cereal",
        type: "standard",
        varieties: 3,
        minimum: 15,
        unit: "8 ounce boxes or plastic containers"
      },
      {
        id: "infant-fruits",
        category: "Infant Fruits",
        type: "infant-produce",
        varieties: 4,
        singleMinimum: 48,
        twoPackMinimum: 24,
        unit: "4 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "infant-vegetables",
        category: "Infant Vegetables",
        type: "infant-produce",
        varieties: 4,
        singleMinimum: 48,
        twoPackMinimum: 24,
        unit: "4 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "infant-meats",
        category: "Infant Meats",
        type: "standard",
        varieties: 2,
        minimum: 20,
        unit: "2.5 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "milk",
        category: "Milk",
        type: "milk-pg1",
        varieties: 5,
        milkTypes: [
          "Whole",
          "Low-fat (1%)",
          "Fat free (skim)",
          "Lactose-free",
          "Soy"
        ],
        minimum: 16,
        unit: "gallons total",
        sizesRequired: 2,
        note: "Gallons and half-gallons may be used. At least two sizes are required."
      },
      {
        id: "yogurt",
        category: "Yogurt",
        type: "yogurt",
        varieties: 2,
        wholeFatMinimum: 4,
        lowFatMinimum: 12,
        unit: "containers",
        note: "Any approved container sizes."
      },
      {
        id: "cheese",
        category: "Cheese",
        type: "either-size",
        varieties: 3,
        options: [
          { minimum: 10, size: "8 ounce packages" },
          { minimum: 5, size: "16 ounce packages" }
        ]
      },
      {
        id: "eggs",
        category: "Eggs",
        type: "standard",
        minimum: 10,
        unit: "dozen"
      },
      {
        id: "breakfast-cereal",
        category: "Breakfast Cereals",
        type: "cereal",
        varieties: 4,
        minimum: 24,
        wholeGrainVarieties: 2,
        unit: "boxes or bags",
        note: "Cold cereal: 12–36 ounces. Hot cereal: 11–36 ounces."
      },
      {
        id: "beans",
        category: "Dried or Canned Beans",
        type: "beans",
        varieties: 4,
        driedMinimum: 8,
        cannedMinimum: 32,
        driedSize: "16 ounce packages",
        cannedSize: "15–16 ounce cans"
      },
      {
        id: "peanut-butter",
        category: "Peanut Butter",
        type: "standard",
        varieties: 2,
        minimum: 10,
        unit: "16–18 ounce containers"
      },
      {
        id: "whole-grains",
        category: "Whole Grains",
        type: "whole-grain",
        varieties: 4,
        minimum: 16,
        breadVarieties: 2,
        unit: "packages"
      },
      {
        id: "fruits",
        category: "Fruits",
        type: "produce-and",
        varieties: 8,
        subcategories: 3,
        freshVarieties: 4,
        freshPounds: 30,
        cannedMinimum: 33,
        frozenMinimum: 40,
        dollarMinimum: 30
      },
      {
        id: "vegetables",
        category: "Vegetables",
        type: "produce-and",
        varieties: 8,
        subcategories: 3,
        freshPounds: 30,
        cannedMinimum: 33,
        frozenMinimum: 40,
        dollarMinimum: 30
      }
    ]
  },

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
          "Similac Soy Isomil"
        ],
        minimum: 72,
        unit: "containers",
        representativeRequired: true,
        note: "Only contract formula is counted toward minimum stocking requirements."
      },
      {
        id: "infant-cereal",
        category: "Infant Cereal",
        type: "standard",
        varieties: 3,
        minimum: 12,
        unit: "8 ounce boxes or plastic containers"
      },
      {
        id: "infant-fruits",
        category: "Infant Fruits",
        type: "infant-produce",
        varieties: 4,
        singleMinimum: 32,
        twoPackMinimum: 16,
        unit: "4 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "infant-vegetables",
        category: "Infant Vegetables",
        type: "infant-produce",
        varieties: 4,
        singleMinimum: 32,
        twoPackMinimum: 16,
        unit: "4 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "infant-meats",
        category: "Infant Meats",
        type: "standard",
        varieties: 1,
        minimum: 10,
        unit: "2.5 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "milk",
        category: "Milk",
        type: "milk-pg2",
        statedTypeCount: 4,
        milkTypes: [
          "Whole",
          "Low-fat (1%)",
          "Fat free (skim)",
          "Lactose-free",
          "Soy"
        ],
        minimum: 12,
        unit: "gallons total",
        sizesRequired: 2,
        sourceNote: "The source states four types but lists five milk types."
      },
      {
        id: "yogurt",
        category: "Yogurt",
        type: "yogurt",
        varieties: 2,
        wholeFatMinimum: 2,
        lowFatMinimum: 6,
        unit: "containers",
        note: "Any approved container sizes."
      },
      {
        id: "cheese",
        category: "Cheese",
        type: "either-size",
        varieties: 3,
        options: [
          { minimum: 8, size: "8 ounce packages" },
          { minimum: 4, size: "16 ounce packages" }
        ]
      },
      {
        id: "eggs",
        category: "Eggs",
        type: "standard",
        minimum: 8,
        unit: "dozen"
      },
      {
        id: "breakfast-cereal",
        category: "Breakfast Cereals",
        type: "cereal",
        varieties: 4,
        minimum: 20,
        wholeGrainVarieties: 2,
        unit: "boxes or bags",
        note: "Cold cereal: 12–36 ounces. Hot cereal: 11–36 ounces."
      },
      {
        id: "beans",
        category: "Dried or Canned Beans",
        type: "beans",
        varieties: 3,
        driedMinimum: 6,
        cannedMinimum: 24,
        driedSize: "16 ounce packages",
        cannedSize: "15–16 ounce cans"
      },
      {
        id: "peanut-butter",
        category: "Peanut Butter",
        type: "standard",
        varieties: 2,
        minimum: 8,
        unit: "16–18 ounce containers"
      },
      {
        id: "whole-grains",
        category: "Whole Grains",
        type: "whole-grain",
        varieties: 2,
        minimum: 8,
        breadVarieties: 1,
        unit: "packages"
      },
      {
        id: "fruits",
        category: "Fruits",
        type: "produce-and",
        varieties: 6,
        subcategories: 3,
        freshVarieties: 4,
        freshPounds: 15,
        cannedMinimum: 17,
        frozenMinimum: 20,
        dollarMinimum: 25
      },
      {
        id: "vegetables",
        category: "Vegetables",
        type: "produce-and",
        varieties: 6,
        subcategories: 3,
        freshPounds: 15,
        cannedMinimum: 17,
        frozenMinimum: 20,
        dollarMinimum: 25
      }
    ]
  },

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
          "Similac Soy Isomil"
        ],
        minimum: 48,
        unit: "containers",
        representativeRequired: true,
        note: "Only contract formula is counted toward minimum stocking requirements."
      },
      {
        id: "infant-cereal",
        category: "Infant Cereal",
        type: "standard",
        varieties: 2,
        minimum: 6,
        unit: "8 ounce boxes or plastic containers"
      },
      {
        id: "infant-fruits",
        category: "Infant Fruits",
        type: "infant-produce",
        varieties: 4,
        singleMinimum: 20,
        twoPackMinimum: 10,
        unit: "4 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "infant-vegetables",
        category: "Infant Vegetables",
        type: "infant-produce",
        varieties: 4,
        singleMinimum: 20,
        twoPackMinimum: 10,
        unit: "4 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "milk",
        category: "Milk",
        type: "milk-pg3",
        statedTypeCount: 3,
        milkTypes: [
          "Whole",
          "Low-fat (1%)",
          "Fat free (skim)",
          "Lactose-free"
        ],
        minimum: 8,
        unit: "gallons total",
        sizesRequired: 2,
        note: "No minimum stocking requirement exists for soy milk.",
        sourceNote: "The source states three types but lists four milk types."
      },
      {
        id: "yogurt",
        category: "Yogurt",
        type: "standard",
        varieties: 2,
        minimum: 8,
        unit: "low-fat containers",
        note: "No minimum stocking requirement exists for whole-fat yogurt."
      },
      {
        id: "cheese",
        category: "Cheese",
        type: "either-size",
        varieties: 2,
        options: [
          { minimum: 6, size: "8 ounce packages" },
          { minimum: 3, size: "16 ounce packages" }
        ]
      },
      {
        id: "eggs",
        category: "Eggs",
        type: "standard",
        minimum: 6,
        unit: "dozen"
      },
      {
        id: "breakfast-cereal",
        category: "Breakfast Cereals",
        type: "cereal",
        varieties: 4,
        minimum: 12,
        wholeGrainVarieties: 2,
        unit: "boxes or bags",
        note: "Cold cereal: 12–36 ounces. Hot cereal: 11–36 ounces."
      },
      {
        id: "beans",
        category: "Dried or Canned Beans",
        type: "beans",
        varieties: 2,
        driedMinimum: 4,
        cannedMinimum: 16,
        driedSize: "16 ounce packages",
        cannedSize: "15–16 ounce cans"
      },
      {
        id: "peanut-butter",
        category: "Peanut Butter",
        type: "standard",
        varieties: 1,
        minimum: 6,
        unit: "16–18 ounce containers"
      },
      {
        id: "whole-grains",
        category: "Whole Grains",
        type: "whole-grain",
        varieties: 2,
        minimum: 6,
        breadVarieties: 1,
        unit: "packages"
      },
      {
        id: "fruits",
        category: "Fruits",
        type: "produce-and",
        varieties: 4,
        subcategories: 2,
        freshVarieties: 2,
        freshPounds: 10,
        cannedMinimum: 11,
        frozenMinimum: 13,
        dollarMinimum: 20
      },
      {
        id: "vegetables",
        category: "Vegetables",
        type: "produce-and",
        varieties: 4,
        subcategories: 2,
        freshVarieties: 2,
        freshPounds: 10,
        cannedMinimum: 11,
        frozenMinimum: 13,
        dollarMinimum: 20
      }
    ]
  },

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
          "Similac Soy Isomil"
        ],
        minimum: 24,
        unit: "containers",
        representativeRequired: true,
        note: "If a WIC customer or staff member requests Total Comfort and/or Soy Isomil, the store has 72 hours to stock the product. Only contract formula is counted toward minimum stocking requirements."
      },
      {
        id: "infant-cereal",
        category: "Infant Cereal",
        type: "standard",
        varieties: 2,
        minimum: 6,
        unit: "8 ounce boxes or plastic containers"
      },
      {
        id: "infant-fruits",
        category: "Infant Fruits",
        type: "infant-produce",
        varieties: 4,
        singleMinimum: 20,
        twoPackMinimum: 10,
        unit: "4 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "infant-vegetables",
        category: "Infant Vegetables",
        type: "infant-produce",
        varieties: 4,
        singleMinimum: 20,
        twoPackMinimum: 10,
        unit: "4 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "milk",
        category: "Milk",
        type: "split-milk",
        varieties: 2,
        milkTypes: [
          "Whole",
          "Low-fat (1%)",
          "Fat free (skim)"
        ],
        wholeMinimum: 2,
        lowFatMinimum: 4,
        note: "Two gallons whole AND four gallons low-fat and/or fat-free. No minimum stocking requirement exists for soy milk, lactose-free milk, or half gallons."
      },
      {
        id: "yogurt",
        category: "Yogurt",
        type: "standard",
        varieties: 2,
        minimum: 6,
        unit: "low-fat containers",
        note: "No minimum stocking requirement exists for whole-fat yogurt."
      },
      {
        id: "cheese",
        category: "Cheese",
        type: "either-size",
        varieties: 2,
        options: [
          { minimum: 4, size: "8 ounce packages" },
          { minimum: 2, size: "16 ounce packages" }
        ]
      },
      {
        id: "eggs",
        category: "Eggs",
        type: "standard",
        minimum: 4,
        unit: "dozen"
      },
      {
        id: "breakfast-cereal",
        category: "Breakfast Cereals",
        type: "cereal",
        varieties: 3,
        minimum: 9,
        wholeGrainVarieties: 1,
        unit: "boxes or bags",
        note: "Cold cereal: 12–36 ounces. Hot cereal: 11–36 ounces."
      },
      {
        id: "beans",
        category: "Dried or Canned Beans",
        type: "beans",
        varieties: 1,
        driedMinimum: 2,
        cannedMinimum: 8,
        driedSize: "16 ounce packages",
        cannedSize: "16 ounce to 16 ounce cans",
        sourceNote: "Can-size wording is preserved from the source document."
      },
      {
        id: "peanut-butter",
        category: "Peanut Butter",
        type: "standard",
        varieties: 1,
        minimum: 4,
        unit: "16–18 ounce containers"
      },
      {
        id: "whole-grains",
        category: "Whole Grains",
        type: "standard",
        varieties: 2,
        minimum: 4,
        unit: "packages"
      },
      {
        id: "fruits",
        category: "Fruits",
        type: "produce-and",
        varieties: 2,
        subcategories: 2,
        freshVarieties: 1,
        freshPounds: 6,
        cannedMinimum: 9,
        frozenMinimum: 11,
        dollarMinimum: 10
      },
      {
        id: "vegetables",
        category: "Vegetables",
        type: "produce-and",
        varieties: 2,
        subcategories: 2,
        freshVarieties: 1,
        freshPounds: 6,
        cannedMinimum: 9,
        frozenMinimum: 11,
        dollarMinimum: 10
      }
    ]
  },

  5: {
    name: "Rural Independent Grocers",
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
          "Similac Soy Isomil"
        ],
        minimum: 12,
        unit: "containers",
        representativeRequired: true,
        note: "If a WIC customer or staff member requests Total Comfort and/or Soy Isomil, the store has 72 hours to stock the product. Only contract formula is counted toward minimum stocking requirements."
      },
      {
        id: "infant-cereal",
        category: "Infant Cereal",
        type: "standard",
        varieties: 1,
        minimum: 3,
        unit: "8 ounce boxes or plastic containers"
      },
      {
        id: "infant-fruits",
        category: "Infant Fruits",
        type: "infant-produce",
        varieties: 2,
        singleMinimum: 8,
        twoPackMinimum: 4,
        unit: "4 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "infant-vegetables",
        category: "Infant Vegetables",
        type: "infant-produce",
        varieties: 2,
        singleMinimum: 8,
        twoPackMinimum: 4,
        unit: "4 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "milk",
        category: "Milk",
        type: "split-milk",
        varieties: 2,
        milkTypes: [
          "Whole",
          "Low-fat (1%)",
          "Fat free (skim)"
        ],
        wholeMinimum: 1,
        lowFatMinimum: 3,
        note: "One gallon whole AND three gallons low-fat and/or fat-free. No minimum stocking requirement exists for soy milk, lactose-free milk, or half gallons."
      },
      {
        id: "cheese",
        category: "Cheese",
        type: "either-size",
        varieties: 1,
        options: [
          { minimum: 2, size: "8 ounce packages" },
          { minimum: 1, size: "16 ounce package" }
        ]
      },
      {
        id: "eggs",
        category: "Eggs",
        type: "standard",
        minimum: 1,
        unit: "dozen"
      },
      {
        id: "breakfast-cereal",
        category: "Breakfast Cereals",
        type: "cereal",
        varieties: 3,
        minimum: 6,
        wholeGrainVarieties: 1,
        unit: "boxes or bags",
        note: "Cold cereal: 12–36 ounces. Hot cereal: 11–36 ounces."
      },
      {
        id: "beans",
        category: "Dried or Canned Beans",
        type: "beans",
        varieties: 1,
        driedMinimum: 1,
        cannedMinimum: 4,
        driedSize: "16 ounce package",
        cannedSize: "15–16 ounce cans"
      },
      {
        id: "peanut-butter",
        category: "Peanut Butter",
        type: "standard",
        varieties: 1,
        minimum: 1,
        unit: "16–18 ounce container"
      },
      {
        id: "whole-grains",
        category: "Whole Grains",
        type: "standard",
        varieties: 1,
        minimum: 2,
        unit: "16 ounce packages"
      },
      {
        id: "fruits",
        category: "Fruits",
        type: "produce-or",
        varieties: 2,
        freshPounds: 3,
        cannedMinimum: 4,
        frozenMinimum: 5,
        dollarMinimum: 8
      },
      {
        id: "vegetables",
        category: "Vegetables",
        type: "produce-or",
        varieties: 2,
        freshPounds: 3,
        cannedMinimum: 4,
        frozenMinimum: 5,
        dollarMinimum: 8,
        sourceNote: "The source document describes this vegetable requirement using the word “fruit.”"
      }
    ]
  },

  6: {
    name: "Isolated Independent Stores",
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
          "Similac Soy Isomil"
        ],
        minimum: 12,
        unit: "containers",
        representativeRequired: true,
        note: "If a WIC customer or staff member requests Total Comfort and/or Soy Isomil, the store has 72 hours to stock the product. Only contract formula is counted toward minimum stocking requirements."
      },
      {
        id: "infant-cereal",
        category: "Infant Cereal",
        type: "standard",
        varieties: 1,
        minimum: 3,
        unit: "8 ounce boxes or plastic containers"
      },
      {
        id: "infant-fruits",
        category: "Infant Fruits",
        type: "infant-produce",
        varieties: 2,
        singleMinimum: 8,
        twoPackMinimum: 4,
        unit: "4 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "infant-vegetables",
        category: "Infant Vegetables",
        type: "infant-produce",
        varieties: 2,
        singleMinimum: 8,
        twoPackMinimum: 4,
        unit: "4 ounce jars or plastic containers",
        note: "Includes 2 ounce or 4 ounce containers."
      },
      {
        id: "milk",
        category: "Milk",
        type: "split-milk",
        varieties: 2,
        milkTypes: [
          "Whole",
          "Low-fat (1%)",
          "Fat free (skim)"
        ],
        wholeMinimum: 1,
        lowFatMinimum: 3,
        note: "One gallon whole AND three gallons low-fat and/or fat-free. No minimum stocking requirement exists for soy milk, lactose-free milk, or half gallons."
      },
      {
        id: "cheese",
        category: "Cheese",
        type: "either-size",
        varieties: 1,
        options: [
          { minimum: 2, size: "8 ounce packages" },
          { minimum: 1, size: "16 ounce package" }
        ]
      },
      {
        id: "eggs",
        category: "Eggs",
        type: "standard",
        minimum: 1,
        unit: "dozen"
      },
      {
        id: "breakfast-cereal",
        category: "Breakfast Cereals",
        type: "cereal",
        varieties: 3,
        minimum: 6,
        wholeGrainVarieties: 1,
        unit: "boxes or bags",
        note: "Cold cereal: 12–36 ounces. Hot cereal: 11–36 ounces."
      },
      {
        id: "beans",
        category: "Dried or Canned Beans",
        type: "beans",
        varieties: 1,
        driedMinimum: 1,
        cannedMinimum: 4,
        driedSize: "16 ounce package",
        cannedSize: "15–16 ounce cans"
      },
      {
        id: "peanut-butter",
        category: "Peanut Butter",
        type: "standard",
        varieties: 1,
        minimum: 1,
        unit: "16–18 ounce container"
      },
      {
        id: "whole-grains",
        category: "Whole Grains",
        type: "standard",
        varieties: 1,
        minimum: 2,
        unit: "16 ounce packages"
      },
      {
        id: "fruits",
        category: "Fruits",
        type: "produce-or",
        varieties: 2,
        freshPounds: 3,
        cannedMinimum: 4,
        frozenMinimum: 5,
        dollarMinimum: 8
      },
      {
        id: "vegetables",
        category: "Vegetables",
        type: "produce-or",
        varieties: 2,
        freshPounds: 3,
        cannedMinimum: 4,
        frozenMinimum: 5,
        dollarMinimum: 8,
        sourceNote: "The source document describes this vegetable requirement using the word “fruit.”"
      }
    ]
  }
};
