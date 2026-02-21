const weightInput = document.getElementById("weight");
const weightRange = document.getElementById("weightRange");
const darkToggle = document.getElementById("darkToggle");
const langToggle = document.getElementById("langToggle");
const foodEnergyInput = document.getElementById("foodEnergy");
const foodRange = document.getElementById("foodRange");
const resultDiv = document.getElementById("result");
const labels = {
    hero: document.getElementById("hero"),
    weightLabel: document.getElementById("weightLabel"),
    typeLabel: document.getElementById("typeLabel"),
    foodLabel: document.getElementById("foodLabel"),
    disclaimer: document.getElementById("disclaimer")
};

// Handle Dark Mode
darkToggle.addEventListener("change", function() {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", darkToggle.checked);
});

// Handle Language Switch
langToggle.addEventListener("change", function() {
    const lang = langToggle.checked ? 'en' : 'pt';
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    recalculate();
});

// Handle Weight Range and Input Sync
weightRange.addEventListener("input", function() {
    weightInput.value = weightRange.value;
    recalculate();
});

weightInput.addEventListener("input", function() {
    weightRange.value = weightInput.value;
    recalculate();
});

// Handle Food Energy Range and Input Sync
foodRange.addEventListener("input", function() {
    foodEnergyInput.value = foodRange.value;
    recalculate();
});

foodEnergyInput.addEventListener("input", function() {
    foodRange.value = foodEnergyInput.value;
    recalculate();
});

// Recalculate on type change or any input change
document.getElementById("type").addEventListener("change", recalculate);

// Recalculate function
function recalculate() {
    let weight = parseFloat(weightInput.value.replace(',', '.'));  // Allow both dot and comma
    const multiplier = parseFloat(document.getElementById("type").value);
    const foodEnergy = parseFloat(foodEnergyInput.value.replace(',', '.'));
    const resultDiv = document.getElementById("result");

    if (!weight || !foodEnergy) {
        resultDiv.innerHTML = langToggle.checked
            ? "Please fill in all fields."
            : "Por favor, preencha todos os campos.";
        return;
    }

    const RER = 70 * Math.pow(weight, 0.75); // Resting Energy Requirement (RER) formula
    const calories = RER * multiplier; // Total daily energy requirement
    const grams = (calories / foodEnergy) * 1000; // Convert calories to grams of food

    const resultHTML = langToggle.checked
        ? `<strong>${calories.toFixed(0)} kcal/day</strong><br>≈ <strong>${grams.toFixed(0)} grams/day</strong>`
        : `<strong>${calories.toFixed(0)} kcal/dia</strong><br>≈ <strong>${grams.toFixed(0)} gramas/dia</strong>`;

    resultDiv.innerHTML = resultHTML;
    localStorage.setItem("lastResult", resultHTML);
}

// Set language on page load
function setLanguage(lang) {
    if (lang === 'en') {
        labels.hero.innerText = "How much should I feed my cat?";
        labels.weightLabel.innerText = "Cat Weight (kg)";
        labels.typeLabel.innerText = "Cat Type";
        labels.foodLabel.innerText = "Food Energy (kcal per kg)";
        labels.disclaimer.innerHTML = "This calculator provides an estimate based on <em>2021 AAHA Nutrition and Weight Management Guidelines for Dogs and Cats</em>. Always consult your veterinarian for personalized feeding advice.";
        document.querySelectorAll('#type option').forEach(opt => {
            opt.innerText = opt.getAttribute('data-en');
        });
        weightInput.placeholder = "e.g. 4.5";
        foodEnergyInput.placeholder = "e.g. 3700";
    } else {
        labels.hero.innerText = "Quanto devo alimentar meu gato?";
        labels.weightLabel.innerText = "Peso do gato (kg)";
        labels.typeLabel.innerText = "Tipo de gato";
        labels.foodLabel.innerText = "Energia do alimento (kcal por kg)";
        labels.disclaimer.innerHTML = "Esta calculadora fornece uma estimativa com base nas diretrizes do <em>2021 AAHA Nutrition and Weight Management Guidelines for Dogs and Cats</em>. Sempre consulte seu veterinário para orientação personalizada.";
        document.querySelectorAll('#type option').forEach(opt => {
            opt.innerText = opt.getAttribute('data-pt');
        });
        weightInput.placeholder = "ex: 4,5";
        foodEnergyInput.placeholder = "ex: 3700";
    }
}

// Load saved settings
window.onload = function() {
    // Check for Dark Mode in localStorage
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
        darkToggle.checked = true;
    }

    // Check for language preference in localStorage
    if (localStorage.getItem("lang") === "en") {
        langToggle.checked = true;
        setLanguage('en');
    } else {
        setLanguage('pt');
    }

    // Check for last calculation result in localStorage
    if (localStorage.getItem("lastResult")) {
        resultDiv.innerHTML = localStorage.getItem("lastResult");
    }
};