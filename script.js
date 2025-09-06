/* レベル入力 */
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

// 半角数字のみ許可
function enforceHalfWidthDigits(input) {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^0-9]/g, "");
  });
}

const currentLevel = document.getElementById("currentLevel");
const targetLevel = document.getElementById("targetLevel");
const nextExp = document.getElementById("nextExp");
[currentLevel, targetLevel, nextExp].forEach(enforceHalfWidthDigits);

/* 転生数に色付け */
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
  rebirth.style.backgroundColor = rebirthColors[rebirth.value] || "#fff";
});

/* 強化値・参加枠数表示 */
document.addEventListener("DOMContentLoaded", () => {
  const abilityRadios1 = document.querySelectorAll('input[name="ability1"]');
  const abilityRadios2 = document.querySelectorAll('input[name="ability2"]');
  const enhanceBox = document.getElementById("enhanceBox");
  const slotBox = document.getElementById("slotBox");

  function updateOptions() {
    const selected1 = document.querySelector('input[name="ability1"]:checked')?.value;
    const selected2 = document.querySelector('input[name="ability2"]:checked')?.value;
    enhanceBox.style.display = (selected1 === "博識" || selected2 === "博識" || selected1 === "共栄" || selected2 === "共栄") ? "flex" : "none";
    slotBox.style.display = (selected1 === "共栄" || selected2 === "共栄") ? "flex" : "none";
  }

  updateOptions();
  abilityRadios1.forEach(r => r.addEventListener("change", updateOptions));
  abilityRadios2.forEach(r => r.addEventListener("change", updateOptions));
});

/* 討伐対象候補 */
const targetExpTable = {
  "[497] 闇黒龍": 497, "[326] 叛逆の断罪者": 326, "[275] 盲鬼ト浮鬼": 275,
  "[261] 砂漠の亡者":261, "[250] 終焉の指揮者": 250, "[222] ポセイドン": 222,
  "[196] 死を告げる者": 196, "[183] 疎まれし者": 183, "[169] 刑罰を記すもの": 169,
  "[161] ロックイーター": 161, "[147] カトブレパス": 147, "[134] 海太郎": 134,
  "[122] 意思ある肖像": 122, "[106] ウッビィ": 106, "[94] スキュラ": 94,
  "[78] 鼠小組": 78, "[59] 画匠カミーリオ": 59, "[43] 川太郎": 43,
  "[29] 魔女の森の梟": 29, "[20] お化け提灯": 20, "[7] トゲウサギ": 7,
  "[5] コブンネズミ": 5
};
const wordList = Object.keys(targetExpTable);
const targetInput = document.querySelector(".targetInput");
const suggestionsBox = document.querySelector(".targetSuggestions");

function updateSuggestions() {
  const value = targetInput.value.trim().toLowerCase();
  const matches = value === "" ? wordList : wordList.filter(w => w.toLowerCase().includes(value));
  suggestionsBox.innerHTML = "";
  if (matches.length > 0) {
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
targetInput.addEventListener("blur", () => setTimeout(() => { suggestionsBox.style.display = "none"; }, 100));

/* 総必要経験値計算 */
function calcTotalExp(currentLv, targetLv, rebirth, nextExp) {
  if (currentLv >= targetLv) return 0;
  let total = nextExp;
  for (let lv = currentLv + 1; lv <= targetLv - 1; lv++) {
    total += lv * (11 + rebirth) - 3;
  }
  return total;
}

/* 討伐一回あたりの経験値 */
function calcExpPerBattle(targetExp, itemMultiplier, ability1, ability2, enhanceValue, slotValue, boostMultiplier) {
  function abilityMultiplier(val) {
    switch(val){
      case "習熟/記念": return 10;
      case "博識": return enhanceValue;
      case "早熟": return 30;
      case "共栄": return Math.floor(enhanceValue * slotValue);
      default: return 0;
    }
  }
  const totalPercent = abilityMultiplier(ability1) + abilityMultiplier(ability2);
  return Math.ceil(targetExp * itemMultiplier * (1 + totalPercent / 100) * boostMultiplier);
}

/* 計算・表示 */
document.getElementById("calcBtn").addEventListener("click", () => {
  const curLv = parseInt(currentLevel.value) || 1;
  const tarLv = parseInt(targetLevel.value) || 1;
  const next = parseInt(nextExp.value) || 0;
  const reb = parseInt(rebirth.value) || 0;
  const targetExp = targetExpTable[targetInput.value] || 0;
  const itemMultiplier = parseInt(document.querySelector('input[name="item"]:checked')?.value) || 1;
  const ability1 = document.querySelector('input[name="ability1"]:checked')?.value || "none";
  const ability2 = document.querySelector('input[name="ability2"]:checked')?.value || "none";
  const enhanceVal = parseInt(document.getElementById("enhanceValue").value) || 0;
  const slotVal = parseFloat(document.getElementById("slotValue").value) || 1;
  const boostMultiplier = parseFloat(document.querySelector('input[name="boost"]:checked')?.value) || 1;

  const totalExpNeeded = calcTotalExp(curLv, tarLv, reb, next);
  const expPerBattle = calcExpPerBattle(targetExp, itemMultiplier, ability1, ability2, enhanceVal, slotVal, boostMultiplier);

  const numBattles = Math.ceil(totalExpNeeded / expPerBattle);
  const obtainedExp = numBattles * expPerBattle;
  const fraction = obtainedExp - totalExpNeeded;

  const targetLevelNext = tarLv * (11 + reb) - 3;
  const remainingNext = targetLevelNext - fraction;

  // 警告表示
  let warningText = "";
  if (remainingNext < 0) {
    let extraExp = Math.abs(remainingNext);
    let levelUp = tarLv;
    while (true) {
      const nextLvExp = (levelUp + 1) * (11 + reb) - 3;
      if (extraExp >= nextLvExp) {
        extraExp -= nextLvExp;
        levelUp++;
      } else break;
    }
    warningText = `Lv ${levelUp} まで上がります！`;
    document.getElementBy
