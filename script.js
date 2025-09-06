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
  "[5] コブンネズミ": 5,
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
