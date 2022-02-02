export const LANGUAGE_MAPPING: Record<string, any> = {
    "Meteorology and Climate Services": ["Meteorology and Climate Services"],
    "Agriculture and Food Security": ["Agriculture and Food Security"],
    Livestock: ["Livestock"],
    "Disasters Risk Reduction": ["Disasters Risk Reduction"],
    "Water and Energy": ["Water and Energy"],
    "Conflict / Law enforcement and Security": [
        "Conflict / Law enforcement and Security",
    ],
    "Environment and Climate Change": ["Environment and Climate Change"],
    "Media / Communication and Information Technology": [
        "Media / Communication and Information Technology",
    ],
    Health: ["Health"],
    "Education / Academia and Research": ["Education / Academia and Research"],
    "Humanitarian Assistance": ["Humanitarian Assistance"],
    "Migration and Social Protection": ["Migration and Social Protection"],
    "Banking / Finance and Insurance": ["Banking / Finance and Insurance"],
    "Business / Consulting and Management": [
        "Business / Consulting and Management",
    ],
    "Hospitality / Events management / Leisure / Sports and Tourism": [
        "Hospitality / Events management / Leisure / Sports and Tourism",
    ],
    "Transport / Logistics / Infrastructure and Construction / Engineering and Manufacturing":
        [
            "Transport / Logistics / Infrastructure and Construction / Engineering and Manufacturing",
        ],
    "Coordination of different sectors": ["Coordination of different sectors"],
    Other: ["Other"],
};

export const uniformizeSector = (sector: string) =>
    Object.keys(LANGUAGE_MAPPING).find((key: string) =>
        LANGUAGE_MAPPING[key].includes(sector)
    );
