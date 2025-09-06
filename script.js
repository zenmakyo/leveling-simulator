/* レベル入力調整ボタン */
document.querySelectorAll(".adjustBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = btn.parentElement.querySelector("input[type=number]");
    let value = parseInt(input.value) || 0;
    value += parseInt(btn.dataset.value);

    if (value < 1) value = 1;
    if (value > 250) value = 250;

    input.value = value;
  });
});

// 半角数字のみ
function enforceHalfWidthDigits(input) {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^0-9]/g, "");
  });
}

const currentLevel = document.getElementById("currentLevel");
const targetLevel = document.getElementById("targetLevel");
const nextExpInput = document.getElementById("nextExp");

enforceHalfWidthDigits(currentLevel);
enforceHalfWidthDigits(targetLevel);
enforceHalfWidthDigits(nextExpInput);

/* 転生数の背景色 */
const rebirth = document.getElementById("rebirth");
const rebirthColors = {
  "0": "rgba(220, 221, 221, 0.5)",
  "1": "rgba(187, 200, 230, 0.5)",
  "2": "rgba(44, 169, 225, 0.5)",
  "3": "rgba(102, 255, 102, 0.5)",
  "4": "rgba(255, 255, 0, 0.5)",
  "5": "rgba(255, 204, 0, 0.5)",
  "6": "rgba(255, 153, 0, 0.5)",
  "7": "rgba(204, 0, 0, 0.5)",
  "8": "rgba(255, 51, 204, 0.5)",
  "9": "rgba(153, 0, 204, 0.5)"
};
rebirth.addEventListener("change", () => {
  const value = rebirth.value;
  rebirth.style.backgroundColor = rebirthColors[value] || "#fff";
});

/* 強化値・参加枠数表示制御 */
document.addEventListener("DOMContentLoaded", () => {
  const abilityRadios1 = document.querySelectorAll('input[name="ability1"]');
  const abilityRadios2 = document.querySelectorAll('input[name="ability2"]');
  const enhanceBox = document.getElementById("enhanceBox");
  const slotBox = document.getElementById("slotBox");

  function updateOptions() {
    const selected1 = document.querySelector('input[name="ability1"]:checked')?.value;
    const selected2 = document.querySelector('input[name="ability2"]:checked')?.value;

    if (selected1 === "博識" || selected2 === "博識" || selected1 === "共栄" || selected2 === "共栄") {
      enhanceBox.style.display = "flex";
    } else {
      enhanceBox.style.display = "none";
    }

    if (selected1 === "共栄" || selected2 === "共栄") {
      slotBox.style.display = "flex";
    } else {
      slotBox.style.display = "none";
    }
  }

  updateOptions();

  abilityRadios1.forEach(r => r.addEventListener("change", updateOptions));
  abilityRadios2.forEach(r => r.addEventListener("change", updateOptions));
});

/* 討伐対象リスト */
const targetExpTable = {
  "[497] 闇黒龍": 497,
  "[326] 叛逆の断罪者": 326,
  "[275] 盲鬼ト浮鬼": 275,
  "[261] 砂漠の亡者":261,
  "[250] 終焉の指揮者": 250,
  "[222] ポセイドン": 222,
  "[196] 死を告げる者": 196,
  "[183] 疎まれし者": 183,
  "[169] 刑罰を記すもの": 169,
  "[161] ロックイーター": 161,
  "[147] カトブレパス": 147,
  "[134] 海太郎": 134,
  "[122] 意思ある肖像": 122,
  "[106] ウッビィ": 106,
  "[94] スキュラ": 94,
  "[78] 鼠小組": 78,
  "[59] 画匠カミーリオ": 59,
  "[43] 川太郎": 43,
  "[29] 魔女の森の梟": 29,
  "[20] お化け提灯": 20,
  "[7] トゲウサギ": 7,
  "[5] コブンネズミ": 5
};

const wordList = Object.keys(targetExpTable);
const targetInput = document.querySelector(".targetInput");
const suggestionsBox = document.querySelector(".targetSuggestions");

