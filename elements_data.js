const table = [
    // [Ký hiệu], [Tên], [Khối lượng], [Vị trí X], [Vị trí Y], [MÃ NHÓM (1-9)]
    "H", "Hydrogen", 1.008, 1, 1, 6,     // 6: Phi kim
    "He", "Helium", 4.003, 18, 1, 8,    // 8: Khí hiếm
    "Li", "Lithium", 6.94, 1, 2, 1,      // 1: Kim loại Kiềm
    "Be", "Beryllium", 9.012, 2, 2, 2,   // 2: Kim loại Kiềm Thổ
    "B", "Boron", 10.81, 13, 2, 5,       // 5: Á kim
    "C", "Carbon", 12.01, 14, 2, 6,       // 6: Phi kim
    "N", "Nitrogen", 14.01, 15, 2, 6,    // 6: Phi kim
    "O", "Oxygen", 16.00, 16, 2, 6,      // 6: Phi kim
    "F", "Fluorine", 19.00, 17, 2, 7,    // 7: Halogen
    "Ne", "Neon", 20.18, 18, 2, 8,      // 8: Khí hiếm
    "Na", "Sodium", 22.99, 1, 3, 1,     // 1: Kim loại Kiềm
    "Mg", "Magnesium", 24.31, 2, 3, 2,  // 2: Kim loại Kiềm Thổ
    "Al", "Aluminium", 26.98, 13, 3, 4,  // 4: Kim loại P-block
    "Si", "Silicon", 28.09, 14, 3, 5,    // 5: Á kim
    "P", "Phosphorus", 30.97, 15, 3, 6,  // 6: Phi kim
    "S", "Sulfur", 32.06, 16, 3, 6,      // 6: Phi kim
    "Cl", "Chlorine", 35.45, 17, 3, 7,  // 7: Halogen
    "Ar", "Argon", 39.95, 18, 3, 8,     // 8: Khí hiếm
    "K", "Potassium", 39.10, 1, 4, 1,    // 1: Kim loại Kiềm
    "Ca", "Calcium", 40.08, 2, 4, 2,    // 2: Kim loại Kiềm Thổ
    "Sc", "Scandium", 44.96, 3, 4, 3,   // 3: Kim loại Chuyển tiếp
    "Ti", "Titanium", 47.87, 4, 4, 3,   // 3: Kim loại Chuyển tiếp
    "V", "Vanadium", 50.94, 5, 4, 3,    // 3: Kim loại Chuyển tiếp
    "Cr", "Chromium", 52.00, 6, 4, 3,   // 3: Kim loại Chuyển tiếp
    "Mn", "Manganese", 54.94, 7, 4, 3,  // 3: Kim loại Chuyển tiếp
    "Fe", "Iron", 55.85, 8, 4, 3,       // 3: Kim loại Chuyển tiếp
    "Co", "Cobalt", 58.93, 9, 4, 3,     // 3: Kim loại Chuyển tiếp
    "Ni", "Nickel", 58.69, 10, 4, 3,    // 3: Kim loại Chuyển tiếp
    "Cu", "Copper", 63.55, 11, 4, 3,    // 3: Kim loại Chuyển tiếp
    "Zn", "Zinc", 65.38, 12, 4, 3,      // 3: Kim loại Chuyển tiếp
    "Ga", "Gallium", 69.72, 13, 4, 4,   // 4: Kim loại P-block
    "Ge", "Germanium", 72.63, 14, 4, 5, // 5: Á kim
    "As", "Arsenic", 74.92, 15, 4, 5,   // 5: Á kim
    "Se", "Selenium", 78.97, 16, 4, 6,  // 6: Phi kim
    "Br", "Bromine", 79.90, 17, 4, 7,   // 7: Halogen
    "Kr", "Krypton", 83.80, 18, 4, 8,   // 8: Khí hiếm
    "Rb", "Rubidium", 85.47, 1, 5, 1,   // 1: Kim loại Kiềm
    "Sr", "Strontium", 87.62, 2, 5, 2,  // 2: Kim loại Kiềm Thổ
    "Y", "Yttrium", 88.91, 3, 5, 3,     // 3: Kim loại Chuyển tiếp
    "Zr", "Zirconium", 91.22, 4, 5, 3,  // 3: Kim loại Chuyển tiếp
    "Nb", "Niobium", 92.91, 5, 5, 3,    // 3: Kim loại Chuyển tiếp
    "Mo", "Molybdenum", 95.96, 6, 5, 3, // 3: Kim loại Chuyển tiếp
    "Tc", "Technetium", 98.0, 7, 5, 3,  // 3: Kim loại Chuyển tiếp
    "Ru", "Ruthenium", 101.1, 8, 5, 3,  // 3: Kim loại Chuyển tiếp
    "Rh", "Rhodium", 102.9, 9, 5, 3,    // 3: Kim loại Chuyển tiếp
    "Pd", "Palladium", 106.4, 10, 5, 3, // 3: Kim loại Chuyển tiếp
    "Ag", "Silver", 107.9, 11, 5, 3,    // 3: Kim loại Chuyển tiếp
    "Cd", "Cadmium", 112.4, 12, 5, 3,   // 3: Kim loại Chuyển tiếp
    "In", "Indium", 114.8, 13, 5, 4,    // 4: Kim loại P-block
    "Sn", "Tin", 118.7, 14, 5, 4,       // 4: Kim loại P-block
    "Sb", "Antimony", 121.8, 15, 5, 5,  // 5: Á kim
    "Te", "Tellurium", 127.6, 16, 5, 5, // 5: Á kim
    "I", "Iodine", 126.9, 17, 5, 7,     // 7: Halogen
    "Xe", "Xenon", 131.3, 18, 5, 8,     // 8: Khí hiếm
    "Cs", "Caesium", 132.9, 1, 6, 1,    // 1: Kim loại Kiềm
    "Ba", "Barium", 137.3, 2, 6, 2,     // 2: Kim loại Kiềm Thổ
    // Lanthanides (La - Lu) - Hàng ảo 9
    "La", "Lanthanum", 138.9, 3, 9, 9,  // 9: Lantan/Actin
    "Ce", "Cerium", 140.1, 4, 9, 9,
    "Pr", "Praseodymium", 140.9, 5, 9, 9,
    "Nd", "Neodymium", 144.2, 6, 9, 9,
    "Pm", "Promethium", 145.0, 7, 9, 9,
    "Sm", "Samarium", 150.4, 8, 9, 9,
    "Eu", "Europium", 152.0, 9, 9, 9,
    "Gd", "Gadolinium", 157.3, 10, 9, 9,
    "Tb", "Terbium", 158.9, 11, 9, 9,
    "Dy", "Dysprosium", 162.5, 12, 9, 9,
    "Ho", "Holmium", 164.9, 13, 9, 9,
    "Er", "Erbium", 167.3, 14, 9, 9,
    "Tm", "Thulium", 168.9, 15, 9, 9,
    "Yb", "Ytterbium", 173.1, 16, 9, 9,
    "Lu", "Lutetium", 175.0, 17, 9, 9,

    "Hf", "Hafnium", 178.5, 4, 6, 3,    // 3: Kim loại Chuyển tiếp
    "Ta", "Tantalum", 180.9, 5, 6, 3,   // 3: Kim loại Chuyển tiếp
    "W", "Tungsten", 183.8, 6, 6, 3,    // 3: Kim loại Chuyển tiếp
    "Re", "Rhenium", 186.2, 7, 6, 3,    // 3: Kim loại Chuyển tiếp
    "Os", "Osmium", 190.2, 8, 6, 3,     // 3: Kim loại Chuyển tiếp
    "Ir", "Iridium", 192.2, 9, 6, 3,    // 3: Kim loại Chuyển tiếp
    "Pt", "Platinum", 195.1, 10, 6, 3,  // 3: Kim loại Chuyển tiếp
    "Au", "Gold", 197.0, 11, 6, 3,      // 3: Kim loại Chuyển tiếp
    "Hg", "Mercury", 200.6, 12, 6, 3,   // 3: Kim loại Chuyển tiếp
    "Tl", "Thallium", 204.4, 13, 6, 4,  // 4: Kim loại P-block
    "Pb", "Lead", 207.2, 14, 6, 4,      // 4: Kim loại P-block
    "Bi", "Bismuth", 209.0, 15, 6, 4,   // 4: Kim loại P-block
    "Po", "Polonium", 209.0, 16, 6, 5,  // 5: Á kim
    "At", "Astatine", 210.0, 17, 6, 7,  // 7: Halogen
    "Rn", "Radon", 222.0, 18, 6, 8,     // 8: Khí hiếm
    "Fr", "Francium", 223.0, 1, 7, 1,   // 1: Kim loại Kiềm
    "Ra", "Radium", 226.0, 2, 7, 2,     // 2: Kim loại Kiềm Thổ
    // Actinides (Ac - Lr) - Hàng ảo 10
    "Ac", "Actinium", 227.0, 3, 10, 9,  // 9: Lantan/Actin
    "Th", "Thorium", 232.0, 4, 10, 9,
    "Pa", "Protactinium", 231.0, 5, 10, 9,
    "U", "Uranium", 238.0, 6, 10, 9,
    "Np", "Neptunium", 237.0, 7, 10, 9,
    "Pu", "Plutonium", 244.0, 8, 10, 9,
    "Am", "Americium", 243.0, 9, 10, 9,
    "Cm", "Curium", 247.0, 10, 10, 9,
    "Bk", "Berkelium", 247.0, 11, 10, 9,
    "Cf", "Californium", 251.0, 12, 10, 9,
    "Es", "Einsteinium", 252.0, 13, 10, 9,
    "Fm", "Fermium", 257.0, 14, 10, 9,
    "Md", "Mendelevium", 258.0, 15, 10, 9,
    "No", "Nobelium", 259.0, 16, 10, 9,
    "Lr", "Lawrencium", 262.0, 17, 10, 9,

    "Rf", "Rutherfordium", 267.0, 4, 7, 3, // 3: Kim loại Chuyển tiếp
    "Db", "Dubnium", 268.0, 5, 7, 3,
    "Sg", "Seaborgium", 271.0, 6, 7, 3,
    "Bh", "Bohrium", 270.0, 7, 7, 3,
    "Hs", "Hassium", 277.0, 8, 7, 3,
    "Mt", "Meitnerium", 276.0, 9, 7, 3,
    "Ds", "Darmstadtium", 281.0, 10, 7, 3,
    "Rg", "Roentgenium", 280.0, 11, 7, 3,
    "Cn", "Copernicium", 285.0, 12, 7, 3,
    "Nh", "Nihonium", 286.0, 13, 7, 4,  // 4: Kim loại P-block
    "Fl", "Flerovium", 289.0, 14, 7, 4, // 4: Kim loại P-block
    "Mc", "Moscovium", 290.0, 15, 7, 4, // 4: Kim loại P-block
    "Lv", "Livermorium", 293.0, 16, 7, 4, // 4: Kim loại P-block
    "Ts", "Tennessine", 294.0, 17, 7, 7, // 7: Halogen
    "Og", "Oganesson", 294.0, 18, 7, 8  // 8: Khí hiếm
];