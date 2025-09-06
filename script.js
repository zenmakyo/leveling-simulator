/* レベル入力 */
document.querySelectorAll(".adjustBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = btn.parentElement.querySelector("input[type=number]");
    let value = parseInt(input.value) || 0;
    value += parseInt(btn.dataset.value);

    // 範囲チェック
    if (value < 1) value = 1;
    if (value > 250) value = 250;

    input.value = value;
  });
});

// 半角数字のみ許可
function enforceHalfWidthDigits(input) {
  input.addEventListener("input", () => {
    // 入力値から半角数字以外を削除
    input.value = input.value.replace(/[^0-9]/g, "");
  });
}

// 対象のinputを指定
const currentLevel = document.getElementById("currentLevel");
const targetLevel = document.getElementById("targetLevel");
const nextvalue = document.getElementById("nextvalue");

enforceHalfWidthDigits(currentLevel);
enforceHalfWidthDigits(targetLevel);
enforceHalfWidthDigits(nextvalue);

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
  const value = rebirth.value;
  rebirth.style.backgroundColor = rebirthColors[value] || "#fff"; // 選択された値に応じて背景色
});

/* 強化値と参加枠数の表示 */
function updateOptions() {
  const selected1 = document.querySelector('input[name="ability1"]:checked')?.value;
  const selected2 = document.querySelector('input[name="ability2"]:checked')?.value;
  console.log(selected1, selected2); // ←確認用
}
  
document.addEventListener("DOMContentLoaded", () => {
  const abilityRadios1 = document.querySelectorAll('input[name="ability1"]');
  const abilityRadios2 = document.querySelectorAll('input[name="ability2"]');
  const enhanceBox = document.getElementById("enhanceBox");
  const slotBox = document.getElementById("slotBox");

  function updateOptions() {
    // 現在の選択値を取得
    const selected1 = document.querySelector('input[name="ability1"]:checked')?.value;
    const selected2 = document.querySelector('input[name="ability2"]:checked')?.value;

    // 強化値は「博識 or 共栄」のどちらかが含まれていたら表示
    if (selected1 === "博識" || selected2 === "博識" || selected1 === "共栄" || selected2 === "共栄") {
      enhanceBox.style.display = "flex";
    } else {
      enhanceBox.style.display = "none";
    }

    // 参加枠数は「共栄」が含まれていたら表示
    if (selected1 === "共栄" || selected2 === "共栄") {
      slotBox.style.display = "flex";
    } else {
      slotBox.style.display = "none";
    }
  }

  // 初期チェック
  updateOptions();

  // 変更イベントを監視
  abilityRadios1.forEach(radio => radio.addEventListener("change", updateOptions));
  abilityRadios2.forEach(radio => radio.addEventListener("change", updateOptions));
});