function updateSuggestions() {
  const value = targetInput.value.trim().toLowerCase();
  let matches = value === "" ? wordList : wordList.filter(word => word.toLowerCase().includes(value));

  suggestionsBox.innerHTML = "";
  if (matches.length) {
    matches.forEach(word => {
      const div = document.createElement("div");
      div.textContent = word;
      div.addEventListener("mousedown", () => {
        targetInput.value = word;
        suggestionsBox.style.display = "none";
      });
      suggestionsBox.appendChild(div);
    });
    suggestionsBox.style.display = "block";
  } else {
    suggestionsBox.style.display = "none";
  }
}

targetInput.addEventListener("input", updateSuggestions);
targetInput.addEventListener("focus", updateSuggestions);
targetInput.addEventListener("blur", () => {
  setTimeout(() => { suggestionsBox.style.display = "none"; }, 100);
});

/* 総経験値計算 */
function calculateTotalExp(currentLv, targetLv, rebirth, nextExp) {
  if (currentLv >= targetLv) return 0;
  let totalExp = nextExp;
  for (let lv = currentLv + 1; lv <= targetLv - 1; lv++) {
    totalExp += lv * (11 + rebirth) - 3;
  }
  return totalExp;
}

/* 一回あたりの経験値 */
function calcExpPerFight(targetExp, itemMultiplier, ability1Value, ability2Value, enhanceValue, slotValue) {
  function abilityMultiplier(value) {
    switch(value) {
      case "習熟/記念": return 10;
      case "博識": return enhanceValue;
      case "早熟": return 30;
      case "共栄": return Math.floor(enhanceValue * slotValue);
      default: return 0;
    }
  }

  const totalAbilityPercent = abilityMultiplier(ability1Value) + abilityMultiplier(ability2Value);
  const totalMultiplier = 1 + totalAbilityPercent / 100;

  const expPerFight = targetExp * itemMultiplier * totalMultiplier;
  return Math.ceil(expPerFight);
}

/* 結果表示 */
function displayResults(currentLevel, targetLevel, totalExpNeeded, expPerBattle, nextExp) {
  document.getElementById("currentLvDisplay").textContent = currentLevel;
  document.getElementById("targetLvDisplay").textContent = targetLevel;

  const numBattles = Math.ceil(totalExpNeeded / expPerBattle);
  document.getElementById("numBattlesDisplay").textContent = numBattles;

  const remainingNext = nextExp - (numBattles * expPerBattle - totalExpNeeded);
  document.getElementById("nextExpDisplay").textContent = remainingNext;

  if (remainingNext < 0) {
    document.getElementById("fractionWarning").style.display = "block";
  } else {
    document.getElementById("fractionWarning").style.display = "none";
  }

  document.getElementById("coinDisplay").textContent = Math.ceil(numBattles / 5);
  document.getElementById("resultBox").style.display = "block";
}

/* 計算ボタン */
document.getElementById("calcBtn").addEventListener("click", () => {
  const currentLv = parseInt(currentLevel.value) || 1;
  const targetLv = parseInt(targetLevel.value) || 1;
  const nextExpVal = parseInt(nextExpInput.value) || 0;
  const rebirthVal = parseInt(rebirth.value) || 0;

  const targetExp = targetExpTable[targetInput.value] || 0;
  const itemMultiplier = parseFloat(document.querySelector('input[name="item"]:checked').value) || 1;
  const ability1Value = document.querySelector('input[name="ability1"]:checked').value;
  const ability2Value = document.querySelector('input[name="ability2"]:checked').value;
  const enhanceValue = parseInt(document.getElementById("enhanceValue").value) || 0;
  const slotValue = parseFloat(document.getElementById("slotValue").value) || 1;

  const totalExpNeeded = calculateTotalExp(currentLv, targetLv, rebirthVal, nextExpVal);
  const expPerBattle = calcExpPerFight(targetExp, itemMultiplier, ability1Value, ability2Value, enhanceValue, slotValue);

  displayResults(currentLv, targetLv, totalExpNeeded, expPerBattle, nextExpVal);
});
