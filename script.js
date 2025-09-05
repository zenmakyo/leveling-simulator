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

const targetExpTable = {
  "闇黒龍": 497,
  "叛逆の断罪者": 326,
  "盲鬼ト浮鬼": 275
  
};

const targetInput = document.querySelector(".targetInput");
const suggestionsBox = document.querySelector(".targetSuggestions");

function updateSuggestions() {
  const value = targetInput.value.trim().toLowerCase();
  let matches;

  if (value === "") {
    // 未入力時は全件表示
    matches = wordList;
  } else {
    // 部分一致
    matches = wordList.filter(word => word.toLowerCase().includes(value));
  }

  // 候補表示
  suggestionsBox.innerHTML = "";
  if (matches.length > 0) {
    matches.forEach(word => {
      const div = document.createElement("div");
      div.textContent = word;
      div.addEventListener("click", () => {
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

// 入力中
targetInput.addEventListener("input", updateSuggestions);
// フォーカス時
targetInput.addEventListener("focus", updateSuggestions);
// フォーカス外れたとき
targetInput.addEventListener("blur", () => {
  setTimeout(() => { suggestionsBox.style.display = "none"; }, 100);
});