/* 討伐対象 */
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
  let matches;

  if (value === "") {
    matches = wordList; // 全件表示
  } else {
    matches = wordList.filter(word => word.toLowerCase().includes(value));
  }

  suggestionsBox.innerHTML = "";
  if (matches.length > 0) {
    matches.forEach(word => {
      const div = document.createElement("div");
      div.textContent = word;
      div.addEventListener("mousedown", () => { // click ではなく mousedown
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

/**
 * 現在レベルから目標レベルまでに必要な総経験値を計算
 * @param {number} currentLv - 現在レベル
 * @param {number} targetLv - 目標レベル
 * @param {number} rebirth - 転生回数
 * @param {number} nextExp - 現在レベルから次のレベルまでの経験値
 * @returns {number} 総必要経験値
 */
function calculateTotalExp(currentLv, targetLv, rebirth, nextExp) {
  if (currentLv >= targetLv) return 0;

  let totalExp = nextExp; // 現在レベル→次レベル分を加算

  for (let lv = currentLv + 1; lv <= targetLv - 1; lv++) {
    totalExp += lv * (11 + rebirth) - 3;
  }

  return totalExp;
}

// HTMLの入力要素から値を取得して計算
function getTotalExpFromInputs() {
  const currentLv = parseInt(document.getElementById("currentLevel").value) || 0;
  const targetLv = parseInt(document.getElementById("targetLevel").value) || 0;
  const nextExp = parseInt(document.getElementById("nextExp").value) || 0;
  const rebirth = parseInt(document.getElementById("rebirth").value) || 0;

  return calculateTotalExp(currentLv, targetLv, rebirth, nextExp);
}

/* 討伐一回あたりの経験値量計算 */
function calcExpPerFight(targetExp, itemMultiplier, ability1Value, ability2Value, enhanceValue, slotValue) {
  // アビリティ倍率の計算
  function abilityMultiplier(value) {
    switch(value) {
      case "習熟/記念": return 10;
      case "博識": return enhanceValue; // 強化値 %
      case "早熟": return 30;
      case "共栄": return Math.floor(enhanceValue * slotValue); // 小数切り捨て
      default: return 0;
    }
  }

  const totalAbilityPercent = abilityMultiplier(ability1Value) + abilityMultiplier(ability2Value);
  const totalMultiplier = 1 + totalAbilityPercent / 100;

  // 討伐対象の経験値 × アイテム倍率 × 装備アビリティ倍率
  const expPerFight = targetExp * itemMultiplier * totalMultiplier;

  return Math.ceil(expPerFight);
}

/* 必要討伐回数 */
function calcNumBattles(totalExpNeeded, expPerBattle) {
  // 必要経験値を1回あたりの経験値で割って切り上げ
  return Math.ceil(totalExpNeeded / expPerBattle);
}

function calcBattleResults(totalExpNeeded, expPerBattle, nextExpForTarget) {
  // 必要討伐回数
  const numBattles = Math.ceil(totalExpNeeded / expPerBattle);

  // 獲得経験値
  const obtainedExp = numBattles * expPerBattle;

  // 端数
  const fraction = obtainedExp - totalExpNeeded;

  // Next残量
  const remainingNext = nextExpForTarget - fraction;

  // 警告判定
  const warning = remainingNext < 0;

  return {
    numBattles,
    obtainedExp,
    fraction,
    remainingNext,
    warning
  };
}

function displayResults(currentLevel, targetLevel, totalExpNeeded, expPerBattle, nextExp, coinNeeded) {
  // 表示用の要素
  document.getElementById("currentLvDisplay").textContent = currentLevel;
  document.getElementById("targetLvDisplay").textContent = targetLevel;
  
  const numBattles = Math.ceil(totalExpNeeded / expPerBattle);
  document.getElementById("numBattlesDisplay").textContent = numBattles;
  
  const remainingNext = nextExp - (numBattles * expPerBattle - totalExpNeeded);
  document.getElementById("nextExpDisplay").textContent = remainingNext;
  
  // 警告表示
  if (remainingNext < 0) {
    document.getElementById("fractionWarning").style.display = "block";
  } else {
    document.getElementById("fractionWarning").style.display = "none";
  }
  
  document.getElementById("coinDisplay").textContent = Math.ceil(numBattles / 5);
  
  // 結果ボックス表示
  document.getElementById("resultBox").style.display = "block";
}

document.getElementById("calcBtn").addEventListener("click", () => {
  const currentLevel = parseInt(document.getElementById("currentLevel").value) || 1;
  const targetLevel = parseInt(document.getElementById("targetLevel").value) || 1;
  const nextExp = parseInt(document.getElementById("nextExp").value) || 0;
  const rebirth = parseInt(document.getElementById("rebirth").value) || 0;

  // ここで totalExpNeeded と expPerBattle を計算
  const totalExpNeeded = calcTotalExp(currentLevel, targetLevel, rebirth, nextExp); // 既存関数
  const expPerBattle = calcExpPerBattle(); // 既存関数

  // displayResults に渡して表示
  displayResults(currentLevel, targetLevel, totalExpNeeded, expPerBattle, nextExp);
});
