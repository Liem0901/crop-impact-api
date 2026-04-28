export const crops = {
  green_coral_lettuce: {
    category: "leafy_greens",
    weather_sensitivity: { heat: 0.85, rain: 0.7 },
    conditions: {
      heavy_rain: {
        impact: { supply: "decrease", quality: "decrease" },
        severity: 0.75,
        reason:
          "Heavy rain can waterlog beds and splash soil onto leaves, increasing rot and post-harvest spoilage risk."
      },
      high_temperature: {
        impact: { supply: "decrease", quality: "decrease" },
        severity: 0.8,
        reason:
          "High temperatures accelerate bolting and leaf wilting, reducing marketable yield and shelf life."
      },
      normal: {
        impact: { supply: "stable", quality: "stable" },
        severity: 0.15,
        reason:
          "Mild temperature and moderate moisture typically support steady growth and consistent quality."
      }
    }
  },

  romaine_lettuce: {
    category: "leafy_greens",
    weather_sensitivity: { heat: 0.75, rain: 0.6 },
    conditions: {
      heavy_rain: {
        impact: { supply: "slight_decrease", quality: "decrease" },
        severity: 0.6,
        reason:
          "Prolonged rainfall increases disease pressure and leaf damage, raising trim losses during packing."
      },
      high_temperature: {
        impact: { supply: "decrease", quality: "slight_decrease" },
        severity: 0.7,
        reason:
          "Hot weather can cause tipburn and faster maturation, reducing head weight and uniformity."
      },
      normal: {
        impact: { supply: "stable", quality: "stable" },
        severity: 0.12,
        reason:
          "Normal conditions generally produce uniform heads with minimal physiological disorders."
      }
    }
  },

  butterhead_lettuce: {
    category: "leafy_greens",
    weather_sensitivity: { heat: 0.8, rain: 0.65 },
    conditions: {
      heavy_rain: {
        impact: { supply: "decrease", quality: "decrease" },
        severity: 0.65,
        reason:
          "Soft leaves bruise easily and excess moisture increases rot, lowering pack-out rates."
      },
      high_temperature: {
        impact: { supply: "decrease", quality: "decrease" },
        severity: 0.78,
        reason:
          "Heat stress leads to bolting and loose heads, reducing grade and shortening shelf life."
      },
      normal: {
        impact: { supply: "stable", quality: "stable" },
        severity: 0.14,
        reason:
          "Balanced weather supports tender leaves and stable yields with low defect rates."
      }
    }
  },

  japanese_cucumber: {
    category: "fruiting_vegetables",
    weather_sensitivity: { heat: 0.55, rain: 0.6 },
    conditions: {
      heavy_rain: {
        impact: { supply: "slight_decrease", quality: "decrease" },
        severity: 0.55,
        reason:
          "Excess rain can promote fungal diseases and uneven fruit shape, increasing rejection at grading."
      },
      high_temperature: {
        impact: { supply: "stable", quality: "slight_decrease" },
        severity: 0.4,
        reason:
          "High temperatures may cause bitter fruit or softening if plants are water-stressed."
      },
      normal: {
        impact: { supply: "stable", quality: "stable" },
        severity: 0.1,
        reason:
          "Normal conditions support steady flowering and uniform fruit size."
      }
    }
  },

  cherry_tomato: {
    category: "fruiting_vegetables",
    weather_sensitivity: { heat: 0.45, rain: 0.7 },
    conditions: {
      heavy_rain: {
        impact: { supply: "slight_decrease", quality: "decrease" },
        severity: 0.6,
        reason:
          "Sudden rainfall can trigger fruit cracking and disease, reducing marketable quality."
      },
      high_temperature: {
        impact: { supply: "slight_decrease", quality: "slight_decrease" },
        severity: 0.5,
        reason:
          "Heat can reduce fruit set and increase sunscald risk, lowering overall pack-out."
      },
      normal: {
        impact: { supply: "stable", quality: "stable" },
        severity: 0.08,
        reason:
          "Moderate conditions favor consistent fruit set and sweetness."
      }
    }
  },

  crystal_tomato: {
    category: "fruiting_vegetables",
    weather_sensitivity: { heat: 0.5, rain: 0.75 },
    conditions: {
      heavy_rain: {
        impact: { supply: "decrease", quality: "decrease" },
        severity: 0.68,
        reason:
          "High rainfall increases cracking and fungal pressure, causing higher losses from sorting and spoilage."
      },
      high_temperature: {
        impact: { supply: "slight_decrease", quality: "slight_decrease" },
        severity: 0.52,
        reason:
          "Hot conditions can reduce fruit set and increase soft fruit, impacting shelf stability."
      },
      normal: {
        impact: { supply: "stable", quality: "stable" },
        severity: 0.1,
        reason:
          "Normal weather supports steady production with minimal cracking risk."
      }
    }
  }
};

export const CROP_IDS = Object.freeze(Object.keys(crops));

